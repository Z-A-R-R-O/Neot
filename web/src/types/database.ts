export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Role = "student" | "teacher" | "parent" | "admin";
export type AgeGroup = "child" | "teen" | "adult";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: Role;
  age_group: AgeGroup | null;
  parent_id: string | null;
  onboarding_completed: boolean;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  role?: Role;
  age_group?: AgeGroup | null;
  parent_id?: string | null;
  onboarding_completed?: boolean;
  metadata?: Json;
}

export interface ProfileUpdate {
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  role?: Role;
  age_group?: AgeGroup | null;
  parent_id?: string | null;
  onboarding_completed?: boolean;
  metadata?: Json;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  teacher_id: string;
  subject: string | null;
  grade_level: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  status: "draft" | "published" | "archived";
  estimated_minutes: number | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  content: Json;
  estimated_minutes: number | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      courses: {
        Row: Course;
        Insert: Omit<Course, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Course, "id">>;
      };
      lessons: {
        Row: Lesson;
        Insert: Omit<Lesson, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Lesson, "id">>;
      };
      enrollments: {
        Row: Enrollment;
        Insert: Omit<Enrollment, "id" | "created_at">;
        Update: Partial<Omit<Enrollment, "id">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
