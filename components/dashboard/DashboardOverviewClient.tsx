"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  AlarmClockCheck,
  ArrowRight,
  ArrowUp,
  FileClock,
  FileStack,
  FolderArchive,
  FolderKanban,
  Grid2x2,
  Handshake,
  Mail,
  Scale,
  Users,
} from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import ProtectedLink from "@/components/rbac/ProtectedLink";
import { dummyDisposisi, dummyDokumen, dummyPeminjaman } from "@/lib/data";
import { filterDigitalDocuments } from "@/lib/rbac";

function AnimatedNumber({
  value,
  duration = 1000,
}: {
  value: number;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{displayValue}</>;
}

type ModuleCard = {
  title: string;
  href: string;
  accentColor: string;
  icon: ReactNode;
  subtitle?: string;
  buttonText?: string;
};

function hexToRgb(value: string): string | null {
  const hex = value.replace("#", "").trim();
  if (hex.length !== 3 && hex.length !== 6) return null;

  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((char) => char + char)
          .join("")
      : hex;

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function DashboardPremiumCard({
  title,
  icon,
  href,
  badge,
  subtitle,
  className = "",
  accentColor = "#157ec3",
  buttonText = "Akses Modul",
}: {
  title: string;
  icon: ReactNode;
  href: string;
  badge?: string;
  subtitle?: string;
  className?: string;
  accentColor?: string;
  buttonText?: string;
}) {
  const accentRgb = hexToRgb(accentColor) ?? "21, 126, 195";
  const cardStyle = {
    "--card-accent": accentColor,
    "--card-accent-rgb": accentRgb,
  } as CSSProperties;

  return (
    <ProtectedLink
      href={href}
      className={`uiverse-card ${className}`}
      style={cardStyle}
      title={title}
    >
      <div className="uiverse-card-shine" aria-hidden="true" />
      <div className="uiverse-card-glow" aria-hidden="true" />
      <div className="uiverse-card-content">
        {badge ? <div className="uiverse-card-badge">{badge}</div> : null}
        <div className="uiverse-card-image">
          <div className="text-white">{icon}</div>
        </div>
        <div className="uiverse-card-text">
          <p className="uiverse-card-title">{title}</p>
          {subtitle ? (
            <p className="uiverse-card-description">{subtitle}</p>
          ) : null}
        </div>
        <div className="uiverse-card-footer">
          <div className="uiverse-card-price">{buttonText}</div>
          <div className="uiverse-card-button">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </ProtectedLink>
  );
}

function DashboardSkeletonLine({
  width = "100%",
  height = "14px",
}: {
  width?: string;
  height?: string;
}) {
  return <div className="skeleton-line" style={{ width, height }} />;
}

function DashboardSkeletonTable({
  rows = 5,
  cols = 6,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="skeleton-table">
      <div className="skeleton-table-header">
        {Array.from({ length: cols }).map((_, index) => (
          <div key={index} className="skeleton-table-cell">
            <DashboardSkeletonLine width="80%" />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table-row">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="skeleton-table-cell">
              <DashboardSkeletonLine
                width={
                  colIndex === 0 ? "30px" : colIndex === cols - 1 ? "70px" : "100%"
                }
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function DashboardSkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-stat">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-3">
              <DashboardSkeletonLine width="50%" height="12px" />
              <DashboardSkeletonLine width="40%" height="28px" />
              <DashboardSkeletonLine width="60%" height="12px" />
            </div>
            <div className="skeleton-icon" />
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardSkeletonBanner() {
  return (
    <div className="skeleton-banner">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-3">
          <DashboardSkeletonLine width="45%" height="28px" />
          <DashboardSkeletonLine width="65%" height="16px" />
        </div>
        <div className="hidden skeleton-icon-lg md:block" />
      </div>
    </div>
  );
}

export default function DashboardOverviewClient() {
  const { user, role } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const dokumenAkses = useMemo(() => {
    if (!role) return [];
    return filterDigitalDocuments(role, dummyDokumen);
  }, [role]);

  const dokumenAksesId = useMemo(
    () => new Set(dokumenAkses.map((dokumen) => dokumen.id)),
    [dokumenAkses],
  );

  const statsData = useMemo(() => {
    const totalDokumen = dokumenAkses.length;
    const dokumenDipinjam = dokumenAkses.filter(
      (dokumen) => dokumen.statusPinjam === "Dipinjam",
    ).length;

    const disposisiPending = dummyDisposisi.filter(
      (disposisi) =>
        disposisi.status === "Pending" &&
        dokumenAksesId.has(disposisi.dokumenId),
    ).length;

    const peminjamanPending = dummyPeminjaman.filter(
      (peminjaman) =>
        peminjaman.status === "Pending" &&
        dokumenAksesId.has(peminjaman.dokumenId),
    ).length;

    return {
      totalDokumen,
      dokumenDipinjam,
      disposisiPending,
      peminjamanPending,
    };
  }, [dokumenAkses, dokumenAksesId]);

  const moduleCards = useMemo(() => {
    const list: ModuleCard[] = [
      {
        title: "Laporan Arsip Digital",
        href: "/dashboard/arsip-digital/ruang-arsip/tempat-penyimpanan",
        accentColor: "#157ec3",
        subtitle: "Dokumen dan penyimpanan",
        buttonText: "Akses Laporan",
        icon: <FolderArchive className="w-8 h-8" aria-hidden="true" />,
      },
      {
        title: "Laporan Persuratan",
        href: "/dashboard/manajemen-surat/laporan",
        accentColor: "#7c3aed",
        subtitle: "Surat dan memorandum",
        buttonText: "Akses Laporan",
        icon: <Mail className="w-8 h-8" aria-hidden="true" />,
      },
      {
        title: "Laporan Debitur",
        href: "/dashboard/informasi-debitur",
        accentColor: "#0f766e",
        subtitle: "Pembiayaan nasabah",
        buttonText: "Akses Laporan",
        icon: <Users className="w-8 h-8" aria-hidden="true" />,
      },
      {
        title: "Laporan Legal",
        href: "/dashboard/legal/laporan",
        accentColor: "#d97706",
        subtitle: "Dokumen dan progres legal",
        buttonText: "Akses Laporan",
        icon: <Scale className="w-8 h-8" aria-hidden="true" />,
      },
    ];

    return list;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const statsCount = 4;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <DashboardSkeletonBanner />
        <DashboardSkeletonStats count={statsCount} />
        <DashboardSkeletonTable rows={5} cols={8} />
      </div>
    );
  }

  return (
    <>
      <div
        className="welcome-banner rounded-2xl p-4 text-white animate-fade-in lg:p-8"
        style={{
          background: "linear-gradient(135deg, #157ec3 0%, #0d5a8f 100%)",
        }}
      >
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0">
            <h1 className="mb-2 text-xl font-bold leading-tight lg:text-3xl">
              Assalamualaikum, {user?.namaLengkap ?? "Pengguna"}!
            </h1>
          </div>

          <div className="hidden items-center md:flex">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(16,185,129,0.14)]" />
              <span className="text-sm font-semibold">
                {user?.divisi ?? "-"}
              </span>
              <span className="text-white/45">|</span>
              <span className="text-sm text-white/80">Sesi aktif</span>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-fade-in">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
          <FolderKanban className="h-6 w-6 text-gray-600" aria-hidden="true" />
          Laporan Arsip
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
          <div className="stat-card blue animate-fade-in stagger-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-gray-900">Total Dokumen</p>
                <p className="text-3xl font-extrabold text-gray-900">
                  <AnimatedNumber value={statsData.totalDokumen} />
                </p>
                <p className="mt-2 flex items-center gap-1 text-xs text-gray-900">
                  <ArrowUp
                    className="h-3 w-3 text-green-600"
                    aria-hidden="true"
                  />
                  +12 bulan ini
                </p>
              </div>
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #157ec3 0%, #0d5a8f 100%)",
                }}
              >
                <FileStack className="h-7 w-7 text-white" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="stat-card amber animate-fade-in stagger-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-gray-900">Sedang Dipinjam</p>
                <p className="text-3xl font-extrabold text-gray-900">
                  <AnimatedNumber value={statsData.dokumenDipinjam} />
                </p>
                <p className="mt-2 text-xs text-gray-900">Aktif dipinjam</p>
              </div>
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                }}
              >
                <Handshake className="h-7 w-7 text-white" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="stat-card blue animate-fade-in stagger-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-gray-900">Disposisi Pending</p>
                <p className="text-3xl font-extrabold text-gray-900">
                  <AnimatedNumber value={statsData.disposisiPending} />
                </p>
                <p className="mt-2 text-xs text-gray-900">Menunggu approval</p>
              </div>
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
                }}
              >
                <FileClock className="h-7 w-7 text-white" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="stat-card red animate-fade-in stagger-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-gray-900">Peminjaman Pending</p>
                <p className="text-3xl font-extrabold text-gray-900">
                  <AnimatedNumber value={statsData.peminjamanPending} />
                </p>
                <p className="mt-2 text-xs text-gray-900">Perlu tindakan</p>
              </div>
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                }}
              >
                <AlarmClockCheck
                  className="h-7 w-7 text-white"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-fade-in">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
          <Grid2x2 className="h-6 w-6 text-gray-600" aria-hidden="true" />
          Laporan Modul
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {moduleCards.map((card) => (
            <DashboardPremiumCard
              key={card.href}
              title={card.title}
              href={card.href}
              accentColor={card.accentColor}
              icon={card.icon}
              subtitle={card.subtitle}
              buttonText={card.buttonText}
            />
          ))}
        </div>
      </div>
    </>
  );
}
