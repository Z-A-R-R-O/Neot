"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  History,
  RotateCcw,
  Loader2,
  ChevronRight,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface CustomPage {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
}

interface VersionSnapshot {
  id: string;
  pageId: string;
  sections: string;
  createdAt: string;
}

function groupVersionsByPage(
  versions: VersionSnapshot[],
  pages: CustomPage[],
): { page: CustomPage; versions: VersionSnapshot[] }[] {
  const pageMap = new Map(pages.map((p) => [p.id, p]));
  const grouped = new Map<string, VersionSnapshot[]>();

  for (const v of versions) {
    const list = grouped.get(v.pageId) ?? [];
    list.push(v);
    grouped.set(v.pageId, list);
  }

  return Array.from(grouped.entries())
    .map(([pageId, pageVersions]) => ({
      page: pageMap.get(pageId)!,
      versions: pageVersions,
    }))
    .filter((g) => g.page)
    .sort(
      (a, b) =>
        new Date(b.versions[0].createdAt).getTime() -
        new Date(a.versions[0].createdAt).getTime(),
    );
}

export default function VersionHistoryPage() {
  const router = useRouter();
  const [pages, setPages] = useState<CustomPage[] | null>(null);
  const [versions, setVersions] = useState<VersionSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<{
    page: CustomPage;
    versions: VersionSnapshot[];
  } | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch("/api/admin/pages")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load pages");
        return res.json() as Promise<CustomPage[]>;
      })
      .then(async (pagesData) => {
        const allVersions: VersionSnapshot[] = [];
        for (const page of pagesData) {
          const versionsRes = await fetch(`/api/page-versions?pageId=${page.id}`);
          if (versionsRes.ok) {
            const data: VersionSnapshot[] = await versionsRes.json();
            allVersions.push(...data);
          }
        }
        setPages(pagesData);
        setVersions(allVersions);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load data"))
      .finally(() => setIsLoading(false));
  }, [refreshKey]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setRefreshKey((k) => k + 1);
  }, []);

  async function handleRestore(snapshotId: string) {
    if (!confirm("Restore this version? Current sections will be replaced.")) return;
    setRestoring(snapshotId);
    try {
      const res = await fetch(`/api/page-versions/${snapshotId}/restore`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to restore");
      }
      setToast({ message: "Version restored!", variant: "success" });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "Failed to restore", variant: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setRestoring(null);
    }
  }

  if (isLoading) return <LoadingScreen fullScreen={false} message="Loading version history..." />;

  if (error) return <ErrorState message={error} onRetry={handleRetry} />;

  const grouped = groupVersionsByPage(
    versions,
    pages ?? [],
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed right-4 top-20 z-[100] rounded-lg border px-4 py-3 text-sm font-medium shadow-lg transition-all ${
            toast.variant === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-foreground">Version History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and restore snapshots created on publish.
        </p>
      </div>

      {grouped.length === 0 ? (
        <EmptyState
          icon={History}
          title="No versions yet"
          description="Version snapshots are created automatically when you publish a page."
          actionLabel="Go to Pages"
          onAction={() => router.push("/admin/pages")}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.map(({ page, versions: pageVersions }) => (
            <Card key={page.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate">{page.title}</CardTitle>
                    <CardDescription className="truncate">
                      {pageVersions.length} version{pageVersions.length !== 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    Last saved:{" "}
                    {new Date(pageVersions[0].createdAt).toLocaleDateString()}
                  </p>
                  <p>Status: {page.status}</p>
                </div>
              </CardContent>
              <div className="flex gap-2 border-t border-border px-6 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedGroup({ page, versions: pageVersions })}
                >
                  <ChevronRight className="h-4 w-4" />
                  View Versions
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={selectedGroup !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedGroup(null);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedGroup?.page.title} - Versions
            </DialogTitle>
            <DialogDescription>
              Select a version to restore.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-80 space-y-2 overflow-y-auto">
            {selectedGroup?.versions.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(v.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {JSON.parse(v.sections).length} sections
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={restoring === v.id}
                  onClick={() => handleRestore(v.id)}
                >
                  {restoring === v.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <RotateCcw className="h-3 w-3" />
                  )}
                  Restore
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedGroup(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
