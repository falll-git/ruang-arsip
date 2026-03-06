"use client";

import { useState, useEffect } from "react";
import { FileSpreadsheet, UploadCloud } from "lucide-react";
import { dummyUploadRestrik } from "@/lib/data";
import type { UploadRestrik } from "@/lib/types/modul3";
import { useAppToast } from "@/components/ui/AppToastProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { formatDateDisplay, todayIsoDate } from "@/lib/utils/date";

export default function UploadRestrikPage() {
  const [data, setData] = useState<UploadRestrik[]>([...dummyUploadRestrik]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { showToast } = useAppToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const simulateUpload = (fileName: string) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          const newItem: UploadRestrik = {
            id: `RST${Date.now()}`,
            fileName,
            uploadDate: todayIsoDate(),
            uploadBy: "Admin",
            status: "Pending",
            totalRecord: Math.floor(Math.random() * 50) + 10,
          };
          setData([newItem, ...data]);
          showToast("File berhasil diupload!", "success");
          setSelectedFile(null);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        setSelectedFile(file);
        simulateUpload(file.name);
      } else {
        showToast("Hanya file Excel (.xlsx/.xls) yang diperbolehkan", "error");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        setSelectedFile(file);
        simulateUpload(file.name);
      } else {
        showToast("Hanya file Excel (.xlsx/.xls) yang diperbolehkan", "error");
      }
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      Pending: "#f59e0b",
      Diproses: "#3b82f6",
      Selesai: "#10b981",
    };
    const color = colors[status] || "#6b7280";
    return (
      <span
        className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
        <div className="bg-white rounded-xl p-6 space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FeatureHeader
        title="Upload Data Restrik"
        subtitle="Upload file data restrukturisasi untuk update informasi debitur"
        icon={<UploadCloud />}
      />

      <div
        className={`file-upload ${dragActive ? "dragover" : ""} ${isUploading ? "pointer-events-none opacity-90" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() =>
          !isUploading &&
          document.getElementById("upload-restrik-file-input")?.click()
        }
      >
        <input
          id="upload-restrik-file-input"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex flex-col items-center">
          <UploadCloud
            className={`w-12 h-12 mb-3 ${isUploading ? "text-[#157ec3] animate-pulse" : "text-[#157ec3]"}`}
            aria-hidden="true"
          />

          {isUploading ? (
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Uploading{selectedFile ? `: ${selectedFile.name}` : "..."}
              </p>
              <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#157ec3] h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 tabular-nums">
                {uploadProgress}%
              </p>
            </div>
          ) : selectedFile ? (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Klik untuk ganti file
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Klik atau drag & drop file Excel di sini
              </p>
              <p className="text-xs text-gray-500 mt-1">
                XLSX, XLS (Maks. 10MB)
              </p>
            </div>
          )}
        </div>
      </div>

      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Riwayat Upload</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                File Name
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Tanggal Upload
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Upload By
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Total Record
              </th>
              <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet
                      className="w-5 h-5 text-green-600"
                      aria-hidden="true"
                    />
                    <span className="font-medium text-gray-900">
                      {item.fileName}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">
                  {formatDateDisplay(item.uploadDate)}
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">
                  {item.uploadBy}
                </td>
                <td className="px-5 py-4 text-sm text-gray-900 text-right font-medium">
                  {item.totalRecord}
                </td>
                <td className="px-5 py-4 text-center">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
