"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  Calendar,
  User,
  List,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import FeatureHeader from "@/components/ui/FeatureHeader";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { useAppToast } from "@/components/ui/AppToastProvider";
import { formatDateDisplay } from "@/lib/utils/date";

export default function UploadIdebPage() {
  const { showToast } = useAppToast();
  const [selectedNasabah, setSelectedNasabah] = useState("");
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedNasabah || !bulan || !tahun || !file) {
      showToast("Mohon lengkapi semua field!", "warning");
      return;
    }

    const newHistory = {
      id: history.length + 1,
      tanggal: new Date().toISOString().split("T")[0],
      nasabah: selectedNasabah,
      periode: `${bulan}/${tahun}`,
      fileName: file.name,
      user: "Faisal",
    };

    setHistory([newHistory, ...history]);

    // Reset form
    setSelectedNasabah("");
    setBulan("");
    setTahun("");
    setFile(null);

    showToast("Upload Ideb berhasil!", "success");
  };

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const paginatedHistory = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <FeatureHeader
        title="Upload Ideb"
        subtitle="Upload data Ideb untuk nasabah"
        icon={<Upload />}
      />

      <div className="grid grid-cols-1 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Form Upload Ideb
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pilih Nasabah */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Pilih Nasabah <span className="text-red-500">*</span>
                </div>
              </label>
              <select
                value={selectedNasabah}
                onChange={(e) => setSelectedNasabah(e.target.value)}
                className="select"
                required
              >
                <option value="">Pilih Nasabah</option>
                <option value="Ahmad Suryanto">Ahmad Suryanto</option>
                <option value="Budi Santoso">Budi Santoso</option>
                <option value="Citra Dewi">Citra Dewi</option>
              </select>
            </div>

            {/* Input Bulan dan Tahun */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Bulan <span className="text-red-500">*</span>
                  </div>
                </label>
                <select
                  value={bulan}
                  onChange={(e) => setBulan(e.target.value)}
                  className="select"
                  required
                >
                  <option value="">Pilih Bulan</option>
                  {[
                    "Januari",
                    "Februari",
                    "Maret",
                    "April",
                    "Mei",
                    "Juni",
                    "Juli",
                    "Agustus",
                    "September",
                    "Oktober",
                    "November",
                    "Desember",
                  ].map((m, i) => (
                    <option key={i} value={String(i + 1).padStart(2, "0")}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Tahun <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="number"
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                  placeholder="2024"
                  min="2020"
                  max="2030"
                  className="input"
                  required
                />
              </div>
            </div>

            {/* Upload Ideb */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Upload Ideb <span className="text-red-500">*</span>
                </div>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.xlsx,.xls"
                  className="hidden"
                  id="file-upload"
                  required
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 block mb-1">
                      {file ? file.name : "Klik untuk upload file"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Format: PDF, Excel (.xlsx, .xls) - Max 10MB
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              <Upload className="w-5 h-5" />
              Upload Ideb
            </button>
          </form>
        </div>

        {/* Ringkasan Hasil Ideb */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <List className="w-5 h-5 text-primary" />
              Ringkasan Hasil Ideb
            </h2>
            {history.length > 0 && (
              <button className="btn btn-export-excel btn-sm">
                <Download className="w-4 h-4" />
                Export Excel
              </button>
            )}
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
                    Nasabah
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Periode
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    File
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
                    <td className="px-4 py-3 text-sm font-medium">
                      {item.nasabah}
                    </td>
                    <td className="px-4 py-3 text-sm">{item.periode}</td>
                    <td className="px-4 py-3 text-sm text-primary">
                      {item.fileName}
                    </td>
                    <td className="px-4 py-3 text-sm">{item.user}</td>
                  </tr>
                ))}
                {paginatedHistory.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Belum ada data Ideb yang diupload</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, history.length)} dari{" "}
                {history.length}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm border ${
                        currentPage === page
                          ? "text-white border-transparent"
                          : "border-gray-200 hover:bg-gray-100"
                      }`}
                      style={
                        currentPage === page
                          ? {
                              background:
                                "linear-gradient(135deg, #157ec3 0%, #0d5a8f 100%)",
                            }
                          : undefined
                      }
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
