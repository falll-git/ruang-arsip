"use client";

import { useState, useMemo, useEffect, type CSSProperties } from "react";
import Link from "next/link";
import {
  ChevronUp,
  Eye,
  FileDown,
  FileSpreadsheet,
  Search,
  Users,
} from "lucide-react";
import { useAppToast } from "@/components/ui/AppToastProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import {
  dummyDebiturList,
  formatCurrency,
  getKolektibilitasLabel,
  getHistorisKolektibilitasByDebiturId,
  getDebiturById,
} from "@/lib/data";
import type { KolektibilitasType } from "@/lib/types/modul3";
import { formatDateDisplay } from "@/lib/utils/date";
import DetailModal, {
  DetailSection,
  DetailRow,
} from "@/components/marketing/DetailModal";
import KolBadge from "@/components/marketing/KolBadge";

type SortField = "namaNasabah" | "osPokok" | "kolektibilitas";
type SortOrder = "asc" | "desc";

export default function ListDebiturPage() {
  const { showToast } = useAppToast();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("namaNasabah");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filterKol, setFilterKol] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState<"excel" | "pdf" | null>(
    null,
  );
  const [detailDebiturId, setDetailDebiturId] = useState<string | null>(null);

  const itemsPerPage = 5;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = useMemo(() => {
    let data = [...dummyDebiturList];

    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (d) =>
          d.namaNasabah.toLowerCase().includes(searchLower) ||
          d.noKontrak.toLowerCase().includes(searchLower),
      );
    }

    if (filterKol !== "all") {
      data = data.filter((d) => d.kolektibilitas === filterKol);
    }

    data.sort((a, b) => {
      let compare = 0;
      if (sortField === "namaNasabah") {
        compare = a.namaNasabah.localeCompare(b.namaNasabah);
      } else if (sortField === "osPokok") {
        compare = a.osPokok - b.osPokok;
      } else if (sortField === "kolektibilitas") {
        compare = parseInt(a.kolektibilitas) - parseInt(b.kolektibilitas);
      }
      return sortOrder === "asc" ? compare : -compare;
    });

    return data;
  }, [search, sortField, sortOrder, filterKol]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleExport = (type: "excel" | "pdf") => {
    setExportLoading(type);
    setTimeout(() => {
      setExportLoading(null);
      showToast(`Export ${type.toUpperCase()} berhasil!`, "success");
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="bg-white rounded-xl p-6 space-y-4">
          <div className="flex gap-4">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FeatureHeader
        title="List Debitur"
        subtitle={`Daftar nasabah pembiayaan (${filteredData.length} data)`}
        icon={<Users />}
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => handleExport("excel")}
              disabled={exportLoading !== null}
              className="btn btn-success"
              title="Export Excel"
            >
              {exportLoading === "excel" ? (
                <div
                  className="button-spinner"
                  style={
                    {
                      ["--spinner-size"]: "16px",
                      ["--spinner-border"]: "2px",
                    } as CSSProperties
                  }
                  aria-hidden="true"
                />
              ) : (
                <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
              )}
              Export Excel
            </button>
            <button
              onClick={() => handleExport("pdf")}
              disabled={exportLoading !== null}
              className="btn btn-danger"
              title="Export PDF"
            >
              {exportLoading === "pdf" ? (
                <div
                  className="button-spinner"
                  style={
                    {
                      ["--spinner-size"]: "16px",
                      ["--spinner-border"]: "2px",
                    } as CSSProperties
                  }
                  aria-hidden="true"
                />
              ) : (
                <FileDown className="w-4 h-4" aria-hidden="true" />
              )}
              Export PDF
            </button>
          </div>
        }
      />

      <div
        className="bg-white rounded-xl p-5"
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-60 w-full sm:w-auto">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Cari nama nasabah atau no kontrak..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="input input-with-icon"
              />
            </div>
          </div>

          <div className="shrink-0 min-w-50 w-full sm:w-60">
            <select
              value={filterKol}
              onChange={(e) => {
                setFilterKol(e.target.value);
                setCurrentPage(1);
              }}
              className="select"
            >
              <option value="all">Semua Kolektibilitas</option>
              <option value="1">Kol 1 - Lancar</option>
              <option value="2">Kol 2 - DPK</option>
              <option value="3">Kol 3 - Kurang Lancar</option>
              <option value="4">Kol 4 - Diragukan</option>
              <option value="5">Kol 5 - Macet</option>
            </select>
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  No Kontrak
                </th>
                <th
                  className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort("namaNasabah")}
                >
                  <div className="flex items-center gap-1">
                    Nama Nasabah
                    {sortField === "namaNasabah" && (
                      <ChevronUp
                        className={`w-4 h-4 ${sortOrder === "desc" ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Cabang
                </th>
                <th
                  className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort("osPokok")}
                >
                  <div className="flex items-center justify-end gap-1">
                    OS Pokok
                    {sortField === "osPokok" && (
                      <ChevronUp
                        className={`w-4 h-4 ${sortOrder === "desc" ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </th>
                <th
                  className="text-center px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort("kolektibilitas")}
                >
                  <div className="flex items-center justify-center gap-1">
                    Kol
                    {sortField === "kolektibilitas" && (
                      <ChevronUp
                        className={`w-4 h-4 ${sortOrder === "desc" ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </th>
                <th className="text-center px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((item, idx) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                  onClick={() => setDetailDebiturId(item.id)}
                >
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm px-2 py-1 rounded bg-blue-50 text-blue-700">
                      {item.noKontrak}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.namaNasabah}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.marketing}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {item.cabang}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(item.osPokok)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <KolBadge kol={item.kolektibilitas} />
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailDebiturId(item.id);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" aria-hidden="true" />
                        Detail
                      </button>
                      <Link
                        href={`/dashboard/informasi-debitur/${item.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <ChevronUp
                          className="w-4 h-4 rotate-180"
                          aria-hidden="true"
                        />
                        Halaman
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-sm text-gray-500">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} dari{" "}
              {filteredData.length} data
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? "bg-[#157ec3] text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <DebiturDetailModal
        debiturId={detailDebiturId}
        onClose={() => setDetailDebiturId(null)}
      />
    </div>
  );
}

function DebiturDetailModal({
  debiturId,
  onClose,
}: {
  debiturId: string | null;
  onClose: () => void;
}) {
  const debitur = debiturId ? getDebiturById(debiturId) : null;
  const historis =
    debiturId && debitur
      ? getHistorisKolektibilitasByDebiturId(debiturId).slice(0, 3)
      : [];

  if (!debiturId || !debitur) return null;

  return (
    <DetailModal isOpen={!!debiturId} onClose={onClose} title="Detail Debitur">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailSection title="Informasi Utama">
          <DetailRow
            label="Nama Nasabah"
            value={
              <span className="flex items-center gap-2">
                {debitur.namaNasabah}
                <KolBadge kol={debitur.kolektibilitas as KolektibilitasType} />
              </span>
            }
          />
          <DetailRow label="No Kontrak" value={debitur.noKontrak} />
          <DetailRow label="Cabang" value={debitur.cabang} />
          <DetailRow label="Marketing" value={debitur.marketing} />
          <DetailRow
            label="Status Kolektibilitas"
            value={getKolektibilitasLabel(debitur.kolektibilitas)}
          />
        </DetailSection>

        <DetailSection title="Informasi Pembiayaan">
          <DetailRow label="OS Pokok" value={formatCurrency(debitur.osPokok)} />
          <DetailRow
            label="OS Margin"
            value={formatCurrency(debitur.osMargin)}
          />
          <DetailRow
            label="Jangka Waktu"
            value={`${debitur.jangkaWaktu} Bulan`}
          />
          <DetailRow
            label="Tanggal Akad"
            value={formatDateDisplay(debitur.tanggalAkad)}
          />
          <DetailRow
            label="Jatuh Tempo"
            value={formatDateDisplay(debitur.tanggalJatuhTempo)}
          />
        </DetailSection>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Ringkasan Historis Kol
          </h4>
          <Link
            href={`/dashboard/informasi-debitur/${debitur.id}`}
            className="text-sm font-semibold text-[#157ec3] hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Lihat detail lengkap
          </Link>
        </div>
        {historis.length === 0 ? (
          <p className="text-sm text-gray-500">
            Belum ada historis kolektibilitas.
          </p>
        ) : (
          <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-xs font-semibold uppercase text-gray-500">
                  <th className="text-left px-4 py-3">Bulan</th>
                  <th className="text-center px-4 py-3">Kol</th>
                  <th className="text-right px-4 py-3">OS Pokok</th>
                  <th className="text-right px-4 py-3">OS Margin</th>
                  <th className="text-left px-4 py-3">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {historis.map((item) => (
                  <tr key={item.id} className="bg-white/70">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {item.bulan}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <KolBadge kol={item.kolektibilitas} />
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      {formatCurrency(item.osPokok)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      {formatCurrency(item.osMargin)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.keterangan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DetailModal>
  );
}
