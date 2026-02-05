"use client";

import type { CSSProperties, MouseEventHandler, ReactNode } from "react";
import Link from "next/link";

import { useAuth } from "@/components/auth/AuthProvider";
import { useAppToast } from "@/components/ui/AppToastProvider";
import {
  RBAC_DENIED_MESSAGE,
  USER_ROLE_LABEL,
  getDashboardRouteDecision,
  type RouteAccessDecision,
  type UserRole,
} from "@/lib/rbac";

function stripQuery(href: string): string {
  const idx = href.indexOf("?");
  if (idx === -1) return href;
  return href.slice(0, idx);
}

function getDeniedTooltip(
  decision: RouteAccessDecision,
  role: UserRole | null,
): string {
  const roleLabel = role ? USER_ROLE_LABEL[role] : "Belum login";
  switch (decision.reason) {
    case "AUTH_REQUIRED":
      return "Silakan login terlebih dahulu.";
    case "USER_MANAGEMENT_ONLY_MASTER":
      return `Hanya MASTER USER yang dapat mengakses fitur ini. (Role Anda: ${roleLabel})`;
    case "RESTRICT_DATA_ONLY":
      return `Fitur ini hanya untuk akses RESTRICT. (Role Anda: ${roleLabel})`;
    case "NON_RESTRICT_DATA_ONLY":
      return `Fitur ini hanya untuk akses NON RESTRICT. (Role Anda: ${roleLabel})`;
    case "DIGITAL_ARCHIVE_ONLY":
      return `Fitur ini hanya untuk modul Arsip Digital. (Role Anda: ${roleLabel})`;
    case "DIGITAL_ARCHIVE_ADMIN_ONLY":
      return `Fitur ini hanya untuk Admin Arsip Digital. (Role Anda: ${roleLabel})`;
    case "LEGAL_ONLY":
      return `Fitur ini hanya untuk role Legal. (Role Anda: ${roleLabel})`;
    case "UNKNOWN_ROUTE_DENIED":
      return `Tidak ada akses untuk route ini. (Role Anda: ${roleLabel})`;
    case "ALLOWED":
    default:
      return "";
  }
}

export interface ProtectedLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  title?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  toastMessage?: string;
}

export default function ProtectedLink({
  href,
  className,
  children,
  title,
  style,
  onClick,
  toastMessage,
}: ProtectedLinkProps) {
  const { role, status } = useAuth();
  const { showToast } = useAppToast();

  const shouldCheck = href.startsWith("/dashboard");
  const decision = shouldCheck
    ? getDashboardRouteDecision(
        stripQuery(href),
        status === "authenticated" ? role : null,
      )
    : ({ allowed: true, reason: "ALLOWED" } as const);

  const isDenied = shouldCheck && !decision.allowed;
  const tooltip = isDenied ? getDeniedTooltip(decision, role) : title;

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (isDenied) {
      e.preventDefault();
      e.stopPropagation();
      showToast(toastMessage ?? RBAC_DENIED_MESSAGE, "warning");
      return;
    }

    onClick?.(e);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`${className ?? ""}${isDenied ? " rbac-disabled" : ""}`}
      aria-disabled={isDenied}
      title={tooltip}
      style={style}
    >
      {children}
    </Link>
  );
}
