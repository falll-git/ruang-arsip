"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Archive,
  ArrowLeftRight,
  BookOpen,
  Briefcase,
  CalendarDays,
  ClipboardCheck,
  ChevronDown,
  Clock,
  FilePlus,
  FileText,
  FolderOpen,
  History,
  Inbox,
  LayoutDashboard,
  Link2,
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
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
  const [menuSuratMasuk, setMenuSuratMasuk] = useState(false);
  const [menuSuratKeluar, setMenuSuratKeluar] = useState(false);
  const [menuMemorandum, setMenuMemorandum] = useState(false);

  const [menuDebitur, setMenuDebitur] = useState(false);
  const [menuMarketing, setMenuMarketing] = useState(false);
  const [menuAdmin, setMenuAdmin] = useState(false);

  const [menuLegal, setMenuLegal] = useState(false);
  const [menuCetakDokumen, setMenuCetakDokumen] = useState(false);
  const [menuDataTitipan, setMenuDataTitipan] = useState(false);
  const [menuLinkDokumen, setMenuLinkDokumen] = useState(false);
  const [menuInputProgress, setMenuInputProgress] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isActiveGroup = (paths: string[]) =>
    paths.some((p) => pathname.includes(p));

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

    const shouldUseFocusMode = () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches;

    let blurTimer: ReturnType<typeof setTimeout> | null = null;

    const handleFocusIn = (e: FocusEvent) => {
      if (!shouldUseFocusMode()) return;
      if (isFormField(e.target)) setIsFocusMode(true);
    };

    const handleFocusOut = () => {
      if (!shouldUseFocusMode()) return;
      if (blurTimer) clearTimeout(blurTimer);
      blurTimer = setTimeout(() => {
        const active = document.activeElement;
        if (!isFormField(active)) setIsFocusMode(false);
      }, 120);
    };

    const handleSubmit = () => {
      if (!shouldUseFocusMode()) return;
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
          width: sidebarOpen ? "280px" : "80px",
          background:
            "linear-gradient(180deg, #157ec3 0%, #0f5f96 50%, #0d5a8f 100%)",
          boxShadow: "4px 0 30px rgba(21, 126, 195, 0.2)",
          overflow: "hidden",
          transform:
            isPreviewOpen || isFocusMode || isOverlayOpen
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
            {sidebarOpen ? (
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
            {sidebarOpen && <span className="font-medium">Dashboard</span>}
          </ProtectedLink>

          {sidebarOpen && (
            <div className="mx-0 my-2 border-t border-white/10">
              <span className="block px-4 py-2 text-xs text-white/50 uppercase tracking-wider font-semibold">
                Modul Utama
              </span>
            </div>
          )}

          <div>
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
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Tempat Penyimpanan</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/arsip-digital/ruang-arsip/list-dokumen"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/ruang-arsip/list-dokumen") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
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
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Pengajuan Disposisi</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/arsip-digital/disposisi/permintaan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/disposisi/permintaan") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Permintaan Disposisi</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/arsip-digital/disposisi/historis"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/disposisi/historis") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
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
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Request Peminjaman</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/arsip-digital/peminjaman/accept"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/peminjaman/accept") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Accept Peminjaman</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/arsip-digital/peminjaman/laporan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/peminjaman/laporan") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
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
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Historis Penyimpanan</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/arsip-digital/historis/peminjaman"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/historis/peminjaman") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Historis Peminjaman</span>
                      </ProtectedLink>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setMenuParameter(!menuParameter)}
                    className={`sidebar-submenu-item w-full justify-between ${isActiveGroup(["/parameter"]) ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" aria-hidden="true" />
                      <span>Parameter</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${menuParameter ? "rotate-180" : ""}`}
                    />
                  </button>
                  {menuParameter && (
                    <div className="ml-1 mt-0.5 space-y-0.5">
                      <ProtectedLink
                        href="/dashboard/arsip-digital/parameter/tempat-penyimpanan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/parameter/tempat-penyimpanan") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Setup Tempat Penyimpanan</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/arsip-digital/parameter/jenis-dokumen"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/arsip-digital/parameter/jenis-dokumen") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Setup Jenis Dokumen</span>
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
              className={`sidebar-menu-item w-full justify-between ${isActiveGroup(["/surat"]) ? "active" : ""}`}
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
                    onClick={() => setMenuSuratMasuk(!menuSuratMasuk)}
                    className={`sidebar-submenu-item w-full justify-between ${isActiveGroup(["/surat-masuk"]) ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <Inbox className="w-4 h-4" />
                      <span>Surat Masuk</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${menuSuratMasuk ? "rotate-180" : ""}`}
                    />
                  </button>
                  {menuSuratMasuk && (
                    <div className="ml-1 mt-0.5 space-y-0.5">
                      <ProtectedLink
                        href="/dashboard/surat/surat-masuk/input"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/surat/surat-masuk/input") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Input Surat Masuk</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/surat/surat-masuk/laporan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/surat/surat-masuk/laporan") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Laporan Surat Masuk</span>
                      </ProtectedLink>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setMenuSuratKeluar(!menuSuratKeluar)}
                    className={`sidebar-submenu-item w-full justify-between ${isActiveGroup(["/surat-keluar"]) ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      <span>Surat Keluar</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${menuSuratKeluar ? "rotate-180" : ""}`}
                    />
                  </button>
                  {menuSuratKeluar && (
                    <div className="ml-1 mt-0.5 space-y-0.5">
                      <ProtectedLink
                        href="/dashboard/surat/surat-keluar/input"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/surat/surat-keluar/input") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Input Surat Keluar</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/surat/surat-keluar/laporan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/surat/surat-keluar/laporan") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Laporan Surat Keluar</span>
                      </ProtectedLink>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setMenuMemorandum(!menuMemorandum)}
                    className={`sidebar-submenu-item w-full justify-between ${isActiveGroup(["/memorandum"]) ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Memorandum</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${menuMemorandum ? "rotate-180" : ""}`}
                    />
                  </button>
                  {menuMemorandum && (
                    <div className="ml-1 mt-0.5 space-y-0.5">
                      <ProtectedLink
                        href="/dashboard/surat/memorandum/input"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/surat/memorandum/input") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Input Memorandum</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/surat/memorandum/laporan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/surat/memorandum/laporan") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Laporan Memorandum</span>
                      </ProtectedLink>
                    </div>
                  )}
                </div>
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
                      <Briefcase className="w-4 h-4" />
                      <span>Marketing</span>
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
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Input Action Plan</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/informasi-debitur/marketing/hasil-kunjungan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/informasi-debitur/marketing/hasil-kunjungan") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Input Hasil Kunjungan</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/informasi-debitur/marketing/langkah-penanganan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/informasi-debitur/marketing/langkah-penanganan") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Input Langkah Penanganan</span>
                      </ProtectedLink>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setMenuAdmin(!menuAdmin)}
                    className={`sidebar-submenu-item w-full justify-between ${isActiveGroup(["/informasi-debitur/admin"]) ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Admin</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${menuAdmin ? "rotate-180" : ""}`}
                    />
                  </button>
                  {menuAdmin && (
                    <div className="ml-1 mt-0.5 space-y-0.5">
                      <ProtectedLink
                        href="/dashboard/informasi-debitur/admin/upload-slik"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/informasi-debitur/admin/upload-slik") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Upload Data SLIK</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/informasi-debitur/admin/upload-restrik"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/informasi-debitur/admin/upload-restrik") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Upload Data Restrik</span>
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
                      <span>Cetak Dokumen</span>
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
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Dokumen Akad</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/cetak/haftsheet"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/cetak/haftsheet") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Haftsheet</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/cetak/surat-peringatan"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/cetak/surat-peringatan") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Surat Peringatan</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/cetak/formulir-asuransi"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/cetak/formulir-asuransi") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Formulir Asuransi</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/cetak/keterangan-lunas"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/cetak/keterangan-lunas") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Surat Keterangan Lunas</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/cetak/surat-samsat"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/cetak/surat-samsat") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
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
                      <span>Data Titipan</span>
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
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Dana Titipan Asuransi</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/titipan/notaris"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/titipan/notaris") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Dana Titipan Notaris</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/titipan/angsuran"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/titipan/angsuran") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Dana Titipan Angsuran</span>
                      </ProtectedLink>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setMenuLinkDokumen(!menuLinkDokumen)}
                    className={`sidebar-submenu-item w-full justify-between ${isActiveGroup(["/legal/link-dokumen"]) ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <Link2 className="w-4 h-4" aria-hidden="true" />
                      <span>Link Dokumen</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${menuLinkDokumen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  {menuLinkDokumen && (
                    <div className="ml-1 mt-0.5 space-y-0.5">
                      <ProtectedLink
                        href="/dashboard/legal/link-dokumen"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/link-dokumen") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Link Dokumen Pembiayaan</span>
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
                      <span>Input Progress</span>
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
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Progress Notaris</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/progress/asuransi"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/progress/asuransi") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Progress Asuransi</span>
                      </ProtectedLink>
                      <ProtectedLink
                        href="/dashboard/legal/progress/klaim"
                        className={`sidebar-submenu-item text-xs ${isActive("/dashboard/legal/progress/klaim") ? "active" : ""}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span>Tracking Claim Asuransi</span>
                      </ProtectedLink>
                    </div>
                  )}
                </div>

                <ProtectedLink
                  href="/dashboard/legal/cek-bprs"
                  className={`sidebar-submenu-item ${isActive("/dashboard/legal/cek-bprs") ? "active" : ""}`}
                >
                  <Search className="w-4 h-4" aria-hidden="true" />
                  <span>Cek Data Debitur di BPRS Lain</span>
                </ProtectedLink>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <div className="mx-0 my-2 border-t border-white/10">
              <span className="block px-4 py-2 text-xs text-white/50 uppercase tracking-wider font-semibold">
                Administrasi
              </span>
            </div>
          )}

          <ProtectedLink
            href="/dashboard/users"
            className={`sidebar-menu-item ${isActive("/dashboard/users") ? "active" : ""}`}
          >
            <Users className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Manajemen User</span>}
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

      <main
        className="transition-all duration-300 lg:ml-70"
        style={{
          marginLeft:
            isPreviewOpen || isFocusMode || isOverlayOpen ? "0" : undefined,
        }}
      >
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
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Buka menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <div className="uiverse-menu-toggle hidden lg:inline-flex">
              <input
                type="checkbox"
                id="dashboard-menu-toggle"
                checked={sidebarOpen}
                onChange={(event) => setSidebarOpen(event.target.checked)}
                className="uiverse-menu-toggle__input"
              />
              <label
                htmlFor="dashboard-menu-toggle"
                className="uiverse-menu-toggle__label focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#157ec3]/30"
                aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
                title={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
                role="button"
                aria-pressed={sidebarOpen}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  setSidebarOpen((prev) => !prev);
                }}
              >
                <div className="uiverse-menu-toggle__bar uiverse-menu-toggle__bar--1" />
                <div className="uiverse-menu-toggle__bar uiverse-menu-toggle__bar--2" />
                <div className="uiverse-menu-toggle__bar uiverse-menu-toggle__bar--3" />
              </label>
            </div>
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
                {pathname.includes("/surat/surat-masuk/input") &&
                  "Input Surat Masuk"}
                {pathname.includes("/surat/surat-masuk/laporan") &&
                  "Laporan Surat Masuk"}
                {pathname.includes("/surat/surat-keluar/input") &&
                  "Input Surat Keluar"}
                {pathname.includes("/surat/surat-keluar/laporan") &&
                  "Laporan Surat Keluar"}
                {pathname.includes("/surat/memorandum/input") &&
                  "Input Memorandum"}
                {pathname.includes("/surat/memorandum/laporan") &&
                  "Laporan Memorandum"}
                {pathname === "/dashboard/informasi-debitur" && "List Debitur"}
                {pathname.includes(
                  "/dashboard/informasi-debitur/marketing/action-plan",
                ) && "Marketing - Action Plan"}
                {pathname.includes(
                  "/dashboard/informasi-debitur/marketing/hasil-kunjungan",
                ) && "Marketing - Hasil Kunjungan"}
                {pathname.includes(
                  "/dashboard/informasi-debitur/marketing/langkah-penanganan",
                ) && "Marketing - Langkah Penanganan"}
                {pathname.includes(
                  "/dashboard/informasi-debitur/admin/upload-slik",
                ) && "Admin - Upload Data SLIK"}
                {pathname.includes(
                  "/dashboard/informasi-debitur/admin/upload-restrik",
                ) && "Admin - Upload Data Restrik"}
                {pathname.startsWith("/dashboard/informasi-debitur/") &&
                  !pathname.includes("/marketing/") &&
                  !pathname.includes("/admin/") &&
                  "Detail Debitur"}
                {pathname.includes("/legal") && "Manajemen Legal"}
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
