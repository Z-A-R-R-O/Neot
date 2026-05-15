"use client";

import { GraduationCap, Users, HeartHandshake } from "lucide-react";

import { cn } from "@/lib/utils";

type Role = "student" | "teacher" | "parent";

interface RoleSelectorProps {
  selected: Role | null;
  onSelect: (role: Role) => void;
}

const roles: {
  value: Role;
  label: string;
  description: string;
  icon: typeof GraduationCap;
}[] = [
  {
    value: "student",
    label: "Student",
    description: "I want to learn and explore",
    icon: GraduationCap,
  },
  {
    value: "teacher",
    label: "Teacher",
    description: "I want to create courses and teach",
    icon: Users,
  },
  {
    value: "parent",
    label: "Parent",
    description: "I want to guide my child's learning",
    icon: HeartHandshake,
  },
];

export function RoleSelector({ selected, onSelect }: RoleSelectorProps) {
  return (
    <div className="grid gap-4">
      {roles.map(({ value, label, description, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => onSelect(value)}
          className={cn(
            "flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all hover:border-primary-500",
            selected === value
              ? "border-primary-500 bg-primary-50"
              : "border-gray-200 bg-white",
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
              selected === value
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-500",
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{label}</p>
            <p className="mt-0.5 text-sm text-gray-500">{description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
