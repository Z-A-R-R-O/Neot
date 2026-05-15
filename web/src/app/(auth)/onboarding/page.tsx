import { redirect } from "next/navigation";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Welcome to NEOT</CardTitle>
        </CardHeader>
        <OnboardingFlow />
      </Card>
    </div>
  );
}
