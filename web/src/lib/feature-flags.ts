import { prisma } from "@/lib/db";
import { FEATURE_FLAGS, type FeatureFlag } from "@/lib/feature-flags-data";

export type { FeatureFlag };
export { FEATURE_FLAGS };

export async function getFeatureFlags(): Promise<Record<string, boolean>> {
  const settings = await prisma.platformSetting.findMany();
  const overrides: Record<string, boolean> = {};
  for (const s of settings) {
    overrides[s.key] = s.value === "true";
  }
  const result: Record<string, boolean> = {};
  for (const flag of FEATURE_FLAGS) {
    result[flag.key] = overrides[flag.key] ?? flag.defaultValue;
  }
  return result;
}

export async function isFeatureEnabled(key: string): Promise<boolean> {
  const flags = await getFeatureFlags();
  return flags[key] ?? false;
}
