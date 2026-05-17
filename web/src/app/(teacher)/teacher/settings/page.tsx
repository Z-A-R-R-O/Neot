import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TeacherSettingsForm } from "@/components/settings/teacher-settings-form";

interface Metadata {
  subject_expertise?: string[];
  grade_levels?: string[];
  bio?: string;
  age_group?: string;
}

export default async function TeacherSettingsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: {
      fullName: true,
      email: true,
      avatarUrl: true,
      ageGroup: true,
      metadata: true,
    },
  });

  if (!profile) redirect("/login");

  const metadata: Metadata = (() => {
    try {
      return JSON.parse(profile.metadata ?? "{}");
    } catch {
      return {};
    }
  })();

  const initialData = {
    fullName: profile.fullName ?? "",
    email: profile.email ?? "",
    avatarUrl: profile.avatarUrl ?? "",
    ageGroup: (profile.ageGroup as "child" | "teen" | "adult") ?? "adult",
    subjectExpertise: metadata.subject_expertise ?? [],
    gradeLevels: metadata.grade_levels ?? [],
    bio: metadata.bio ?? "",
  };

  return <TeacherSettingsForm initialData={initialData} />;
}
