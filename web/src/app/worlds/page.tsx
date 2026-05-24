import { Metadata } from "next";
import { WorldsContent } from "@/components/worlds/worlds-content";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";

export const metadata: Metadata = {
  title: "Learning Worlds",
  description: "Explore themed learning worlds and master new concepts.",
};

export default function LearningWorldsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Suspense fallback={<LoadingScreen />}>
        <WorldsContent />
      </Suspense>
    </div>
  );
}