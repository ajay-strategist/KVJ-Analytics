import { createClient } from "@supabase/supabase-js";
import { mockSupabaseClient } from "./mockSupabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured =
  supabaseUrl &&
  supabaseUrl !== "https://placeholder.supabase.co" &&
  supabaseAnonKey &&
  supabaseAnonKey !== "placeholder-anon-key";

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : (mockSupabaseClient as any);
