"use client";

import { useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function UploadPembiayaanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus("idle");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate upload
    setTimeout(() => {
      setUploadStatus("success");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #157ec3 0%, #0d5a8f 100%)",
            }}
          >
            <Upload className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Upload Data Pembiayaan
            </h2>
            <p className="text-sm text-gray-600">
              Upload data pembiayaan dalam format Excel
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Data Pembiayaan
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#157ec3] transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".xlsx,.xls"
                className="hidden"
                id="pembiayaan-upload"
              />
              <label
                htmlFor="pembiayaan-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <FileSpreadsheet className="w-12 h-12 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-600 block mb-1">
                    {file ? file.name : "Klik untuk upload file Excel"}
                  </span>
                  <span className="text-xs text-gray-500">
                    Format: Excel (.xlsx, .xls) - Max 10MB
                  </span>
                </div>
              </label>
            </div>
          </div>

          {uploadStatus === "success" && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Upload Berhasil!
                </p>
                <p className="text-xs text-green-600">
                  Data pembiayaan berhasil diupload dan diproses
                </p>
              </div>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Upload Gagal!
                </p>
                <p className="text-xs text-red-600">
                  Terjadi kesalahan saat mengupload file
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!file}
            className="w-full px-6 py-3 bg-[#157ec3] text-white rounded-lg hover:bg-[#0d5a8f] transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Upload Data Pembiayaan
          </button>
        </form>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3">
          Informasi Upload Data
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>File harus dalam format Excel (.xlsx atau .xls)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Maksimal ukuran file 10MB</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>
              Pastikan format data sesuai dengan template yang telah ditentukan
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Data yang diupload akan menggantikan data sebelumnya</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
