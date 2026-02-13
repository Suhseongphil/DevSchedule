import { createBrowserClient } from "@supabase/ssr";

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === "undefined") {
      return createBrowserClient(PLACEHOLDER_URL, PLACEHOLDER_KEY);
    }
    throw new Error(
      "Supabase URL과 Anon Key가 필요합니다. .env.local을 확인하세요."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
