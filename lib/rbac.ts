export const RBAC_DENIED_MESSAGE = "Maaf, Anda tidak bisa mengakses fitur ini.";

export const ROLES = {
  VIEWER: "VIEWER",
  ADMIN: "ADMIN",
  LEGAL: "LEGAL",
  SUPERADMIN: "SUPERADMIN",
} as const;

export type Role = keyof typeof ROLES;

export const ROLE_LABELS: Record<Role, string> = {
  VIEWER: "Manajer",
  ADMIN: "Admin",
  LEGAL: "Legal",
  SUPERADMIN: "IT",
};

export type DataAccessLevel = "RESTRICT" | "NON_RESTRICT";

type RouteRule = {
  prefix: string;
  label: string;
  roles: readonly Role[];
};

const ALL_ROLES: readonly Role[] = [
  ROLES.VIEWER,
  ROLES.ADMIN,
  ROLES.LEGAL,
  ROLES.SUPERADMIN,
];

const DASHBOARD_ROUTE_RULES: readonly RouteRule[] = [
  {
    prefix: "/dashboard/users",
    label: "Manajemen User",
    roles: [ROLES.SUPERADMIN],
  },
  {
    prefix: "/dashboard/arsip-digital/parameter",
    label: "Parameter",
    roles: [ROLES.SUPERADMIN],
  },
  {
    prefix: "/dashboard/informasi-debitur/admin",
    label: "Admin",
    roles: [ROLES.ADMIN, ROLES.SUPERADMIN],
  },
  {
    prefix: "/dashboard/legal/upload-ideb",
    label: "Upload IDEB",
    roles: [ROLES.LEGAL, ROLES.SUPERADMIN],
  },
  {
    prefix: "/dashboard/legal/laporan",
    label: "Laporan Legal",
    roles: [ROLES.VIEWER, ROLES.LEGAL, ROLES.SUPERADMIN],
  },
  {
    prefix: "/dashboard/legal/cetak",
    label: "Cetak Dok Legal",
    roles: [ROLES.LEGAL, ROLES.SUPERADMIN],
  },
  {
    prefix: "/dashboard/legal/titipan",
    label: "Dana Titipan",
    roles: [ROLES.LEGAL],
  },
  {
    prefix: "/dashboard/legal/progress",
    label: "Input Progress PHK3",
    roles: [ROLES.LEGAL],
  },
  {
    prefix: "/dashboard/legal",
    label: "Legal",
    roles: [ROLES.VIEWER, ROLES.LEGAL, ROLES.SUPERADMIN],
  },
  {
    prefix: "/dashboard/manajemen-surat/kelola-surat/input-surat-masuk",
    label: "Input Surat Masuk",
    roles: [ROLES.ADMIN],
  },
  {
    prefix: "/dashboard/manajemen-surat/kelola-surat/input-surat-keluar",
    label: "Input Surat Keluar",
    roles: [ROLES.ADMIN],
  },
  {
    prefix: "/dashboard/manajemen-surat/kelola-surat/input-memorandum",
    label: "Input Memorandum",
    roles: [ROLES.ADMIN],
  },
  {
    prefix: "/dashboard/manajemen-surat/laporan",
    label: "Laporan",
    roles: ALL_ROLES,
  },
  {
    prefix: "/dashboard/manajemen-surat/cetak-dokumen",
    label: "Cetak Dokumen",
    roles: ALL_ROLES,
  },
  {
    prefix: "/dashboard/informasi-debitur/marketing",
    label: "Input Progress",
    roles: [ROLES.ADMIN],
  },
  {
    prefix: "/dashboard/informasi-debitur",
    label: "List Debitur",
    roles: ALL_ROLES,
  },
  {
    prefix: "/dashboard/arsip-digital/disposisi/historis",
    label: "Historis",
    roles: ALL_ROLES,
  },
  {
    prefix: "/dashboard/arsip-digital/disposisi",
    label: "Disposisi Dokumen",
    roles: [ROLES.VIEWER, ROLES.ADMIN, ROLES.LEGAL],
  },
  {
    prefix: "/dashboard/arsip-digital/peminjaman/laporan",
    label: "Laporan Arsip",
    roles: ALL_ROLES,
  },
  {
    prefix: "/dashboard/arsip-digital/peminjaman/request",
    label: "Peminjaman Dokumen",
    roles: [ROLES.ADMIN, ROLES.LEGAL],
  },
  {
    prefix: "/dashboard/arsip-digital/peminjaman/accept",
    label: "Peminjaman Dokumen",
    roles: [ROLES.ADMIN, ROLES.LEGAL],
  },
  {
    prefix: "/dashboard/arsip-digital/historis",
    label: "Historis",
    roles: ALL_ROLES,
  },
  {
    prefix: "/dashboard/arsip-digital/input-dokumen",
    label: "Penyimpanan Arsip",
    roles: [ROLES.ADMIN, ROLES.LEGAL],
  },
  {
    prefix: "/dashboard/arsip-digital/ruang-arsip",
    label: "Penyimpanan Arsip",
    roles: [ROLES.ADMIN, ROLES.LEGAL],
  },
];

function matchesPath(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function hasRole(role: Role, roles: readonly Role[]) {
  return roles.includes(role);
}

export function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" &&
    (Object.keys(ROLES) as Role[]).includes(value as Role)
  );
}

export function canManageUsers(role: Role): boolean {
  return role === ROLES.SUPERADMIN;
}

export function filterDigitalDocuments<
  T extends { levelAkses: DataAccessLevel },
>(isRestrict: boolean, documents: T[]): T[] {
  return documents.filter((document) =>
    document.levelAkses === "NON_RESTRICT" || isRestrict,
  );
}

export function canManageDisposisi(role: Role): boolean {
  return hasRole(role, [ROLES.VIEWER, ROLES.ADMIN, ROLES.LEGAL]);
}

export interface RouteAccessDecision {
  allowed: boolean;
  reason: "ALLOWED" | "AUTH_REQUIRED" | "ROLE_REQUIRED" | "UNKNOWN_ROUTE_DENIED";
  label?: string;
  allowedRoles?: readonly Role[];
}

function allow(): RouteAccessDecision {
  return { allowed: true, reason: "ALLOWED" };
}

function denyRoleAccess(rule: RouteRule): RouteAccessDecision {
  return {
    allowed: false,
    reason: "ROLE_REQUIRED",
    label: rule.label,
    allowedRoles: rule.roles,
  };
}

function deny(reason: RouteAccessDecision["reason"]): RouteAccessDecision {
  return { allowed: false, reason };
}

export function getDashboardRouteDecision(
  pathname: string,
  role: Role | null | undefined,
): RouteAccessDecision {
  if (!role) return deny("AUTH_REQUIRED");

  if (pathname === "/dashboard") return allow();

  const matchedRule = DASHBOARD_ROUTE_RULES.find((rule) =>
    matchesPath(pathname, rule.prefix),
  );

  if (matchedRule) {
    return hasRole(role, matchedRule.roles) ? allow() : denyRoleAccess(matchedRule);
  }

  if (pathname.startsWith("/dashboard")) {
    return deny("UNKNOWN_ROUTE_DENIED");
  }

  return deny("UNKNOWN_ROUTE_DENIED");
}
