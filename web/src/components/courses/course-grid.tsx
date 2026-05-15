"use client";

import { CourseCard } from "@/components/courses/course-card";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorState } from "@/components/ui/error-state";
import type { CourseListItem } from "@/hooks/useCourses";

interface CourseGridProps {
  courses?: CourseListItem[];
  isLoading: boolean;
  error: Error | null;
  enrollments?: Map<string, number>;
}

export function CourseGrid({
  courses,
  isLoading,
  error,
  enrollments,
}: CourseGridProps) {
  if (isLoading) return <LoadingScreen fullScreen={false} />;

  if (error) return <ErrorState message={error.message} />;

  if (!courses?.length) {
    return (
      <EmptyState
        title="No courses found"
        description="Check back later for new courses."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          enrolled={enrollments?.has(course.id)}
          progress={enrollments?.get(course.id)}
        />
      ))}
    </div>
  );
}
