"use client";

import { CourseGrid } from "@/components/courses/course-grid";
import { useCourses } from "@/hooks/useCourses";

export default function CoursesPage() {
  const { data: courses, isLoading, error } = useCourses({ status: "published" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Explore Courses</h1>
        <p className="mt-1 text-gray-500">
          Discover courses tailored to your learning journey.
        </p>
      </div>

      <CourseGrid
        courses={courses}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
