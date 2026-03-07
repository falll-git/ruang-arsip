"use client";

import { useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Scale,
  SearchX,
  Shield,
  type LucideIcon,
} from "lucide-react";

import DetailModal, {
  DetailRow,
  DetailSection,
} from "@/components/marketing/DetailModal";
import DocumentViewButton from "@/components/manajemen-surat/DocumentViewButton";
import { useDocumentPreviewContext } from "@/components/ui/DocumentPreviewContext";
import {
  getPihakKetigaByKategori,
  pihakKetigaSummary,
} from "@/lib/data";
import type { PihakKetiga, PihakKetigaKategori } from "@/lib/types";

const kategoriMeta: Record<
  PihakKetigaKategori,
  { icon: LucideIcon; label: string }
> = {
  NOTARIS: { icon: Scale, label: "Notaris" },
  ASURANSI: { icon: Shield, label: "Asuransi" },
  KJPP: { icon: Building2, label: "KJPP" },
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatShortDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = parsed.getFullYear();

  return `${day}-${month}-${year}`;
}

function ExpiredValue({ value }: { value: number }) {
  return (
    <span
      className={
        value > 0 ? "font-semibold text-red-600" : "font-semibold text-gray-400"
      }
    >
      {formatNumber(value)}
    </span>
  );
}

