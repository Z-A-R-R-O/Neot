"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  GraduationCap,
  Heart,
  Target,
  BookOpen,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OnboardingWizardProps {
  role: string;
  userId: string;
}

type OnboardingData = {
  fullName: string;
  ageGroup: string;
  interests: string[];
  experienceLevel: string;
  goals: string;
  bio: string;
  subjects: string[];
  gradeLevels: string[];
  yearsExperience: string;
  childName: string;
  childAgeGroup: string;
  childInterests: string[];
};

const easing = [0.16, 1, 0.3, 1] as const;

const INTEREST_OPTIONS = [
  "Math",
  "Science",
  "Programming",
  "Art",
  "Music",
  "Languages",
  "History",
  "Geography",
  "Biology",
  "Reading",
  "Logic",
];

const SUBJECT_OPTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Literature",
  "History",
  "Geography",
  "Art",
  "Music",
  "Languages",
  "Physical Education",
];

const GRADE_LEVEL_OPTIONS = [
  "Elementary",
  "Middle School",
  "High School",
  "College",
];

const EXPERIENCE_LEVEL_OPTIONS = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const YEARS_EXPERIENCE_OPTIONS = [
  "0-1",
  "1-3",
  "3-5",
  "5-10",
  "10+",
];

const AGE_GROUP_OPTIONS = [
  { value: "child", label: "Child (<13)" },
  { value: "teen", label: "Teen (13-18)" },
  { value: "adult", label: "Adult (18+)" },
];

const studentSteps = [
  { id: "welcome", label: "Welcome", icon: Sparkles },
  { id: "interests", label: "Interests", icon: Heart },
  { id: "experience", label: "Experience", icon: Target },
  { id: "goals", label: "Goals", icon: BookOpen },
  { id: "done", label: "Done", icon: Check },
];

const teacherSteps = [
  { id: "welcome", label: "Welcome", icon: GraduationCap },
  { id: "subjects", label: "Subjects", icon: BookOpen },
  { id: "grades", label: "Grades", icon: Target },
  { id: "experience", label: "Experience", icon: Sparkles },
  { id: "done", label: "Done", icon: Check },
];

const parentSteps = [
  { id: "welcome", label: "Welcome", icon: Heart },
  { id: "child", label: "Child", icon: Heart },
  { id: "interests", label: "Interests", icon: BookOpen },
  { id: "done", label: "Done", icon: Check },
];

