"use client";

import { useState } from "react";
import { Upload, FileText, Calendar, User, List } from "lucide-react";

export default function UploadIdebPage() {
  const [selectedNasabah, setSelectedNasabah] = useState("");
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle upload logic here
    console.log({ selectedNasabah, bulan, tahun, file });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            }}
          >
            <Upload className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Upload Ideb</h2>
            <p className="text-sm text-gray-600">
              Upload data Ideb untuk nasabah
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pilih Nasabah */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Pilih Nasabah
              </div>
            </label>
            <select
              value={selectedNasabah}
              onChange={(e) => setSelectedNasabah(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
              required
            >
              <option value="">Pilih Nasabah</option>
              <option value="nasabah1">Nasabah 1</option>
              <option value="nasabah2">Nasabah 2</option>
              <option value="nasabah3">Nasabah 3</option>
            </select>
          </div>

          {/* Input Bulan dan Tahun */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Bulan
                </div>
              </label>
              <select
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tahun
                </div>
              </label>
              <input
                type="number"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                placeholder="2024"
                min="2020"
                max="2030"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Upload Ideb */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Upload Ideb
              </div>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#f59e0b] transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.xlsx,.xls"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {file ? file.name : "Klik untuk upload file"}
                </span>
                <span className="text-xs text-gray-500">
                  Format: PDF, Excel (.xlsx, .xls)
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-[#f59e0b] text-white rounded-lg hover:bg-[#d97706] transition-colors font-semibold"
          >
            Upload Ideb
          </button>
        </form>
      </div>

      {/* Ringkasan Hasil Ideb */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            }}
          >
            <List className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            Ringkasan Hasil Ideb
          </h3>
        </div>

        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Belum ada data Ideb yang diupload</p>
        </div>
      </div>
    </div>
  );
}
