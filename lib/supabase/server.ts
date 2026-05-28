import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns a Supabase server client when env vars are configured.
 * Returns null during build or when credentials are not yet set in Vercel.
 */
export async function createClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createSupabaseClient(url, anonKey);
}
