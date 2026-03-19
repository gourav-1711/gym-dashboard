"use client";

import { useAuthStore } from "@/store/authStore";
import { useAuthInit } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  useAuthInit();
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.replace("/login");
    }
    if (!loading && user && pathname === "/login") {
      router.replace("/");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#c8f65d] mx-auto mb-3" />
          <p className="text-white/40 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Still allow /login if not authenticated
  if (!user && pathname === "/login") {
    return <>{children}</>;
  }

  // Redirect to login handled by useEffect, so return null/loading while we wait
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
