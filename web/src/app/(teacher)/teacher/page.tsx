import { BookOpen, Users, GraduationCap } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

export default async function TeacherDashboardPage() {
  let userId: string | undefined;
  let email: string | undefined;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;
    email = user?.email;
  } catch {
    // Supabase not configured
  }

  const name = email ? email.split("@")[0] : "there";

  const [totalCourses, totalEnrollmentsResult] = await Promise.all([
    prisma.course.count({
      where: { teacherId: userId ?? "" },
    }),
    prisma.enrollment.findMany({
      where: {
        course: { teacherId: userId ?? "" },
      },
      select: { id: true, userId: true },
    }),
  ]);

  const totalEnrollments = totalEnrollmentsResult.length;
  const totalStudents = new Set(totalEnrollmentsResult.map((e) => e.userId)).size;

  const stats = [
    {
      icon: BookOpen,
      label: "Total Courses",
      value: totalCourses,
    },
    {
      icon: Users,
      label: "Total Students",
      value: totalStudents,
    },
    {
      icon: GraduationCap,
      label: "Total Enrollments",
      value: totalEnrollments,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {name}!
        </h1>
        <p className="mt-1 text-gray-500">
          Here&apos;s an overview of your teaching.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="mt-0 text-2xl">{stat.value}</CardTitle>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
