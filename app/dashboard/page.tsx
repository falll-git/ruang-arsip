"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArrowLeftRight,
  ArrowUp,
  BookOpen,
  ChevronRight,
  Clock,
  Building2,
  FileText,
  LayoutDashboard,
  Mail,
  Scale,
  Users,
} from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import {
  SkeletonBanner,
  SkeletonStats,
  SkeletonTable,
} from "@/components/ui/Skeleton";
import PremiumCard from "@/components/ui/PremiumCard";
import { dummyDisposisi, dummyDokumen, dummyPeminjaman } from "@/lib/data";
import {
  canAccessDigitalArchive,
  canAccessLegalModule,
  filterDigitalDocuments,
} from "@/lib/rbac";

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
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
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
  buttonText?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const dokumenAkses = useMemo(() => {
    if (!role) return [];
    return filterDigitalDocuments(role, dummyDokumen);
  }, [role]);

  const dokumenAksesId = useMemo(
    () => new Set(dokumenAkses.map((d) => d.id)),
    [dokumenAkses],
  );

  const statsData = useMemo(() => {
    const totalDokumen = dokumenAkses.length;
    const dokumenDipinjam = dokumenAkses.filter(
      (d) => d.statusPinjam === "Dipinjam",
    ).length;

    const disposisiPending = dummyDisposisi.filter(
      (d) => d.status === "Pending" && dokumenAksesId.has(d.dokumenId),
    ).length;

    const peminjamanPending = dummyPeminjaman.filter(
      (p) => p.status === "Pending" && dokumenAksesId.has(p.dokumenId),
    ).length;

    return {
      totalDokumen,
      dokumenDipinjam,
      disposisiPending,
      peminjamanPending,
    };
  }, [dokumenAkses, dokumenAksesId]);

  const recentDokumen = useMemo(() => dokumenAkses.slice(0, 5), [dokumenAkses]);

  const cards = useMemo(() => {
    const list: ModuleCard[] = [
      {
        title: "Manajemen Arsip Digital",
        href: "/dashboard/arsip-digital/ruang-arsip/list-dokumen",
        accentColor: "#157ec3",
        icon: <Archive className="w-8 h-8" aria-hidden="true" />,
      },
      {
        title: "Manajemen Surat",
        href: "/dashboard/surat/surat-masuk/input",
        accentColor: "#7c3aed",
        icon: <Mail className="w-8 h-8" aria-hidden="true" />,
      },
      {
        title: "Informasi Debitur",
        href: "/dashboard/informasi-debitur",
        accentColor: "#ef4444",
        icon: <Users className="w-8 h-8" aria-hidden="true" />,
      },
      {
        title: "Manajemen Legal",
        href: "/dashboard/legal/cetak/akad",
        accentColor: "#f59e0b",
        buttonText: "Buka Modul",
        icon: <Scale className="w-8 h-8" aria-hidden="true" />,
      },
    ];

    return list;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenDokumen = (kode: string) => {
    router.push(
      `/dashboard/arsip-digital/ruang-arsip/list-dokumen?kode=${encodeURIComponent(kode)}`,
    );
  };

  const statsCount = 4;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <SkeletonBanner />
        <SkeletonStats count={statsCount} />
        <SkeletonTable rows={5} cols={8} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div
        className="welcome-banner rounded-2xl p-8 text-white animate-fade-in"
        style={{
          background: "linear-gradient(135deg, #157ec3 0%, #0d5a8f 100%)",
        }}
      >
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold mb-2 leading-tight">
              Assalamualaikum, {user?.namaLengkap ?? "Pengguna"}!
            </h1>
          </div>

          <div className="hidden md:flex items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/12 border border-white/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(16,185,129,0.14)]" />
              <span className="text-sm font-semibold">
                {user?.divisi ?? "-"}
              </span>
              <span className="text-white/45">•</span>
              <span className="text-sm text-white/80">Sesi aktif</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card blue animate-fade-in stagger-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900 mb-1">Total Dokumen</p>
              <p className="text-3xl font-extrabold text-gray-900">
                <AnimatedNumber value={statsData.totalDokumen} />
              </p>
              <p className="text-xs text-gray-900 mt-2 flex items-center gap-1">
                <ArrowUp
                  className="w-3 h-3 text-green-600"
                  aria-hidden="true"
                />
                +12 bulan ini
              </p>
            </div>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #157ec3 0%, #0d5a8f 100%)",
              }}
            >
              <FileText className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="stat-card amber animate-fade-in stagger-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900 mb-1">Sedang Dipinjam</p>
              <p className="text-3xl font-extrabold text-gray-900">
                <AnimatedNumber value={statsData.dokumenDipinjam} />
              </p>
              <p className="text-xs text-gray-900 mt-2">Aktif dipinjam</p>
            </div>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              }}
            >
              <BookOpen className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="stat-card blue animate-fade-in stagger-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900 mb-1">Disposisi Pending</p>
              <p className="text-3xl font-extrabold text-gray-900">
                <AnimatedNumber value={statsData.disposisiPending} />
              </p>
              <p className="text-xs text-gray-900 mt-2">Menunggu approval</p>
            </div>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #157ec3 0%, #0d5a8f 100%)",
              }}
            >
              <ArrowLeftRight
                className="w-7 h-7 text-white"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div className="stat-card red animate-fade-in stagger-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900 mb-1">Peminjaman Pending</p>
              <p className="text-3xl font-extrabold text-gray-900">
                <AnimatedNumber value={statsData.peminjamanPending} />
              </p>
              <p className="text-xs text-gray-900 mt-2">Perlu tindakan</p>
            </div>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              }}
            >
              <Clock className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div className="animate-fade-in">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <LayoutDashboard
            className="w-6 h-6 text-gray-600"
            aria-hidden="true"
          />
          Modul Utama
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <PremiumCard
              key={card.href}
              title={card.title}
              href={card.href}
              accentColor={card.accentColor}
              icon={card.icon}
              buttonText={card.buttonText}
            />
          ))}
        </div>
      </div>

      {role && canAccessLegalModule(role) && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-gray-600" aria-hidden="true" />
            Shortcut
          </h2>
          <Link
            href="/dashboard/legal/cek-bprs"
            className="group block bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #157ec3 0%, #0d5a8f 100%)",
                  }}
                >
                  <Building2 className="w-7 h-7" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-gray-900">
                    Cek Data Debitur (BPRS Lain)
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-1.5 rounded-full"
                        style={{ backgroundColor: "#10b981" }}
                      />
                      <span>Hijau: Lancar (Kol 1)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-1.5 rounded-full"
                        style={{ backgroundColor: "#f59e0b" }}
                      />
                      <span>Kuning: Dalam Perhatian Khusus (Kol 2)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-1.5 rounded-full"
                        style={{ backgroundColor: "#f97316" }}
                      />
                      <span>Oranye: Kurang Lancar (Kol 3)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-1.5 rounded-full"
                        style={{ backgroundColor: "#ef4444" }}
                      />
                      <span>Merah: Diragukan (Kol 4)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-1.5 rounded-full"
                        style={{ backgroundColor: "#7f1d1d" }}
                      />
                      <span>Merah Tua: Macet (Kol 5)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="shrink-0 inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-white bg-[#157ec3] group-hover:bg-[#0d5a8f] transition-colors">
                Buka Fitur
              </div>
            </div>
          </Link>
        </div>
      )}

      {role && canAccessDigitalArchive(role) && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-6 h-6 text-gray-600" aria-hidden="true" />
              Aktivitas Terbaru
            </h2>
            <Link
              href="/dashboard/arsip-digital/ruang-arsip/list-dokumen"
              className="text-sm font-medium text-[#157ec3] hover:text-[#0d5a8f] flex items-center gap-1"
            >
              Lihat Semua{" "}
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode</th>
                  <th>Jenis</th>
                  <th>Nama Dokumen</th>
                  <th>Detail</th>
                  <th>Tanggal</th>
                  <th>User</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentDokumen.map((item, idx) => (
                  <tr
                    key={item.id}
                    role="link"
                    tabIndex={0}
                    onClick={() => handleOpenDokumen(item.kode)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleOpenDokumen(item.kode);
                      }
                    }}
                    className="cursor-pointer hover:bg-[#157ec3]/5 table-row-link"
                    aria-label={`Buka dokumen ${item.kode}`}
                    title={`Buka dokumen ${item.kode}`}
                  >
                    <td className="font-medium">{idx + 1}</td>
                    <td>
                      <span
                        className="font-mono text-sm px-2 py-1 rounded"
                        style={{
                          background: "rgba(21, 126, 195, 0.1)",
                          color: "#157ec3",
                        }}
                      >
                        {item.kode}
                      </span>
                    </td>
                    <td className="text-gray-600">{item.jenisDokumen}</td>
                    <td className="font-medium text-gray-800">
                      {item.namaDokumen}
                    </td>
                    <td className="text-gray-500 text-sm max-w-xs truncate">
                      {item.detail}
                    </td>
                    <td className="text-gray-600">{item.tglInput}</td>
                    <td>
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">
                        {item.userInput}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${item.statusPinjam === "Tersedia" ? "badge-success" : "badge-warning"}`}
                      >
                        {item.statusPinjam}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentDokumen.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-500">
                      Tidak ada dokumen yang dapat diakses.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
