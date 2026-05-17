"use client";

import { useState, useEffect } from "react";
import { Database, Download, FileJson, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function BackupControls() {
  const [dbInfo, setDbInfo] = useState<{ sizeBytes: number; lastModified: string } | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  const [isExportingDb, setIsExportingDb] = useState(false);
  const [isExportingJson, setIsExportingJson] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/backup/info")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setDbInfo(data as { sizeBytes: number; lastModified: string });
      })
      .catch(() => {})
      .finally(() => setIsLoadingInfo(false));
  }, []);

  async function handleExportDb() {
    setIsExportingDb(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/backup");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `neot-backup-${new Date().toISOString().split("T")[0]}.db`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage("Database exported successfully");
    } catch {
      setMessage("Failed to export database");
    } finally {
      setIsExportingDb(false);
    }
  }

  async function handleExportJson() {
    setIsExportingJson(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/backup?format=json");
      if (!res.ok) throw new Error("Export failed");
      const json = await res.json();
      const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `neot-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage("Data exported successfully");
    } catch {
      setMessage("Failed to export data");
    } finally {
      setIsExportingJson(false);
    }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Database Backup
          </CardTitle>
          <CardDescription>
            Download the full SQLite database file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingInfo ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking database...
            </div>
          ) : dbInfo ? (
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">
                Size: <span className="font-medium text-foreground">{formatSize(dbInfo.sizeBytes)}</span>
              </p>
              <p className="text-muted-foreground">
                Last modified: <span className="font-medium text-foreground">
                  {new Date(dbInfo.lastModified).toLocaleString()}
                </span>
              </p>
            </div>
          ) : null}
          <Button
            onClick={handleExportDb}
            disabled={isExportingDb}
            className="w-full"
          >
            {isExportingDb ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export Database
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-primary" />
            Data Export (JSON)
          </CardTitle>
          <CardDescription>
            Export all platform data as JSON.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Exports all records including users, courses, lessons, enrollments, settings, and more.
          </p>
          <Button
            onClick={handleExportJson}
            disabled={isExportingJson}
            variant="outline"
            className="w-full"
          >
            {isExportingJson ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileJson className="h-4 w-4" />
            )}
            Export Data (JSON)
          </Button>
        </CardContent>
      </Card>

      {message && (
        <div className="col-span-full rounded-lg border bg-muted/50 p-3 text-center text-sm text-muted-foreground">
          {message}
        </div>
      )}
    </div>
  );
}
