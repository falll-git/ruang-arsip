"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  FileText,
  UploadCloud,
  User,
  Building2,
  Send,
} from "lucide-react";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { useAppToast } from "@/components/ui/AppToastProvider";
import { dummyDivisiList, dummySuratUsers } from "@/lib/data";
import FeatureHeader from "@/components/ui/FeatureHeader";
import UiverseCheckbox from "@/components/ui/UiverseCheckbox";

export default function InputMemorandumPage() {
  const { showToast } = useAppToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    noMemo: "",
    perihalMemo: "",
    tanggalMemo: "",
    divisiPengirim: "",
    pembuatMemo: "",
    keteranganMemo: "",
  });

  const [selectedPenerimaTipe, setSelectedPenerimaTipe] = useState<
    "divisi" | "perorangan"
  >("perorangan");
  const [selectedDivisi, setSelectedDivisi] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
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

  const handleDivisiToggle = (divisi: string) => {
    setSelectedDivisi((prev) =>
      prev.includes(divisi)
        ? prev.filter((d) => d !== divisi)
        : [...prev, divisi],
    );
  };

  const handleUserToggle = (userId: number) => {
    setSelectedUsers((prev) =>
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isPenerimaTerpilih =
      selectedPenerimaTipe === "divisi"
        ? selectedDivisi.length > 0
        : selectedUsers.length > 0;

    if (!isPenerimaTerpilih) {
      showToast("Pilih minimal 1 penerima memo!", "error");
      return;
    }

    if (
      !formData.noMemo ||
      !formData.perihalMemo ||
      !formData.tanggalMemo ||
      !formData.divisiPengirim ||
      !formData.pembuatMemo
    ) {
      showToast("Lengkapi semua field memorandum!", "error");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("Memorandum berhasil disimpan!", "success");
      setFormData({
        noMemo: "",
        perihalMemo: "",
        tanggalMemo: "",
        divisiPengirim: "",
        pembuatMemo: "",
        keteranganMemo: "",
      });
      setSelectedDivisi([]);
      setSelectedUsers([]);
      setFile(null);
      setSelectedPenerimaTipe("perorangan");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      noMemo: "",
      perihalMemo: "",
      tanggalMemo: "",
      divisiPengirim: "",
      pembuatMemo: "",
      keteranganMemo: "",
    });
    setSelectedDivisi([]);
    setSelectedUsers([]);
    setFile(null);
    setSelectedPenerimaTipe("perorangan");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isPenerimaTerpilih =
    selectedPenerimaTipe === "divisi"
      ? selectedDivisi.length > 0
      : selectedUsers.length > 0;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      <FeatureHeader
        title="Input Memorandum"
        subtitle="Buat dan distribusikan memorandum internal"
        icon={<FileText />}
      />

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="divisiPengirim"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Divisi Pengirim <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2
                  className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <select
                  id="divisiPengirim"
                  name="divisiPengirim"
                  value={formData.divisiPengirim}
                  onChange={handleChange}
                  required
                  className="select pl-10"
                >
                  <option value="">Pilih Divisi</option>
                  {dummyDivisiList.map((divisi) => (
                    <option key={divisi} value={divisi}>
                      {divisi}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="noMemo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                No Memo <span className="text-red-500">*</span>
              </label>
              <input
                id="noMemo"
                type="text"
                name="noMemo"
                value={formData.noMemo}
                onChange={handleChange}
                required
                className="input font-mono"
                placeholder="Contoh: MEMO/001/HRD/2026"
              />
            </div>

            <div>
              <label
                htmlFor="tanggalMemo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tanggal Memo <span className="text-red-500">*</span>
              </label>
              <DatePickerInput
                value={formData.tanggalMemo}
                onChange={(nextValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    tanggalMemo: nextValue,
                  }))
                }
              />
            </div>

            <div>
              <label
                htmlFor="pembuatMemo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Pembuat Memo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="pembuatMemo"
                  type="text"
                  name="pembuatMemo"
                  value={formData.pembuatMemo}
                  onChange={handleChange}
                  required
                  className="input input-with-icon"
                  placeholder="Nama pembuat memo"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="perihalMemo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Perihal Memo <span className="text-red-500">*</span>
            </label>
            <input
              id="perihalMemo"
              type="text"
              name="perihalMemo"
              value={formData.perihalMemo}
              onChange={handleChange}
              required
              className="input"
              placeholder="Contoh: Evaluasi Kinerja Karyawan"
            />
          </div>

          <div>
            <label
              htmlFor="keteranganMemo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Keterangan Memo <span className="text-red-500">*</span>
            </label>
            <textarea
              id="keteranganMemo"
              name="keteranganMemo"
              value={formData.keteranganMemo}
              onChange={handleChange}
              required
              rows={4}
              className="textarea"
              placeholder="Jelaskan detail memorandum secara lengkap..."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Memo
              </label>
              <div
                className={["file-upload", dragOver ? "dragover" : ""]
                  .filter(Boolean)
                  .join(" ")}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-3 text-primary-700 mx-auto">
                  <UploadCloud className="w-7 h-7" aria-hidden="true" />
                </div>
                {file ? (
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      <span className="text-primary-700 font-semibold">
                        Klik untuk upload
                      </span>{" "}
                      atau drag & drop
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      PDF, DOC, atau gambar (maks 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Penerima Memo <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPenerimaTipe("perorangan");
                    setSelectedDivisi([]);
                  }}
                  className={[
                    "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                    selectedPenerimaTipe === "perorangan"
                      ? "bg-white text-primary-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700",
                  ].join(" ")}
                >
                  Per User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPenerimaTipe("divisi");
                    setSelectedUsers([]);
                  }}
                  className={[
                    "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                    selectedPenerimaTipe === "divisi"
                      ? "bg-white text-primary-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700",
                  ].join(" ")}
                >
                  Per Divisi
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                {selectedPenerimaTipe === "perorangan"
                  ? dummySuratUsers.map((user) => {
                      const selected = selectedUsers.includes(user.id);
                      return (
                        <UiverseCheckbox
                          key={user.id}
                          checked={selected}
                          onCheckedChange={() => handleUserToggle(user.id)}
                          ariaLabel={`Pilih penerima ${user.nama}`}
                          className={[
                            "uiverse-checkbox--block p-3 rounded-lg border transition-all",
                            selected
                              ? "border-primary-300 bg-primary-50 shadow-sm"
                              : "border-slate-200 hover:border-primary-200 hover:bg-slate-50",
                          ].join(" ")}
                          label={
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm font-semibold text-gray-800 truncate">
                                {user.nama}
                              </span>
                              <span className="block text-xs text-gray-500 truncate">
                                {user.divisi}
                              </span>
                            </span>
                          }
                        />
                      );
                    })
                  : dummyDivisiList.map((divisi) => {
                      const selected = selectedDivisi.includes(divisi);
                      return (
                        <UiverseCheckbox
                          key={divisi}
                          checked={selected}
                          onCheckedChange={() => handleDivisiToggle(divisi)}
                          ariaLabel={`Pilih divisi ${divisi}`}
                          className={[
                            "uiverse-checkbox--block p-3 rounded-lg border transition-all",
                            selected
                              ? "border-primary-300 bg-primary-50 shadow-sm"
                              : "border-slate-200 hover:border-primary-200 hover:bg-slate-50",
                          ].join(" ")}
                          label={
                            <span className="block text-sm font-semibold text-gray-800">
                              {divisi}
                            </span>
                          }
                        />
                      );
                    })}
              </div>

              {!isPenerimaTerpilih && (
                <div className="flex items-center gap-2 mt-3 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                  <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  Wajib memilih minimal satu penerima.
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="btn btn-outline"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isLoading || !isPenerimaTerpilih}
              className="btn btn-primary"
            >
              {isLoading ? (
                <>
                  <div
                    className="button-spinner"
                    style={
                      {
                        ["--spinner-size"]: "18px",
                        ["--spinner-border"]: "2px",
                      } as React.CSSProperties
                    }
                    aria-hidden="true"
                  />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Simpan Memorandum</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
