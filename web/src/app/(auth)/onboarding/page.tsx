import { redirect } from "next/navigation";

import { OnboardingFlow } from "@/components/auth/onboarding-flow";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function OnboardingPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { onboardingCompleted: true, role: true },
  });

  if (profile?.onboardingCompleted) {
    const dashboards: Record<string, string> = {
      student: "/dashboard",
      teacher: "/teacher",
      admin: "/admin",
      parent: "/dashboard",
    };
    redirect(dashboards[profile.role] ?? "/dashboard");
  }

  return <OnboardingFlow />;
}
