import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Friend } from "../types/types";
import { SharedMesaError } from "../services/sharedMesa";
import { loadSharedMesaApi } from "../services/supabase";

// Creates a shared mesa and opens it. Used to share the local mesa (seeded with whoever is
// sitting there) and to start an empty one from a shared mesa.
export const useCreateSharedMesa = () => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const create = async (name: string, friends: Friend[]) => {
    if (busy) return;

    setBusy(true);
    setError("");

    try {
      const api = await loadSharedMesaApi();
      if (!api) throw new SharedMesaError("Las mesas compartidas no están disponibles.");

      const id = await api.create(name, friends);
      navigate(`/m/${id}`);
    } catch (failure) {
      setError(
        failure instanceof SharedMesaError ? failure.message : "No pudimos crear la mesa. Revisá tu conexión."
      );
    } finally {
      setBusy(false);
    }
  };

  return { create, busy, error };
};
