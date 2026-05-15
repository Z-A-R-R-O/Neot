import { prisma } from "@/lib/db";

export function getAdminClient() {
  return { db: prisma };
}
