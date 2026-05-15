import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export async function GET() {
  let userId: string | undefined;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id;
  } catch {
    // Supabase not configured
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          thumbnailUrl: true,
          difficulty: true,
          estimatedMinutes: true,
          teacher: { select: { fullName: true } },
          _count: { select: { modules: true } },
        },
      },
    },
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json(enrollments);
}
