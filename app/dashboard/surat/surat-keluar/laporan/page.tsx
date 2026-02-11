"use client";

import { useMemo, useState } from "react";
import {
  Eye,
  FileSpreadsheet,
  FileText,
  Mail,
  Search,
  Send,
  Truck,
  User,
  Users,
  X,
  Filter,
  Calendar,
} from "lucide-react";
import { useAppToast } from "@/components/ui/AppToastProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { useDocumentPreviewContext } from "@/components/ui/DocumentPreviewContext";
import { dummySuratKeluar, type SuratKeluar } from "@/lib/data";
import { USER_ROLES } from "@/lib/rbac";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { exportToExcel } from "@/lib/utils/exportExcel";
import { formatDateDisplay, parseDateString } from "@/lib/utils/date";

const mediaOptions = ["Semua", "Email", "Kurir", "Langsung", "Pos"] as const;
const sifatOptions = ["Semua", "Biasa", "Rahasia"] as const;

function mediaIcon(media: SuratKeluar["media"]) {
  if (media === "Kurir")
    return <Truck className="w-3.5 h-3.5" aria-hidden="true" />;
  if (media === "Langsung")
    return <User className="w-3.5 h-3.5" aria-hidden="true" />;
  return <Mail className="w-3.5 h-3.5" aria-hidden="true" />;
}

function sifatBadge(sifat: SuratKeluar["sifat"]) {
  if (sifat === "Rahasia") return "bg-red-50 text-red-700 border-red-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
}

