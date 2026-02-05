"use client";

import { useState } from "react";
import {
  CheckCircle2,
  History,
  Send,
  X,
  XCircle,
  User,
  Calendar,
} from "lucide-react";
import { dummyDisposisi, dummyDokumen } from "@/lib/data";
import FeatureHeader from "@/components/ui/FeatureHeader";

interface HistorisItem {
  id: number;
  kode: string;
  namaDokumen: string;
  pemilik?: string;
  pemohon?: string;
  tglPengajuan: string;
  status: string;
  tglAksi: string;
}

const completedDisposisi = dummyDisposisi.filter(
  (d) => d.status === "Approved" || d.status === "Rejected",
);

const historisPermohonan: HistorisItem[] = completedDisposisi.map((d) => {
  const dokumen = dummyDokumen.find((doc) => doc.id === d.dokumenId);
  return {
    id: d.id,
    kode: dokumen?.kode ?? `DOK-${d.dokumenId}`,
    namaDokumen: dokumen?.namaDokumen ?? "-",
    pemilik: d.pemilik,
    tglPengajuan: d.tglPengajuan,
    status: d.status,
    tglAksi: d.tglAksi || d.tglPengajuan,
  };
});

const historisPersetujuan: HistorisItem[] = completedDisposisi.map((d) => {
  const dokumen = dummyDokumen.find((doc) => doc.id === d.dokumenId);
  return {
    id: d.id,
    kode: dokumen?.kode ?? `DOK-${d.dokumenId}`,
    namaDokumen: dokumen?.namaDokumen ?? "-",
    pemohon: d.pemohon,
    tglPengajuan: d.tglPengajuan,
    status: d.status,
    tglAksi: d.tglAksi || d.tglPengajuan,
  };
});

export default function HistorisDisposisiPage() {
  const [activeTab, setActiveTab] = useState<"permohonan" | "persetujuan">(
    "permohonan",
  );
  const [selectedItem, setSelectedItem] = useState<HistorisItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const data =
    activeTab === "permohonan" ? historisPermohonan : historisPersetujuan;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <FeatureHeader
        title="Historis Disposisi"
        subtitle="Arsip riwayat pengajuan dan persetujuan disposisi dokumen."
        icon={<History />}
      />

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setActiveTab("permohonan")}
          className={
            activeTab === "permohonan" ? "btn btn-primary" : "btn btn-outline"
          }
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          Permohonan Saya
        </button>
        <button
          onClick={() => setActiveTab("persetujuan")}
          className={
            activeTab === "persetujuan" ? "btn btn-primary" : "btn btn-outline"
          }
        >
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          Persetujuan Saya
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Total Riwayat
            </p>
            <p className="text-3xl font-extrabold text-gray-900 mt-2 leading-none">
              {data.length}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
            <History className="w-7 h-7" aria-hidden="true" />
          </div>
        </div>
        <div className="card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Disetujui
            </p>
            <p className="text-3xl font-extrabold text-gray-900 mt-2 leading-none">
              {data.filter((d) => d.status === "Approved").length}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
          </div>
        </div>
        <div className="card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Ditolak
            </p>
            <p className="text-3xl font-extrabold text-gray-900 mt-2 leading-none">
              {data.filter((d) => d.status === "Rejected").length}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
            <XCircle className="w-7 h-7" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                  No
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Kode
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nama Dokumen
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {activeTab === "permohonan" ? "Pemilik" : "Pemohon"}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tgl Pengajuan
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tgl Aksi
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item, idx) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-primary-600 bg-primary-50 px-2 py-1 rounded border border-primary-100 text-xs font-medium">
                      {item.kode}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {item.namaDokumen}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {activeTab === "permohonan"
                        ? item.pemilik || "-"
                        : item.pemohon || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.tglPengajuan}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.tglAksi}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                        ${
                          item.status === "Approved"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                    >
                      {item.status === "Approved" ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowDetail(true);
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetail && selectedItem && (
        <div
          data-dashboard-overlay="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <History className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Detail Disposisi
                </h2>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                    Kode Dokumen
                  </label>
                  <p className="font-bold text-primary-600 mt-1">
                    {selectedItem.kode}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                    Nama Dokumen
                  </label>
                  <p className="font-medium text-gray-800 mt-1">
                    {selectedItem.namaDokumen}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                    {activeTab === "permohonan" ? "Pemilik Dokumen" : "Pemohon"}
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-800">
                      {activeTab === "permohonan"
                        ? selectedItem.pemilik || "-"
                        : selectedItem.pemohon || "-"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                    Status Akhir
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                        ${
                          selectedItem.status === "Approved"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                    >
                      {selectedItem.status === "Approved"
                        ? "Disetujui"
                        : "Ditolak"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                    Tanggal Pengajuan
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-800">
                      {selectedItem.tglPengajuan}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                    Tanggal Aksi
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-800">
                      {selectedItem.tglAksi}
                    </p>
                  </div>
                </div>
              </div>

              {selectedItem.status === "Approved" && (
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        Akses Diberikan
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Anda memiliki akses penuh ke dokumen ini sampai tanggal{" "}
                        <span className="font-bold">28-01-2026</span>.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowDetail(false)}
                className="btn btn-outline"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