function UserBadge({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "-";

  return (
    <div className="inline-flex items-center gap-2.5">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
        {initial}
      </span>
      <span className="text-sm font-bold uppercase tracking-wide text-gray-700">
        {name}
      </span>
    </div>
  );
}

export default function PihakKetigaOverview({
  selectedKategori,
  onKategoriChange,
}: {
  selectedKategori: PihakKetigaKategori | null;
  onKategoriChange: (kategori: PihakKetigaKategori | null) => void;
}) {
  const { openPreview } = useDocumentPreviewContext();
  const [selectedItem, setSelectedItem] = useState<PihakKetiga | null>(null);
  const tableSectionRef = useRef<HTMLDivElement | null>(null);

  const selectedSummary =
    selectedKategori
      ? pihakKetigaSummary.find((item) => item.kategori === selectedKategori) ??
        null
      : null;
  const selectedItems = selectedKategori
    ? getPihakKetigaByKategori(selectedKategori)
    : [];
  const selectedMeta = selectedKategori ? kategoriMeta[selectedKategori] : null;
  const handleCardClick = (kategori: PihakKetigaKategori) => {
    setSelectedItem(null);
    onKategoriChange(selectedKategori === kategori ? null : kategori);
    tableSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {pihakKetigaSummary.map((item, index) => {
          const meta = kategoriMeta[item.kategori];
          const CategoryIcon = meta.icon;

          return (
            <button
              key={item.kategori}
              type="button"
              onClick={() => handleCardClick(item.kategori)}
              className={`group animate-slide-up rounded-2xl border bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                selectedKategori === item.kategori
                  ? "border-2 border-gray-900"
                  : "border-gray-100"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6 flex items-start gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-110"
                    style={{
                      background:
                        "linear-gradient(135deg, #157ec3 0%, #0d5a8f 100%)",
                    }}
                  >
                    <CategoryIcon
                      className="h-7 w-7 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-gray-900">
                      {meta.label}
                    </p>
                  </div>
                </div>

                <div className="flex w-[118px] shrink-0 flex-col items-end text-right">
                  <span className="mb-1 text-xs font-semibold uppercase leading-tight tracking-wider text-gray-400">
                    Total Pihak Ketiga
                  </span>
                  <span className="text-2xl font-bold tabular-nums text-gray-800">
                    {formatNumber(item.jumlahPihakKetiga)}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Activity className="h-4 w-4" aria-hidden="true" />
                    Proses Berjalan
                  </span>
                  <span className="font-semibold text-gray-800">
                    {formatNumber(item.prosesBerjalan)}
                  </span>
                </div>
                <div className="my-3 h-px w-full bg-gray-200" />
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="flex items-center gap-2 text-gray-500">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Laporan Selesai
                  </span>
                  <span className="font-semibold text-emerald-600">
                    {formatNumber(item.laporanSelesai)}
                  </span>
                </div>
                <div className="my-3 h-px w-full bg-gray-200" />
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="flex items-center gap-2 text-gray-500">
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    Lewat Expired
                  </span>
                  <ExpiredValue value={item.lewatExpired} />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between font-medium text-primary-600 transition-transform group-hover:translate-x-1">
                <span className="text-sm">Lihat Nasabah</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </div>
            </button>
          );
        })}
      </div>

      <div ref={tableSectionRef} className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedMeta ? `Data ${selectedMeta.label}` : "Data Pihak Ketiga"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {selectedSummary
              ? `${formatNumber(selectedSummary.jumlahPihakKetiga)} data ${selectedMeta?.label?.toLowerCase()} tersedia. Double click pada baris untuk melihat detail.`
              : "Pilih salah satu kategori untuk melihat daftar laporan pihak ketiga."}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {selectedSummary ? (
            selectedItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Kode
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Jenis Dok
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Nama Dok
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Detail
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Tgl Input
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        User
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedItems.map((item, index) => (
                      <tr
                        key={item.id}
                        onDoubleClick={() => setSelectedItem(item)}
                        className="cursor-pointer transition-colors hover:bg-gray-50"
                        title={`Double click untuk detail ${item.nama}`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex min-w-[88px] justify-center rounded-[10px] border border-gray-800 px-2.5 py-1 font-mono text-xs font-medium text-gray-900">
                            {item.kodeDokumen}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                          {item.jenisDokumen}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                          {item.namaDokumen}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item.detailDokumen}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatShortDate(item.tanggalInput)}
                        </td>
                        <td className="px-6 py-4">
                          <UserBadge name={item.userInput} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                  <SearchX className="h-8 w-8" aria-hidden="true" />
                </div>
                <p className="text-lg font-medium text-gray-600">
                  Tidak ada data pihak ketiga untuk kategori ini
                </p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                <SearchX className="h-8 w-8" aria-hidden="true" />
              </div>
              <p className="text-lg font-medium text-gray-900">
                Pilih kategori pihak ketiga
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Klik salah satu kartu di atas untuk menampilkan data detail.
              </p>
            </div>
          )}
        </div>
      </div>

      <DetailModal
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        title="Detail Pihak Ketiga"
      >
        {selectedItem ? (
          <div className="space-y-6">
            <DetailSection title="Informasi Dokumen">
              <DetailRow label="ID" value={selectedItem.id} />
              <DetailRow label="Kode Dokumen" value={selectedItem.kodeDokumen} />
              <DetailRow label="Nama Pihak Ketiga" value={selectedItem.nama} />
              <DetailRow
                label="Kategori"
                value={kategoriMeta[selectedItem.kategori].label}
              />
              <DetailRow
                label="Jenis Dokumen"
                value={selectedItem.jenisDokumen}
              />
              <DetailRow label="Nama Dokumen" value={selectedItem.namaDokumen} />
              <DetailRow
                label="Detail Dokumen"
                value={selectedItem.detailDokumen}
              />
              <DetailRow
                label="Tanggal Input"
                value={formatShortDate(selectedItem.tanggalInput)}
              />
              <DetailRow label="User Input" value={selectedItem.userInput} />
            </DetailSection>

            <DetailSection title="Status Laporan">
              <DetailRow
                label="Proses Berjalan"
                value={formatNumber(selectedItem.prosesBerjalan)}
              />
              <DetailRow
                label="Laporan Selesai"
                value={
                  <span className="font-semibold text-emerald-600">
                    {formatNumber(selectedItem.laporanSelesai)}
                  </span>
                }
              />
              <DetailRow
                label="Lewat Expired"
                value={<ExpiredValue value={selectedItem.lewatExpired} />}
              />
            </DetailSection>

            {selectedItem.fileUrl ? (
              <DetailSection title="Lampiran">
                <DetailRow
                  label="Dokumen"
                  value={
                    <DocumentViewButton
                      onClick={() =>
                        openPreview(
                          selectedItem.fileUrl!,
                          selectedItem.namaDokumen,
                          selectedItem.fileType ?? "pdf",
                        )
                      }
                      title="View dokumen"
                    />
                  }
                />
              </DetailSection>
            ) : null}
          </div>
        ) : null}
      </DetailModal>
    </>
  );
}
