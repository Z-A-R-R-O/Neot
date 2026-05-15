import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  let email: string | undefined;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? undefined;
  } catch {
    // Supabase not configured
  }

  const name = email ? email.split("@")[0] : "there";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {name}!
        </h1>
        <p className="mt-1 text-gray-500">
          Here&apos;s an overview of your learning journey.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Enrolled Courses</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Completed Lessons</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Achievement Points</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>
    </div>
  );
}
