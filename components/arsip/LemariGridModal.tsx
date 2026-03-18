"use client";

import {
  AlertTriangle,
  Archive,
  ArrowLeftRight,
  BookOpen,
  Box,
  ChevronRight,
  FileSpreadsheet,
  FolderOpen,
  Layers,
  Search,
  SearchX,
} from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import { dokumenArsipData, disposisiData, peminjamanData, rakData } from "@/lib/data";
import { exportDokumenPerKantor } from "@/lib/export-arsip";
import type { Kantor, Lemari } from "@/lib/types";
import { parseDateString } from "@/lib/utils/date";

const ACTIVE_DISPOSISI_STATUS = new Set(["PENDING", "PROSES"]);

type LemariWithMeta = Lemari & {
  kapasitas?: number;
  status?: "Aktif" | "Nonaktif";
};

type LemariGridModalProps = {
  kantor: Kantor;
  lemariList: Lemari[];
  onSelectLemari: (lemari: Lemari) => void;
  onClose: () => void;
};

function getStatusBadgeClass(status: "Aktif" | "Nonaktif") {
  return status === "Aktif"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-gray-200 bg-gray-100 text-gray-700";
}

export default function LemariGridModal({
  kantor,
  lemariList,
  onSelectLemari,
  onClose,
}: LemariGridModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const {
    totalDokumenByLemariId,
    jumlahRakByLemariId,
    disposisiByLemariId,
    dipinjamByLemariId,
    jatuhTempoByLemariId,
  } = useMemo(() => {
    const totalDokumen = new Map<string, number>();
    const jumlahRak = new Map<string, number>();
    const disposisi = new Map<string, number>();
    const dipinjam = new Map<string, number>();
    const jatuhTempo = new Map<string, number>();

    rakData.forEach((item) => {
      totalDokumen.set(
        item.lemariId,
        (totalDokumen.get(item.lemariId) ?? 0) + item.totalArsip,
      );
      jumlahRak.set(item.lemariId, (jumlahRak.get(item.lemariId) ?? 0) + 1);
    });

    disposisiData.forEach((item) => {
      if (!ACTIVE_DISPOSISI_STATUS.has(item.status)) return;
      disposisi.set(item.lemariId, (disposisi.get(item.lemariId) ?? 0) + 1);
    });

    peminjamanData.forEach((item) => {
      if (item.status !== "Dipinjam") return;
      dipinjam.set(item.lemariId, (dipinjam.get(item.lemariId) ?? 0) + 1);
      const parsed = parseDateString(item.tanggalKembali);
      if (!parsed) return;
      const compare = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
      if (compare < today) {
        jatuhTempo.set(item.lemariId, (jatuhTempo.get(item.lemariId) ?? 0) + 1);
      }
    });

    return {
      totalDokumenByLemariId: totalDokumen,
      jumlahRakByLemariId: jumlahRak,
      disposisiByLemariId: disposisi,
      dipinjamByLemariId: dipinjam,
      jatuhTempoByLemariId: jatuhTempo,
    };
  }, [today]);

  const filteredLemari = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return lemariList;
    return lemariList.filter((item) =>
      item.kodeLemari.toLowerCase().includes(query),
    );
  }, [lemariList, searchTerm]);

  const hasNoData = lemariList.length === 0;
  const hasNoFilteredData =
    lemariList.length > 0 && filteredLemari.length === 0;

  const handleExport = async () => {
    setExportLoading(true);
    try {
      await exportDokumenPerKantor({
        kantorId: kantor.id,
        kantorNama: kantor.namaKantor,
        lemariList,
        rakList: rakData,
        dokumenList: dokumenArsipData,
      });
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div
      data-dashboard-overlay="true"
      className="fixed inset-0 z-[1400] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[85vh] w-[96vw] max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-gray-100 bg-gray-50/50 px-5 py-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-gray-900">
              {kantor.namaKantor}
            </h3>
            <p className="text-sm text-gray-500">
              {filteredLemari.length} Lemari
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            disabled={exportLoading}
            className="btn btn-export-excel"
            title="Export Excel"
          >
            {exportLoading ? (
              <span
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
            <span>Export Excel</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="mb-5">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="input input-with-icon"
                placeholder="Cari kode lemari..."
              />
            </div>
          </div>

          {hasNoData ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                <FolderOpen className="h-7 w-7" aria-hidden="true" />
              </div>
              <p className="text-base font-medium text-gray-700">
                Belum ada lemari
              </p>
            </div>
          ) : hasNoFilteredData ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                <SearchX className="h-7 w-7" aria-hidden="true" />
              </div>
              <p className="text-base font-medium text-gray-700">
                Tidak ada lemari yang sesuai
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredLemari.map((lemari, idx) => {
                const metadata = lemari as LemariWithMeta;
                const hasKapasitas = typeof metadata.kapasitas === "number";
                const status = metadata.status;
                const jumlahRak = jumlahRakByLemariId.get(lemari.id) ?? 0;
                const dokumenDisposisi = disposisiByLemariId.get(lemari.id) ?? 0;
                const dokumenDipinjam = dipinjamByLemariId.get(lemari.id) ?? 0;
                const dokumenJatuhTempo = jatuhTempoByLemariId.get(lemari.id) ?? 0;

                return (
                  <div
                    key={lemari.id}
                    className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20"
                        style={{
                          background:
                            "linear-gradient(135deg, #157ec3 0%, #0d5a8f 100%)",
                        }}
                      >
                        <Archive className="w-7 h-7 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                          Total Arsip
                        </span>
                        <span className="text-2xl font-bold text-gray-800 tabular-nums">
                          {totalDokumenByLemariId.get(lemari.id) ?? 0}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-xl bg-gray-50">
                        <div className="flex items-center justify-between px-4 py-3 text-sm">
                          <span className="flex items-center gap-3 text-gray-600 whitespace-nowrap">
                            <Box className="h-4 w-4 text-gray-500" aria-hidden="true" />
                            Kode Lemari
                          </span>
                          <span className="font-semibold text-gray-800 text-right whitespace-nowrap">
                            {lemari.kodeLemari}
                          </span>
                        </div>
                        <div className="h-px w-full bg-gray-200" />
                        <div className="flex items-center justify-between px-4 py-3 text-sm">
                          <span className="flex items-center gap-3 text-gray-600 whitespace-nowrap">
                            <Layers className="h-4 w-4 text-gray-500" aria-hidden="true" />
                            Jumlah Rak
                          </span>
                          <span className="min-w-[2.5rem] font-semibold text-gray-800 tabular-nums text-right">
                            {jumlahRak}
                          </span>
                        </div>
                        <div className="h-px w-full bg-gray-200" />
                        <div className="flex items-center justify-between px-4 py-3 text-sm">
                          <span className="flex items-center gap-3 text-gray-600 whitespace-nowrap">
                            <ArrowLeftRight
                              className="h-4 w-4 text-gray-500"
                              aria-hidden="true"
                            />
                            Dokumen Disposisi
                          </span>
                          <span className="min-w-[2.5rem] font-semibold text-gray-800 tabular-nums text-right">
                            {dokumenDisposisi}
                          </span>
                        </div>
                        <div className="h-px w-full bg-gray-200" />
                        <div className="flex items-center justify-between px-4 py-3 text-sm">
                          <span className="flex items-center gap-3 text-gray-600 whitespace-nowrap">
                            <BookOpen className="h-4 w-4 text-gray-500" aria-hidden="true" />
                            Dokumen Dipinjam
                          </span>
                          <span className="min-w-[2.5rem] font-semibold text-gray-800 tabular-nums text-right">
                            {dokumenDipinjam}
                          </span>
                        </div>
                        <div className="h-px w-full bg-gray-200" />
                        <div className="flex items-center justify-between px-4 py-3 text-sm">
                          <span className="flex items-center gap-3 text-gray-600 whitespace-nowrap">
                            <AlertTriangle
                              className="h-4 w-4 text-gray-500"
                              aria-hidden="true"
                            />
                            Dokumen Jatuh Tempo
                          </span>
                          <span className="min-w-[2.5rem] font-semibold text-gray-800 tabular-nums text-right">
                            {dokumenJatuhTempo}
                          </span>
                        </div>
                        {hasKapasitas ? (
                          <>
                            <div className="h-px w-full bg-gray-200" />
                            <div className="flex items-center justify-between px-4 py-3 text-sm">
                              <span className="flex items-center gap-3 text-gray-600 whitespace-nowrap">
                                <Archive
                                  className="h-4 w-4 text-gray-500"
                                  aria-hidden="true"
                                />
                                Kapasitas
                              </span>
                              <span className="min-w-[2.5rem] font-semibold text-gray-800 tabular-nums text-right">
                                {metadata.kapasitas}
                              </span>
                            </div>
                          </>
                        ) : null}
                        {status === "Aktif" || status === "Nonaktif" ? (
                          <>
                            <div className="h-px w-full bg-gray-200" />
                            <div className="flex items-center justify-between px-4 py-3 text-sm">
                              <span className="flex items-center gap-3 text-gray-600 whitespace-nowrap">
                                <Archive
                                  className="h-4 w-4 text-gray-500"
                                  aria-hidden="true"
                                />
                                Status
                              </span>
                              <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(
                                  status,
                                )}`}
                              >
                                {status}
                              </span>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectLemari(lemari)}
                      className="mt-6 flex w-full items-center justify-between text-primary-600 font-medium group-hover:translate-x-1 transition-transform"
                    >
                      <span className="text-sm">Lihat Rak</span>
                      <ChevronRight className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end border-t border-gray-100 bg-gray-50 px-5 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
