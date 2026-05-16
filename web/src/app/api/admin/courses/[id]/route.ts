import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

const updateSchema = z.object({
  status: z.enum(["draft", "published", "archived"]).optional(),
  title: z.string().min(1).max(200).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const existing = await prisma.course.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const course = await prisma.course.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(course);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const existing = await prisma.course.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  await prisma.course.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
