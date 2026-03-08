"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertCircle,
  Archive,
  ArrowLeftRight,
  Award,
  BarChart2,
  BookOpen,
  CalendarDays,
  Car,
  ClipboardCheck,
  ClipboardList,
  ChevronDown,
  Clock,
  FilePlus,
  FileCheck,
  FileUp,
  FileText,
  UploadCloud,
  FolderOpen,
  History,
  Inbox,
  LayoutDashboard,
  List,
  Menu,
  Settings,
  LogOut,
  Mail,
  Printer,
  Scale,
  Search,
  Shield,
  Send,
  Users,
  Wallet,
  X,
} from "lucide-react";
import Notification from "@/components/Notification";
import PageLoader from "@/components/ui/PageLoader";
import {
  DocumentPreviewProvider,
  useDocumentPreviewContext,
} from "@/components/ui/DocumentPreviewContext";
import { ArsipDigitalMasterDataProvider } from "@/components/arsip-digital/ArsipDigitalMasterDataProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAppToast } from "@/components/ui/AppToastProvider";
import ProtectedLink from "@/components/rbac/ProtectedLink";
import { RBAC_DENIED_MESSAGE, getDashboardRouteDecision } from "@/lib/rbac";

const SIDEBAR_OPEN_STORAGE_KEY = "ruang-arsip.dashboard.sidebar-open";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocumentPreviewProvider>
      <ArsipDigitalMasterDataProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </ArsipDigitalMasterDataProvider>
    </DocumentPreviewProvider>
  );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isPreviewOpen } = useDocumentPreviewContext();
  const router = useRouter();
  const { status, user, role, signOut } = useAuth();
  const { showToast } = useAppToast();
  const lastDeniedPathRef = useRef<string | null>(null);
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = window.sessionStorage.getItem(SIDEBAR_OPEN_STORAGE_KEY);
    if (stored === "0") return false;
    if (stored === "1") return true;
    return true;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [isDesktop, setIsDesktop] = useState(false);
  const routeDecision = getDashboardRouteDecision(pathname, role);
  const lastScrollYRef = useRef(0);
  const scrollTickingRef = useRef(false);

  const [menuArsip, setMenuArsip] = useState(false);
  const [menuRuangArsip, setMenuRuangArsip] = useState(false);
  const [menuDisposisi, setMenuDisposisi] = useState(false);
  const [menuPeminjaman, setMenuPeminjaman] = useState(false);
  const [menuHistoris, setMenuHistoris] = useState(false);
  const [menuParameter, setMenuParameter] = useState(false);

  const [menuSurat, setMenuSurat] = useState(false);
  const [menuKelolaSurat, setMenuKelolaSurat] = useState(false);

  const [menuDebitur, setMenuDebitur] = useState(false);
  const [menuMarketing, setMenuMarketing] = useState(false);
  const [menuAdmin, setMenuAdmin] = useState(false);

  const [menuLegal, setMenuLegal] = useState(false);
  const [menuCetakDokumen, setMenuCetakDokumen] = useState(false);
  const [menuDataTitipan, setMenuDataTitipan] = useState(false);
  const [menuInputProgress, setMenuInputProgress] = useState(false);

  const updateSidebarOpen = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      setSidebarOpen((prev) => {
        const next =
          typeof value === "function"
            ? (value as (prev: boolean) => boolean)(prev)
            : value;

        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(
            SIDEBAR_OPEN_STORAGE_KEY,
            next ? "1" : "0",
          );
        }

        return next;
      });
    },
    [],
  );

  const isActive = (path: string) => pathname === path;
  const isActiveGroup = (paths: string[]) =>
    paths.some((p) => pathname.includes(p));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(min-width: 1024px)");
    const updateMatch = () => setIsDesktop(media.matches);
    updateMatch();
    media.addEventListener("change", updateMatch);
    return () => media.removeEventListener("change", updateMatch);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      if (window.innerWidth < 640) updateSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateSidebarOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleScroll = () => {
      if (scrollTickingRef.current) return;
      scrollTickingRef.current = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const shouldShowHeader = !(
          currentY > lastScrollYRef.current && currentY > 100
        );

        setHeaderVisible((prev) =>
          prev === shouldShowHeader ? prev : shouldShowHeader,
        );

        lastScrollYRef.current = currentY;
        scrollTickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const isFormField = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (target.isContentEditable) return true;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT")
        return true;
      return false;
    };

    let blurTimer: ReturnType<typeof setTimeout> | null = null;

    const handleFocusIn = (e: FocusEvent) => {
      if (isFormField(e.target)) setIsFocusMode(true);
    };

    const handleFocusOut = () => {
      if (blurTimer) clearTimeout(blurTimer);
      blurTimer = setTimeout(() => {
        const active = document.activeElement;
        if (!isFormField(active)) setIsFocusMode(false);
      }, 120);
    };

    const handleSubmit = () => {
      setIsFocusMode(true);
      if (blurTimer) clearTimeout(blurTimer);
      blurTimer = setTimeout(() => setIsFocusMode(false), 1200);
    };

    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);
    window.addEventListener("submit", handleSubmit, true);

    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
      window.removeEventListener("submit", handleSubmit, true);
      if (blurTimer) clearTimeout(blurTimer);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsFocusMode(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const selector = '.modal-overlay, [data-dashboard-overlay="true"]';
    const updateOverlayState = () => {
      setIsOverlayOpen(Boolean(document.querySelector(selector)));
    };

    updateOverlayState();
    const observer = new MutationObserver(updateOverlayState);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }

    if (status !== "authenticated" || !role) return;
    if (routeDecision.allowed) {
      lastDeniedPathRef.current = null;
      return;
    }

    if (lastDeniedPathRef.current === pathname) return;
    lastDeniedPathRef.current = pathname;

    showToast(RBAC_DENIED_MESSAGE, "warning");
    router.replace("/dashboard");
  }, [pathname, role, routeDecision.allowed, router, showToast, status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, [status]);

  if (status !== "authenticated" || !user || !role || !routeDecision.allowed) {
    return <PageLoader />;
  }

  const sidebarWidth = 280;
  const shouldOffsetMain =
    isDesktop && sidebarOpen && !isPreviewOpen && !isOverlayOpen;
  const isSidebarExpanded = !isDesktop || sidebarOpen;

  const handleSidebarNavClickCapture = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const anchor = target.closest(
      "a.sidebar-menu-item, a.sidebar-submenu-item",
    );
    if (!anchor) return;
    if (anchor.classList.contains("rbac-disabled")) return;

    const href = anchor.getAttribute("href");
    if (!href || !href.startsWith("/dashboard")) return;

    updateSidebarOpen(false);
    setMobileMenuOpen(false);
  };
  const mainStyle: CSSProperties = {
    marginLeft: shouldOffsetMain ? `${sidebarWidth}px` : "0px",
    width: shouldOffsetMain ? `calc(100% - ${sidebarWidth}px)` : "100%",
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)",
      }}
    >
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen transition-all duration-300 ease-in-out flex-col ${
          mobileMenuOpen ? "flex" : "hidden"
        } lg:flex`}
        style={{
          width: `${sidebarWidth}px`,
          background:
            "linear-gradient(180deg, #157ec3 0%, #0f5f96 50%, #0d5a8f 100%)",
          boxShadow: "4px 0 30px rgba(21, 126, 195, 0.2)",
          overflow: "hidden",
          transform:
            isPreviewOpen || isOverlayOpen || (isDesktop && !sidebarOpen)
              ? "translateX(-100%)"
              : "translateX(0)",
        }}
      >
        <div
          className="p-5 border-b"
          style={{
            borderColor: "rgba(255, 255, 255, 0.1)",
            background: "rgba(255, 255, 255, 0.05)",
            flexShrink: 0,
          }}
        >
          <div className="flex items-center justify-between gap-3">
            {isSidebarExpanded ? (
              <div className="min-w-0 flex flex-col justify-center">
                <h1 className="text-[15px] font-extrabold text-white tracking-wide leading-tight">
                  RUWANG ARSIP
                </h1>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center">
                <span className="text-base font-extrabold text-white tracking-wide leading-none">
                  RA
                </span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <nav
          className="flex-1 py-3 sidebar-nav"
          onClickCapture={handleSidebarNavClickCapture}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.3) transparent",
            overflowX: "hidden",
            overflowY: "auto",
            maxWidth: "100%",
          }}
        >
          <ProtectedLink
            href="/dashboard"
            className={`sidebar-menu-item ${isActive("/dashboard") ? "active" : ""}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            {isSidebarExpanded && (
              <span className="font-medium">Dashboard</span>
            )}
          </ProtectedLink>

          {isSidebarExpanded && (
            <div className="mx-0 my-2 border-t border-white/10">
              <span className="block px-4 py-2 text-xs text-white/50 uppercase tracking-wider font-semibold">
                Modul Utama
              </span>
            </div>
          )}

          <div className="sidebar-arsip-group">
            <button
              onClick={() => setMenuArsip(!menuArsip)}
              className={`sidebar-menu-item w-full justify-between ${isActiveGroup(["/arsip-digital"]) ? "active" : ""}`}
            >
              <div className="flex items-center gap-3">
                <Archive className="w-5 h-5" />
                {sidebarOpen && (
                  <span className="font-bold">Arsip Digital</span>
                )}
              </div>
              {sidebarOpen && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${menuArsip ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {sidebarOpen && menuArsip && (
              <div className="mt-1 space-y-0.5">
                <ProtectedLink
                  href="/dashboard/arsip-digital/input-dokumen"
                  className={`sidebar-submenu-item ${isActive("/dashboard/arsip-digital/input-dokumen") ? "active" : ""}`}
                >
                  <FilePlus className="w-4 h-4" />
                  <span>Input Dokumen</span>
                </ProtectedLink>

                <div>
                  <button
                    onClick={() => setMenuRuangArsip(!menuRuangArsip)}
                    className={`sidebar-submenu-item w-full justify-between ${isActiveGroup(["/ruang-arsip"]) ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      <span>Ruang Arsip</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${menuRuangArsip ? "rotate-180" : ""}`}
                    />
                  </button>
                  {menuRuangArsip && (
                    <div className="ml-1 mt-0.5 space-y-0.5">
                      <ProtectedLink
                        href="/dashboard/arsip-digital/ruang-arsip/tempat-penyimpanan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/ruang-arsip/tempat-penyimpanan") ? "active" : ""}`}
                      >
                        <Archive className="w-4 h-4" aria-hidden="true" />
                        <span>Tempat Penyimpanan</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/arsip-digital/ruang-arsip/list-dokumen"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/ruang-arsip/list-dokumen") ? "active" : ""}`}
                      >
                        <List className="w-4 h-4" aria-hidden="true" />
                        <span>List Dokumen</span>
                      </ProtectedLink>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setMenuDisposisi(!menuDisposisi)}
                    className={`sidebar-submenu-item w-full justify-between ${isActiveGroup(["/disposisi"]) ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <ArrowLeftRight className="w-4 h-4" />
                      <span>Disposisi</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${menuDisposisi ? "rotate-180" : ""}`}
                    />
                  </button>
                  {menuDisposisi && (
                    <div className="ml-1 mt-0.5 space-y-0.5">
                      <ProtectedLink
                        href="/dashboard/arsip-digital/disposisi/pengajuan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/disposisi/pengajuan") ? "active" : ""}`}
                      >
                        <FilePlus className="w-4 h-4" aria-hidden="true" />
                        <span>Pengajuan Disposisi</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/arsip-digital/disposisi/permintaan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/disposisi/permintaan") ? "active" : ""}`}
                      >
                        <Inbox className="w-4 h-4" aria-hidden="true" />
                        <span>Permintaan Disposisi</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/arsip-digital/disposisi/historis"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/disposisi/historis") ? "active" : ""}`}
                      >
                        <History className="w-4 h-4" aria-hidden="true" />
                        <span>Historis Disposisi</span>
                      </ProtectedLink>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setMenuPeminjaman(!menuPeminjaman)}
                    className={`sidebar-submenu-item w-full justify-between ${isActiveGroup(["/peminjaman"]) ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Peminjaman Fisik</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${menuPeminjaman ? "rotate-180" : ""}`}
                    />
                  </button>
                  {menuPeminjaman && (
                    <div className="ml-1 mt-0.5 space-y-0.5">
                      <ProtectedLink
                        href="/dashboard/arsip-digital/peminjaman/request"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/peminjaman/request") ? "active" : ""}`}
                      >
                        <Send className="w-4 h-4" aria-hidden="true" />
                        <span>Request Peminjaman</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/arsip-digital/peminjaman/accept"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/peminjaman/accept") ? "active" : ""}`}
                      >
                        <FileCheck className="w-4 h-4" aria-hidden="true" />
                        <span>Accept Peminjaman</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/arsip-digital/peminjaman/laporan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/peminjaman/laporan") ? "active" : ""}`}
                      >
                        <BarChart2 className="w-4 h-4" aria-hidden="true" />
                        <span>Laporan Peminjaman</span>
                      </ProtectedLink>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setMenuHistoris(!menuHistoris)}
                    className={`sidebar-submenu-item w-full justify-between ${isActiveGroup(["/historis"]) ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4" />
                      <span>Historis</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${menuHistoris ? "rotate-180" : ""}`}
                    />
                  </button>
                  {menuHistoris && (
                    <div className="ml-1 mt-0.5 space-y-0.5">
                      <ProtectedLink
                        href="/dashboard/arsip-digital/historis/penyimpanan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/historis/penyimpanan") ? "active" : ""}`}
                      >
                        <Archive className="w-4 h-4" aria-hidden="true" />
                        <span>Historis Penyimpanan</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/arsip-digital/historis/peminjaman"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/historis/peminjaman") ? "active" : ""}`}
                      >
                        <BookOpen className="w-4 h-4" aria-hidden="true" />
                        <span>Historis Peminjaman</span>
                      </ProtectedLink>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setMenuSurat(!menuSurat)}
              className={`sidebar-menu-item w-full justify-between ${isActiveGroup(["/manajemen-surat"]) ? "active" : ""}`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                {sidebarOpen && (
                  <span className="font-bold">Manajemen Surat</span>
                )}
              </div>
              {sidebarOpen && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${menuSurat ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {sidebarOpen && menuSurat && (
              <div className="mt-1 space-y-0.5">
                <div>
                  <button
                    onClick={() => setMenuKelolaSurat(!menuKelolaSurat)}
                    className={`sidebar-submenu-item w-full justify-between ${
                      isActiveGroup([
                        "/dashboard/manajemen-surat/kelola-surat/input-surat-masuk",
                        "/dashboard/manajemen-surat/kelola-surat/input-surat-keluar",
                        "/dashboard/manajemen-surat/kelola-surat/input-memorandum",
                      ])
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      <span>Kelola Surat</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${menuKelolaSurat ? "rotate-180" : ""}`}
                    />
                  </button>

                  {menuKelolaSurat && (
                    <div className="ml-1 mt-0.5 space-y-0.5">
                      <ProtectedLink
                        href="/dashboard/manajemen-surat/kelola-surat/input-surat-masuk"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/manajemen-surat/kelola-surat/input-surat-masuk") ? "active" : ""}`}
                      >
                        <Inbox className="w-4 h-4" />
                        <span>Input Surat Masuk</span>
                      </ProtectedLink>

                      <ProtectedLink
                        href="/dashboard/manajemen-surat/kelola-surat/input-surat-keluar"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/manajemen-surat/kelola-surat/input-surat-keluar") ? "active" : ""}`}
                      >
                        <Send className="w-4 h-4" />
                        <span>Input Surat Keluar</span>
                      </ProtectedLink>

                      <ProtectedLink
                        href="/dashboard/manajemen-surat/kelola-surat/input-memorandum"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/manajemen-surat/kelola-surat/input-memorandum") ? "active" : ""}`}
                      >
                        <FileText className="w-4 h-4" />
                        <span>Input Memorandum</span>
                      </ProtectedLink>
                    </div>
                  )}
                </div>

                <ProtectedLink
                  href="/dashboard/manajemen-surat/laporan"
                  className={`sidebar-submenu-item ${isActive("/dashboard/manajemen-surat/laporan") ? "active" : ""}`}
                >
                  <List className="w-4 h-4" />
                  <span>Laporan Persuratan</span>
                </ProtectedLink>

                <ProtectedLink
                  href="/dashboard/manajemen-surat/cetak-dokumen"
                  className={`sidebar-submenu-item ${isActive("/dashboard/manajemen-surat/cetak-dokumen") ? "active" : ""}`}
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen</span>
                </ProtectedLink>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setMenuDebitur(!menuDebitur)}
              className={`sidebar-menu-item w-full justify-between ${isActiveGroup(["/informasi-debitur"]) ? "active" : ""}`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                {sidebarOpen && (
                  <span className="font-bold">Informasi Debitur</span>
                )}
              </div>
              {sidebarOpen && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${menuDebitur ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {sidebarOpen && menuDebitur && (
              <div className="mt-1 space-y-0.5">
                <ProtectedLink
                  href="/dashboard/informasi-debitur"
                  className={`sidebar-submenu-item ${isActive("/dashboard/informasi-debitur") ? "active" : ""}`}
                >
                  <List className="w-4 h-4" />
                  <span>List Debitur</span>
                </ProtectedLink>

                <div>
                  <button
                    onClick={() => setMenuMarketing(!menuMarketing)}
                    className={`sidebar-submenu-item w-full justify-between ${isActiveGroup(["/informasi-debitur/marketing"]) ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4" />
                      <span>Input Progress</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${menuMarketing ? "rotate-180" : ""}`}
                    />
                  </button>
                  {menuMarketing && (
                    <div className="ml-1 mt-0.5 space-y-0.5">
                      <ProtectedLink
                        href="/dashboard/informasi-debitur/marketing/action-plan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/informasi-debitur/marketing/action-plan") ? "active" : ""}`}
                      >
                        <ClipboardCheck className="w-4 h-4" />
                        <span>Input Action Plan</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/informasi-debitur/marketing/hasil-kunjungan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/informasi-debitur/marketing/hasil-kunjungan") ? "active" : ""}`}
                      >
                        <FileText className="w-4 h-4" />
                        <span>Input Hasil Kunjungan</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/informasi-debitur/marketing/langkah-penanganan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/informasi-debitur/marketing/langkah-penanganan") ? "active" : ""}`}
                      >
                        <ClipboardList className="w-4 h-4" />
                        <span>Input Langkah Penanganan</span>
                      </ProtectedLink>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setMenuLegal(!menuLegal)}
              className={`sidebar-menu-item w-full justify-between ${isActiveGroup(["/legal"]) ? "active" : ""}`}
            >
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5" aria-hidden="true" />
                {sidebarOpen && (
                  <span className="font-bold">Manajemen Legal</span>
                )}
              </div>
              {sidebarOpen && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${menuLegal ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              )}
            </button>

            {sidebarOpen && menuLegal && (
              <div className="mt-1 space-y-0.5">
                <div>
                  <button
                    onClick={() => setMenuCetakDokumen(!menuCetakDokumen)}
                    className={`sidebar-submenu-item w-full justify-between ${isActiveGroup(["/legal/cetak"]) ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <Printer className="w-4 h-4" aria-hidden="true" />
                      <span>Cetak Dokumen Legal</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${menuCetakDokumen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  {menuCetakDokumen && (
                    <div className="ml-1 mt-0.5 space-y-0.5">
                      <ProtectedLink
                        href="/dashboard/legal/cetak/akad"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/cetak/akad") ? "active" : ""}`}
                      >
                        <FileText className="w-4 h-4" aria-hidden="true" />
                        <span>Dokumen Akad</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/cetak/haftsheet"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/cetak/haftsheet") ? "active" : ""}`}
                      >
                        <FileCheck className="w-4 h-4" aria-hidden="true" />
                        <span>Haftsheet</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/cetak/surat-peringatan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/cetak/surat-peringatan") ? "active" : ""}`}
                      >
                        <Mail className="w-4 h-4" aria-hidden="true" />
                        <span>Surat Peringatan</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/cetak/formulir-asuransi"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/cetak/formulir-asuransi") ? "active" : ""}`}
                      >
                        <Shield className="w-4 h-4" aria-hidden="true" />
                        <span>Formulir Asuransi</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/cetak/keterangan-lunas"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/cetak/keterangan-lunas") ? "active" : ""}`}
                      >
                        <Award className="w-4 h-4" aria-hidden="true" />
                        <span>Surat Keterangan Lunas</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/cetak/surat-samsat"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/cetak/surat-samsat") ? "active" : ""}`}
                      >
                        <Car className="w-4 h-4" aria-hidden="true" />
                        <span>Surat Samsat</span>
                      </ProtectedLink>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setMenuDataTitipan(!menuDataTitipan)}
                    className={`sidebar-submenu-item w-full justify-between ${isActiveGroup(["/legal/titipan"]) ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" aria-hidden="true" />
                      <span>Dana Titipan</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${menuDataTitipan ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  {menuDataTitipan && (
                    <div className="ml-1 mt-0.5 space-y-0.5">
                      <ProtectedLink
                        href="/dashboard/legal/titipan/asuransi"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/titipan/asuransi") ? "active" : ""}`}
                      >
                        <Shield className="w-4 h-4" aria-hidden="true" />
                        <span>Dana Titipan Asuransi</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/titipan/notaris"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/titipan/notaris") ? "active" : ""}`}
                      >
                        <Scale className="w-4 h-4" aria-hidden="true" />
                        <span>Dana Titipan Notaris</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/titipan/angsuran"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/titipan/angsuran") ? "active" : ""}`}
                      >
                        <Wallet className="w-4 h-4" aria-hidden="true" />
                        <span>Dana Titipan Angsuran</span>
                      </ProtectedLink>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setMenuInputProgress(!menuInputProgress)}
                    className={`sidebar-submenu-item w-full justify-between ${isActiveGroup(["/legal/progress"]) ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4" aria-hidden="true" />
                      <span>Input Progres PHK3</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${menuInputProgress ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  {menuInputProgress && (
                    <div className="ml-1 mt-0.5 space-y-0.5">
                      <ProtectedLink
                        href="/dashboard/legal/progress/notaris"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/progress/notaris") ? "active" : ""}`}
                      >
                        <Scale className="w-4 h-4" aria-hidden="true" />
                        <span>Progress Notaris</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/progress/asuransi"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/progress/asuransi") ? "active" : ""}`}
                      >
                        <Shield className="w-4 h-4" aria-hidden="true" />
                        <span>Progress Asuransi</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/progress/klaim"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/progress/klaim") ? "active" : ""}`}
                      >
                        <AlertCircle className="w-4 h-4" aria-hidden="true" />
                        <span>Tracking Claim Asuransi</span>
                      </ProtectedLink>
                    </div>
                  )}
                </div>

                <ProtectedLink
                  href="/dashboard/legal/upload-ideb"
                  className={`sidebar-submenu-item ${isActive("/dashboard/legal/upload-ideb") ? "active" : ""}`}
                >
                  <FileUp className="w-4 h-4" aria-hidden="true" />
                  <span>Upload Ideb</span>
                </ProtectedLink>
                <ProtectedLink
                  href="/dashboard/legal/laporan"
                  className={`sidebar-submenu-item ${isActive("/dashboard/legal/laporan") ? "active" : ""}`}
                >
                  <BarChart2 className="w-4 h-4" aria-hidden="true" />
                  <span>Laporan Legal</span>
                </ProtectedLink>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <div className="mx-0 my-2 border-t border-white/10">
              <span className="block px-4 py-2 text-xs text-white/50 uppercase tracking-wider font-semibold">
                Administrator
              </span>
            </div>
          )}

          <div>
            <button
              onClick={() => setMenuAdmin(!menuAdmin)}
              className={`sidebar-menu-item w-full justify-between ${isActiveGroup(["/informasi-debitur/admin"]) ? "active" : ""}`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5" />
                {sidebarOpen && <span className="font-bold">Admin</span>}
              </div>
              {sidebarOpen && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${menuAdmin ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {sidebarOpen && menuAdmin && (
              <div className="mt-1 space-y-0.5">
                <ProtectedLink
                  href="/dashboard/informasi-debitur/admin/upload-slik"
                  className={`sidebar-submenu-item text-xs ${isActive("/dashboard/informasi-debitur/admin/upload-slik") ? "active" : ""}`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Data SLIK</span>
                </ProtectedLink>
                <ProtectedLink
                  href="/dashboard/informasi-debitur/admin/upload-restrik"
                  className={`sidebar-submenu-item text-xs ${isActive("/dashboard/informasi-debitur/admin/upload-restrik") ? "active" : ""}`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Data Restrik</span>
                </ProtectedLink>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setMenuParameter(!menuParameter)}
              className={`sidebar-menu-item w-full justify-between ${isActiveGroup(["/parameter"]) ? "active" : ""}`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5" aria-hidden="true" />
                {sidebarOpen && <span className="font-bold">Parameter</span>}
              </div>
              {sidebarOpen && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${menuParameter ? "rotate-180" : ""}`}
                />
              )}
            </button>
            {sidebarOpen && menuParameter && (
              <div className="mt-1 space-y-0.5">
                <ProtectedLink
                  href="/dashboard/arsip-digital/parameter/tempat-penyimpanan"
                  className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/parameter/tempat-penyimpanan") ? "active" : ""}`}
                >
                  <FolderOpen className="w-4 h-4" aria-hidden="true" />
                  <span>Setup Tempat Penyimpanan</span>
                </ProtectedLink>
                <ProtectedLink
                  href="/dashboard/arsip-digital/parameter/jenis-dokumen"
                  className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/parameter/jenis-dokumen") ? "active" : ""}`}
                >
                  <FileText className="w-4 h-4" aria-hidden="true" />
                  <span>Setup Jenis Dokumen</span>
                </ProtectedLink>
              </div>
            )}
          </div>

          <ProtectedLink
            href="/dashboard/users"
            className={`sidebar-menu-item ${isActive("/dashboard/users") ? "active" : ""}`}
          >
            <Users className="w-5 h-5" />
            {sidebarOpen && <span className="font-bold">Manajemen User</span>}
          </ProtectedLink>
        </nav>

        <div
          className="p-4 border-t"
          style={{
            borderColor: "rgba(255, 255, 255, 0.1)",
            background: "rgba(0, 0, 0, 0.15)",
            flexShrink: 0,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: "rgba(255, 255, 255, 0.2)", flexShrink: 0 }}
            >
              {user.namaLengkap.charAt(0)}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.namaLengkap}
                </p>
                <p className="text-xs text-white/70">{user.divisi}</p>
              </div>
            )}
            <Link
              href="/"
              onClick={() => signOut()}
              className="logout-btn"
              style={{ flexShrink: 0 }}
            >
              <div className="sign">
                <LogOut className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="logout-text">Logout</div>
            </Link>
          </div>
        </div>
      </aside>

      <main className="transition-all duration-300" style={mainStyle}>
        <header
          className={`px-4 lg:px-6 py-4 flex items-center justify-between sticky z-40 border-b border-gray-100 transition-all duration-300 ${
            headerVisible && !isPreviewOpen && !isFocusMode && !isOverlayOpen
              ? "top-0"
              : "-top-24"
          }`}
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-2 lg:gap-4">
            <button
              onClick={() => {
                updateSidebarOpen(true);
                setMobileMenuOpen(true);
              }}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Buka menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <button
              type="button"
              onClick={() => updateSidebarOpen((prev) => !prev)}
              className="hidden lg:inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#157ec3] transition-colors hover:bg-[#157ec3]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#157ec3]/30"
              aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
              title={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
              aria-pressed={sidebarOpen}
            >
              {sidebarOpen ? (
                <X className="h-7 w-7" aria-hidden="true" />
              ) : (
                <Menu className="h-7 w-7" aria-hidden="true" />
              )}
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {pathname === "/dashboard" && "Dashboard"}
                {pathname.includes("input-dokumen") && "Input Dokumen Digital"}
                {pathname.includes("tempat-penyimpanan") &&
                  pathname.includes("ruang-arsip") &&
                  "Laporan Tempat Penyimpanan"}
                {pathname.includes("list-dokumen") && "List Dokumen Digital"}
                {pathname.includes("disposisi/pengajuan") &&
                  "Pengajuan Disposisi"}
                {pathname.includes("disposisi/permintaan") &&
                  "Permintaan Disposisi"}
                {pathname.includes("disposisi/historis") &&
                  "Historis Disposisi"}
                {pathname.includes("peminjaman/request") &&
                  "Request Peminjaman"}
                {pathname.includes("peminjaman/accept") && "Accept Peminjaman"}
                {pathname.includes("peminjaman/laporan") &&
                  "Laporan Peminjaman"}
                {pathname.includes("historis/penyimpanan") &&
                  "Historis Penyimpanan"}
                {pathname.includes("historis/peminjaman") &&
                  "Historis Peminjaman Dokumen"}
                {pathname.includes("parameter/tempat") &&
                  "Setup Tempat Penyimpanan"}
                {pathname.includes("parameter/jenis") && "Setup Jenis Dokumen"}
                {pathname.includes("/users") && "Manajemen User"}
                {pathname.includes(
                  "/dashboard/manajemen-surat/kelola-surat/input-surat-masuk",
                ) &&
                  "Input Surat Masuk"}
                {pathname.includes(
                  "/dashboard/manajemen-surat/kelola-surat/input-surat-keluar",
                ) &&
                  "Input Surat Keluar"}
                {pathname.includes(
                  "/dashboard/manajemen-surat/kelola-surat/input-memorandum",
                ) &&
                  "Input Memorandum"}
                {pathname.includes("/dashboard/manajemen-surat/laporan") &&
                  "Laporan Persuratan"}
                {pathname.includes("/dashboard/manajemen-surat/cetak-dokumen") &&
                  "Cetak Dokumen"}
                {pathname === "/dashboard/informasi-debitur" && "List Debitur"}
                {pathname.includes(
                  "/dashboard/informasi-debitur/marketing/action-plan",
                ) && "Input Progress - Action Plan"}
                {pathname.includes(
                  "/dashboard/informasi-debitur/marketing/hasil-kunjungan",
                ) && "Input Progress - Hasil Kunjungan"}
                {pathname.includes(
                  "/dashboard/informasi-debitur/marketing/langkah-penanganan",
                ) && "Input Progress - Langkah Penanganan"}
                {pathname.includes(
                  "/dashboard/informasi-debitur/admin/upload-slik",
                ) && "Administrator - Upload Data SLIK"}
                {pathname.includes(
                  "/dashboard/informasi-debitur/admin/upload-restrik",
                ) && "Administrator - Upload Data Restrik"}
                {pathname.startsWith("/dashboard/informasi-debitur/") &&
                  !pathname.includes("/marketing/") &&
                  !pathname.includes("/admin/") &&
                  "Detail Debitur"}
                {pathname.includes("/dashboard/legal/upload-ideb") &&
                  "Upload Ideb"}
                {pathname.includes("/dashboard/legal/laporan") &&
                  "Laporan Legal"}
                {pathname.includes("/dashboard/legal/cetak/") &&
                  "Cetak Dokumen Legal"}
                {pathname.includes("/legal") &&
                  !pathname.includes("/dashboard/legal/cetak/") &&
                  !pathname.includes("/dashboard/legal/upload-ideb") &&
                  !pathname.includes("/dashboard/legal/laporan") &&
                  "Manajemen Legal"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Notification />
            <div
              className="hidden sm:flex items-center rounded-full border text-sm shadow-sm overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(21, 126, 195, 0.1) 0%, rgba(13, 90, 143, 0.06) 100%)",
                borderColor: "rgba(21, 126, 195, 0.18)",
              }}
            >
              <div className="flex items-center gap-2 px-4 py-2">
                <Clock className="w-4 h-4 text-[#0d5a8f]" aria-hidden="true" />
                <span className="font-semibold tabular-nums text-[#0d5a8f]">
                  {now.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div
                className="h-9 w-px"
                style={{ background: "rgba(21, 126, 195, 0.16)" }}
              />

              <div className="flex items-center gap-2 px-4 py-2">
                <CalendarDays
                  className="w-4 h-4 text-[#0d5a8f]"
                  aria-hidden="true"
                />
                <span className="font-semibold text-[#0d5a8f] tabular-nums">
                  {now.toLocaleDateString("id-ID", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div
              className="sm:hidden flex items-center gap-2 px-3 py-2 rounded-full border text-sm shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg, rgba(21, 126, 195, 0.1) 0%, rgba(13, 90, 143, 0.06) 100%)",
                borderColor: "rgba(21, 126, 195, 0.18)",
                color: "#0d5a8f",
              }}
            >
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span className="font-semibold tabular-nums">
                {now.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
