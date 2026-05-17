import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  auth: boolean;
}

interface ApiGroup {
  category: string;
  endpoints: ApiEndpoint[];
}

const apiGroups: ApiGroup[] = [
  {
    category: "Authentication",
    endpoints: [
      { method: "POST", path: "/api/auth/login", description: "Authenticate user and create session", auth: false },
      { method: "POST", path: "/api/auth/logout", description: "Destroy active session", auth: true },
      { method: "GET", path: "/api/auth/session", description: "Get current session info", auth: false },
    ],
  },
  {
    category: "Users",
    endpoints: [
      { method: "GET", path: "/api/users", description: "List all users", auth: true },
      { method: "GET", path: "/api/users/[id]", description: "Get user by ID", auth: true },
      { method: "PUT", path: "/api/users/[id]", description: "Update user", auth: true },
      { method: "DELETE", path: "/api/users/[id]", description: "Delete user", auth: true },
    ],
  },
  {
    category: "Courses",
    endpoints: [
      { method: "GET", path: "/api/courses", description: "List courses", auth: false },
      { method: "POST", path: "/api/courses", description: "Create course", auth: true },
      { method: "GET", path: "/api/courses/[id]", description: "Get course details", auth: false },
      { method: "PUT", path: "/api/courses/[id]", description: "Update course", auth: true },
      { method: "DELETE", path: "/api/courses/[id]", description: "Delete course", auth: true },
    ],
  },
  {
    category: "Content",
    endpoints: [
      { method: "GET", path: "/api/courses/[id]/modules", description: "List course modules", auth: false },
      { method: "POST", path: "/api/courses/[id]/modules", description: "Create module", auth: true },
      { method: "GET", path: "/api/modules/[id]/lessons", description: "List module lessons", auth: false },
      { method: "POST", path: "/api/modules/[id]/lessons", description: "Create lesson", auth: true },
      { method: "PUT", path: "/api/lessons/[id]", description: "Update lesson", auth: true },
    ],
  },
  {
    category: "Media",
    endpoints: [
      { method: "POST", path: "/api/media/upload", description: "Upload a file", auth: true },
      { method: "GET", path: "/api/media", description: "List uploaded media", auth: true },
      { method: "DELETE", path: "/api/media/[id]", description: "Delete media", auth: true },
    ],
  },
  {
    category: "Admin",
    endpoints: [
      { method: "GET", path: "/api/admin/analytics", description: "Platform analytics data", auth: true },
      { method: "GET", path: "/api/admin/blocks", description: "List block definitions", auth: true },
      { method: "GET", path: "/api/admin/users", description: "Admin user management", auth: true },
    ],
  },
];

export default function AdminApiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">API</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          API endpoints, rate limits, and usage information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rate Limiting</CardTitle>
          <CardDescription>Global API rate limit configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Max Requests</p>
              <p className="text-lg font-semibold text-foreground">5</p>
              <p className="text-xs text-muted-foreground">per window</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Window Duration</p>
              <p className="text-lg font-semibold text-foreground">60s</p>
              <p className="text-xs text-muted-foreground">rolling window</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Strategy</p>
              <p className="text-lg font-semibold text-foreground">In-Memory</p>
              <p className="text-xs text-muted-foreground">per IP address</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {apiGroups.map((group) => (
        <Card key={group.category}>
          <CardHeader>
            <CardTitle className="text-base">{group.category}</CardTitle>
            <CardDescription>
              {group.endpoints.length} endpoint{group.endpoints.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Method</th>
                    <th className="pb-2 pr-4 font-medium">Path</th>
                    <th className="pb-2 pr-4 font-medium">Description</th>
                    <th className="pb-2 font-medium">Auth</th>
                  </tr>
                </thead>
                <tbody>
                  {group.endpoints.map((ep) => (
                    <tr key={ep.path + ep.method} className="border-b border-border/50 last:border-0">
                      <td className="py-2 pr-4">
                        <span className={`font-mono text-xs font-semibold ${
                          ep.method === "GET" ? "text-green-500" :
                          ep.method === "POST" ? "text-blue-500" :
                          ep.method === "PUT" ? "text-yellow-500" :
                          "text-red-500"
                        }`}>
                          {ep.method}
                        </span>
                      </td>
                      <td className="py-2 pr-4 font-mono text-xs text-foreground">{ep.path}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{ep.description}</td>
                      <td className="py-2">
                        {ep.auth ? (
                          <Badge variant="secondary" className="text-xs">Required</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Public</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
