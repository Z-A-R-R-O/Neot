"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, Loader2, ChevronUp, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  order: number;
  visible: boolean;
  settings: Record<string, unknown>;
}

interface RoleWidgets {
  [role: string]: WidgetConfig[];
}

const DEFAULT_WIDGETS: RoleWidgets = {
  student: [
    { id: "stats-cards", type: "stats", title: "Stats Cards", order: 0, visible: true, settings: {} },
    { id: "my-courses", type: "list", title: "My Courses", order: 1, visible: true, settings: {} },
    { id: "continue-learning", type: "list", title: "Continue Learning", order: 2, visible: true, settings: {} },
    { id: "achievements", type: "grid", title: "Achievements", order: 3, visible: true, settings: {} },
    { id: "leaderboard", type: "chart", title: "Leaderboard", order: 4, visible: true, settings: {} },
    { id: "notifications", type: "list", title: "Notifications", order: 5, visible: true, settings: {} },
    { id: "time-spent", type: "chart", title: "Time Spent", order: 6, visible: true, settings: {} },
  ],
  teacher: [
    { id: "stats-cards", type: "stats", title: "Stats Cards", order: 0, visible: true, settings: {} },
    { id: "my-courses", type: "list", title: "My Courses", order: 1, visible: true, settings: {} },
    { id: "students", type: "list", title: "Students", order: 2, visible: true, settings: {} },
    { id: "analytics", type: "chart", title: "Analytics", order: 3, visible: true, settings: {} },
    { id: "recent-activity", type: "list", title: "Recent Activity", order: 4, visible: true, settings: {} },
  ],
  parent: [
    { id: "children-overview", type: "stats", title: "Children Overview", order: 0, visible: true, settings: {} },
    { id: "reports", type: "list", title: "Reports", order: 1, visible: true, settings: {} },
    { id: "achievements", type: "grid", title: "Achievements", order: 2, visible: true, settings: {} },
    { id: "streaks", type: "stats", title: "Streaks", order: 3, visible: true, settings: {} },
  ],
  admin: [
    { id: "stats-cards", type: "stats", title: "Stats Cards", order: 0, visible: true, settings: {} },
    { id: "users-overview", type: "chart", title: "Users Overview", order: 1, visible: true, settings: {} },
    { id: "recent-reports", type: "list", title: "Recent Reports", order: 2, visible: true, settings: {} },
    { id: "system-health", type: "stats", title: "System Health", order: 3, visible: true, settings: {} },
  ],
};

const ROLES = ["student", "teacher", "parent", "admin"];

export function DashboardBuilderPage() {
  const [widgetsByRole, setWidgetsByRole] = useState<RoleWidgets>({});
  const [activeRole, setActiveRole] = useState("student");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard-config")
      .then((res) => res.json())
      .then((data) => {
        const merged: RoleWidgets = {};
        for (const role of ROLES) {
          const existing = data.find((c: { role: string }) => c.role === role);
          const defaults = DEFAULT_WIDGETS[role] ?? [];
          if (existing) {
            const parsed: WidgetConfig[] = JSON.parse(existing.widgets);
            merged[role] = parsed.map((w) => {
              const def = defaults.find((d) => d.id === w.id);
              return def ? { ...def, ...w } : w;
            });
          } else {
            merged[role] = [...defaults];
          }
        }
        setWidgetsByRole(merged);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const currentWidgets = widgetsByRole[activeRole] ?? DEFAULT_WIDGETS[activeRole] ?? [];

  function handleToggle(id: string) {
    setWidgetsByRole((prev) => {
      const widgets = [...(prev[activeRole] ?? [])];
      const idx = widgets.findIndex((w) => w.id === id);
      if (idx !== -1) {
        widgets[idx] = { ...widgets[idx], visible: !widgets[idx].visible };
      }
      return { ...prev, [activeRole]: widgets };
    });
  }

  function handleMoveUp(id: string) {
    setWidgetsByRole((prev) => {
      const widgets = [...(prev[activeRole] ?? [])];
      const idx = widgets.findIndex((w) => w.id === id);
      if (idx <= 0) return prev;
      [widgets[idx - 1], widgets[idx]] = [widgets[idx], widgets[idx - 1]];
      return { ...prev, [activeRole]: widgets.map((w, i) => ({ ...w, order: i })) };
    });
  }

  function handleMoveDown(id: string) {
    setWidgetsByRole((prev) => {
      const widgets = [...(prev[activeRole] ?? [])];
      const idx = widgets.findIndex((w) => w.id === id);
      if (idx === -1 || idx >= widgets.length - 1) return prev;
      [widgets[idx], widgets[idx + 1]] = [widgets[idx + 1], widgets[idx]];
      return { ...prev, [activeRole]: widgets.map((w, i) => ({ ...w, order: i })) };
    });
  }

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      for (const role of ROLES) {
        const widgets = widgetsByRole[role];
        if (!widgets) continue;
        const res = await fetch("/api/admin/dashboard-config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role, widgets }),
        });
        if (!res.ok) throw new Error(`Failed to save config for ${role}`);
      }
    } catch {
      alert("Failed to save dashboard config");
    } finally {
      setIsSaving(false);
    }
  }, [widgetsByRole]);

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-tertiary-foreground">
        Loading dashboard config...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Builder</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure which widgets appear on each role&apos;s dashboard.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save
        </Button>
      </div>

      <div className="flex gap-2">
        {ROLES.map((role) => (
          <Button
            key={role}
            variant={activeRole === role ? "default" : "outline"}
            onClick={() => setActiveRole(role)}
            className="capitalize"
          >
            {role}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {currentWidgets.map((widget) => (
          <Card key={widget.id}>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => handleMoveUp(widget.id)}
                    className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                    disabled={currentWidgets.indexOf(widget) === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(widget.id)}
                    className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                    disabled={currentWidgets.indexOf(widget) === currentWidgets.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{widget.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{widget.type}</p>
                </div>
              </div>
              <Switch
                checked={widget.visible}
                onCheckedChange={() => handleToggle(widget.id)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
