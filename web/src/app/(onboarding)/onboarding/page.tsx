import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default async function OnboardingPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (user.onboardingCompleted) {
    const dashboards: Record<string, string> = {
      student: "/dashboard",
      teacher: "/teacher",
      parent: "/parent",
      admin: "/admin",
    };
    redirect(dashboards[user.role] ?? "/");
  }

  return <OnboardingWizard role={user.role} userId={user.id} />;
}
