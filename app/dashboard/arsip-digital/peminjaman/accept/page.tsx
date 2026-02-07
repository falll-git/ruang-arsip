"use client";

import { useState } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileBarChart2,
  X,
} from "lucide-react";
import { dummyDokumen, dummyPeminjaman } from "@/lib/data";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { useAppToast } from "@/components/ui/AppToastProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { formatDateDisplay } from "@/lib/utils/date";

const permohonanList = dummyPeminjaman
  .filter((p) => p.status === "Pending" || p.status === "Dipinjam")
  .map((p) => {
    const dokumen = dummyDokumen.find((d) => d.id === p.dokumenId);
    return {
      id: p.id,
      kode: dokumen?.kode ?? `DOK-${p.dokumenId}`,
      namaDokumen: dokumen?.namaDokumen ?? "-",
      pemohon: p.peminjam,
      tglPeminjaman: p.tglPinjam,
      tglPengembalian: p.tglKembali,
      alasan: p.alasan,
      tipe: p.status === "Dipinjam" ? "Pengembalian" : "Peminjaman",
    };
  });

export default function AcceptPeminjamanPage() {
  const { showToast } = useAppToast();
  const [data, setData] = useState(permohonanList);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    (typeof permohonanList)[0] | null
  >(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );
  const [tanggalPenyerahan, setTanggalPenyerahan] = useState("");
  const [alasanAksi, setAlasanAksi] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = (
    item: (typeof permohonanList)[0],
    type: "approve" | "reject",
  ) => {
    setSelectedItem(item);
    setActionType(type);
    setShowModal(true);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowModal(false);
      setData(data.filter((d) => d.id !== selectedItem?.id));

      const message =
        actionType === "approve"
          ? selectedItem?.tipe === "Peminjaman"
            ? "Peminjaman berhasil disetujui!"
            : "Pengembalian berhasil dikonfirmasi!"
          : "Peminjaman ditolak!";

      showToast(message, actionType === "reject" ? "warning" : "success");

      setTanggalPenyerahan("");
      setAlasanAksi("");
    }, 1500);
  };

  const peminjamanCount = data.filter((d) => d.tipe === "Peminjaman").length;
  const pengembalianCount = data.filter(
    (d) => d.tipe === "Pengembalian",
  ).length;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <FeatureHeader
        title="Accept Peminjaman"
        subtitle="Kelola persetujuan peminjaman dan pengembalian dokumen fisik."
        icon={<ClipboardCheck />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Total Permintaan
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {data.length}
            </p>
          </div>
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <FileBarChart2 className="w-7 h-7" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Peminjaman Baru
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {peminjamanCount}
            </p>
          </div>
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <BookOpen className="w-7 h-7" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Pengembalian
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {pengembalianCount}
            </p>
          </div>
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                    No
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Kode
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Nama Dokumen
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Pemohon
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tgl Pinjam
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tgl Kembali
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">
                    Alasan
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
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${
                            item.tipe === "Peminjaman"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          }`}
                      >
                        {item.tipe}
                      </span>
                    </td>
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
                        {item.pemohon}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDateDisplay(item.tglPeminjaman)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDateDisplay(item.tglPengembalian)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs italic">
                      &quot;{item.alasan}&quot;
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAction(item, "approve")}
                          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors tooltip tooltip-left"
                          title={
                            item.tipe === "Peminjaman"
                              ? "Setujui"
                              : "Konfirmasi"
                          }
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        {item.tipe === "Peminjaman" && (
                          <button
                            onClick={() => handleAction(item, "reject")}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors tooltip tooltip-left"
                            title="Tolak"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Check className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Semua Beres!</h3>
          <p className="text-gray-500 mt-2">
            Tidak ada permintaan peminjaman atau pengembalian yang menunggu.
          </p>
        </div>
      )}

      {showModal && selectedItem && (
        <div
          data-dashboard-overlay="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${actionType === "approve" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  {actionType === "approve" ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {actionType === "approve"
                    ? selectedItem.tipe === "Peminjaman"
                      ? "Setujui Peminjaman"
                      : "Konfirmasi Pengembalian"
                    : "Tolak Peminjaman"}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 uppercase font-semibold">
                      Kode
                    </label>
                    <p className="font-mono text-sm font-bold text-primary-600">
                      {selectedItem.kode}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <label className="text-xs text-gray-500 uppercase font-semibold">
                      Tipe
                    </label>
                    <p>
                      <span className="badge badge-sm badge-info">
                        {selectedItem.tipe}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="w-full h-px bg-gray-200" />
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase font-semibold">
                    Dokumen
                  </label>
                  <p className="font-medium text-gray-800">
                    {selectedItem.namaDokumen}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase font-semibold">
                    Pemohon
                  </label>
                  <p className="font-medium text-gray-800">
                    {selectedItem.pemohon}
                  </p>
                </div>
              </div>

              {actionType === "approve" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal Penyerahan <span className="text-red-500">*</span>
                  </label>
                  <DatePickerInput
                    value={tanggalPenyerahan}
                    onChange={setTanggalPenyerahan}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tanggal dokumen fisik diserahkan/diterima.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alasan / Catatan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={alasanAksi}
                  onChange={(e) => setAlasanAksi(e.target.value)}
                  placeholder={`Tambahkan catatan ${actionType === "approve" ? "persetujuan" : "penolakan"}...`}
                  className="textarea resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  !alasanAksi.trim() ||
                  (actionType === "approve" && !tanggalPenyerahan) ||
                  isLoading
                }
                className={`px-6 py-2.5 rounded-lg text-white font-medium hover:opacity-90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2
                  ${actionType === "approve" ? "bg-green-600 shadow-green-600/20" : "bg-red-600 shadow-red-600/20"}
                `}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  <>
                    {actionType === "approve" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    {actionType === "approve" ? "Konfirmasi" : "Tolak"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
