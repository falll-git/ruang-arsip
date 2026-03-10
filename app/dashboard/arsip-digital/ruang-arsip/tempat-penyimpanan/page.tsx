"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowLeftRight,
  BookOpen,
  Box,
  ChevronRight,
  Warehouse,
} from "lucide-react";

import DokumenModal from "@/components/arsip/DokumenModal";
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

const ITEMS_PER_PAGE = 6;

type LemariSummary = {
  id: string;
  kantorId: string;
  kodeLemari: string;
  namaKantor: string;
  totalArsip: number;
  disposisiCount: number;
  peminjamanCount: number;
};

export default function TempatPenyimpananPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLemariId, setSelectedLemariId] = useState<string | null>(null);
  const [selectedRakId, setSelectedRakId] = useState<string | null>(null);

  const kantorById = useMemo(
    () => new Map(kantorData.map((kantor) => [kantor.id, kantor])),
    [kantorData],
  );

  const totalArsipByLemari = useMemo(() => {
    return rakData.reduce((acc, rak) => {
      acc.set(rak.lemariId, (acc.get(rak.lemariId) ?? 0) + rak.totalArsip);
      return acc;
    }, new Map<string, number>());
  }, [rakData]);

  const disposisiByLemari = useMemo(() => {
    return disposisiData.reduce((acc, item) => {
      acc.set(item.lemariId, (acc.get(item.lemariId) ?? 0) + 1);
      return acc;
    }, new Map<string, number>());
  }, [disposisiData]);

  const peminjamanByLemari = useMemo(() => {
    return peminjamanData.reduce((acc, item) => {
      acc.set(item.lemariId, (acc.get(item.lemariId) ?? 0) + 1);
      return acc;
    }, new Map<string, number>());
  }, [peminjamanData]);

  const lemariSummary = useMemo<LemariSummary[]>(() => {
    return lemariData.map((lemari) => ({
      ...lemari,
      namaKantor: kantorById.get(lemari.kantorId)?.namaKantor ?? "-",
      totalArsip: totalArsipByLemari.get(lemari.id) ?? 0,
      disposisiCount: disposisiByLemari.get(lemari.id) ?? 0,
      peminjamanCount: peminjamanByLemari.get(lemari.id) ?? 0,
    }));
  }, [
    kantorById,
    disposisiByLemari,
    lemariData,
    peminjamanByLemari,
    totalArsipByLemari,
  ]);

  const totalPages = Math.max(1, Math.ceil(lemariSummary.length / ITEMS_PER_PAGE));
  const effectivePage = Math.min(currentPage, totalPages);
  const start = (effectivePage - 1) * ITEMS_PER_PAGE;
  const paginatedLemari = lemariSummary.slice(start, start + ITEMS_PER_PAGE);
  const showPagination = lemariSummary.length > ITEMS_PER_PAGE;

  const selectedLemari = selectedLemariId
    ? lemariData.find((lemari) => lemari.id === selectedLemariId) ?? null
    : null;
  const selectedLemariSummary = selectedLemariId
    ? lemariSummary.find((lemari) => lemari.id === selectedLemariId) ?? null
    : null;
  const rakList = selectedLemari
    ? rakData.filter((rak) => rak.lemariId === selectedLemari.id)
    : [];
  const selectedRak = selectedRakId
    ? rakData.find((rak) => rak.id === selectedRakId) ?? null
    : null;
  const dokumenRak = selectedRak
    ? dokumenArsipData.filter((item) => item.rakId === selectedRak.id)
    : [];

  const handleOpenLemari = (lemariId: string) => {
    setSelectedLemariId(lemariId);
    setSelectedRakId(null);
  };

  const handleCloseAll = () => {
    setSelectedRakId(null);
    setSelectedLemariId(null);
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
      />

      <div>
        <div className="space-y-6">
          {paginatedLemari.map((lemari, idx) => (
            <div
              key={lemari.id}
              className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,55%)_minmax(0,45%)]"
            >
              <button
                type="button"
                onClick={() => handleOpenLemari(lemari.id)}
                className="group w-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 animate-slide-up text-left"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-110"
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
                      {lemari.totalArsip}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Warehouse className="w-4 h-4" aria-hidden="true" /> Kantor
                      </span>
                      <span className="font-semibold text-gray-800">
                        {lemari.namaKantor}
                      </span>
                    </div>
                    <div className="w-full h-px bg-gray-200" />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Box className="w-4 h-4" aria-hidden="true" /> Lemari
                      </span>
                      <span className="font-semibold text-gray-800">
                        {lemari.kodeLemari}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-primary-600 font-medium group-hover:translate-x-1 transition-transform">
                  <span className="text-sm">Lihat Detail Dokumen</span>
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </div>
              </button>

              <div
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up"
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
                      {lemari.totalArsip}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/dashboard/arsip-digital/disposisi/historis?lemariId=${lemari.id}`,
                        )
                      }
                      className="w-full flex justify-between items-center text-sm rounded-lg px-3 py-2 border border-transparent cursor-pointer transition-colors duration-200 hover:bg-gray-100"
                    >
                      <span className="text-gray-500 flex items-center gap-2">
                        <ArrowLeftRight className="w-4 h-4" aria-hidden="true" />
                        Disposisi
                      </span>
                      <span className="font-semibold text-gray-800 flex items-center gap-2">
                        {lemari.disposisiCount}
                        <ChevronRight
                          className="w-4 h-4 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/dashboard/arsip-digital/historis/peminjaman?lemariId=${lemari.id}`,
                        )
                      }
                      className="w-full flex justify-between items-center text-sm rounded-lg px-3 py-2 border border-transparent cursor-pointer transition-colors duration-200 hover:bg-gray-100"
                    >
                      <span className="text-gray-500 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" aria-hidden="true" />
                        Peminjaman
                      </span>
                      <span className="font-semibold text-gray-800 flex items-center gap-2">
                        {lemari.peminjamanCount}
                        <ChevronRight
                          className="w-4 h-4 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPagination ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setCurrentPage(() => Math.max(1, effectivePage - 1))}
            disabled={effectivePage === 1}
          >
            Sebelumnya
          </button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                type="button"
                className={`btn btn-sm ${page === effectivePage ? "btn-primary" : "btn-outline"}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() =>
              setCurrentPage(() => Math.min(totalPages, effectivePage + 1))
            }
            disabled={effectivePage === totalPages}
          >
            Berikutnya
          </button>
        </div>
      ) : null}

      {selectedLemari && !selectedRakId ? (
        <RakGridModal
          lemari={selectedLemari}
          namaKantor={selectedLemariSummary?.namaKantor ?? "-"}
          rakList={rakList}
          onClose={handleCloseAll}
          onSelectRak={(rakId) => setSelectedRakId(rakId)}
        />
      ) : null}

      {selectedLemari && selectedRak ? (
        <DokumenModal
          lemari={selectedLemari}
          namaKantor={selectedLemariSummary?.namaKantor ?? "-"}
          rak={selectedRak}
          dokumen={dokumenRak}
          onBack={() => setSelectedRakId(null)}
          onCloseAll={handleCloseAll}
        />
      ) : null}
    </div>
  );
}
