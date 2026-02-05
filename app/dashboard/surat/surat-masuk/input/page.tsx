"use client";

import { useState } from "react";
import { MailOpen, UploadCloud, Building2, FileText, Send } from "lucide-react";
import FeatureHeader from "@/components/ui/FeatureHeader";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { useAppToast } from "@/components/ui/AppToastProvider";
import UiverseCheckbox from "@/components/ui/UiverseCheckbox";
import { dummySuratUsers } from "@/lib/data";

export default function InputSuratMasukPage() {
  const { showToast } = useAppToast();
  const [formData, setFormData] = useState({
    namaPengirim: "",
    alamatPengirim: "",
    namaSurat: "",
    perihalSurat: "",
    tanggalPenerimaan: "",
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
    if (!formData.tanggalPenerimaan) {
      showToast("Tanggal penerimaan wajib diisi!", "error");
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showToast("Surat masuk berhasil disimpan!", "success");
      setFormData({
        namaPengirim: "",
        alamatPengirim: "",
        namaSurat: "",
        perihalSurat: "",
        tanggalPenerimaan: "",
        sifatSurat: "",
      });
      setSelectedDisposisi([]);
      setFile(null);
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      namaPengirim: "",
      alamatPengirim: "",
      namaSurat: "",
      perihalSurat: "",
      tanggalPenerimaan: "",
      sifatSurat: "",
    });
    setSelectedDisposisi([]);
    setFile(null);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <FeatureHeader
        title="Input Surat Masuk"
        subtitle="Form pencatatan dan pendisposisian surat masuk."
        icon={<MailOpen />}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50/50 border-b border-gray-200 px-8 py-4">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary-500" />
            Detail Surat
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Section 1: Informasi Pengirim */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label
                  htmlFor="namaPengirim"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nama Pengirim <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="namaPengirim"
                    type="text"
                    name="namaPengirim"
                    value={formData.namaPengirim}
                    onChange={handleChange}
                    className="input input-with-icon"
                    placeholder="Contoh: PT Amanah Sejahtera"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="tanggalPenerimaan"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tanggal Penerimaan <span className="text-red-500">*</span>
                </label>
                <DatePickerInput
                  value={formData.tanggalPenerimaan}
                  onChange={(nextValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      tanggalPenerimaan: nextValue,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="alamatPengirim"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Alamat Pengirim <span className="text-red-500">*</span>
              </label>
              <textarea
                id="alamatPengirim"
                name="alamatPengirim"
                value={formData.alamatPengirim}
                onChange={handleChange}
                rows={2}
                className="textarea resize-none"
                placeholder="Alamat lengkap instansi/pengirim..."
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Section 2: Detail Surat */}
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
                  placeholder="Contoh: 001/INV/2023"
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
                placeholder="Ringkasan perihal atau isi surat..."
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Section 3: Upload & Disposisi */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload File Scan <span className="text-red-500">*</span>
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
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input
                  id="file-input"
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

          <div className="border-t border-gray-100 pt-6 flex justify-end gap-3">
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
                  Simpan Surat Masuk
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}
