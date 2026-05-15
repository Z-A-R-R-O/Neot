import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const result = publicEnvSchema.safeParse(process.env);

if (!result.success) {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "Missing required environment variables:",
      result.error.flatten().fieldErrors,
    );
    process.exit(1);
  }
}

export const publicEnv = result.data ?? {};