function ChipButton({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
        selected
          ? "border-primary-500/40 bg-primary-500/15 text-primary-300 shadow-sm"
          : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-muted-foreground hover:border-[rgba(255,255,255,0.18)] hover:text-foreground"
      }`}
    >
      {label}
      {selected && <Check className="h-3 w-3 ml-0.5 text-primary-400" />}
    </button>
  );
}

export function OnboardingWizard(props: OnboardingWizardProps) {
  const { role } = props;
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSubmitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [data, setData] = useState<OnboardingData>({
    fullName: "",
    ageGroup: "",
    interests: [],
    experienceLevel: "",
    goals: "",
    bio: "",
    subjects: [],
    gradeLevels: [],
    yearsExperience: "",
    childName: "",
    childAgeGroup: "",
    childInterests: [],
  });

  const steps =
    role === "teacher"
      ? teacherSteps
      : role === "parent"
        ? parentSteps
        : studentSteps;

  const updateField = useCallback(<K extends keyof OnboardingData>(
    field: K,
    value: OnboardingData[K],
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleArrayField = useCallback(
    (field: "interests" | "subjects" | "gradeLevels" | "childInterests", value: string) => {
      setData((prev) => {
        const arr = prev[field];
        if (arr.includes(value)) {
          return { ...prev, [field]: arr.filter((v) => v !== value) };
        }
        return { ...prev, [field]: [...arr, value] };
      });
    },
    [],
  );

  function nextStep() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleComplete() {
    setSubmitting(true);
    setServerError(null);

    const profileBody: Record<string, unknown> = {};

    if (data.fullName) profileBody.fullName = data.fullName;

    if (role === "student") {
      if (data.ageGroup) profileBody.ageGroup = data.ageGroup;
      if (data.interests.length > 0) profileBody.interests = data.interests;
    }

    if (role === "teacher") {
      if (data.subjects.length > 0) profileBody.subjects = data.subjects;
      if (data.gradeLevels.length > 0) profileBody.gradeLevels = data.gradeLevels;
      if (data.bio) profileBody.bio = data.bio;
    }

    if (role === "parent") {
      if (data.childName) profileBody.childName = data.childName;
      if (data.childInterests.length > 0) profileBody.childInterests = data.childInterests;
    }

    const profileRes = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileBody),
    });

    if (!profileRes.ok) {
      const err = await profileRes.json();
      setServerError(err.error ?? "Failed to save profile");
      setSubmitting(false);
      return;
    }

    const onboardingBody: Record<string, unknown> = {
      fullName: data.fullName || undefined,
    };

    if (role === "student") {
      onboardingBody.ageGroup = data.ageGroup || undefined;
      onboardingBody.interests = data.interests;
      onboardingBody.experienceLevel = data.experienceLevel || undefined;
      onboardingBody.goals = data.goals || undefined;
    }

    if (role === "teacher") {
      onboardingBody.bio = data.bio || undefined;
      onboardingBody.subjects = data.subjects;
      onboardingBody.gradeLevels = data.gradeLevels;
      onboardingBody.yearsExperience = data.yearsExperience || undefined;
    }

    if (role === "parent") {
      onboardingBody.childName = data.childName || undefined;
      onboardingBody.childAgeGroup = data.childAgeGroup || undefined;
      onboardingBody.childInterests = data.childInterests;
    }

    const onboardingRes = await fetch("/api/auth/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(onboardingBody),
    });

    if (!onboardingRes.ok) {
      const err = await onboardingRes.json();
      setServerError(err.error ?? "Failed to complete onboarding");
      setSubmitting(false);
      return;
    }

    const dashboards: Record<string, string> = {
      student: "/dashboard",
      teacher: "/teacher",
      parent: "/dashboard",
    };
    router.push(dashboards[role] ?? "/dashboard");
  }

  function renderStep() {
    const stepId = steps[step].id;

    switch (stepId) {
      case "welcome":
        return renderWelcomeStep();
      case "interests":
        return role === "parent" ? renderChildInterestsStep() : renderInterestsStep();
      case "experience":
        return role === "student" ? renderExperienceLevelStep() : renderTeacherExperienceStep();
      case "goals":
        return renderGoalsStep();
      case "subjects":
        return renderSubjectsStep();
      case "grades":
        return renderGradeLevelsStep();
      case "child":
        return renderChildStep();
      case "done":
        return renderDoneStep();
      default:
        return null;
    }
  }

  function renderWelcomeStep() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome to NEOT
          </h1>
          <p className="mt-2 text-muted-foreground">
            Let&apos;s get to know you better.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName" required>
            Full Name
          </Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="Enter your full name"
            className="bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)]"
          />
        </div>

        {role === "student" && (
          <div className="space-y-3">
            <Label required>Age Group</Label>
            <div className="grid grid-cols-3 gap-3">
              {AGE_GROUP_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`group flex cursor-pointer flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm transition-all ${
                    data.ageGroup === opt.value
                      ? "border-primary-500/30 bg-primary-500/10 text-primary-400"
                      : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-muted-foreground hover:border-[rgba(255,255,255,0.15)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="ageGroup"
                    value={opt.value}
                    checked={data.ageGroup === opt.value}
                    onChange={() => updateField("ageGroup", opt.value)}
                    className="sr-only"
                  />
                  <span className="font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {role === "teacher" && (
          <div className="space-y-2">
            <Label htmlFor="bio">Short Bio</Label>
            <Textarea
              id="bio"
              value={data.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Tell us about your teaching style and experience..."
              rows={3}
              maxLength={500}
              className="bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)] resize-none"
            />
            <p className="text-xs text-muted-foreground">Up to 500 characters</p>
          </div>
        )}

        {role === "parent" && (
          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
            <p className="text-sm text-muted-foreground">
              We&apos;ll help you track your child&apos;s learning journey.
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={nextStep}
            disabled={!data.fullName.trim()}
            className="group flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-foreground text-sm font-semibold text-background transition-all hover:shadow-glow-sm active:scale-[0.98] disabled:opacity-50"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    );
  }

  function renderInterestsStep() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            What are you interested in?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Select the subjects you&apos;d like to explore.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((opt) => (
            <ChipButton
              key={opt}
              selected={data.interests.includes(opt)}
              label={opt}
              onClick={() => toggleArrayField("interests", opt)}
            />
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={prevStep}
            className="group flex h-12 w-20 items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-sm font-medium text-muted-foreground transition-all hover:border-[rgba(255,255,255,0.15)] hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
          <button
            onClick={nextStep}
            className="group flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-foreground text-sm font-semibold text-background transition-all hover:shadow-glow-sm active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    );
  }

  function renderExperienceLevelStep() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            What&apos;s your experience level?
          </h2>
          <p className="mt-2 text-muted-foreground">
            We&apos;ll tailor content to match your skill level.
          </p>
        </div>

        <div className="grid gap-3">
          {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
            <label
              key={opt}
              className={`group flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all ${
                data.experienceLevel === opt
                  ? "border-primary-500/30 bg-primary-500/10 text-primary-400"
                  : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-muted-foreground hover:border-[rgba(255,255,255,0.15)]"
              }`}
            >
              <input
                type="radio"
                name="experienceLevel"
                value={opt}
                checked={data.experienceLevel === opt}
                onChange={() => updateField("experienceLevel", opt)}
                className="sr-only"
              />
              <span className="font-medium">{opt}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={prevStep}
            className="group flex h-12 w-20 items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-sm font-medium text-muted-foreground transition-all hover:border-[rgba(255,255,255,0.15)] hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
          <button
            onClick={nextStep}
            className="group flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-foreground text-sm font-semibold text-background transition-all hover:shadow-glow-sm active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    );
  }

  function renderGoalsStep() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            What do you want to learn?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Tell us about your learning goals and aspirations.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals">Your Goals</Label>
          <Textarea
            id="goals"
            value={data.goals}
            onChange={(e) => updateField("goals", e.target.value)}
            placeholder="I want to learn programming to build apps..."
            rows={4}
            className="bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)] resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={prevStep}
            className="group flex h-12 w-20 items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-sm font-medium text-muted-foreground transition-all hover:border-[rgba(255,255,255,0.15)] hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
          <button
            onClick={nextStep}
            className="group flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-foreground text-sm font-semibold text-background transition-all hover:shadow-glow-sm active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    );
  }

  function renderSubjectsStep() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            What do you teach?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Select the subjects you specialize in.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {SUBJECT_OPTIONS.map((opt) => (
            <ChipButton
              key={opt}
              selected={data.subjects.includes(opt)}
              label={opt}
              onClick={() => toggleArrayField("subjects", opt)}
            />
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={prevStep}
            className="group flex h-12 w-20 items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-sm font-medium text-muted-foreground transition-all hover:border-[rgba(255,255,255,0.15)] hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
          <button
            onClick={nextStep}
            className="group flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-foreground text-sm font-semibold text-background transition-all hover:shadow-glow-sm active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    );
  }

  function renderGradeLevelsStep() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            What grade levels do you teach?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Select all that apply.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {GRADE_LEVEL_OPTIONS.map((opt) => (
            <ChipButton
              key={opt}
              selected={data.gradeLevels.includes(opt)}
              label={opt}
              onClick={() => toggleArrayField("gradeLevels", opt)}
            />
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={prevStep}
            className="group flex h-12 w-20 items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-sm font-medium text-muted-foreground transition-all hover:border-[rgba(255,255,255,0.15)] hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
          <button
            onClick={nextStep}
            className="group flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-foreground text-sm font-semibold text-background transition-all hover:shadow-glow-sm active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    );
  }

  function renderTeacherExperienceStep() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Teaching Experience
          </h2>
          <p className="mt-2 text-muted-foreground">
            How many years have you been teaching?
          </p>
        </div>

        <div className="space-y-2">
          <Label required>Years of Experience</Label>
          <Select
            value={data.yearsExperience}
            onValueChange={(val) => updateField("yearsExperience", val)}
          >
            <SelectTrigger className="w-full bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)]">
              <SelectValue placeholder="Select years of experience" />
            </SelectTrigger>
            <SelectContent>
              {YEARS_EXPERIENCE_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt} years
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={prevStep}
            className="group flex h-12 w-20 items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-sm font-medium text-muted-foreground transition-all hover:border-[rgba(255,255,255,0.15)] hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
          <button
            onClick={nextStep}
            className="group flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-foreground text-sm font-semibold text-background transition-all hover:shadow-glow-sm active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    );
  }

  function renderChildStep() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            About your child
          </h2>
          <p className="mt-2 text-muted-foreground">
            Tell us about your child so we can personalize their experience.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="childName">Child&apos;s Name</Label>
          <Input
            id="childName"
            value={data.childName}
            onChange={(e) => updateField("childName", e.target.value)}
            placeholder="Enter your child's name"
            className="bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)]"
          />
        </div>

        <div className="space-y-3">
          <Label>Child&apos;s Age Group</Label>
          <div className="grid grid-cols-3 gap-3">
            {AGE_GROUP_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`group flex cursor-pointer flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm transition-all ${
                  data.childAgeGroup === opt.value
                    ? "border-primary-500/30 bg-primary-500/10 text-primary-400"
                    : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-muted-foreground hover:border-[rgba(255,255,255,0.15)]"
                }`}
              >
                <input
                  type="radio"
                  name="childAgeGroup"
                  value={opt.value}
                  checked={data.childAgeGroup === opt.value}
                  onChange={() => updateField("childAgeGroup", opt.value)}
                  className="sr-only"
                />
                <span className="font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={prevStep}
            className="group flex h-12 w-20 items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-sm font-medium text-muted-foreground transition-all hover:border-[rgba(255,255,255,0.15)] hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
          <button
            onClick={nextStep}
            className="group flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-foreground text-sm font-semibold text-background transition-all hover:shadow-glow-sm active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    );
  }

  function renderChildInterestsStep() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Your child&apos;s interests
          </h2>
          <p className="mt-2 text-muted-foreground">
            Select the subjects your child is interested in.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((opt) => (
            <ChipButton
              key={opt}
              selected={data.childInterests.includes(opt)}
              label={opt}
              onClick={() => toggleArrayField("childInterests", opt)}
            />
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={prevStep}
            className="group flex h-12 w-20 items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-sm font-medium text-muted-foreground transition-all hover:border-[rgba(255,255,255,0.15)] hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
          <button
            onClick={nextStep}
            className="group flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-foreground text-sm font-semibold text-background transition-all hover:shadow-glow-sm active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    );
  }

  function renderDoneStep() {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/20">
            <Check className="h-8 w-8 text-primary-400" />
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            You&apos;re all set!
          </h2>
          <p className="mt-2 text-muted-foreground">
            Here&apos;s a summary of your profile.
          </p>
        </div>

        <div className="glass-card overflow-hidden border border-[rgba(255,255,255,0.08)] rounded-xl p-6">
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-semibold text-foreground">{data.fullName}</dd>
            </div>

            {role === "student" && (
              <>
                {data.ageGroup && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Age Group</dt>
                    <dd className="font-semibold capitalize text-foreground">
                      {data.ageGroup}
                    </dd>
                  </div>
                )}
                {data.interests.length > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Interests</dt>
                    <dd className="font-semibold text-foreground">
                      {data.interests.join(", ")}
                    </dd>
                  </div>
                )}
                {data.experienceLevel && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Level</dt>
                    <dd className="font-semibold text-foreground">
                      {data.experienceLevel}
                    </dd>
                  </div>
                )}
                {data.goals && (
                  <div className="flex items-start justify-between">
                    <dt className="text-muted-foreground">Goals</dt>
                    <dd className="max-w-[200px] text-right font-medium text-foreground">
                      {data.goals}
                    </dd>
                  </div>
                )}
              </>
            )}

            {role === "teacher" && (
              <>
                {data.bio && (
                  <div className="flex items-start justify-between">
                    <dt className="text-muted-foreground">Bio</dt>
                    <dd className="max-w-[200px] text-right font-medium text-foreground">
                      {data.bio}
                    </dd>
                  </div>
                )}
                {data.subjects.length > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Subjects</dt>
                    <dd className="font-semibold text-foreground">
                      {data.subjects.join(", ")}
                    </dd>
                  </div>
                )}
                {data.gradeLevels.length > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Grade Levels</dt>
                    <dd className="font-semibold text-foreground">
                      {data.gradeLevels.join(", ")}
                    </dd>
                  </div>
                )}
                {data.yearsExperience && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Experience</dt>
                    <dd className="font-semibold text-foreground">
                      {data.yearsExperience} years
                    </dd>
                  </div>
                )}
              </>
            )}

            {role === "parent" && (
              <>
                {data.childName && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Child&apos;s Name</dt>
                    <dd className="font-semibold text-foreground">{data.childName}</dd>
                  </div>
                )}
                {data.childAgeGroup && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Child&apos;s Age Group</dt>
                    <dd className="font-semibold capitalize text-foreground">
                      {data.childAgeGroup}
                    </dd>
                  </div>
                )}
                {data.childInterests.length > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Child&apos;s Interests</dt>
                    <dd className="font-semibold text-foreground">
                      {data.childInterests.join(", ")}
                    </dd>
                  </div>
                )}
              </>
            )}
          </dl>
        </div>

        {serverError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {serverError}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={prevStep}
            className="group flex h-12 w-20 items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-sm font-medium text-muted-foreground transition-all hover:border-[rgba(255,255,255,0.15)] hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
          <button
            onClick={handleComplete}
            disabled={isSubmitting}
            className="group flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary-500 text-sm font-semibold text-white transition-all hover:shadow-glow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                {role === "student" ? "Start Learning" : "Go to Dashboard"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="noise aurora-cinematic relative hidden w-1/2 flex-col items-center justify-center overflow-hidden p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-1/4 -top-1/4 h-[1000px] w-[1000px] rounded-full bg-primary-500/10 blur-[180px] animate-pulse-glow" />
          <div className="absolute -bottom-1/4 -right-1/4 h-[800px] w-[800px] rounded-full bg-accent-500/8 blur-[160px] animate-pulse-glow" style={{ animationDelay: "2.5s" }} />
          <div className="absolute inset-0 opacity-20">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-primary-400"
                animate={{ y: [0, -120, 0], x: [0, Math.sin(i * 1.5) * 60, 0], opacity: [0, 0.8, 0] }}
                transition={{ duration: 12 + i * 2, repeat: Infinity, ease: "linear", delay: i * 1.5 }}
                style={{ left: `${10 + i * 14}%`, top: `${15 + (i % 4) * 18}%` }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary-500 shadow-glow">
              <span className="text-sm font-bold text-white">N</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">NEOT</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: easing }}
            className="glass-thick rounded-[32px] p-8 shadow-2xl"
          >
            <p className="text-lg leading-relaxed text-foreground/90">
              &ldquo;Learning should adapt to humans. Humans should not adapt to systems.&rdquo;
            </p>
          </motion.div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary-400" />
            <span>Just a few steps to get started</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none" />
      </div>

      <div className="relative flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,124,255,0.05)_0%,transparent_60%)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easing }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="mb-10">
            <div className="flex items-center justify-between">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-500 ${
                        i < step
                          ? "bg-primary-500 text-white"
                          : i === step
                          ? "border-2 border-primary-500 bg-primary-500/10 text-primary-400"
                          : "border border-[rgba(255,255,255,0.1)] text-muted-foreground"
                      }`}
                    >
                      {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider ${
                        i <= step ? "text-primary-400" : "text-muted-foreground/50"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`mx-4 h-px w-16 transition-colors duration-500 sm:w-24 ${
                      i < step ? "bg-primary-500/50" : "bg-[rgba(255,255,255,0.08)]"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={steps[step].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: easing }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
