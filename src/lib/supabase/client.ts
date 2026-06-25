"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Singleton for convenience in client components
let _client: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!_client) {
    _client = createClient();
  }
  return _client;
}
