import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";

import { useAddFriendForm } from "./useAddFriendForm";
import { useCreateSharedMesa } from "./useCreateSharedMesa";
import { useAutoHistory, useMesaSummary } from "./useMesa";
import type { Mesa } from "./useMesa";
import { usePersistedState } from "./usePersistedState";

import { createSharedMesaApi, SharedMesaError } from "../services/sharedMesa";
import type { ParticipantInput, RpcClient, SharedMesaApi, SharedParticipant } from "../services/sharedMesa";
import { loadSupabase } from "../services/supabase";
import { formatName } from "../utils/format";
import { isBooleanMap } from "../utils/storage";

export type SharedMesaStatus = "loading" | "ready" | "missing" | "error" | "unconfigured";

const RENAME_DELAY_MS = 600;
const EVENT_NAME_MAX_LENGTH = 80;

// A mesa that lives in Supabase and that everyone with the link edits. It returns the same shape
// as the local mesa, so the desktop page and the phone shell show it without knowing the difference.
//
// Keeping everyone in sync: after each change this device tells the others through a broadcast
// channel named after the mesa, and every device reads the mesa again when it hears it or when the
// app comes back to the foreground. The tables are never exposed, only the mesa's functions.
export const useSharedMesa = (mesaId: string): Mesa & { status: SharedMesaStatus; syncError: string } => {
  const [status, setStatus] = useState<SharedMesaStatus>("loading");
  const [participants, setParticipants] = useState<SharedParticipant[]>([]);
  const [eventName, setEventNameState] = useState<string>("");
  const [syncError, setSyncError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);

  // Paid marks are this device's notes, like on the local mesa.
  const [paid, setPaid] = usePersistedState<Record<string, boolean>>(
    `quetedebo:shared:${mesaId}:paid`,
    {},
    isBooleanMap
  );

  const apiRef = useRef<SharedMesaApi | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const latestRequest = useRef<number>(0);
  const editingId = useRef<string | null>(null);
  // While someone types the mesa's name, a refresh must not overwrite it.
  const nameDirty = useRef<boolean>(false);
  const latestName = useRef<string>("");

  const refresh = useCallback(async () => {
    const api = apiRef.current;
    if (!api) return;

    // Two refreshes can overlap; only the newest one gets to write.
    const request = ++latestRequest.current;

    try {
      const mesa = await api.get(mesaId);
      if (request !== latestRequest.current) return;

      if (!mesa) {
        setStatus("missing");
        return;
      }

      setParticipants(mesa.participants);
      if (!nameDirty.current) setEventNameState(mesa.name);
      setStatus("ready");
    } catch {
      if (request !== latestRequest.current) return;
      setStatus((current) => (current === "ready" ? current : "error"));
    }
  }, [mesaId]);

  const mutate = useCallback(
    async (action: (api: SharedMesaApi) => Promise<void>): Promise<boolean> => {
      const api = apiRef.current;
      if (!api) return false;

      try {
        setSyncError("");
        await action(api);
        await refresh();

        void channelRef.current
          ?.send({ type: "broadcast", event: "changed", payload: {} })
          .catch(() => undefined);

        return true;
      } catch (error) {
        setSyncError(
          error instanceof SharedMesaError ? error.message : "No pudimos guardar el cambio. Revisá tu conexión."
        );
        return false;
      }
    },
    [refresh]
  );

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    const connect = async () => {
      const supabase = await loadSupabase();
      if (cancelled) return;

      if (!supabase) {
        setStatus("unconfigured");
        return;
      }

      apiRef.current = createSharedMesaApi(supabase as unknown as RpcClient);
      await refresh();
      if (cancelled) return;

      const channel = supabase
        .channel(`mesa:${mesaId}`)
        .on("broadcast", { event: "changed" }, () => void refresh())
        .subscribe();
      channelRef.current = channel;

      const onVisible = () => {
        if (document.visibilityState === "visible") void refresh();
      };
      document.addEventListener("visibilitychange", onVisible);

      cleanup = () => {
        document.removeEventListener("visibilitychange", onVisible);
        channelRef.current = null;
        void supabase.removeChannel(channel);
      };
    };

    void connect();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [mesaId, refresh]);

  // The name is saved a moment after the person stops typing, not on every key.
  useEffect(() => {
    if (!nameDirty.current) return;

    const sent = eventName.trim();
    const timer = setTimeout(() => {
      void mutate((api) => api.rename(mesaId, sent)).then(() => {
        if (latestName.current.trim() === sent) nameDirty.current = false;
      });
    }, RENAME_DELAY_MS);

    return () => clearTimeout(timer);
  }, [eventName, mesaId, mutate]);

  const setEventName = (name: string) => {
    const capped = name.slice(0, EVENT_NAME_MAX_LENGTH);
    nameDirty.current = true;
    latestName.current = capped;
    setEventNameState(capped);
  };

  const form = useAddFriendForm((name, amount, concept, editing) => {
    const input: ParticipantInput = { name: formatName(name), expense: amount, concept };
    const participantId = editing === null ? null : editingId.current;
    editingId.current = null;

    void mutate((api) =>
      participantId ? api.update(mesaId, participantId, input) : api.add(mesaId, input)
    );
  });

  const freshMesa = useCreateSharedMesa();

  const summary = useMesaSummary(participants, paid);
  useAutoHistory(participants, eventName, mesaId);

  const startEdit = (index: number) => {
    const participant = participants[index];
    if (!participant) return;

    editingId.current = participant.id;
    form.startEdit(index, participant);
  };

  const deleteFriend = (index: number) => {
    const participant = participants[index];
    if (!participant) return;

    if (editingId.current === participant.id) {
      editingId.current = null;
      form.cancelEdit();
    }

    void mutate((api) => api.remove(mesaId, participant.id));
  };

  // Shares the link, not a summary: whoever opens it sits at this same mesa.
  const handleShare = async () => {
    const url = `${window.location.origin}/m/${mesaId}`;
    const title = eventName.trim() || "La juntada";

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text: `${title}: sumá lo que pusiste en la mesa`, url });
        return;
      } catch (error) {
        // Closing the share sheet is not a failure; anything else falls back to copying.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return {
    kind: "shared",
    status,
    syncError,
    friends: participants,
    ...summary,
    paid,
    togglePaid: (key: string) => setPaid((prev) => ({ ...prev, [key]: !prev[key] })),
    eventName,
    setEventName,
    form,
    startEdit,
    deleteFriend,
    // A shared mesa is never cleared in one tap: it belongs to the whole group.
    confirmingReset,
    setConfirmingReset,
    handleReset: () => setConfirmingReset(false),
    copied,
    handleShare: () => void handleShare(),
    sharing: null,
    // A new, empty mesa with its own link; this one stays as it is for the group.
    newMesa: { start: () => void freshMesa.create("", []), busy: freshMesa.busy, error: freshMesa.error },
  };
};
