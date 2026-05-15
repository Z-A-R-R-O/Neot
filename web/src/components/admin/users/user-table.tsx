"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { UserActions } from "@/components/admin/users/user-actions";

interface UserRecord {
  id: string;
  email: string | null;
  fullName: string | null;
  role: string;
  ageGroup: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  _count: {
    enrollments: number;
    courses: number;
  };
}

interface UserTableProps {
  users: UserRecord[];
  onUserUpdated: (userId: string) => void;
  onUserDeleted: (userId: string) => void;
}

const roleBadge: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default",
  teacher: "secondary",
  parent: "outline",
  student: "outline",
};

export function UserTable({ users, onUserUpdated, onUserDeleted }: UserTableProps) {
  const router = useRouter();

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-gray-400">
        No users found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-600">User</th>
            <th className="px-4 py-3 font-medium text-gray-600">Role</th>
            <th className="px-4 py-3 font-medium text-gray-600">Age Group</th>
            <th className="px-4 py-3 font-medium text-gray-600">Courses</th>
            <th className="px-4 py-3 font-medium text-gray-600">Enrolled</th>
            <th className="px-4 py-3 font-medium text-gray-600">Joined</th>
            <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((u) => (
            <tr
              key={u.id}
              className="cursor-pointer transition-colors hover:bg-gray-50"
              onClick={() => router.push(`/admin/users/${u.id}`)}
            >
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {u.fullName || "Unnamed"}
                  </p>
                  <p className="text-xs text-gray-400">{u.email || "—"}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant={roleBadge[u.role] ?? "outline"}>
                  {u.role}
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {u.ageGroup || "—"}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {u._count.courses}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {u._count.enrollments}
              </td>
              <td className="px-4 py-3 text-gray-500">
                {format(new Date(u.createdAt), "MMM d, yyyy")}
              </td>
              <td className="px-4 py-3">
                <div onClick={(e) => e.stopPropagation()}>
                  <UserActions
                    userId={u.id}
                    currentRole={u.role}
                    onRoleChange={(_, role) => {
                      onUserUpdated(u.id);
                    }}
                    onDelete={(userId) => onUserDeleted(userId)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
