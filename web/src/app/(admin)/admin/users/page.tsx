"use client";

import { useState, useEffect, useCallback } from "react";

import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorState } from "@/components/ui/error-state";
import { UserFilters } from "@/components/admin/users/user-filters";
import { UserTable } from "@/components/admin/users/user-table";

interface UsersResponse {
  users: unknown[];
  total: number;
  page: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (role && role !== "all") params.set("role", role);

      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("Failed to load users");
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [search, role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function handleUserUpdated() {
    fetchUsers();
  }

  function handleUserDeleted(userId: string) {
    setData((prev) => {
      if (!prev) return prev;
      const filtered = (prev.users as Array<{ id: string }>).filter((u) => u.id !== userId);
      return { ...prev, users: filtered, total: prev.total - 1 };
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage all platform users.
        </p>
      </div>

      <UserFilters
        search={search}
        role={role}
        onSearchChange={setSearch}
        onRoleChange={setRole}
        onReset={() => {
          setSearch("");
          setRole("all");
        }}
      />

      {isLoading ? (
        <LoadingScreen fullScreen={false} message="Loading users..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchUsers} />
      ) : data ? (
        <>
          <p className="text-xs text-muted-foreground">
            {data.total} user{data.total !== 1 ? "s" : ""}
          </p>
          <UserTable
            users={data.users as never[]}
            onUserUpdated={handleUserUpdated}
            onUserDeleted={handleUserDeleted}
          />
        </>
      ) : null}
    </div>
  );
}
