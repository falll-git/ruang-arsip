"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  ArrowLeftRight,
  ChevronRight,
  BookOpen,
  Building2,
  FileSpreadsheet,
  Search,
  Warehouse,
} from "lucide-react";

import DokumenListModal from "@/components/arsip/DokumenListModal";
import LemariGridModal from "@/components/arsip/LemariGridModal";
import RakGridModal from "@/components/arsip/RakGridModal";
import FeatureHeader from "@/components/ui/FeatureHeader";
import {
  disposisiData,
  dokumenArsipData,
  kantorData,
  lemariData,
  peminjamanData,
  rakData,
} from "@/lib/data";
import { exportToExcel } from "@/lib/utils/exportExcel";
import type { Kantor, Lemari, Rak } from "@/lib/types";
import { parseDateString } from "@/lib/utils/date";

const ACTIVE_DISPOSISI_STATUS = new Set(["PENDING", "PROSES"]);
const HOVER_ROW_CLASS = "transition-colors hover:bg-gray-100";

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function isPastDate(value: string, today: Date) {
  const parsed = parseDateString(value);
  if (!parsed) return false;
  return startOfDay(parsed) < today;
}

export default function TempatPenyimpananPage() {
  const router = useRouter();
  const today = useMemo(() => startOfDay(new Date()), []);
  const [selectedKantor, setSelectedKantor] = useState<Kantor | null>(null);
  const [selectedLemari, setSelectedLemari] = useState<Lemari | null>(null);
  const [selectedRak, setSelectedRak] = useState<Rak | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { kantorSummary } = useMemo(() => {
    const lemariById = new Map(lemariData.map((item) => [item.id, item]));
    const rakById = new Map(rakData.map((item) => [item.id, item]));
    const totalDokumenByKantor = new Map<string, number>();
    const jumlahLemariByKantor = new Map<string, number>();
    const disposisiByKantor = new Map<string, number>();
    const peminjamanByKantor = new Map<string, number>();
    const jatuhTempoByKantor = new Map<string, number>();

    lemariData.forEach((lemari) => {
      jumlahLemariByKantor.set(
        lemari.kantorId,
        (jumlahLemariByKantor.get(lemari.kantorId) ?? 0) + 1,
      );
    });

    dokumenArsipData.forEach((dokumen) => {
      const rak = rakById.get(dokumen.rakId);
      const lemari = rak ? lemariById.get(rak.lemariId) : undefined;
      if (!lemari) return;
      totalDokumenByKantor.set(
        lemari.kantorId,
        (totalDokumenByKantor.get(lemari.kantorId) ?? 0) + 1,
      );
    });

    disposisiData.forEach((item) => {
      if (!ACTIVE_DISPOSISI_STATUS.has(item.status)) return;
      const kantorId = lemariById.get(item.lemariId)?.kantorId;
      if (!kantorId) return;
      disposisiByKantor.set(kantorId, (disposisiByKantor.get(kantorId) ?? 0) + 1);
    });

    peminjamanData.forEach((item) => {
      if (item.status !== "Dipinjam") return;
      const kantorId = lemariById.get(item.lemariId)?.kantorId;
      if (!kantorId) return;
      peminjamanByKantor.set(
        kantorId,
        (peminjamanByKantor.get(kantorId) ?? 0) + 1,
      );
      if (isPastDate(item.tanggalKembali, today)) {
        jatuhTempoByKantor.set(
          kantorId,
          (jatuhTempoByKantor.get(kantorId) ?? 0) + 1,
        );
      }
    });

    return {
      kantorSummary: kantorData.map((kantor) => ({
        id: kantor.id,
        namaKantor: kantor.namaKantor,
        totalDokumen: totalDokumenByKantor.get(kantor.id) ?? 0,
        jumlahLemari: jumlahLemariByKantor.get(kantor.id) ?? 0,
        dokumenDisposisi: disposisiByKantor.get(kantor.id) ?? 0,
        dokumenDipinjam: peminjamanByKantor.get(kantor.id) ?? 0,
        dokumenDipinjamJatuhTempo: jatuhTempoByKantor.get(kantor.id) ?? 0,
      })),
    };
  }, [today]);

  const filteredKantorSummary = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return kantorSummary;
    return kantorSummary.filter((kantor) =>
      kantor.namaKantor.toLowerCase().includes(query),
    );
  }, [kantorSummary, searchTerm]);

  const lemariList = useMemo(
    () =>
      selectedKantor
        ? lemariData.filter((item) => item.kantorId === selectedKantor.id)
        : [],
    [selectedKantor],
  );

  const rakList = useMemo(
    () =>
      selectedLemari
        ? rakData.filter((item) => item.lemariId === selectedLemari.id)
        : [],
    [selectedLemari],
  );

  const dokumenList = useMemo(
    () =>
      selectedRak
        ? dokumenArsipData.filter((item) => item.rakId === selectedRak.id)
        : [],
    [selectedRak],
  );

  const handleExport = async () => {
    await exportToExcel({
      filename: "ruang-arsip-digital",
      sheetName: "Ruang Arsip Digital",
      title: "Ruang Arsip Digital",
      columns: [
        { header: "No", key: "no", width: 6 },
        { header: "Kantor", key: "namaKantor", width: 24 },
        { header: "Total Arsip", key: "totalDokumen", width: 14 },
        { header: "Jumlah Lemari", key: "jumlahLemari", width: 14 },
        { header: "Dokumen Disposisi", key: "dokumenDisposisi", width: 18 },
        { header: "Dokumen Dipinjam", key: "dokumenDipinjam", width: 18 },
        {
          header: "Dokumen Jatuh Tempo",
          key: "dokumenDipinjamJatuhTempo",
          width: 20,
        },
      ],
      data: filteredKantorSummary.map((kantor, idx) => ({
        no: idx + 1,
        namaKantor: kantor.namaKantor,
        totalDokumen: kantor.totalDokumen,
        jumlahLemari: kantor.jumlahLemari,
        dokumenDisposisi: kantor.dokumenDisposisi,
        dokumenDipinjam: kantor.dokumenDipinjam,
        dokumenDipinjamJatuhTempo: kantor.dokumenDipinjamJatuhTempo,
      })),
    });
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="mb-4">
        <Link href="/dashboard" className="btn btn-outline btn-sm">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke Dashboard
        </Link>
      </div>

      <FeatureHeader
        title="Ruang Arsip Digital"
        subtitle="Laporan visual penyimpanan dokumen fisik dan digital."
        icon={<Warehouse />}
        actions={
          <button
            onClick={handleExport}
            className="btn btn-export-excel"
            title="Export Excel"
          >
            <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
            <span>Export Excel</span>
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 p-5">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Cari Kantor
            </label>
            <div className="relative">
              <Search
                className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Cari nama kantor..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="input input-with-icon"
                aria-label="Cari kantor"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        {filteredKantorSummary.map((kantor, idx) => (
          <div
            key={kantor.id}
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
                <Warehouse className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Total Arsip
                </span>
                <span className="text-2xl font-bold text-gray-800 tabular-nums">
                  {kantor.totalDokumen}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-gray-50">
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="flex items-center gap-3 text-gray-600 whitespace-nowrap">
                    <Building2
                      className="h-4 w-4 text-gray-500"
                      aria-hidden="true"
                    />
                    Kantor
                  </span>
                  <span className="font-semibold text-gray-800 text-right whitespace-nowrap">
                    {kantor.namaKantor}
                  </span>
                </div>
                <div className="h-px w-full bg-gray-200" />
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="flex items-center gap-3 text-gray-600 whitespace-nowrap">
                    <Archive
                      className="h-4 w-4 text-gray-500"
                      aria-hidden="true"
                    />
                    Jumlah Lemari
                  </span>
                  <span className="min-w-[2.5rem] font-semibold text-gray-800 tabular-nums text-right">
                    {kantor.jumlahLemari}
                  </span>
                </div>
                <div className="h-px w-full bg-gray-200" />
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/dashboard/arsip-digital/disposisi/historis?kantorId=${kantor.id}`,
                    )
                  }
                  className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-sm cursor-pointer ${HOVER_ROW_CLASS}`}
                >
                  <span className="flex items-center gap-3 text-gray-600 whitespace-nowrap">
                    <ArrowLeftRight
                      className="h-4 w-4 text-gray-500"
                      aria-hidden="true"
                    />
                    Dokumen Disposisi
                  </span>
                  <span className="min-w-[2.5rem] text-sm font-semibold text-gray-800 tabular-nums text-right">
                    {kantor.dokumenDisposisi}
                  </span>
                </button>
                <div className="h-px w-full bg-gray-200" />
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/dashboard/arsip-digital/historis/peminjaman?kantorId=${kantor.id}`,
                    )
                  }
                  className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-sm cursor-pointer ${HOVER_ROW_CLASS}`}
                >
                  <span className="flex items-center gap-3 text-gray-600 whitespace-nowrap">
                    <BookOpen
                      className="h-4 w-4 text-gray-500"
                      aria-hidden="true"
                    />
                    Dokumen Dipinjam
                  </span>
                  <span className="min-w-[2.5rem] text-sm font-semibold text-gray-800 tabular-nums text-right">
                    {kantor.dokumenDipinjam}
                  </span>
                </button>
                <div className="h-px w-full bg-gray-200" />
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/dashboard/arsip-digital/ruang-arsip/jatuh-tempo?kantorId=${kantor.id}`,
                    )
                  }
                  className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-sm cursor-pointer ${HOVER_ROW_CLASS}`}
                >
                  <span className="flex items-center gap-3 text-gray-600 whitespace-nowrap">
                    <AlertTriangle
                      className="h-4 w-4 text-gray-500"
                      aria-hidden="true"
                    />
                    Dokumen Dipinjam &amp; Jatuh Tempo
                  </span>
                  <span className="min-w-[2.5rem] text-sm font-semibold text-gray-800 tabular-nums text-right">
                    {kantor.dokumenDipinjamJatuhTempo}
                  </span>
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setSelectedKantor({
                  id: kantor.id,
                  namaKantor: kantor.namaKantor,
                })
              }
              className="mt-6 flex w-full items-center justify-between text-primary-600 font-medium group-hover:translate-x-1 transition-transform"
            >
              <span className="text-sm">Lihat Detail Dokumen</span>
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>

          </div>
        ))}
      </div>

      {selectedKantor ? (
        <LemariGridModal
          kantor={selectedKantor}
          lemariList={lemariList}
          onSelectLemari={(lemari) => setSelectedLemari(lemari)}
          onClose={() => setSelectedKantor(null)}
        />
      ) : null}

      {selectedKantor && selectedLemari ? (
        <RakGridModal
          lemari={selectedLemari}
          kantor={selectedKantor}
          rakList={rakList}
          onSelectRak={(rak) => setSelectedRak(rak)}
          onBack={() => setSelectedLemari(null)}
          onClose={() => {
            setSelectedKantor(null);
            setSelectedLemari(null);
          }}
        />
      ) : null}

      {selectedKantor && selectedLemari && selectedRak ? (
        <DokumenListModal
          rak={selectedRak}
          lemari={selectedLemari}
          kantor={selectedKantor}
          dokumenList={dokumenList}
          onBack={() => setSelectedRak(null)}
          onClose={() => {
            setSelectedKantor(null);
            setSelectedLemari(null);
            setSelectedRak(null);
          }}
        />
      ) : null}
    </div>
  );
}
