"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Eye, Archive, Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";

const statusVariants: Record<string, "success" | "warning" | "secondary" | "danger"> = {
  published: "success",
  draft: "warning",
  archived: "secondary",
};

export default function TeacherCoursesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const {
    data: courses,
    isLoading,
    error,
    refetch,
  } = useCourses({
    teacherId: user?.id,
    status: undefined,
  });

  if (authLoading || isLoading) {
    return <LoadingScreen message="Loading courses..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load courses" onRetry={() => refetch()} />;
  }

  async function handleAction(courseId: string, action: "publish" | "archive") {
    setActionLoading(courseId);
    try {
      await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action === "publish" ? "published" : "archived",
        }),
      });
      refetch();
    } catch {
      // Silently fail
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your courses and content.
          </p>
        </div>
        <Link href="/teacher/courses/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Course
          </Button>
        </Link>
      </div>

      {!courses || courses.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No courses yet"
          description="Create your first course to get started."
          actionLabel="Create Course"
          onAction={() => window.location.assign("/teacher/courses/new")}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="truncate">{course.title}</CardTitle>
                    {course.description && (
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    )}
                  </div>
                  <Badge
                    variant={statusVariants[course.status] ?? "secondary"}
                    size="sm"
                    className="ml-2 shrink-0"
                  >
                    {course.status}
                  </Badge>
                </div>
              </CardHeader>
              <div className="space-y-1 px-6 pb-4 text-sm text-gray-500">
                <p>{course._count.modules} modules</p>
                <p>{course._count.enrollments} enrollments</p>
                {course.subject && <p>Subject: {course.subject}</p>}
              </div>
              <div className="flex gap-2 border-t border-gray-100 px-6 py-3">
                <Link href={`/teacher/courses/${course.id}/modules`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                {course.status === "draft" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={actionLoading === course.id}
                    onClick={() => handleAction(course.id, "publish")}
                  >
                    {actionLoading === course.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    Publish
                  </Button>
                )}
                {course.status !== "archived" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={actionLoading === course.id}
                    onClick={() => handleAction(course.id, "archive")}
                  >
                    {actionLoading === course.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Archive className="h-4 w-4" />
                    )}
                    Archive
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
