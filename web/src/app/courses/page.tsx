import { PublicLayout } from "@/components/layout/public-layout";
import { CoursesContent } from "@/components/courses/courses-content";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;

  return (
    <PublicLayout>
      <CoursesContent initialTag={tag} />
    </PublicLayout>
  );
}
