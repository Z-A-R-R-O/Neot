import { Metadata } from "next";
import { ReviewDashboard } from "@/components/memory/review-dashboard";

export const metadata: Metadata = {
  title: "Review Dashboard",
  description: "Strengthen your memory with spaced repetition reviews.",
};

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <ReviewDashboard />
    </div>
  );
}
