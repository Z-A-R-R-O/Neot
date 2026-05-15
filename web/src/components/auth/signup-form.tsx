"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const signupSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  ageGroup: z.enum(["under13", "13to18", "18plus"], {
    message: "Select your age group",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { signup } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupData) {
    setServerError(null);
    const { error } = await signup(data.email, data.password);
    if (error) {
      setServerError(error.message);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center">
        <p className="font-medium text-green-800">Check your email</p>
        <p className="mt-1 text-sm text-green-600">
          We sent a confirmation link to your email address.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" required>
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="··········"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" required>
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="··········"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-gray-700">
          Age Group <span className="text-red-500">*</span>
        </legend>
        <div className="flex gap-4">
          {[
            { value: "under13", label: "Under 13" },
            { value: "13to18", label: "13–18" },
            { value: "18plus", label: "18+" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50"
            >
              <input
                type="radio"
                value={option.value}
                className="text-primary-600 focus:ring-primary-500"
                {...register("ageGroup")}
              />
              {option.label}
            </label>
          ))}
        </div>
        {errors.ageGroup && (
          <p className="text-sm text-red-500">{errors.ageGroup.message}</p>
        )}
      </fieldset>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}
