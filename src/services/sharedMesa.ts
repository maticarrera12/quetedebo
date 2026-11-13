import type { Friend } from "../types/types";

// Talks to the Supabase functions in supabase/migrations. The tables are closed to the browser:
// every call goes through a function that needs the mesa id, which is what the shared link carries.

export interface SharedParticipant {
  id: string;
  name: string;
  expense: number;
  concept: string;
  color: number;
}

export interface SharedMesa {
  id: string;
  name: string;
  participants: SharedParticipant[];
}

export interface ParticipantInput {
  name: string;
  expense: number;
  concept: string;
}

// The slice of the Supabase client this module uses, so tests can hand in a fake one.
export interface RpcClient {
  rpc: (fn: string, args: Record<string, unknown>) => PromiseLike<{
    data: unknown;
    error: { message: string; code?: string } | null;
  }>;
}

export class SharedMesaError extends Error {}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isMesaId = (value: string): boolean => UUID.test(value);

const MESSAGES: Record<string, string> = {
  "54000": "La mesa ya tiene 50 personas.",
  P0002: "Esa persona o esa mesa ya no existe.",
  "23514": "Revisá el nombre y el monto.",
};

const toError = (error: { message: string; code?: string }) =>
  new SharedMesaError((error.code && MESSAGES[error.code]) || "No pudimos guardar el cambio. Probá de nuevo.");

const isParticipant = (value: unknown): value is SharedParticipant => {
  if (typeof value !== "object" || value === null) return false;

  const { id, name, expense, concept, color } = value as Record<string, unknown>;

  return (
    typeof id === "string" &&
    typeof name === "string" &&
    name.trim() !== "" &&
    typeof expense === "number" &&
    Number.isFinite(expense) &&
    expense >= 0 &&
    typeof concept === "string" &&
    Number.isInteger(color)
  );
};

export const parseSharedMesa = (value: unknown): SharedMesa | null => {
  if (typeof value !== "object" || value === null) return null;

  const { id, name, participants } = value as Record<string, unknown>;

  if (typeof id !== "string" || typeof name !== "string") return null;
  if (!Array.isArray(participants) || !participants.every(isParticipant)) return null;

  return {
    id,
    name,
    participants: participants.map(({ id, name, expense, concept, color }) => ({ id, name, expense, concept, color })),
  };
};

export const createSharedMesaApi = (client: RpcClient) => {
  const call = async (fn: string, args: Record<string, unknown>): Promise<unknown> => {
    const { data, error } = await client.rpc(fn, args);
    if (error) throw toError(error);
    return data;
  };

  return {
    create: async (name: string, friends: Friend[]): Promise<string> => {
      const id = await call("create_mesa", {
        p_name: name,
        p_participants: friends.map(({ name, expense, concept }) => ({ name, expense, concept: concept ?? "" })),
      });

      if (typeof id !== "string") throw toError({ message: "create_mesa returned no id" });
      return id;
    },

    get: async (mesaId: string): Promise<SharedMesa | null> => {
      if (!isMesaId(mesaId)) return null;
      return parseSharedMesa(await call("get_mesa", { p_mesa: mesaId }));
    },

    add: async (mesaId: string, { name, expense, concept }: ParticipantInput): Promise<void> => {
      await call("add_participant", { p_mesa: mesaId, p_name: name, p_expense: expense, p_concept: concept });
    },

    update: async (mesaId: string, participantId: string, { name, expense, concept }: ParticipantInput): Promise<void> => {
      await call("update_participant", {
        p_mesa: mesaId,
        p_participant: participantId,
        p_name: name,
        p_expense: expense,
        p_concept: concept,
      });
    },

    remove: async (mesaId: string, participantId: string): Promise<void> => {
      await call("delete_participant", { p_mesa: mesaId, p_participant: participantId });
    },

    rename: async (mesaId: string, name: string): Promise<void> => {
      await call("rename_mesa", { p_mesa: mesaId, p_name: name });
    },
  };
};

export type SharedMesaApi = ReturnType<typeof createSharedMesaApi>;
