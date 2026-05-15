"use client";

import { Search, Users } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your enrolled students.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Search students..." className="pl-10" />
      </div>

      <Card>
        <CardHeader className="flex flex-col items-center py-12 text-center">
          <Users className="mb-3 h-12 w-12 text-gray-300" />
          <CardTitle>No students yet</CardTitle>
          <CardDescription>
            Students will appear here once they enroll in your courses.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
