import { Users, BookOpen, GraduationCap, FileText } from "lucide-react";

import { prisma } from "@/lib/db";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const [totalUsers, roleCounts, totalCourses, totalEnrollments, pageCounts] =
    await Promise.all([
      prisma.profile.count(),
      prisma.profile.groupBy({
        by: ["role"],
        _count: { id: true },
      }),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.customPage.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
    ]);

  const roleMap: Record<string, number> = {};
  for (const r of roleCounts) {
    roleMap[r.role] = r._count.id;
  }

  const pageMap: Record<string, number> = {};
  for (const p of pageCounts) {
    pageMap[p.status] = p._count.id;
  }

  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: totalUsers,
      sub: `${roleMap["student"] ?? 0} students · ${roleMap["teacher"] ?? 0} teachers · ${roleMap["parent"] ?? 0} parents`,
    },
    {
      icon: BookOpen,
      label: "Courses",
      value: totalCourses,
      sub: `${totalEnrollments} total enrollments`,
    },
    {
      icon: GraduationCap,
      label: "Enrollments",
      value: totalEnrollments,
    },
    {
      icon: FileText,
      label: "Custom Pages",
      value: (pageMap["published"] ?? 0) + (pageMap["draft"] ?? 0),
      sub: `${pageMap["published"] ?? 0} published · ${pageMap["draft"] ?? 0} drafts`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Platform overview and management.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-100">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="min-w-0">
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="mt-0 text-2xl">{stat.value}</CardTitle>
                  {stat.sub && (
                    <p className="mt-0.5 truncate text-xs text-tertiary-foreground">
                      {stat.sub}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
