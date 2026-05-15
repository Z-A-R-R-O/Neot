import Link from "next/link";
import { BookOpen, School, BarChart3, User, LogIn, UserPlus } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const links = [
  {
    href: "/courses",
    label: "Explore Courses",
    desc: "Browse available courses",
    icon: BookOpen,
  },
  {
    href: "/teacher",
    label: "Teacher Dashboard",
    desc: "Create and manage courses",
    icon: School,
  },
  {
    href: "/teacher/courses/new",
    label: "Create Course",
    desc: "Build a new course",
    icon: BarChart3,
  },
  {
    href: "/login",
    label: "Login",
    desc: "Sign in to your account",
    icon: LogIn,
  },
  {
    href: "/signup",
    label: "Sign Up",
    desc: "Create a new account",
    icon: UserPlus,
  },
  {
    href: "/dashboard",
    label: "Student Dashboard",
    desc: "Your learning journey",
    icon: User,
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground">
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">
          Adaptive Learning Platform
        </p>
        <h1 className="font-heading text-5xl font-bold sm:text-7xl">NEOT</h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
          Learning should adapt to humans. Humans should not adapt to systems.
        </p>
      </section>

      <nav className="mt-12 grid w-full max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm">{link.label}</CardTitle>
                  </div>
                  <CardDescription>{link.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </nav>
    </main>
  );
}
