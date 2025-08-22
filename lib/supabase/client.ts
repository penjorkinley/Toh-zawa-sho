// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

// For client components ONLY
export function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
