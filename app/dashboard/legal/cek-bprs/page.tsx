"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Building2,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle,
  AlertTriangle,
  Eye,
  Clock,
  MapPin,
  User,
} from "lucide-react";
import {
  dummyBPRSLain,
  dummyHistoryCekBPRS,
  BPRSLain,
  HistoryCekBPRS,
} from "@/lib/data";
import { useAppToast } from "@/components/ui/AppToastProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { exportToExcel } from "@/lib/utils/exportExcel";
import { formatDateDisplay, todayIsoDate } from "@/lib/utils/date";

export default function CekBPRSLainPage() {
  const { showToast } = useAppToast();
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<BPRSLain[]>([]);
  const [history, setHistory] = useState(dummyHistoryCekBPRS);
  const [historySearch, setHistorySearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<BPRSLain | null>(null);

  const handleSearch = () => {
    if (!search.trim()) {
      showToast("Masukkan NIK atau nama!", "error");
      return;
    }
    const found = dummyBPRSLain.filter(
      (d) =>
        d.nama.toLowerCase().includes(search.toLowerCase()) || d.nik === search,
    );
    setResults(found);
    setShowResults(true);

    const newHistory: HistoryCekBPRS = {
      id: history.length + 1,
      tanggal: todayIsoDate(),
      keyword: search,
      hasilDitemukan: found.length,
      user: "Faisal",
    };
    setHistory([newHistory, ...history]);

    showToast(
      found.length > 0
        ? `Ditemukan ${found.length} data debitur`
        : "Tidak ditemukan data debitur",
      found.length > 0 ? "warning" : "success",
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const filteredHistory = useMemo(() => {
    if (!historySearch) return history;
    return history.filter((h) =>
      h.keyword.toLowerCase().includes(historySearch.toLowerCase()),
    );
  }, [history, historySearch]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleExportExcel = async () => {
    await exportToExcel({
      filename: "history_cek_bprs",
      sheetName: "History Cek BPRS",
      title: "HISTORY PENGECEKAN DATA DEBITUR BPRS LAIN",
      columns: [
        { header: "No", key: "no", width: 5 },
        { header: "Tanggal", key: "tanggal", width: 12 },
        { header: "Keyword", key: "keyword", width: 25 },
        { header: "Hasil", key: "hasilDitemukan", width: 10 },
        { header: "User", key: "user", width: 15 },
      ],
      data: filteredHistory.map((item, idx) => ({ ...item, no: idx + 1 })),
    });
    showToast("Export Excel berhasil!", "success");
  };

  const getStatusBadge = (status: string, kol: number) => {
    const kolColors: { [key: number]: string } = {
      1: "bg-green-100 text-green-700",
      2: "bg-yellow-100 text-yellow-700",
      3: "bg-orange-100 text-orange-700",
      4: "bg-red-100 text-red-700",
      5: "bg-red-200 text-red-800",
    };
    return (
      <div className="flex flex-col gap-1">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${status === "Aktif" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
        >
          {status}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${kolColors[kol]}`}
        >
          Kol {kol}
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <FeatureHeader
        title="Cek Data Debitur (BPRS Lain)"
        subtitle="Verifikasi status pembiayaan calon nasabah di BPRS lain"
        icon={<Building2 />}
      />

      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Pengecekan Data Debitur
            </h2>
            <p className="text-sm text-gray-500">
              Cari berdasarkan NIK atau Nama lengkap
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Masukkan NIK atau Nama lengkap..."
              className="input input-with-icon"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          <button
            onClick={handleSearch}
            className="btn btn-primary w-full md:w-auto"
          >
            Cek Sekarang
          </button>
        </div>
      </div>

      {showResults && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            {results.length > 0 ? (
              <>
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Ditemukan {results.length} Data Debitur
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Tidak Ditemukan Data
              </>
            )}
          </h2>

          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="border border-orange-200 bg-orange-50 rounded-xl p-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {result.nama}
                        </h3>
                        <p className="text-sm text-gray-600">
                          NIK: {result.nik}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {result.namaBPRS}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {result.lokasi}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(result.status, result.kolektibilitas)}
                      <button
                        onClick={() => {
                          setSelectedResult(result);
                          setShowDetailModal(true);
                        }}
                        className="btn btn-outline btn-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Data Bersih
              </h3>
              <p className="text-gray-400">
                Tidak ditemukan data pembiayaan untuk &quot;{search}&quot; di
                BPRS lain
              </p>
            </div>
          )}

          <button
            onClick={() => {
              setShowResults(false);
              setSearch("");
              setResults([]);
            }}
            className="btn btn-outline btn-sm mt-4"
          >
            ← Pencarian Baru
          </button>
        </div>
      )}

      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            History Pengecekan
          </h2>
          <button
            onClick={handleExportExcel}
            className="btn btn-success btn-sm"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>
        <div className="relative mb-4">
          <input
            type="text"
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
            placeholder="Cari..."
            className="input input-with-icon"
          />
          <Filter className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Keyword
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Hasil
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  User
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedHistory.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDateDisplay(item.tanggal)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {item.keyword}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.hasilDitemukan > 0 ? (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        {item.hasilDitemukan} ditemukan
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Bersih
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.user}</td>
                </tr>
              ))}
              {paginatedHistory.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showDetailModal && selectedResult && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowDetailModal(false);
            setSelectedResult(null);
          }}
        >
          <div
            className="modal-content modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detail Data Debitur</h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedResult(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex items-center gap-2 text-orange-700 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">
                    Peringatan: Debitur Aktif di BPRS Lain
                  </span>
                </div>
                <p className="text-sm text-orange-600">
                  Calon nasabah ini tercatat memiliki pembiayaan aktif di{" "}
                  {selectedResult.namaBPRS}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Nama Lengkap</p>
                  <p className="font-semibold text-gray-800">
                    {selectedResult.nama}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">NIK</p>
                  <p className="font-semibold text-gray-800">
                    {selectedResult.nik}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Nama BPRS</p>
                  <p className="font-semibold text-gray-800">
                    {selectedResult.namaBPRS}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Lokasi</p>
                  <p className="font-semibold text-gray-800">
                    {selectedResult.lokasi}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Produk</p>
                  <p className="font-semibold text-gray-800">
                    {selectedResult.produk}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Plafond</p>
                  <p className="font-semibold text-gray-800">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(selectedResult.plafond)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Status</p>
                  <p
                    className={`font-semibold ${selectedResult.status === "Aktif" ? "text-blue-600" : "text-gray-600"}`}
                  >
                    {selectedResult.status}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${selectedResult.kolektibilitas >= 3 ? "bg-red-50" : selectedResult.kolektibilitas === 2 ? "bg-yellow-50" : "bg-green-50"}`}
                >
                  <p className="text-xs text-gray-500">Kolektibilitas</p>
                  <p
                    className={`font-bold text-xl ${selectedResult.kolektibilitas >= 3 ? "text-red-600" : selectedResult.kolektibilitas === 2 ? "text-yellow-600" : "text-green-600"}`}
                  >
                    {selectedResult.kolektibilitas}
                  </p>
                </div>
              </div>

              {selectedResult.keterangan && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Keterangan</p>
                  <p className="text-sm text-gray-700">
                    {selectedResult.keterangan}
                  </p>
                </div>
              )}

              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-500 mb-1">Terakhir Update</p>
                <p className="text-sm text-blue-700">
                  {selectedResult.lastUpdate}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedResult(null);
                }}
                className="btn btn-primary w-full"
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
