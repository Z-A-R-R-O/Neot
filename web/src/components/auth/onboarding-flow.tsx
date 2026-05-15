"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";



import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoleSelector } from "@/components/auth/role-selector";

type Role = "student" | "teacher" | "parent";

type Step = "role" | "details" | "confirm";

const studentSchema = z.object({
  ageGroup: z.enum(["child", "teen", "adult"]),
  grade: z.string().optional(),
  interests: z.string().optional(),
});

const teacherSchema = z.object({
  subjects: z.string().min(1, "Enter at least one subject"),
  gradeLevels: z.string().min(1, "Enter at least one grade level"),
});

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role | null>(null);
  const [childName, setChildName] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const studentForm = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: { ageGroup: "teen", interests: "", grade: "" },
  });

  const teacherForm = useForm<z.infer<typeof teacherSchema>>({
    resolver: zodResolver(teacherSchema),
    defaultValues: { subjects: "", gradeLevels: "" },
  });

  async function handleConfirm() {
    if (!role) return;
    setSubmitting(true);
    setServerError(null);

    const metadata: Record<string, unknown> = {};

    if (role === "student") {
      const data = studentForm.getValues();
      metadata.age_group = data.ageGroup;
      if (data.grade) metadata.grade = data.grade;
      if (data.interests) {
        metadata.interests = data.interests.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }

    if (role === "teacher") {
      const data = teacherForm.getValues();
      metadata.subjects = data.subjects.split(",").map((s) => s.trim()).filter(Boolean);
      metadata.grade_levels = data.gradeLevels.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const res = await fetch("/api/auth/role", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, metadata }),
    });

    if (!res.ok) {
      const err = await res.json();
      setServerError(err.error ?? "Something went wrong");
      setSubmitting(false);
      return;
    }

    const dashboards: Record<Role, string> = {
      student: "/dashboard",
      teacher: "/teacher",
      parent: "/dashboard",
    };
    router.push(dashboards[role]);
  }

  function renderRoleStep() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            What best describes you?
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose your role to personalize your experience
          </p>
        </div>
        <RoleSelector selected={role} onSelect={setRole} />
        <Button
          onClick={() => setStep("details")}
          disabled={!role}
          className="w-full"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  function renderDetailsStep() {
    if (role === "student") {
      return (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Tell us about yourself
          </h2>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-gray-700 required">
              Age Group
            </legend>
            <div className="flex gap-3">
              {[
                { value: "child", label: "Child (<13)" },
                { value: "teen", label: "Teen (13–18)" },
                { value: "adult", label: "Adult (18+)" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50"
                >
                  <input
                    type="radio"
                    value={opt.value}
                    className="text-primary-600 focus:ring-primary-500"
                    {...studentForm.register("ageGroup")}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor="grade">Grade (optional)</Label>
            <Input
              id="grade"
              placeholder="e.g. 5th grade"
              {...studentForm.register("grade")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">
              Interests (optional, comma-separated)
            </Label>
            <Input
              id="interests"
              placeholder="math, science, art"
              {...studentForm.register("interests")}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("role")}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={() => setStep("confirm")} className="flex-1">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    if (role === "teacher") {
      return (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Tell us about your teaching
          </h2>

          <div className="space-y-2">
            <Label htmlFor="subjects" required>
              Subjects you teach
            </Label>
            <Input
              id="subjects"
              placeholder="math, science, english"
              error={teacherForm.formState.errors.subjects?.message}
              {...teacherForm.register("subjects")}
            />
            <p className="text-xs text-gray-400">Comma-separated</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gradeLevels" required>
              Grade levels
            </Label>
            <Input
              id="gradeLevels"
              placeholder="elementary, middle, high"
              error={teacherForm.formState.errors.gradeLevels?.message}
              {...teacherForm.register("gradeLevels")}
            />
            <p className="text-xs text-gray-400">Comma-separated</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("role")}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={() => setStep("confirm")} className="flex-1">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    if (role === "parent") {
      return (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            About your family
          </h2>

          <div className="space-y-2">
            <Label htmlFor="childName">
              Child&apos;s name (optional)
            </Label>
            <Input
              id="childName"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Enter your child's name"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("role")}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={() => setStep("confirm")} className="flex-1">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    return null;
  }

  function renderConfirmStep() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Almost done!
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review your selections and confirm
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Role</dt>
              <dd className="font-medium capitalize text-gray-900">{role}</dd>
            </div>
            {role === "student" && (() => {
              const sv = studentForm.getValues();
              return (
                <>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Age Group</dt>
                    <dd className="font-medium capitalize text-gray-900">{sv.ageGroup}</dd>
                  </div>
                  {sv.grade && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Grade</dt>
                      <dd className="font-medium text-gray-900">{sv.grade}</dd>
                    </div>
                  )}
                </>
              );
            })()}
            {role === "teacher" && (() => {
              const tv = teacherForm.getValues();
              return (
                <>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Subjects</dt>
                    <dd className="font-medium text-gray-900">{tv.subjects}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Grade Levels</dt>
                    <dd className="font-medium text-gray-900">{tv.gradeLevels}</dd>
                  </div>
                </>
              );
            })()}
          </dl>
        </div>

        {serverError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep("details")}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Confirm
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[400px]">
      {step === "role" && renderRoleStep()}
      {step === "details" && renderDetailsStep()}
      {step === "confirm" && renderConfirmStep()}
    </div>
  );
}
