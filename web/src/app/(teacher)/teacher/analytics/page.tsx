"use client";

import { BarChart3, Users, BookOpen, TrendingUp } from "lucide-react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Course and student performance metrics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium text-gray-500">
                Active Courses
              </CardTitle>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">--</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-500" />
              <CardTitle className="text-sm font-medium text-gray-500">
                Active Students
              </CardTitle>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">--</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-sm font-medium text-gray-500">
                Avg. Completion
              </CardTitle>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">--</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-sm font-medium text-gray-500">
                Avg. Score
              </CardTitle>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">--</p>
          </CardHeader>
        </Card>
      </div>

      <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-400">
        Detailed analytics charts coming soon. Recharts integration will render
        enrollment, completion funnel, score distribution, and drop-off analysis.
      </div>
    </div>
  );
}
