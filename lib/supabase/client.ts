import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

/**
 * Returns a Supabase browser client when env vars are configured.
 * Returns null during build or when credentials are not yet set in Vercel.
 */
export function createClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createSupabaseClient(url, anonKey);
  }

  return browserClient;
}
