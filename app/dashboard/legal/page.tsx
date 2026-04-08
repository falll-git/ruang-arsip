"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { ROLES } from "@/lib/rbac";

export default function LegalDashboardPage() {
  const router = useRouter();
  const { role, status } = useAuth();

  useEffect(() => {
    if (status !== "authenticated" || !role) return;

    if (role === ROLES.VIEWER) {
      router.replace("/dashboard/legal/laporan");
      return;
    }

    if (role === ROLES.LEGAL || role === ROLES.SUPERADMIN) {
      router.replace("/dashboard/legal/cetak/akad");
      return;
    }

    router.replace("/dashboard");
  }, [role, router, status]);

  return null;
}
