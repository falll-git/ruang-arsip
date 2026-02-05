export const RBAC_DENIED_MESSAGE = "Maaf, Anda tidak bisa mengakses fitur ini.";

export const USER_ROLES = {
  FULL_AKSES: "FULL_AKSES",
  FUNGSI_LEGAL: "FUNGSI_LEGAL",
  AKSES_RESTRICT: "AKSES_RESTRICT",
  MASTER_USER: "MASTER_USER",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  FULL_AKSES: "FULL AKSES",
  FUNGSI_LEGAL: "FUNGSI LEGAL",
  AKSES_RESTRICT: "AKSES RESTRICT",
  MASTER_USER: "MASTER USER",
};

export type DataAccessLevel = "RESTRICT" | "NON_RESTRICT";

export function canManageUsers(role: UserRole): boolean {
  return role === USER_ROLES.MASTER_USER;
}

export function canAccessRestrictData(role: UserRole): boolean {
  return (
    role === USER_ROLES.FULL_AKSES ||
    role === USER_ROLES.AKSES_RESTRICT ||
    role === USER_ROLES.MASTER_USER
  );
}

export function canAccessNonRestrictData(role: UserRole): boolean {
  return (
    role === USER_ROLES.FULL_AKSES ||
    role === USER_ROLES.FUNGSI_LEGAL ||
    role === USER_ROLES.MASTER_USER
  );
}

export function canAccessDigitalArchive(role: UserRole): boolean {
  return (
    role === USER_ROLES.FULL_AKSES ||
    role === USER_ROLES.FUNGSI_LEGAL ||
    role === USER_ROLES.AKSES_RESTRICT ||
    role === USER_ROLES.MASTER_USER
  );
}

export function canAccessDigitalArchiveAdmin(role: UserRole): boolean {
  return (
    role === USER_ROLES.FULL_AKSES ||
    role === USER_ROLES.FUNGSI_LEGAL ||
    role === USER_ROLES.MASTER_USER
  );
}

export function canViewDigitalDocument(
  role: UserRole,
  levelAkses: DataAccessLevel,
): boolean {
  return canViewDataByLevel(role, levelAkses);
}

export function filterDigitalDocuments<
  T extends { levelAkses: DataAccessLevel },
>(role: UserRole, documents: T[]): T[] {
  return documents.filter((d) => canViewDigitalDocument(role, d.levelAkses));
}

export function canApproveAsLegal(role: UserRole): boolean {
  return (
    role === USER_ROLES.FULL_AKSES ||
    role === USER_ROLES.FUNGSI_LEGAL ||
    role === USER_ROLES.MASTER_USER
  );
}

export function canAccessLegalModule(role: UserRole): boolean {
  return (
    role === USER_ROLES.FULL_AKSES ||
    role === USER_ROLES.FUNGSI_LEGAL ||
    role === USER_ROLES.MASTER_USER
  );
}

export function canAccessSuratModule(role: UserRole): boolean {
  return (
    role === USER_ROLES.FULL_AKSES ||
    role === USER_ROLES.FUNGSI_LEGAL ||
    role === USER_ROLES.AKSES_RESTRICT ||
    role === USER_ROLES.MASTER_USER
  );
}

export function canViewDataByLevel(
  role: UserRole,
  level: DataAccessLevel,
): boolean {
  return level === "RESTRICT"
    ? canAccessRestrictData(role)
    : canAccessNonRestrictData(role);
}

export interface RouteAccessDecision {
  allowed: boolean;
  reason:
    | "ALLOWED"
    | "AUTH_REQUIRED"
    | "USER_MANAGEMENT_ONLY_MASTER"
    | "RESTRICT_DATA_ONLY"
    | "NON_RESTRICT_DATA_ONLY"
    | "DIGITAL_ARCHIVE_ONLY"
    | "DIGITAL_ARCHIVE_ADMIN_ONLY"
    | "LEGAL_ONLY"
    | "UNKNOWN_ROUTE_DENIED";
}

function allow(): RouteAccessDecision {
  return { allowed: true, reason: "ALLOWED" };
}

function deny(reason: RouteAccessDecision["reason"]): RouteAccessDecision {
  return { allowed: false, reason };
}

export function getDashboardRouteDecision(
  pathname: string,
  role: UserRole | null | undefined,
): RouteAccessDecision {
  if (!role) return deny("AUTH_REQUIRED");

  if (pathname === "/dashboard") return allow();

  if (pathname.startsWith("/dashboard/users")) {
    return canManageUsers(role) ? allow() : deny("USER_MANAGEMENT_ONLY_MASTER");
  }

  if (pathname.startsWith("/dashboard/legal")) {
    return canAccessLegalModule(role) ? allow() : deny("LEGAL_ONLY");
  }

  if (pathname.startsWith("/dashboard/surat")) {
    return canAccessSuratModule(role) ? allow() : deny("UNKNOWN_ROUTE_DENIED");
  }

  if (pathname.startsWith("/dashboard/informasi-debitur")) {
    if (
      pathname.startsWith("/dashboard/informasi-debitur/admin/upload-restrik")
    ) {
      return canAccessRestrictData(role) ? allow() : deny("RESTRICT_DATA_ONLY");
    }
    if (pathname.startsWith("/dashboard/informasi-debitur/admin/upload-slik")) {
      return canAccessNonRestrictData(role)
        ? allow()
        : deny("NON_RESTRICT_DATA_ONLY");
    }
    return canAccessNonRestrictData(role)
      ? allow()
      : deny("NON_RESTRICT_DATA_ONLY");
  }

  if (pathname.startsWith("/dashboard/arsip-digital")) {
    if (!canAccessDigitalArchive(role)) return deny("DIGITAL_ARCHIVE_ONLY");

    const arsipSelfServiceAllowed = [
      "/dashboard/arsip-digital/ruang-arsip/list-dokumen",
      "/dashboard/arsip-digital/ruang-arsip/tempat-penyimpanan",
      "/dashboard/arsip-digital/input-dokumen",
      "/dashboard/arsip-digital/disposisi/pengajuan",
      "/dashboard/arsip-digital/disposisi/historis",
      "/dashboard/arsip-digital/peminjaman/request",
      "/dashboard/arsip-digital/peminjaman/laporan",
      "/dashboard/arsip-digital/historis/penyimpanan",
      "/dashboard/arsip-digital/historis/peminjaman",
    ];

    if (arsipSelfServiceAllowed.some((prefix) => pathname.startsWith(prefix))) {
      return allow();
    }

    if (pathname.startsWith("/dashboard/arsip-digital/peminjaman/accept")) {
      return canApproveAsLegal(role) ? allow() : deny("LEGAL_ONLY");
    }

    return canAccessDigitalArchiveAdmin(role)
      ? allow()
      : deny("DIGITAL_ARCHIVE_ADMIN_ONLY");
  }

  if (pathname.startsWith("/dashboard")) {
    return deny("UNKNOWN_ROUTE_DENIED");
  }

  return deny("UNKNOWN_ROUTE_DENIED");
}
