import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SettingsForm } from "@/components/settings/settings-form";

interface Metadata {
  interests?: string[];
  subjects?: string[];
  grade_levels?: string[];
  bio?: string;
  child_name?: string;
  child_interests?: string[];
  grade?: string;
  age_group?: string;
}

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: {
      fullName: true,
      email: true,
      avatarUrl: true,
      role: true,
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
    role: profile.role as "student" | "teacher" | "parent",
    ageGroup: (profile.ageGroup as "child" | "teen" | "adult") ?? "teen",
    grade: metadata.grade ?? "",
    interests: metadata.interests ?? [],
    subjects: metadata.subjects ?? [],
    gradeLevels: metadata.grade_levels ?? [],
    bio: metadata.bio ?? "",
    childName: metadata.child_name ?? "",
    childInterests: metadata.child_interests ?? [],
  };

  return <SettingsForm initialData={initialData} />;
}
