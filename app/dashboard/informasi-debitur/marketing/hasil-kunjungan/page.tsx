"use client";

import { useState, useEffect } from "react";
import { Eye, Plus, UploadCloud, X } from "lucide-react";
import {
  dummyDebiturList,
  dummyHasilKunjungan,
  formatCurrency,
  getKolektibilitasColor,
} from "@/lib/data";
import type { HasilKunjungan } from "@/lib/types/modul3";
import { useAppToast } from "@/components/ui/AppToastProvider";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { useDocumentPreviewContext } from "@/components/ui/DocumentPreviewContext";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { formatDateDisplay } from "@/lib/utils/date";

export default function HasilKunjunganPage() {
  const { openPreview } = useDocumentPreviewContext();
  const [data, setData] = useState<HasilKunjungan[]>([...dummyHasilKunjungan]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDebitur, setSelectedDebitur] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    tanggalKunjungan: "",
    hasilKunjungan: "",
    kesimpulan: "",
  });
  const { showToast } = useAppToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setDragOver(false);
    setFile(null);
  };

  const getAttachmentType = (nextFile: File): "pdf" | "image" => {
    const name = nextFile.name.toLowerCase();
    if (nextFile.type === "application/pdf" || name.endsWith(".pdf"))
      return "pdf";
    return "image";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const nextFile = e.target.files[0];
    if (nextFile.size > 10 * 1024 * 1024) {
      showToast("Ukuran file maksimal 10MB", "error");
      return;
    }
    setFile(nextFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!e.dataTransfer.files || !e.dataTransfer.files[0]) return;

    const nextFile = e.dataTransfer.files[0];
    if (nextFile.size > 10 * 1024 * 1024) {
      showToast("Ukuran file maksimal 10MB", "error");
      return;
    }
    setFile(nextFile);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedDebitur ||
      !form.tanggalKunjungan ||
      !form.hasilKunjungan ||
      !form.kesimpulan
    ) {
      showToast("Semua field harus diisi!", "error");
      return;
    }

    const fotoKunjungan = file ? URL.createObjectURL(file) : undefined;
    const fotoKunjunganTipe = file ? getAttachmentType(file) : undefined;
    const fotoKunjunganNama = file ? file.name : undefined;

    const newItem: HasilKunjungan = {
      id: `HKJ${Date.now()}`,
      debiturId: selectedDebitur,
      tanggalKunjungan: form.tanggalKunjungan,
      hasilKunjungan: form.hasilKunjungan,
      kesimpulan: form.kesimpulan,
      fotoKunjungan,
      fotoKunjunganNama,
      fotoKunjunganTipe,
      createdBy: "User",
    };

    setData([newItem, ...data]);
    setIsModalOpen(false);
    setForm({ tanggalKunjungan: "", hasilKunjungan: "", kesimpulan: "" });
    setSelectedDebitur("");
    setFile(null);
    showToast("Hasil kunjungan berhasil ditambahkan!", "success");
  };

  const getDebiturName = (id: string) => {
    const debitur = dummyDebiturList.find((d) => d.id === id);
    return debitur ? debitur.namaNasabah : id;
  };

  const getDebiturKol = (id: string) => {
    const debitur = dummyDebiturList.find((d) => d.id === id);
    return debitur?.kolektibilitas || "1";
  };

  const KolBadge = ({ kol }: { kol: string }) => {
    const color = getKolektibilitasColor(kol);
    return (
      <span className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-900">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        Kol {kol}
      </span>
    );
  };

  const normalizeFileUrl = (filePath: string) => {
    if (/^https?:\/\//i.test(filePath)) return filePath;
    if (/^(blob:|data:)/i.test(filePath)) return filePath;
    if (filePath.startsWith("/")) {
      return filePath.startsWith("/documents/")
        ? filePath
        : `/documents${filePath}`;
    }
    return filePath.startsWith("documents/")
      ? `/${filePath}`
      : `/documents/${filePath}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="bg-white rounded-xl p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FeatureHeader
        title="Hasil Kunjungan"
        subtitle="Dokumentasi hasil kunjungan ke nasabah"
        icon={<Eye />}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            title="Tambah Hasil Kunjungan"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Tambah Hasil Kunjungan
          </button>
        }
      />

      <div className="space-y-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-5 border border-gray-100"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {getDebiturName(item.debiturId)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateDisplay(item.tanggalKunjungan)}
                  </p>
                  <div className="mt-2">
                    <KolBadge kol={getDebiturKol(item.debiturId)} />
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-400">by {item.createdBy}</span>
            </div>
            <p className="text-gray-700 text-sm mb-3">{item.hasilKunjungan}</p>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-700 mb-1">
                Kesimpulan:
              </p>
              <p className="text-sm text-blue-900">{item.kesimpulan}</p>
            </div>
            {item.fotoKunjungan && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    openPreview(
                      normalizeFileUrl(item.fotoKunjungan!),
                      `Lampiran Kunjungan - ${getDebiturName(item.debiturId)}${item.fotoKunjunganNama ? ` (${item.fotoKunjunganNama})` : ""}`,
                      item.fotoKunjunganTipe ??
                        (item.fotoKunjungan!.toLowerCase().endsWith(".pdf")
                          ? "pdf"
                          : "image"),
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#157ec3] hover:bg-[#0d5a8f] transition-colors"
                >
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  Lihat Lampiran
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          data-dashboard-overlay="true"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Tambah Hasil Kunjungan
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pilih Debitur
                </label>
                <select
                  value={selectedDebitur}
                  onChange={(e) => setSelectedDebitur(e.target.value)}
                  className="select"
                  required
                >
                  <option value="">-- Pilih Debitur --</option>
                  {dummyDebiturList
                    .filter((d) => parseInt(d.kolektibilitas) >= 2)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.namaNasabah} - Kol {d.kolektibilitas} (
                        {formatCurrency(d.osPokok)})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Kunjungan
                </label>
                <DatePickerInput
                  value={form.tanggalKunjungan}
                  onChange={(nextValue) =>
                    setForm((prev) => ({
                      ...prev,
                      tanggalKunjungan: nextValue,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hasil Kunjungan
                </label>
                <textarea
                  value={form.hasilKunjungan}
                  onChange={(e) =>
                    setForm({ ...form, hasilKunjungan: e.target.value })
                  }
                  rows={3}
                  className="textarea resize-none"
                  placeholder="Jelaskan hasil kunjungan..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kesimpulan
                </label>
                <textarea
                  value={form.kesimpulan}
                  onChange={(e) =>
                    setForm({ ...form, kesimpulan: e.target.value })
                  }
                  rows={2}
                  className="textarea resize-none"
                  placeholder="Kesimpulan dari kunjungan..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Lampiran (Opsional)
                </label>
                <div
                  className={`file-upload ${dragOver ? "dragover" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() =>
                    document.getElementById("fileLampiranKunjungan")?.click()
                  }
                >
                  <input
                    id="fileLampiranKunjungan"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <div className="flex flex-col items-center">
                    <UploadCloud
                      className="w-10 h-10 text-[#157ec3] mb-2"
                      aria-hidden="true"
                    />
                    {file ? (
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">
                          Klik atau drag & drop file di sini
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, JPG, PNG (Maks. 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90"
                  style={{ backgroundColor: "#157ec3" }}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
