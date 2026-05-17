import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  permissions: z.string().optional().default("{}"),
  isBuiltIn: z.boolean().optional().default(false),
});

const DEFAULT_ROLES: Array<{ name: string; description: string; permissions: Permissions; isBuiltIn: boolean }> = [
  {
    name: "admin",
    description: "Full access to all platform features and settings",
    isBuiltIn: true,
    permissions: {
      users: { create: true, read: true, update: true, delete: true },
      courses: { create: true, read: true, update: true, delete: true },
      pages: { create: true, read: true, update: true, delete: true },
      settings: { read: true, update: true },
      roles: { read: true, update: true },
      analytics: { read: true },
      templates: { create: true, read: true, update: true, delete: true },
      navigation: { create: true, read: true, update: true, delete: true },
      media: { create: true, read: true, delete: true },
      backups: { create: true, read: true },
      moderation: { read: true, update: true, delete: true },
      notifications: { create: true, read: true, delete: true },
      automation: { create: true, read: true, update: true, delete: true },
      localization: { read: true, update: true },
    },
  },
  {
    name: "teacher",
    description: "Can create and manage courses, view analytics",
    isBuiltIn: true,
    permissions: {
      users: { create: false, read: true, update: false, delete: false },
      courses: { create: true, read: true, update: true, delete: true },
      pages: { create: false, read: true, update: false, delete: false },
      settings: { read: false, update: false },
      roles: { read: false, update: false },
      analytics: { read: true },
      templates: { create: false, read: true, update: false, delete: false },
      navigation: { create: false, read: true, update: false, delete: false },
      media: { create: true, read: true, delete: true },
      backups: { create: false, read: false },
      moderation: { read: false, update: false, delete: false },
      notifications: { create: true, read: true, delete: false },
      automation: { create: false, read: false, update: false, delete: false },
      localization: { read: false, update: false },
    },
  },
  {
    name: "student",
    description: "Can browse courses, enroll, and learn",
    isBuiltIn: true,
    permissions: {
      users: { create: false, read: true, update: false, delete: false },
      courses: { create: false, read: true, update: false, delete: false },
      pages: { create: false, read: true, update: false, delete: false },
      settings: { read: false, update: false },
      roles: { read: false, update: false },
      analytics: { read: false },
      templates: { create: false, read: false, update: false, delete: false },
      navigation: { create: false, read: true, update: false, delete: false },
      media: { create: false, read: true, delete: false },
      backups: { create: false, read: false },
      moderation: { read: false, update: false, delete: false },
      notifications: { create: false, read: true, delete: false },
      automation: { create: false, read: false, update: false, delete: false },
      localization: { read: false, update: false },
    },
  },
  {
    name: "parent",
    description: "Can monitor child progress and manage family settings",
    isBuiltIn: true,
    permissions: {
      users: { create: false, read: true, update: false, delete: false },
      courses: { create: false, read: true, update: false, delete: false },
      pages: { create: false, read: true, update: false, delete: false },
      settings: { read: false, update: false },
      roles: { read: false, update: false },
      analytics: { read: true },
      templates: { create: false, read: false, update: false, delete: false },
      navigation: { create: false, read: true, update: false, delete: false },
      media: { create: false, read: true, delete: false },
      backups: { create: false, read: false },
      moderation: { read: false, update: false, delete: false },
      notifications: { create: false, read: true, delete: false },
      automation: { create: false, read: false, update: false, delete: false },
      localization: { read: false, update: false },
    },
  },
];

interface Permissions {
  [resource: string]: {
    [action: string]: boolean;
  };
}

async function ensureDefaultRoles() {
  const count = await prisma.role.count();
  if (count > 0) return;

  for (const role of DEFAULT_ROLES) {
    await prisma.role.create({
      data: {
        name: role.name,
        description: role.description,
        permissions: JSON.stringify(role.permissions),
        isBuiltIn: role.isBuiltIn,
      },
    });
  }
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await ensureDefaultRoles();

  const roles = await prisma.role.findMany({
    orderBy: [{ isBuiltIn: "desc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(roles);
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { name, description, permissions, isBuiltIn } = parsed.data;

  const existing = await prisma.role.findUnique({ where: { name } });
  if (existing) {
    return NextResponse.json({ error: "A role with this name already exists" }, { status: 409 });
  }

  const role = await prisma.role.create({
    data: { name, description, permissions, isBuiltIn },
  });

  return NextResponse.json(role, { status: 201 });
}
