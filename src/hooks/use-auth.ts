"use client";

import { signOut, useSession } from "next-auth/react";

export function useAuth() {
  const { data, status, update } = useSession();
  return {
    user: data?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isKisan: data?.user?.role === "KISAN",
    isAdmin: data?.user?.role === "ADMIN",
    refresh: update,
    logout: () => signOut({ callbackUrl: "/auth/kisan/login" }),
  };
}
