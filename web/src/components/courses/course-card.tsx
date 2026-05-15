import Link from "next/link";
import { Clock, BookOpen, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { CourseListItem } from "@/hooks/useCourses";

const difficultyColors: Record<string, "default" | "success" | "warning" | "danger"> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "danger",
};

interface CourseCardProps {
  course: CourseListItem;
  enrolled?: boolean;
  progress?: number;
}

export function CourseCard({ course, enrolled, progress }: CourseCardProps) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-50">
        {course.thumbnailUrl && (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <Badge
            variant={difficultyColors[course.difficulty] ?? "default"}
            size="sm"
          >
            {course.difficulty}
          </Badge>
          {enrolled && (
            <Badge variant="secondary" size="sm">
              Enrolled
            </Badge>
          )}
        </div>

        <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-primary-600">
          {course.title}
        </h3>

        {course.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {course.description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
          {course.estimatedMinutes && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {course.estimatedMinutes} min
            </span>
          )}
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {course._count.modules} modules
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {course._count.enrollments}
          </span>
        </div>

        {enrolled && progress !== undefined && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  progress >= 100 ? "bg-green-500" : "bg-primary-500",
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
