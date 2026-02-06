"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  ChevronRight,
  FileText,
  Warehouse,
  X,
  Box,
} from "lucide-react";
import { dummyDokumen } from "@/lib/data";
import { useAuth } from "@/components/auth/AuthProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { filterDigitalDocuments } from "@/lib/rbac";
import { useArsipDigitalMasterData } from "@/components/arsip-digital/ArsipDigitalMasterDataProvider";

export default function TempatPenyimpananPage() {
  const { role } = useAuth();
  const { tempatPenyimpanan } = useArsipDigitalMasterData();
  const [selectedTempat, setSelectedTempat] = useState<{
    id: number;
    kodeKantor: string;
    namaKantor: string;
    kodeLemari: string;
    rak: string;
    kapasitas: number;
    jumlahDok: number;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const accessibleDokumen = useMemo(() => {
    if (!role) return [];
    return filterDigitalDocuments(role, dummyDokumen);
  }, [role]);

  const dokumenByTempat = useMemo(() => {
    const grouped: Record<
      number,
      Array<{
        id: number;
        kode: string;
        jenisDokumen: string;
        namaDokumen: string;
        detail: string;
        tglInput: string;
        userInput: string;
      }>
    > = {};

    tempatPenyimpanan.forEach((t) => {
      grouped[t.id] = [];
    });

    accessibleDokumen.forEach((d) => {
      const tempatId = d.tempatPenyimpananId ?? null;
      if (!tempatId) return;
      const bucket = grouped[tempatId];
      if (!bucket) return;
      bucket.push({
        id: d.id,
        kode: d.kode,
        jenisDokumen: d.jenisDokumen,
        namaDokumen: d.namaDokumen,
        detail: d.detail,
        tglInput: d.tglInput,
        userInput: d.userInput,
      });
    });

    return grouped;
  }, [accessibleDokumen, tempatPenyimpanan]);

  const tempatPenyimpananList = useMemo(() => {
    return tempatPenyimpanan.map((t) => ({
      id: t.id,
      kodeKantor: t.kodeKantor,
      namaKantor: t.namaKantor,
      kodeLemari: t.kodeLemari,
      rak: t.rak,
      kapasitas: t.kapasitas,
      jumlahDok: dokumenByTempat[t.id]?.length ?? 0,
    }));
  }, [dokumenByTempat, tempatPenyimpanan]);

  const handleCardClick = (tempat: (typeof tempatPenyimpananList)[0]) => {
    setSelectedTempat(tempat);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTempat(null);
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <FeatureHeader
        title="Ruang Arsip Digital"
        subtitle="Laporan visual penyimpanan dokumen fisik dan digital."
        icon={<Archive />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tempatPenyimpananList.map((tempat, idx) => (
          <div
            key={tempat.id}
            onClick={() => handleCardClick(tempat)}
            className={`group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 animate-slide-up`}
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
                <Archive className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Total Arsip
                </span>
                <span className="text-2xl font-bold text-gray-800 tabular-nums">
                  {tempat.jumlahDok}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Warehouse className="w-4 h-4" /> Kantor
                  </span>
                  <span className="font-semibold text-gray-800">
                    {tempat.namaKantor}
                  </span>
                </div>
                <div className="w-full h-px bg-gray-200" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Box className="w-4 h-4" /> Kode Lemari
                  </span>
                  <span className="font-semibold text-gray-800">
                    {tempat.kodeLemari}
                  </span>
                </div>
                <div className="w-full h-px bg-gray-200" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Archive className="w-4 h-4" /> Rak
                  </span>
                  <span className="font-semibold text-gray-800">
                    {tempat.rak}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-primary-600 font-medium group-hover:translate-x-1 transition-transform">
              <span className="text-sm">Lihat Detail Dokumen</span>
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedTempat && (
        <div
          data-dashboard-overlay="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/10"
                  style={{
                    background:
                      "linear-gradient(135deg, #157ec3 0%, #0d5a8f 100%)",
                  }}
                >
                  <Archive className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    List Dokumen Tersimpan
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedTempat.namaKantor} • {selectedTempat.kodeLemari} •{" "}
                    {selectedTempat.rak}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-0">
              {dokumenByTempat[selectedTempat.id]?.length > 0 ? (
                <div className="w-full">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10 w-full">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          No
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Kode
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Jenis Dok
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Nama Dok
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">
                          Detail
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Tgl Input
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dokumenByTempat[selectedTempat.id].map((doc, idx) => (
                        <tr
                          key={doc.id}
                          className="hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {idx + 1}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className="font-mono text-primary-600 bg-primary-50 px-2 py-1 rounded border border-primary-100">
                              {doc.kode}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                            {doc.jenisDokumen}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 font-semibold">
                            {doc.namaDokumen}
                          </td>
                          <td
                            className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs"
                            title={doc.detail}
                          >
                            {doc.detail}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {doc.tglInput}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                {doc.userInput.substring(0, 1)}
                              </div>
                              <span className="text-gray-700 font-medium">
                                {doc.userInput}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Tidak ada dokumen
                  </h3>
                  <p className="text-gray-500 max-w-sm mt-1">
                    Belum ada dokumen yang tersimpan pada lokasi{" "}
                    {selectedTempat.namaKantor} - {selectedTempat.rak} ini.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={closeModal} className="btn btn-outline">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
