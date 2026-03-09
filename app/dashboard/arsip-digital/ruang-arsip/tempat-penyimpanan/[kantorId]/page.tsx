"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  Box,
  ChevronRight,
  Search,
  SearchX,
  Warehouse,
} from "lucide-react";

import DokumenLemariModal from "@/components/arsip/DokumenLemariModal";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { dokumenArsipData, kantorData, lemariData } from "@/lib/data";
import type { Lemari } from "@/lib/types";

const ITEMS_PER_PAGE = 6;

export default function KantorLemariPage() {
  const params = useParams<{ kantorId?: string | string[] }>();
  const kantorId = Array.isArray(params.kantorId)
    ? params.kantorId[0] ?? ""
    : (params.kantorId ?? "");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLemari, setSelectedLemari] = useState<Lemari | null>(null);
  const totalDokumenByLemariId = useMemo(
    () =>
      dokumenArsipData.reduce((accumulator, item) => {
        accumulator.set(item.lemariId, (accumulator.get(item.lemariId) ?? 0) + 1);
        return accumulator;
      }, new Map<string, number>()),
    [],
  );

  const kantor = useMemo(
    () => kantorData.find((item) => item.id === kantorId) ?? null,
    [kantorId],
  );

  const lemariByKantor = useMemo(
    () => lemariData.filter((item) => item.kantorId === kantorId),
    [kantorId],
  );

  const filteredLemari = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (query.length === 0) {
      return lemariByKantor;
    }

    return lemariByKantor.filter(
      (item) =>
        item.kodeLemari.toLowerCase().includes(query) ||
        item.rak.toLowerCase().includes(query),
    );
  }, [lemariByKantor, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLemari.length / ITEMS_PER_PAGE),
  );
  const effectiveCurrentPage = Math.min(currentPage, totalPages);

  const paginatedLemari = useMemo(() => {
    const start = (effectiveCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredLemari.slice(start, start + ITEMS_PER_PAGE);
  }, [effectiveCurrentPage, filteredLemari]);

  const dokumenLemari = useMemo(() => {
    if (!selectedLemari) return [];
    return dokumenArsipData.filter((item) => item.lemariId === selectedLemari.id);
  }, [selectedLemari]);

  if (!kantor) {
    return (
      <div className="animate-fade-in max-w-7xl mx-auto">
        <div className="mb-4">
          <Link
            href="/dashboard/arsip-digital/ruang-arsip/tempat-penyimpanan"
            className="btn btn-outline btn-sm"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Kembali ke Ruang
            Arsip Digital
          </Link>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-300">
            <SearchX className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="text-lg font-semibold text-gray-900">Kantor tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="mb-4">
        <Link
          href="/dashboard/arsip-digital/ruang-arsip/tempat-penyimpanan"
          className="btn btn-outline btn-sm"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Kembali ke Ruang
          Arsip Digital
        </Link>
      </div>

      <FeatureHeader
        title={kantor.namaKantor}
        subtitle="Daftar lemari penyimpanan dokumen."
        icon={<Warehouse />}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 p-5">
        <div className="relative">
          <Search
            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Cari kode lemari atau rak..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
            className="input input-with-icon"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedLemari.map((lemari, idx) => (
          <button
            key={lemari.id}
            type="button"
            onClick={() => setSelectedLemari(lemari)}
            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 animate-slide-up text-left"
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
                  {totalDokumenByLemariId.get(lemari.id) ?? lemari.totalArsip}
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
                    {kantor.namaKantor}
                  </span>
                </div>
                <div className="w-full h-px bg-gray-200" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Box className="w-4 h-4" aria-hidden="true" /> Kode Lemari
                  </span>
                  <span className="font-semibold text-gray-800">
                    {lemari.kodeLemari}
                  </span>
                </div>
                <div className="w-full h-px bg-gray-200" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Archive className="w-4 h-4" aria-hidden="true" /> Rak
                  </span>
                  <span className="font-semibold text-gray-800">{lemari.rak}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-primary-600 font-medium group-hover:translate-x-1 transition-transform">
              <span className="text-sm">Lihat Detail Dokumen</span>
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </div>
          </button>
        ))}
      </div>

      {filteredLemari.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-300">
            <SearchX className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="text-base font-medium text-gray-700">
            Tidak ada lemari yang sesuai pencarian
          </p>
        </div>
      ) : null}

      {filteredLemari.length > 0 && totalPages > 1 ? (
        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setCurrentPage(() => Math.max(1, effectiveCurrentPage - 1))}
            disabled={effectiveCurrentPage === 1}
          >
            Sebelumnya
          </button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                type="button"
                className={`btn btn-sm ${page === effectiveCurrentPage ? "btn-primary" : "btn-outline"}`}
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
              setCurrentPage(() => Math.min(totalPages, effectiveCurrentPage + 1))
            }
            disabled={effectiveCurrentPage === totalPages}
          >
            Berikutnya
          </button>
        </div>
      ) : null}

      {selectedLemari ? (
        <DokumenLemariModal
          namaKantor={kantor.namaKantor}
          lemari={selectedLemari}
          dokumen={dokumenLemari}
          onClose={() => setSelectedLemari(null)}
        />
      ) : null}
    </div>
  );
}
