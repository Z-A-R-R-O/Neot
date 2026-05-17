import { prisma } from "@/lib/db";

export async function createAuditLog(params: {
  action: string;
  entityType: string;
  entityId?: string;
  actorId?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await prisma.auditLog.create({
    data: {
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId ?? null,
      actorId: params.actorId ?? null,
      metadata: params.metadata ? JSON.stringify(params.metadata) : "{}",
    },
  });
}
