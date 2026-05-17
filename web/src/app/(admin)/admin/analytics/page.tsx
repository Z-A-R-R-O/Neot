"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Users, BookOpen, GraduationCap, Trophy, Activity, Clock, TrendingUp, Target,
} from "lucide-react";

import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorState } from "@/components/ui/error-state";
import { Badge } from "@/components/ui/badge";

const easing = [0.16, 1, 0.3, 1] as const;

interface DailyStat {
  date: string;
  signups: number;
  dau: number;
}

interface TopCourse {
  id: string;
  title: string;
  status: string;
  teacher: string;
  enrollments: number;
}

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    totalCompletedLessons: number;
  };
  engagement: {
    dau: number;
    mau: number;
    wau: number;
    mauRatio: number;
    retentionRate: number;
    totalTimeSpent: number;
    avgDailyLessons: number;
  };
  roleDistribution: { role: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
  dailyStats: DailyStat[];
  topCourses: TopCourse[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load analytics");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen fullScreen={false} message="Loading analytics..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easing }}
      >
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform overview and growth metrics.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05, ease: easing }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-primary-400" /> Users
          </div>
          <p className="mt-1 font-heading text-2xl font-bold text-foreground">
            {data.overview.totalUsers.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 text-accent-400" /> Courses
          </div>
          <p className="mt-1 font-heading text-2xl font-bold text-foreground">
            {data.overview.totalCourses.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4 text-green-400" /> Enrollments
          </div>
          <p className="mt-1 font-heading text-2xl font-bold text-foreground">
            {data.overview.totalEnrollments.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4 text-yellow-400" /> Lessons Done
          </div>
          <p className="mt-1 font-heading text-2xl font-bold text-foreground">
            {data.overview.totalCompletedLessons.toLocaleString()}
          </p>
        </div>
      </motion.div>

      {/* Engagement Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease: easing }}
      >
        <h2 className="mb-4 font-heading text-lg font-bold text-foreground">Engagement</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-blue-400" /> DAU
            </div>
            <p className="mt-1 font-heading text-xl font-bold text-foreground">
              {data.engagement.dau.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-purple-400" /> WAU
            </div>
            <p className="mt-1 font-heading text-xl font-bold text-foreground">
              {data.engagement.wau.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-green-400" /> MAU
            </div>
            <p className="mt-1 font-heading text-xl font-bold text-foreground">
              {data.engagement.mau.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-yellow-400" /> MAU %
            </div>
            <p className="mt-1 font-heading text-xl font-bold text-foreground">
              {data.engagement.mauRatio}%
            </p>
          </div>
          <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Target className="h-3 w-3 text-emerald-400" /> Retention
            </div>
            <p className={`mt-1 font-heading text-xl font-bold ${data.engagement.retentionRate >= 50 ? "text-emerald-400" : "text-amber-400"}`}>
              {data.engagement.retentionRate}%
            </p>
          </div>
          <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 text-cyan-400" /> Time (30d)
            </div>
            <p className="mt-1 font-heading text-xl font-bold text-foreground">
              {Math.round(data.engagement.totalTimeSpent / 3600)}h
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* DAU + Signups Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: easing }}
          className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-6"
        >
          <h2 className="mb-4 font-heading text-base font-bold text-foreground">
            Daily Active Users & Signups
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                  tickFormatter={(v: string) => {
                    const d = new Date(v);
                    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="dau" name="DAU" radius={[4, 4, 0, 0]} fill="rgba(79,124,255,0.7)" />
                <Bar dataKey="signups" name="Signups" radius={[4, 4, 0, 0]} fill="rgba(52,211,153,0.6)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Role Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: easing }}
          className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-6"
        >
          <h2 className="mb-4 font-heading text-base font-bold text-foreground">
            Users by Role
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.roleDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="role" type="category" tick={{ fontSize: 12, fill: "rgba(255,255,255,0.6)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" name="Users" radius={[0, 4, 4, 0]} fill="rgba(79,124,255,0.7)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Course Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: easing }}
        className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-6"
      >
        <h2 className="mb-4 font-heading text-base font-bold text-foreground">
          Courses by Status
        </h2>
        <div className="flex flex-wrap gap-4">
          {data.statusDistribution.map((s) => (
            <div
              key={s.status}
              className="flex items-center gap-3 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-4 py-3"
            >
              <Badge variant={s.status === "published" ? "default" : s.status === "draft" ? "secondary" : "outline"}>
                {s.status}
              </Badge>
              <span className="font-heading text-xl font-bold text-foreground">{s.count}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: easing }}
        className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-6"
      >
        <h2 className="mb-4 font-heading text-base font-bold text-foreground">
          Top Courses by Enrollment
        </h2>
        {data.topCourses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No courses yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-2 font-medium">Course</th>
                  <th className="pb-2 font-medium">Teacher</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Enrollments</th>
                </tr>
              </thead>
              <tbody>
                {data.topCourses.map((c, i) => (
                  <tr key={c.id} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 text-foreground">
                      <span className="mr-2 text-xs text-muted-foreground">#{i + 1}</span>
                      {c.title}
                    </td>
                    <td className="py-2.5 text-muted-foreground">{c.teacher}</td>
                    <td className="py-2.5">
                      <Badge variant={c.status === "published" ? "default" : "secondary"} className="text-[10px]">
                        {c.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right font-semibold text-foreground">{c.enrollments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
