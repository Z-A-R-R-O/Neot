import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { SignupForm } from "@/components/auth/signup-form";

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
