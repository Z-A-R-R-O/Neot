import { redirect } from "next/navigation";

import { AppLayout } from "@/components/layout/app-layout";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userId: string | undefined;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;
  } catch {
    // Supabase not configured
  }

  if (!userId) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: { role: true, onboardingCompleted: true },
  });

  if (!profile?.onboardingCompleted) {
    redirect("/onboarding");
  }

  const role = (profile.role ?? "student") as "student" | "teacher" | "parent" | "admin";

  return <AppLayout role={role}>{children}</AppLayout>;
}
