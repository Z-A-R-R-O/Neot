"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";

function tryCreateClient() {
  try {
    return createClient();
  } catch {
    return null;
  }
}

export function useAuth() {
  const router = useRouter();
  const [supabase] = useState(tryCreateClient);
  const { user, isLoading, setUser, setLoading, reset } = useAuthStore();
  const isConfigured = supabase !== null;

  useEffect(() => {
    if (!supabase) {
      setUser(null);
      return;
    }

    const {
      data: { subscription },
    } =     supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase, setUser]);

  async function login(email: string, password: string) {
    if (!supabase) return { error: new Error("Auth is not configured") };
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (!error) router.push("/onboarding");
    return { error };
  }

  async function signup(email: string, password: string) {
    if (!supabase) return { error: new Error("Auth is not configured") };
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    return { error };
  }

  async function logout() {
    if (!supabase) {
      reset();
      router.push("/login");
      return;
    }
    await supabase.auth.signOut();
    reset();
    router.push("/login");
  }

  async function signInWithGoogle() {
    if (!supabase) return { error: new Error("Auth is not configured") };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  }

  async function resetPassword(email: string) {
    if (!supabase) return { error: new Error("Auth is not configured") };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });
    return { error };
  }

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
    signInWithGoogle,
    resetPassword,
    isConfigured,
  };
}
