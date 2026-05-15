interface SupabasePublicEnv {
  url: string;
  anonKey: string;
}

function getOptionalEnv(name: string): string | undefined {
  return process.env[name];
}

export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = getOptionalEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getOptionalEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    if (process.env.NODE_ENV === "development") {
      return null;
    }
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return { url, anonKey };
}
