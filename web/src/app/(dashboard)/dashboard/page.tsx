import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const user = await getUser();
  const name = user?.email ? user.email.split("@")[0] : "there";

  let stats = { courses: 0, lessons: 0, xp: 0 };

  try {
    stats.courses = await prisma.enrollment.count({ where: { userId: user!.id } });
  } catch {
    // Stats not available yet
  }

  return <DashboardContent name={name} stats={stats} />;
}

