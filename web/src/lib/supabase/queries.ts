import { prisma } from "@/lib/db";
import type { Profile } from "@/types/database";

export async function getProfile(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
  });

  if (!profile) return null;
  return profile as unknown as Profile;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>,
) {
  const profile = await prisma.profile.update({
    where: { id: userId },
    data: updates as never,
  });

  return profile as unknown as Profile;
}

export async function getPublishedCourses() {
  const courses = await prisma.course.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
  });

  return courses;
}

export async function getCourse(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  return course;
}

export async function getCourseLessons(courseId: string) {
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { sortOrder: "asc" },
  });

  return lessons;
}

export async function getLesson(lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });

  return lesson;
}

export async function getUserEnrollments(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
  });

  return enrollments;
}

export async function enrollInCourse(userId: string, courseId: string) {
  const enrollment = await prisma.enrollment.create({
    data: {
      userId,
      courseId,
      progress: 0,
    },
  });

  return enrollment;
}

export async function updateEnrollmentProgress(
  enrollmentId: string,
  progress: number,
) {
  const clamped = Math.min(progress, 100);
  const enrollment = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      progress: clamped,
      completedAt: clamped >= 100 ? new Date() : undefined,
    },
  });

  return enrollment;
}
