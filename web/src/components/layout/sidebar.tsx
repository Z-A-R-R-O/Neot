"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Trophy,
  Users,
  BarChart3,
  Eye,
  Settings,
  FileText,
  Palette,
  Puzzle,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Role = "student" | "teacher" | "parent" | "admin";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: Record<Role, NavItem[]> = {
  student: [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Courses", href: "/dashboard/courses", icon: BookOpen },
    { label: "Achievements", href: "/dashboard/achievements", icon: Award },
    { label: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
  ],
  teacher: [
    { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { label: "My Courses", href: "/teacher/courses", icon: BookOpen },
    { label: "Analytics", href: "/teacher/analytics", icon: BarChart3 },
    { label: "Students", href: "/teacher/students", icon: Users },
  ],
  parent: [
    { label: "Overview", href: "/dashboard", icon: Eye },
    { label: "Children", href: "/dashboard/children", icon: Users },
    { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ],
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Pages", href: "/admin/pages", icon: FileText },
    { label: "Themes", href: "/admin/themes", icon: Palette },
    { label: "Blocks", href: "/admin/blocks", icon: Puzzle },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
};

interface SidebarProps {
  role: Role;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const items = navItems[role] ?? navItems.student;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card border-r border-border transition-transform duration-200 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
            N
          </div>
          <span className="text-lg font-bold text-card-foreground">NEOT</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
