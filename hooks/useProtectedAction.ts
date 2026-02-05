"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { useAppToast } from "@/components/ui/AppToastProvider";
import type { ToastType } from "@/components/ui/Toast";
import {
  RBAC_DENIED_MESSAGE,
  type RouteAccessDecision,
  type UserRole,
} from "@/lib/rbac";

export interface DenyBehavior {
  message?: string;
  toastType?: ToastType;
  redirectTo?: string | null;
}

export function useProtectedAction() {
  const router = useRouter();
  const { role, status } = useAuth();
  const { showToast } = useAppToast();

  const deny = useCallback(
    (behavior?: DenyBehavior) => {
      showToast(
        behavior?.message ?? RBAC_DENIED_MESSAGE,
        behavior?.toastType ?? "warning",
      );
      if (behavior?.redirectTo) router.replace(behavior.redirectTo);
    },
    [router, showToast],
  );

  const ensureAllowed = useCallback(
    (
      isAllowed: (role: UserRole) => boolean,
      behavior?: DenyBehavior,
    ): boolean => {
      if (status !== "authenticated" || !role) {
        deny({ ...behavior, redirectTo: "/" });
        return false;
      }

      if (isAllowed(role)) return true;
      deny(behavior);
      return false;
    },
    [deny, role, status],
  );

  const ensureRouteAllowed = useCallback(
    (
      decision: RouteAccessDecision,
      behavior?: DenyBehavior,
    ): decision is RouteAccessDecision & { allowed: true } => {
      if (decision.allowed) return true;
      deny(behavior);
      return false;
    },
    [deny],
  );

  const wrap = useCallback(
    <Args extends unknown[]>(
      isAllowed: (role: UserRole) => boolean,
      action: (...args: Args) => void,
      behavior?: DenyBehavior,
    ) => {
      return (...args: Args) => {
        if (!ensureAllowed(isAllowed, behavior)) return;
        action(...args);
      };
    },
    [ensureAllowed],
  );

  return { role, status, ensureAllowed, ensureRouteAllowed, wrap };
}
