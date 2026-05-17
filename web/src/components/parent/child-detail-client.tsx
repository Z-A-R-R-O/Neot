"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Trophy,
  Flame,
  Award,
  Target,
  Clock,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const easing = [0.16, 1, 0.3, 1] as const;

interface ChildProfile {
  id: string;
  fullName: string | null;
  email: string | null;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  avatarUrl: string | null;
  lastActivityDate: string | null;
}

interface EnrollmentItem {
  id: string;
  courseId: string;
  courseTitle: string;
  progress: number;
  completed: boolean;
}

interface AchievementItem {
  id: string;
  name: string;
  description: string;
  iconUrl: string | null;
  xpReward: number;
  earnedAt: string;
}

interface ActivityItem {
  id: string;
  lessonTitle: string;
  status: string;
  score: number | null;
  timestamp: string;
}

interface Props {
  child: ChildProfile;
  enrollments: EnrollmentItem[];
  completedLessonsCount: number;
  achievements: AchievementItem[];
}

export function ChildDetailClient({
  child,
  enrollments,
  completedLessonsCount,
  achievements,
}: Props) {
  const [activityData, setActivityData] = useState<ActivityItem[] | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (activeTab !== "activity") return;
    if (activityData !== null) return;

    fetch(`/api/parent/reports?childId=${child.id}&days=30`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setActivityData(data.recentActivity);
        setActivityLoading(false);
      })
      .catch(() => setActivityLoading(false));
  }, [activeTab, child.id, activityData]);

  const initials = (child.fullName ?? child.email ?? "C")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easing }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/parent">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              {child.fullName ?? child.email ?? "Child"}
            </h1>
            <p className="text-sm text-muted-foreground">{child.email}</p>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easing }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Child Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar size="lg">
                    {child.avatarUrl ? (
                      <AvatarImage src={child.avatarUrl} alt={child.fullName ?? ""} />
                    ) : null}
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-heading text-xl font-bold text-foreground">
                      {child.fullName ?? "Child"}
                    </p>
                    <p className="text-sm text-muted-foreground">{child.email}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="secondary">Level {child.level}</Badge>
                      <Badge variant="secondary">{child.xp.toLocaleString()} XP</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: easing }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Courses</p>
                  <p className="font-heading text-xl font-bold text-foreground">
                    {enrollments.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Lessons</p>
                  <p className="font-heading text-xl font-bold text-foreground">
                    {completedLessonsCount}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Streak</p>
                  <p className="font-heading text-xl font-bold text-foreground">
                    {child.currentStreak}d
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Longest</p>
                  <p className="font-heading text-xl font-bold text-foreground">
                    {child.longestStreak}d
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {child.lastActivityDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: easing }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Last Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">
                    {new Date(child.lastActivityDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="courses" className="mt-6 space-y-4">
          {enrollments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                No courses enrolled
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easing }}
              className="space-y-4"
            >
              {enrollments.map((enr, i) => (
                <motion.div
                  key={enr.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: easing }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{enr.courseTitle}</span>
                        {enr.completed ? (
                          <Badge>Completed</Badge>
                        ) : (
                          <Badge variant="secondary">In Progress</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-muted-foreground">
                          {Math.round(enr.progress)}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                        <div
                          className="h-full rounded-full bg-primary-500 transition-all duration-500"
                          style={{ width: `${enr.progress}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          {achievements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Award className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                No achievements earned yet
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: easing }}
                  className="group relative overflow-hidden rounded-2xl border border-primary-500/20 bg-primary-500/5 p-5 shadow-xl transition-all duration-500 hover:border-primary-500/30 hover:shadow-primary-500/10"
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary-500/10 blur-[50px]" />
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-500/20 text-primary-400">
                      <Award className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{a.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {a.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-primary-400">
                          +{a.xpReward} XP
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(a.earnedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          {activityLoading ? (
            <div className="flex items-center justify-center py-16">
              <Clock className="h-6 w-6 animate-spin text-primary-400" />
            </div>
          ) : activityData && activityData.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easing }}
              className="space-y-3"
            >
              {activityData.map((act) => (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardContent className="flex items-start gap-3 py-4">
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/10">
                        {act.status === "completed" ? (
                          <BookOpen className="h-4 w-4 text-primary-400" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {act.lessonTitle}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {new Date(act.timestamp).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {act.score !== null && (
                            <span className="ml-2 text-primary-400">
                              Score: {Math.round(act.score)}%
                            </span>
                          )}
                        </p>
                      </div>
                      <Badge variant={act.status === "completed" ? "default" : "secondary"}>
                        {act.status}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : activityData ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Clock className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                No recent activity
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-16">
              <Clock className="h-6 w-6 animate-spin text-primary-400" />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
