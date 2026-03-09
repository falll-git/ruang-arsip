"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowLeftRight,
  BookOpen,
  ChevronRight,
  Warehouse,
} from "lucide-react";

import { useArsipDigitalMasterData } from "@/components/arsip-digital/ArsipDigitalMasterDataProvider";
import { useArsipDigitalWorkflow } from "@/components/arsip-digital/ArsipDigitalWorkflowProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { kantorData } from "@/lib/data";

const kantorIdByNama: Record<string, string> = {
  "Kantor Pusat": "kantor-001",
  "Kantor Cabang": "kantor-002",
  "Kantor Kas ST": "kantor-003",
  "Kantor Kas Timur": "kantor-004",
  "Kantor Cabang Kranji": "kantor-005",
};

function toKantorId(namaKantor: string) {
  const knownId = kantorIdByNama[namaKantor];
  if (knownId) return knownId;

  const normalized = namaKantor
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `kantor-${normalized}`;
}

export default function TempatPenyimpananPage() {
  const { tempatPenyimpanan } = useArsipDigitalMasterData();
  const { dokumen, disposisi, peminjaman } = useArsipDigitalWorkflow();

  const kantorList = useMemo(() => {
    const tempatById = new Map(tempatPenyimpanan.map((item) => [item.id, item]));
    const dokumenById = new Map(dokumen.map((item) => [item.id, item]));
    const totalArsipByKantor = new Map<string, number>();
    const disposisiByKantor = new Map<string, number>();
    const peminjamanByKantor = new Map<string, number>();

    dokumen.forEach((item) => {
      if (item.tempatPenyimpananId == null) return;
      const tempat = tempatById.get(item.tempatPenyimpananId);
      if (!tempat) return;
      const kantorId = toKantorId(tempat.namaKantor);
      totalArsipByKantor.set(kantorId, (totalArsipByKantor.get(kantorId) ?? 0) + 1);
    });

    disposisi.forEach((item) => {
      const dokumenItem = dokumenById.get(item.dokumenId);
      if (!dokumenItem?.tempatPenyimpananId) return;
      const tempat = tempatById.get(dokumenItem.tempatPenyimpananId);
      if (!tempat) return;
      const kantorId = toKantorId(tempat.namaKantor);
      disposisiByKantor.set(kantorId, (disposisiByKantor.get(kantorId) ?? 0) + 1);
    });

    peminjaman.forEach((item) => {
      const dokumenItem = dokumenById.get(item.dokumenId);
      if (!dokumenItem?.tempatPenyimpananId) return;
      const tempat = tempatById.get(dokumenItem.tempatPenyimpananId);
      if (!tempat) return;
      const kantorId = toKantorId(tempat.namaKantor);
      peminjamanByKantor.set(kantorId, (peminjamanByKantor.get(kantorId) ?? 0) + 1);
    });

    return kantorData.map((kantor) => ({
      ...kantor,
      totalArsip: totalArsipByKantor.get(kantor.id) ?? 0,
      disposisi: disposisiByKantor.get(kantor.id) ?? 0,
      peminjaman: peminjamanByKantor.get(kantor.id) ?? 0,
    }));
  }, [disposisi, dokumen, peminjaman, tempatPenyimpanan]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {kantorList.map((kantor, idx) => (
          <Link
            key={kantor.id}
            href={`/dashboard/arsip-digital/ruang-arsip/tempat-penyimpanan/${kantor.id}`}
            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 animate-slide-up"
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
                  {kantor.totalArsip}
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
                    <ArrowLeftRight className="w-4 h-4" aria-hidden="true" />
                    Disposisi
                  </span>
                  <span className="font-semibold text-gray-800">
                    {kantor.disposisi}
                  </span>
                </div>
                <div className="w-full h-px bg-gray-200" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                    Peminjaman
                  </span>
                  <span className="font-semibold text-gray-800">
                    {kantor.peminjaman}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-primary-600 font-medium group-hover:translate-x-1 transition-transform">
              <span className="text-sm">Lihat Detail Dokumen</span>
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
