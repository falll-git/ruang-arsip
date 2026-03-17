"use client";

import { useState } from "react";
import DatePickerInput from "@/components/ui/DatePickerInput";

type TenggatWaktuPayload = {
  tenggatWaktu?: string;
  keteranganTenggat?: string;
};

type TenggatWaktuModalProps = {
  isOpen: boolean;
  onSave: (payload: TenggatWaktuPayload) => void;
  onSkip: () => void;
  disposisi: string[];
};

type TenggatWaktuModalContentProps = Omit<TenggatWaktuModalProps, "isOpen">;

function TenggatWaktuModalContent({
  onSave,
  onSkip,
  disposisi,
}: TenggatWaktuModalContentProps) {
  const [tenggatWaktu, setTenggatWaktu] = useState("");
  const [keteranganTenggat, setKeteranganTenggat] = useState("");

  const handleSave = () => {
    const trimmedKeterangan = keteranganTenggat.trim();
    if (tenggatWaktu) {
      console.log({
        action: "NOTIF_WA_TENGGAT",
        tenggatWaktu,
        keterangan: trimmedKeterangan,
        disposisi,
      });
    }

    onSave({
      tenggatWaktu: tenggatWaktu || undefined,
      keteranganTenggat: trimmedKeterangan || undefined,
    });
  };

  return (
    <div
      data-dashboard-overlay="true"
      className="fixed inset-0 z-60 flex items-center justify-center animate-fade-in"
    >
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onSkip}
        aria-hidden="true"
      />
      <div
        className="relative mx-4 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-gray-100 bg-gray-50/70 px-7 py-5">
          <h3 className="text-xl font-bold text-gray-900">
            Tenggat Waktu & Keterangan
          </h3>
          <p className="mt-1 text-sm text-gray-500 leading-relaxed">
            Opsional &mdash; dapat dilewati
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSave();
          }}
          className="space-y-5 p-7"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Tenggat Waktu
            </label>
            <DatePickerInput
              value={tenggatWaktu}
              onChange={setTenggatWaktu}
              placeholder="Pilih tanggal..."
            />
            {tenggatWaktu ? (
              <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-600 leading-relaxed">
                Notifikasi WA akan dikirim ke penerima disposisi
                <br />
                sejak surat dikirim hingga tenggat waktu berakhir.
              </div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keterangan
            </label>
            <textarea
              rows={3}
              className="textarea resize-none"
              placeholder="Tambahkan keterangan atau catatan tindak lanjut..."
              value={keteranganTenggat}
              onChange={(event) => setKeteranganTenggat(event.target.value)}
            />
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-5">
            <button type="button" onClick={onSkip} className="btn btn-outline">
              Lewati
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TenggatWaktuModal({
  isOpen,
  onSave,
  onSkip,
  disposisi,
}: TenggatWaktuModalProps) {
  if (!isOpen) return null;

  return (
    <TenggatWaktuModalContent
      onSave={onSave}
      onSkip={onSkip}
      disposisi={disposisi}
    />
  );
}
