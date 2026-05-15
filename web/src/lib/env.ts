import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_DIRECTUS_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
});

export function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.warn(
      "Environment variable validation warnings:",
      parsed.error.flatten().fieldErrors,
    );
  }

  return parsed.data;
}
