"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorState } from "@/components/ui/error-state";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Reporter {
  email: string | null;
  fullName: string | null;
}

interface ReportRecord {
  id: string;
  type: string;
  targetId: string;
  reason: string;
  reportedBy: string;
  status: string;
  createdAt: string;
  reporter: Reporter | null;
}

interface ReportsResponse {
  reports: ReportRecord[];
}

const statusBadge: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  resolved: "default",
  dismissed: "outline",
};

export default function AdminModerationPage() {
  const [data, setData] = useState<ReportsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);

    fetch(`/api/admin/moderation?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load reports");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reports"))
      .finally(() => setIsLoading(false));
  }, [statusFilter, refreshKey]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setRefreshKey((k) => k + 1);
  }, []);

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/moderation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            reports: prev.reports.map((r) =>
              r.id === id ? { ...r, status: newStatus } : r
            ),
          };
        });
      }
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Moderation</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and manage reported content.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="status" className="text-xs">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <LoadingScreen fullScreen={false} message="Loading reports..." />
      ) : error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : data ? (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Target ID</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Reason</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Reported By</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-tertiary-foreground">
                    No reports found.
                  </td>
                </tr>
              ) : (
                data.reports.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{r.type}</Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {r.targetId}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.reason}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {r.reporter?.fullName || "Unknown"}
                        </p>
                        {r.reporter?.email && (
                          <p className="text-xs text-tertiary-foreground">{r.reporter.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadge[r.status] ?? "outline"}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {format(new Date(r.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      {r.status === "pending" ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-500 hover:text-green-600"
                            disabled={updatingId === r.id}
                            onClick={() => handleStatusChange(r.id, "resolved")}
                          >
                            Resolve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                            disabled={updatingId === r.id}
                            onClick={() => handleStatusChange(r.id, "dismissed")}
                          >
                            Dismiss
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-tertiary-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
