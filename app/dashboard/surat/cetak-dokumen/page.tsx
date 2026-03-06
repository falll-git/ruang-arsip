"use client";

import { useState } from "react";
import { Printer, FileText, Download } from "lucide-react";

export default function CetakDokumenPage() {
  const [selectedJenis, setSelectedJenis] = useState("");

  const jenisDokumen = [
    { id: "surat-masuk", label: "Surat Masuk" },
    { id: "surat-keluar", label: "Surat Keluar" },
    { id: "memorandum", label: "Memorandum" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
            }}
          >
            <Printer className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Cetak Dokumen</h2>
            <p className="text-sm text-gray-600">
              Cetak dokumen surat masuk, surat keluar, dan memorandum
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Dokumen
            </label>
            <select
              value={selectedJenis}
              onChange={(e) => setSelectedJenis(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent"
            >
              <option value="">Pilih Jenis Dokumen</option>
              {jenisDokumen.map((jenis) => (
                <option key={jenis.id} value={jenis.id}>
                  {jenis.label}
                </option>
              ))}
            </select>
          </div>

          {selectedJenis && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Preview Dokumen</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Dokumen siap untuk dicetak
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors">
                <Download className="w-4 h-4" />
                Cetak Dokumen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
