"use client";

import { useMemo, useState } from "react";
import {
  Eye,
  FileSpreadsheet,
  FileText,
  Search,
  Users,
  X,
  Building2,
  Calendar,
} from "lucide-react";
import { useAppToast } from "@/components/ui/AppToastProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { useDocumentPreviewContext } from "@/components/ui/DocumentPreviewContext";
import { dummyDivisiList, dummyMemorandum, type Memorandum } from "@/lib/data";
import { USER_ROLES } from "@/lib/rbac";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { exportToExcel } from "@/lib/utils/exportExcel";
import { formatDateDisplay, parseDateString } from "@/lib/utils/date";

export default function LaporanMemorandumPage() {
  const { openPreview } = useDocumentPreviewContext();
  const { showToast } = useAppToast();
  const { user, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDivisi, setFilterDivisi] = useState("Semua");
  const [sortBy, setSortBy] = useState<"terbaru" | "terlama">("terbaru");
  const [selectedMemo, setSelectedMemo] = useState<Memorandum | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const memoScope = useMemo(() => {
    const viewerName = user?.namaLengkap;
    const viewerDivisi = user?.divisi;
    if (!viewerName || !viewerDivisi) return dummyMemorandum;

    const canViewAll =
      role === USER_ROLES.MASTER_USER || role === USER_ROLES.FULL_AKSES;
    if (canViewAll) return dummyMemorandum;

    return dummyMemorandum.filter((memo) => {
      if (memo.pembuatMemo === viewerName) return true;
      if (memo.penerimaTipe === "perorangan") {
        return memo.penerima.includes(viewerName);
      }
      return memo.penerima.includes(viewerDivisi);
    });
  }, [role, user?.divisi, user?.namaLengkap]);

  const filteredMemo = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const items = memoScope.filter((memo) => {
      const matchSearch = normalizedSearch
        ? memo.noMemo.toLowerCase().includes(normalizedSearch) ||
          memo.perihal.toLowerCase().includes(normalizedSearch) ||
          memo.pembuatMemo.toLowerCase().includes(normalizedSearch) ||
          memo.keterangan.toLowerCase().includes(normalizedSearch)
        : true;

      const matchDivisi =
        filterDivisi === "Semua" || memo.divisiPengirim === filterDivisi;

      return matchSearch && matchDivisi;
    });

    items.sort((a, b) => {
      const aTime = parseDateString(a.tanggal)?.getTime() ?? 0;
      const bTime = parseDateString(b.tanggal)?.getTime() ?? 0;
      return sortBy === "terbaru" ? bTime - aTime : aTime - bTime;
    });

    return items;
  }, [filterDivisi, memoScope, searchTerm, sortBy]);

  const handleExportExcel = async () => {
    await exportToExcel({
      filename: "laporan-memorandum",
      sheetName: "Memorandum",
      title: "Laporan Memorandum Internal",
      columns: [
        { header: "No", key: "no", width: 6 },
        { header: "No Memo", key: "noMemo", width: 20 },
        { header: "Perihal", key: "perihal", width: 30 },
        { header: "Divisi Pengirim", key: "divisiPengirim", width: 18 },
        { header: "Pembuat", key: "pembuatMemo", width: 22 },
        { header: "Tanggal", key: "tanggal", width: 15 },
        { header: "Penerima", key: "penerima", width: 35 },
      ],
      data: filteredMemo.map((memo, idx) => ({
        no: idx + 1,
        noMemo: memo.noMemo,
        perihal: memo.perihal,
        divisiPengirim: memo.divisiPengirim,
        pembuatMemo: memo.pembuatMemo,
        tanggal: formatDateDisplay(memo.tanggal),
        penerima: memo.penerima.join(", "),
      })),
    });
    showToast("Export Excel berhasil!", "success");
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <FeatureHeader
        title="Laporan Memorandum"
        subtitle="Daftar memorandum internal yang telah dibuat dan didistribusikan."
        icon={<FileText />}
        actions={
          <button
            onClick={handleExportExcel}
            className="btn btn-success"
            title="Export Excel"
          >
            <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
            <span>Export Excel</span>
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Cari Memo
            </label>
            <div className="relative">
              <Search
                className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="input input-with-icon"
                placeholder="Cari no memo, perihal, pembuat..."
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Divisi Pengirim
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={filterDivisi}
                onChange={(event) => setFilterDivisi(event.target.value)}
                className="select input-with-icon"
              >
                <option value="Semua">Semua Divisi</option>
                {dummyDivisiList.map((divisi) => (
                  <option key={divisi} value={divisi}>
                    {divisi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Urutkan
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as "terbaru" | "terlama")
                }
                className="select input-with-icon"
              >
                <option value="terbaru">Terbaru (Paling Baru)</option>
                <option value="terlama">Terlama (Paling Lama)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">
            Menampilkan{" "}
            <span className="font-bold text-gray-900">
              {filteredMemo.length}
            </span>{" "}
            memo
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                  No
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  No Memo
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">
                  Perihal
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Divisi
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Pembuat
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMemo.length > 0 ? (
                filteredMemo.map((memo, idx) => (
                  <tr
                    key={memo.id}
                    onClick={() => {
                      setSelectedMemo(memo);
                      setShowDetail(true);
                    }}
                    className="cursor-pointer hover:bg-indigo-50/40 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500 group-hover:text-indigo-600 transition-colors">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-medium px-2 py-1 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {memo.noMemo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs block">
                      {memo.perihal}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {memo.divisiPengirim}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {memo.pembuatMemo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {formatDateDisplay(memo.tanggal)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                        <Search className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Memo Tidak Ditemukan
                      </h3>
                      <p className="text-gray-500 mt-1 max-w-sm">
                        Coba ubah kata kunci pencarian atau filter untuk
                        menemukan memo yang Anda cari.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetail && selectedMemo && (
        <div
          data-dashboard-overlay="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scale-up border border-gray-100"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20"
                  style={{
                    background:
                      "linear-gradient(135deg, #157ec3 0%, #0d5a8f 100%)",
                  }}
                >
                  <FileText className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Detail Memorandum
                  </h2>
                  <p className="text-sm text-gray-500">{selectedMemo.noMemo}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Informasi Umum
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-500">Perihal</label>
                        <p className="text-lg font-semibold text-gray-800 leading-relaxed">
                          {selectedMemo.perihal}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">
                          Isi Ringkas / Keterangan
                        </label>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <p className="text-base font-medium text-gray-700 whitespace-pre-line leading-relaxed">
                            {selectedMemo.keterangan}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Metadata
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <label className="text-xs text-gray-500 block mb-1">
                          Divisi Pengirim
                        </label>
                        <p className="font-semibold text-gray-800">
                          {selectedMemo.divisiPengirim}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <label className="text-xs text-gray-500 block mb-1">
                          Pembuat
                        </label>
                        <p className="font-semibold text-gray-800">
                          {selectedMemo.pembuatMemo}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 col-span-2">
                        <label className="text-xs text-gray-500 block mb-1">
                          Tanggal
                        </label>
                        <p className="font-semibold text-gray-800">
                          {formatDateDisplay(selectedMemo.tanggal)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      File Lampiran
                    </h4>
                    <div
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all group cursor-pointer"
                      onClick={() =>
                        openPreview(
                          "/documents/contoh-dok.pdf",
                          selectedMemo.noMemo,
                          "pdf",
                        )
                      }
                    >
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                          {selectedMemo.fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Klik untuk melihat
                        </p>
                      </div>
                      <button className="btn btn-sm btn-ghost text-indigo-600">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    Daftar Penerima
                  </h3>
                  <span className="text-xs px-2 py-1 bg-white border border-gray-200 rounded text-gray-500 font-medium uppercase tracking-wider">
                    Tipe: {selectedMemo.penerimaTipe}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMemo.penerima.map((target) => (
                    <div
                      key={target}
                      className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                        {target.substring(0, 1)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {target}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-100 bg-gray-50/50">
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
