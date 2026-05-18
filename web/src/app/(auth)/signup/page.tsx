import { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <AuthSplitLayout
      title="Create your account"
      subtitle="Join NEOT and start learning"
    >
      <SignupForm />
    </AuthSplitLayout>
  );
}
