import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_DIRECTUS_URL: z.string().url().optional(),
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
