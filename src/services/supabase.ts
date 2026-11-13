import type { SupabaseClient } from "@supabase/supabase-js";
import { createSharedMesaApi } from "./sharedMesa";
import type { RpcClient, SharedMesaApi } from "./sharedMesa";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Without both variables the app still works: shared mesas are just not offered.
export const isSharingConfigured = (): boolean => Boolean(url && key);

let client: Promise<SupabaseClient | null> | null = null;

// The Supabase client is loaded on demand, so people who only use the local mesa never download it.
export const loadSupabase = (): Promise<SupabaseClient | null> => {
  client ??= isSharingConfigured()
    ? import("@supabase/supabase-js").then(({ createClient }) =>
        createClient(url, key, {
          // Nobody signs in: the mesa link is the only key.
          auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        })
      )
    : Promise.resolve(null);

  return client;
};

export const loadSharedMesaApi = async (): Promise<SharedMesaApi | null> => {
  const supabase = await loadSupabase();
  return supabase ? createSharedMesaApi(supabase as unknown as RpcClient) : null;
};
