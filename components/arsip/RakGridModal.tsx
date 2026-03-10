"use client";

import { Archive, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Lemari, Rak } from "@/lib/types";

type RakGridModalProps = {
  lemari: Lemari;
  namaKantor: string;
  rakList: Rak[];
  onClose: () => void;
  onSelectRak: (rakId: string) => void;
};

export default function RakGridModal({
  lemari,
  namaKantor,
  rakList,
  onClose,
  onSelectRak,
}: RakGridModalProps) {
  return (
    <div
      data-dashboard-overlay="true"
      className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[80vh] w-[94vw] max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
          <h3 className="truncate text-lg font-bold text-gray-900">
            {lemari.kodeLemari} {"\u00B7"} {namaKantor}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="grid grid-cols-3 gap-4">
            {rakList.map((rak) => (
              <button
                key={rak.id}
                type="button"
                onClick={() => onSelectRak(rak.id)}
                className="group rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg shadow-blue-500/20"
                    style={{
                      background:
                        "linear-gradient(135deg, #157ec3 0%, #0d5a8f 100%)",
                    }}
                  >
                    <Archive className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Total Arsip
                    </span>
                    <span className="text-xl font-bold text-gray-800 tabular-nums">
                      {rak.totalArsip}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-gray-900">{rak.namaRak}</p>

                <div className="mt-4 flex items-center justify-between text-primary-600 font-medium group-hover:translate-x-1 transition-transform">
                  <span className="text-sm">Lihat Dokumen</span>
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-gray-100 bg-gray-50 px-5 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
