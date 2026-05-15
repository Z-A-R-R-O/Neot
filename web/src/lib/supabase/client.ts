"use client";

export function createClient() {
  return {
    auth: {
      getUser: async () => {
        try {
          const res = await fetch("/api/auth/me");
          if (!res.ok) return { data: { user: null }, error: null };
          const data = await res.json();
          return { data: { user: data.user }, error: null };
        } catch {
          return { data: { user: null }, error: null };
        }
      },
      onAuthStateChange: () => {
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (!res.ok) return { error: new Error(data.error ?? "Login failed") };
          return { error: null };
        } catch (e) {
          return { error: e instanceof Error ? e : new Error("Login failed") };
        }
      },
      signUp: async ({ email, password }: { email: string; password: string }) => {
        try {
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (!res.ok) return { error: new Error(data.error ?? "Signup failed") };
          return { error: null };
        } catch (e) {
          return { error: e instanceof Error ? e : new Error("Signup failed") };
        }
      },
      signOut: async () => {
        await fetch("/api/auth/logout", { method: "POST" });
      },
      signInWithOAuth: async () => {
        return { error: new Error("OAuth not available with local auth") };
      },
      resetPasswordForEmail: async () => {
        return { error: new Error("Password reset not yet implemented") };
      },
      exchangeCodeForSession: async () => {
        return { error: new Error("OAuth not available") };
      },
    },
  };
}