export default function LaporanSuratKeluarPage() {
  const { openPreview } = useDocumentPreviewContext();
  const { showToast } = useAppToast();
  const { user, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMedia, setFilterMedia] =
    useState<(typeof mediaOptions)[number]>("Semua");
  const [filterSifat, setFilterSifat] =
    useState<(typeof sifatOptions)[number]>("Semua");
  const [sortBy, setSortBy] = useState<"terbaru" | "terlama">("terbaru");
  const [selectedSurat, setSelectedSurat] = useState<SuratKeluar | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const suratScope = useMemo(() => {
    const viewerName = user?.namaLengkap;
    if (!viewerName) return dummySuratKeluar;

    const canViewAll =
      role === USER_ROLES.MASTER_USER || role === USER_ROLES.FULL_AKSES;
    if (canViewAll) return dummySuratKeluar;

    return dummySuratKeluar.filter((surat) =>
      surat.disposisiKepada.includes(viewerName),
    );
  }, [role, user?.namaLengkap]);

  const filteredSurat = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const items = suratScope.filter((surat) => {
      const matchSearch = normalizedSearch
        ? surat.namaSurat.toLowerCase().includes(normalizedSearch) ||
          surat.penerima.toLowerCase().includes(normalizedSearch) ||
          surat.perihal.toLowerCase().includes(normalizedSearch)
        : true;

      const matchMedia = filterMedia === "Semua" || surat.media === filterMedia;

      const matchSifat = filterSifat === "Semua" || surat.sifat === filterSifat;

      return matchSearch && matchMedia && matchSifat;
    });

    items.sort((a, b) => {
      const aTime = parseDateString(a.tanggalKirim)?.getTime() ?? 0;
      const bTime = parseDateString(b.tanggalKirim)?.getTime() ?? 0;
      return sortBy === "terbaru" ? bTime - aTime : aTime - bTime;
    });

    return items;
  }, [filterMedia, filterSifat, searchTerm, sortBy, suratScope]);

  const handleExportExcel = async () => {
    await exportToExcel({
      filename: "laporan-surat-keluar",
      sheetName: "Surat Keluar",
      title: "Laporan Surat Keluar",
      columns: [
        { header: "No", key: "no", width: 6 },
        { header: "Nama Surat", key: "namaSurat", width: 30 },
        { header: "Penerima", key: "penerima", width: 25 },
        { header: "Perihal", key: "perihal", width: 40 },
        { header: "Tgl Kirim", key: "tanggalKirim", width: 15 },
        { header: "Media", key: "media", width: 12 },
        { header: "Sifat", key: "sifat", width: 12 },
      ],
      data: filteredSurat.map((surat, idx) => ({
        no: idx + 1,
        namaSurat: surat.namaSurat,
        penerima: surat.penerima,
        perihal: surat.perihal,
        tanggalKirim: formatDateDisplay(surat.tanggalKirim),
        media: surat.media,
        sifat: surat.sifat,
      })),
    });
    showToast("Export Excel berhasil!", "success");
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <FeatureHeader
        title="Laporan Surat Keluar"
        subtitle="Arsip surat keluar yang telah terkirim."
        icon={<Send />}
        actions={
          <button
            onClick={handleExportExcel}
            className="btn btn-export-excel"
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
              Cari Surat
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
                placeholder="Cari nama surat, penerima, atau perihal..."
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Media
            </label>
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={filterMedia}
                onChange={(event) =>
                  setFilterMedia(
                    event.target.value as (typeof mediaOptions)[number],
                  )
                }
                className="select input-with-icon"
              >
                {mediaOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Sifat
            </label>
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={filterSifat}
                onChange={(event) =>
                  setFilterSifat(
                    event.target.value as (typeof sifatOptions)[number],
                  )
                }
                className="select input-with-icon"
              >
                {sifatOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-3">
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
              {filteredSurat.length}
            </span>{" "}
            surat
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
                  Nama Surat
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Penerima
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">
                  Perihal
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tgl Kirim
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Media
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Sifat
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSurat.length > 0 ? (
                filteredSurat.map((surat, idx) => (
                  <tr
                    key={surat.id}
                    onClick={() => {
                      setSelectedSurat(surat);
                      setShowDetail(true);
                    }}
                    className="cursor-pointer hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {surat.namaSurat}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {surat.penerima}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs block">
                      {surat.perihal}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {formatDateDisplay(surat.tanggalKirim)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {mediaIcon(surat.media)}
                        {surat.media}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${sifatBadge(surat.sifat)}`}
                      >
                        {surat.sifat}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                        <Search className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Surat Tidak Ditemukan
                      </h3>
                      <p className="text-gray-500 mt-1 max-w-sm">
                        Coba ubah kata kunci pencarian atau filter untuk
                        menemukan surat yang Anda cari.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetail && selectedSurat && (
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
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"
                  style={{
                    background:
                      "linear-gradient(135deg, #157ec3 0%, #0d5a8f 100%)",
                  }}
                >
                  <Send className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Detail Surat Keluar
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedSurat.namaSurat}
                  </p>
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
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Informasi Penerima
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-500">
                          Penerima
                        </label>
                        <p className="text-lg font-semibold text-gray-800">
                          {selectedSurat.penerima}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Alamat</label>
                        <p className="text-base font-medium text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          {selectedSurat.alamatPenerima}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Detail Surat
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-500">Perihal</label>
                        <p className="text-base font-medium text-gray-800 leading-relaxed">
                          {selectedSurat.perihal}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Metadata
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <label className="text-xs text-gray-500 block mb-1">
                          Tanggal Kirim
                        </label>
                        <p className="font-semibold text-gray-800">
                          {formatDateDisplay(selectedSurat.tanggalKirim)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <label className="text-xs text-gray-500 block mb-1">
                          Media
                        </label>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                          {mediaIcon(selectedSurat.media)}
                          {selectedSurat.media}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <label className="text-xs text-gray-500 block mb-1">
                          Sifat Surat
                        </label>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${sifatBadge(selectedSurat.sifat)}`}
                        >
                          {selectedSurat.sifat}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      File Lampiran
                    </h4>
                    <div
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group cursor-pointer"
                      onClick={() =>
                        openPreview(
                          "/documents/contoh-dok.pdf",
                          selectedSurat.namaSurat,
                          "pdf",
                        )
                      }
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                          {selectedSurat.fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Klik untuk melihat
                        </p>
                      </div>
                      <button className="btn btn-view-pdf btn-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {selectedSurat.disposisiKepada.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    Tembusan Kepada
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSurat.disposisiKepada.map((name) => (
                      <div
                        key={name}
                        className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm"
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                          {name.substring(0, 1)}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
