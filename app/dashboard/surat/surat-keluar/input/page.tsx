"use client";

import { useState } from "react";
import { AlertCircle, Send, UploadCloud, User } from "lucide-react";
import FeatureHeader from "@/components/ui/FeatureHeader";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { useAppToast } from "@/components/ui/AppToastProvider";
import UiverseCheckbox from "@/components/ui/UiverseCheckbox";
import { dummySuratUsers } from "@/lib/data";

export default function InputSuratKeluarPage() {
  const { showToast } = useAppToast();
  const [formData, setFormData] = useState({
    namaPenerima: "",
    alamatPenerima: "",
    namaSurat: "",
    perihalSurat: "",
    tanggalPengiriman: "",
    mediaPengiriman: "",
    sifatSurat: "",
  });
  const [selectedDisposisi, setSelectedDisposisi] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDisposisiToggle = (userId: number) => {
    setSelectedDisposisi((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tanggalPengiriman) {
      showToast("Tanggal pengiriman wajib diisi!", "error");
      return;
    }

    if (selectedDisposisi.length === 0) {
      showToast("Wajib memilih minimal satu tujuan disposisi.", "error");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showToast("Surat keluar berhasil disimpan!", "success");
      setFormData({
        namaPenerima: "",
        alamatPenerima: "",
        namaSurat: "",
        perihalSurat: "",
        tanggalPengiriman: "",
        mediaPengiriman: "",
        sifatSurat: "",
      });
      setSelectedDisposisi([]);
      setFile(null);
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      namaPenerima: "",
      alamatPenerima: "",
      namaSurat: "",
      perihalSurat: "",
      tanggalPengiriman: "",
      mediaPengiriman: "",
      sifatSurat: "",
    });
    setSelectedDisposisi([]);
    setFile(null);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <FeatureHeader
        title="Input Surat Keluar"
        subtitle="Catat dan arsipkan surat keluar yang dikirim."
        icon={<Send />}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50/50 border-b border-gray-200 px-8 py-4">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-500" />
            Detail Pengiriman
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label
                  htmlFor="namaPenerima"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nama Penerima <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="namaPenerima"
                    type="text"
                    name="namaPenerima"
                    value={formData.namaPenerima}
                    onChange={handleChange}
                    className="input input-with-icon"
                    placeholder="Contoh: PT Mitra Solusi"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="tanggalPengiriman"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tanggal Pengiriman <span className="text-red-500">*</span>
                </label>
                <DatePickerInput
                  value={formData.tanggalPengiriman}
                  onChange={(nextValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      tanggalPengiriman: nextValue,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="alamatPenerima"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Alamat Penerima <span className="text-red-500">*</span>
              </label>
              <textarea
                id="alamatPenerima"
                name="alamatPenerima"
                value={formData.alamatPenerima}
                onChange={handleChange}
                rows={2}
                className="textarea resize-none"
                placeholder="Alamat lengkap penerima..."
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-100" />

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label
                  htmlFor="namaSurat"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nama/Nomor Surat <span className="text-red-500">*</span>
                </label>
                <input
                  id="namaSurat"
                  type="text"
                  name="namaSurat"
                  value={formData.namaSurat}
                  onChange={handleChange}
                  className="input"
                  placeholder="Contoh: 005/OUT/2023"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="mediaPengiriman"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Media Pengiriman <span className="text-red-500">*</span>
                </label>
                <select
                  id="mediaPengiriman"
                  name="mediaPengiriman"
                  value={formData.mediaPengiriman}
                  onChange={handleChange}
                  className="select"
                  required
                >
                  <option value="">Pilih Media</option>
                  <option value="Email">Email</option>
                  <option value="Kurir">Kurir</option>
                  <option value="Langsung">Langsung / Tangan</option>
                  <option value="Pos">Pos</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label
                  htmlFor="perihalSurat"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Perihal Surat <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="perihalSurat"
                  name="perihalSurat"
                  value={formData.perihalSurat}
                  onChange={handleChange}
                  rows={3}
                  className="textarea resize-none"
                  placeholder="Ringkasan isi surat..."
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="sifatSurat"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Sifat Surat <span className="text-red-500">*</span>
                </label>
                <select
                  id="sifatSurat"
                  name="sifatSurat"
                  value={formData.sifatSurat}
                  onChange={handleChange}
                  className="select"
                  required
                >
                  <option value="">Pilih Sifat Surat</option>
                  <option value="Biasa">Biasa</option>
                  <option value="Rahasia">Rahasia</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload File Arsip <span className="text-red-500">*</span>
              </label>
              <div
                className={[
                  "file-upload",
                  "flex flex-col items-center justify-center",
                  dragOver ? "dragover" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onClick={() =>
                  document.getElementById("file-input-keluar")?.click()
                }
              >
                <input
                  id="file-input-keluar"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                  <UploadCloud className="w-8 h-8" />
                </div>
                {file ? (
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      <span className="text-primary-600 font-bold">
                        Klik untuk upload
                      </span>{" "}
                      atau drag & drop
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      PDF, DOC, Gambar (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Disposisi Kepada <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {dummySuratUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleDisposisiToggle(user.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center gap-3
                           ${
                             selectedDisposisi.includes(user.id)
                               ? "border-primary-500 bg-primary-50 shadow-sm"
                               : "border-gray-200 hover:border-primary-200 hover:bg-gray-50"
                           }
                        `}
                  >
                    <div onClick={(event) => event.stopPropagation()}>
                      <UiverseCheckbox
                        checked={selectedDisposisi.includes(user.id)}
                        onCheckedChange={() => handleDisposisiToggle(user.id)}
                        ariaLabel={`Pilih disposisi ${user.nama}`}
                        size={20}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-700">
                        {user.nama}
                      </p>
                      <p className="text-xs text-gray-500">{user.divisi}</p>
                    </div>
                  </div>
                ))}
              </div>
              {selectedDisposisi.length === 0 && (
                <div className="flex items-center gap-2 mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  Wajib memilih minimal satu tujuan disposisi.
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isLoading || selectedDisposisi.length === 0}
              className="btn btn-primary"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Simpan Surat Keluar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
