import { prisma } from "@/lib/db";

export type AuditAction = "create" | "update" | "delete" | "publish" | "restore" | "permission_change" | "theme_change";

export async function createAuditLog(params: {
  action: AuditAction;
  resource: string;
  resourceId?: string;
  userId?: string;
  details?: Record<string, unknown>;
}) {
  return prisma.auditLog.create({
    data: {
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId ?? null,
      userId: params.userId ?? null,
      details: JSON.stringify(params.details ?? {}),
    },
  });
}

export interface AuditLogEntry {
  id: string;
  action: string;
  resource: string;
  resourceId: string | null;
  userId: string | null;
  details: string;
  createdAt: Date;
}

export async function getAuditLogs(options?: {
  action?: string;
  resource?: string;
  limit?: number;
  offset?: number;
}): Promise<AuditLogEntry[]> {
  const where: Record<string, unknown> = {};
  if (options?.action) where.action = options.action;
  if (options?.resource) where.resource = options.resource;

  return prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: options?.limit ?? 50,
    skip: options?.offset ?? 0,
  });
}

export async function getAuditLogCount(options?: {
  action?: string;
  resource?: string;
}): Promise<number> {
  const where: Record<string, unknown> = {};
  if (options?.action) where.action = options.action;
  if (options?.resource) where.resource = options.resource;

  return prisma.auditLog.count({ where });
}
