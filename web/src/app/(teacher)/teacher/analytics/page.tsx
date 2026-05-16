"use client";

import { BarChart3, Users, BookOpen, TrendingUp } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EnrollmentChart } from "@/components/teacher/analytics/enrollment-chart";
import { CompletionFunnel } from "@/components/teacher/analytics/completion-funnel";
import { ScoreDistribution } from "@/components/teacher/analytics/score-distribution";
import { DropOffChart } from "@/components/teacher/analytics/drop-off-chart";
import { useCourseAnalytics } from "@/hooks/analytics/useCourseAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        </div>
        <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
      </CardHeader>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { data, isLoading, error } = useCourseAnalytics();

  if (error) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-red-500">Failed to load analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Course and student performance metrics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Active Courses"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : data?.overview.activeCourses ?? "--"}
          color="text-primary"
        />
        <StatCard
          icon={Users}
          label="Active Students"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : data?.overview.activeStudents ?? "--"}
          color="text-emerald-500"
        />
        <StatCard
          icon={BarChart3}
          label="Avg. Completion"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : `${data?.overview.avgCompletion ?? "--"}%`}
          color="text-amber-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg. Score"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : `${data?.overview.avgScore ?? "--"}%`}
          color="text-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Enrollment Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.enrollmentTrend.length ? (
                <EnrollmentChart data={data.enrollmentTrend} />
              ) : (
                <p className="py-16 text-center text-sm text-tertiary-foreground">No enrollment data yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Completion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.funnel[0]?.enrolled ? (
                <CompletionFunnel data={data.funnel} />
              ) : (
                <p className="py-16 text-center text-sm text-tertiary-foreground">No student progress yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.scoreDistribution.some((d) => d.count > 0) ? (
                <ScoreDistribution data={data.scoreDistribution} />
              ) : (
                <p className="py-16 text-center text-sm text-tertiary-foreground">No quiz scores yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Drop-off Points</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.dropOffPoints.length ? (
                <DropOffChart data={data.dropOffPoints} />
              ) : (
                <p className="py-16 text-center text-sm text-tertiary-foreground">No drop-off data yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
