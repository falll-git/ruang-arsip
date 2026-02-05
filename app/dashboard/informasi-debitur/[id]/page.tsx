"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Eye,
  FileText,
  User,
  UserX,
  Wallet,
} from "lucide-react";
import {
  dummyDokumen,
  getDebiturById,
  getPengecekanBPRSByDebiturId,
  getHistorisKolektibilitasByDebiturId,
  getDokumenByDebiturId,
  getActionPlanByDebiturId,
  getHasilKunjunganByDebiturId,
  getLangkahPenangananByDebiturId,
  getSuratPeringatanByDebiturId,
  formatCurrency,
  getKolektibilitasLabel,
  getKolektibilitasColor,
} from "@/lib/data";
import { useDocumentPreviewContext } from "@/components/ui/DocumentPreviewContext";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { formatDateDisplay } from "@/lib/utils/date";

type TabType =
  | "info"
  | "bprs"
  | "historis"
  | "dokumen"
  | "actionplan"
  | "kunjungan"
  | "penanganan"
  | "sp";

const tabs: { id: TabType; label: string }[] = [
  { id: "info", label: "Data Utama" },
  { id: "bprs", label: "Cek BPRS Lain" },
  { id: "historis", label: "Historis Kol" },
  { id: "dokumen", label: "Dokumen" },
  { id: "actionplan", label: "Action Plan" },
  { id: "kunjungan", label: "Hasil Kunjungan" },
  { id: "penanganan", label: "Langkah Penanganan" },
  { id: "sp", label: "Surat Peringatan" },
];

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="py-3 border-b border-gray-100 last:border-0">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="font-medium text-gray-900">{value}</p>
  </div>
);

export default function DetailDebiturPage() {
  const { id } = useParams();
  const { openPreview } = useDocumentPreviewContext();
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [isLoading, setIsLoading] = useState(true);

  const debitur = getDebiturById(id as string);
  const pengecekanBPRS = getPengecekanBPRSByDebiturId(id as string);
  const historisKol = getHistorisKolektibilitasByDebiturId(id as string);
  const dokumen = getDokumenByDebiturId(id as string);
  const actionPlan = getActionPlanByDebiturId(id as string);
  const hasilKunjungan = getHasilKunjunganByDebiturId(id as string);
  const langkahPenanganan = getLangkahPenangananByDebiturId(id as string);
  const suratPeringatan = getSuratPeringatanByDebiturId(id as string);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="bg-white rounded-xl p-6 space-y-4">
          <div className="h-12 bg-gray-100 rounded animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!debitur) {
    return (
      <div className="bg-white rounded-xl p-12 text-center">
        <UserX
          className="w-16 h-16 mx-auto text-gray-300 mb-4"
          aria-hidden="true"
        />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Debitur tidak ditemukan
        </h2>
        <p className="text-gray-500 mb-4">
          Data dengan ID tersebut tidak ada dalam sistem.
        </p>
        <Link
          href="/dashboard/informasi-debitur"
          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Kembali ke List Debitur
        </Link>
      </div>
    );
  }

  const arsipDigitalTerkait = dummyDokumen
    .filter((d) =>
      d.detail.toLowerCase().includes(debitur.noKontrak.toLowerCase()),
    )
    .sort((a, b) => a.namaDokumen.localeCompare(b.namaDokumen));

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

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      Pending: "#f59e0b",
      Proses: "#3b82f6",
      Selesai: "#10b981",
      "Belum Dikirim": "#6b7280",
      "Sudah Dikirim": "#3b82f6",
      Diterima: "#10b981",
    };
    const color = colors[status] || "#6b7280";
    return (
      <span
        className="inline-flex px-2 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {status}
      </span>
    );
  };

  const headerKolColor = getKolektibilitasColor(debitur.kolektibilitas);

  return (
    <div className="space-y-6">
      <FeatureHeader
        title={debitur.namaNasabah}
        subtitle={debitur.noKontrak}
        icon={<User />}
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/informasi-debitur"
              className="btn btn-outline btn-sm"
              title="Kembali ke List Debitur"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Kembali
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white border border-gray-200 text-gray-900">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: headerKolColor }}
              />
              Kol {debitur.kolektibilitas} -{" "}
              {getKolektibilitasLabel(debitur.kolektibilitas)}
            </div>
          </div>
        }
      />

      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#157ec3] text-[#157ec3] bg-[#157ec3]/10"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "info" && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  Informasi Nasabah
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <InfoRow label="No Kontrak" value={debitur.noKontrak} />
                  <InfoRow label="No Identitas" value={debitur.noIdentitas} />
                  <InfoRow label="Nama Nasabah" value={debitur.namaNasabah} />
                  <InfoRow label="Alamat" value={debitur.alamat} />
                  <InfoRow label="No Telepon" value={debitur.noTelp} />
                  <InfoRow label="Cabang" value={debitur.cabang} />
                  <InfoRow label="Marketing" value={debitur.marketing} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Wallet
                    className="w-4 h-4 text-blue-600"
                    aria-hidden="true"
                  />
                  Informasi Pembiayaan
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <InfoRow
                    label="Pokok"
                    value={formatCurrency(debitur.pokok)}
                  />
                  <InfoRow
                    label="Margin"
                    value={formatCurrency(debitur.margin)}
                  />
                  <InfoRow
                    label="Jangka Waktu"
                    value={`${debitur.jangkaWaktu} Bulan`}
                  />
                  <InfoRow
                    label="OS Pokok"
                    value={formatCurrency(debitur.osPokok)}
                  />
                  <InfoRow
                    label="OS Margin"
                    value={formatCurrency(debitur.osMargin)}
                  />
                  <InfoRow
                    label="Tanggal Akad"
                    value={formatDateDisplay(debitur.tanggalAkad)}
                  />
                  <InfoRow
                    label="Jatuh Tempo"
                    value={formatDateDisplay(debitur.tanggalJatuhTempo)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "bprs" && (
            <div>
              {pengecekanBPRS.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle2
                    className="w-12 h-12 mx-auto mb-3 text-gray-300"
                    aria-hidden="true"
                  />
                  <p className="font-medium">
                    Tidak ada data pembiayaan di BPRS lain
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Nama BPRS
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Outstanding
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Kol
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Tgl Cek
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pengecekanBPRS.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">
                          {item.namaBPRS}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === "Tidak Ada"
                                ? "bg-green-100 text-green-700"
                                : item.status === "Ada - Lancar"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          {formatCurrency(item.outstanding)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className="inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold bg-white border border-gray-200 text-gray-900"
                            style={{
                              borderColor: getKolektibilitasColor(
                                item.kolektibilitas,
                              ),
                            }}
                          >
                            {item.kolektibilitas}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {formatDateDisplay(item.tanggalCek)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "historis" && (
            <div>
              {historisKol.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Tidak ada data historis kolektibilitas</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Bulan
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Kol
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        OS Pokok
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        OS Margin
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Keterangan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historisKol.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{item.bulan}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className="inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold bg-white border border-gray-200 text-gray-900"
                            style={{
                              borderColor: getKolektibilitasColor(
                                item.kolektibilitas,
                              ),
                            }}
                          >
                            {item.kolektibilitas}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(item.osPokok)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(item.osMargin)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {item.keterangan}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "dokumen" && (
            <div>
              {dokumen.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Tidak ada dokumen tersedia</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dokumen.map((doc) => (
                    <div
                      key={doc.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer"
                      onClick={() =>
                        openPreview(
                          normalizeFileUrl(doc.filePath),
                          doc.namaDokumen,
                          doc.filePath.toLowerCase().endsWith(".pdf")
                            ? "pdf"
                            : "image",
                        )
                      }
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-red-50">
                          <FileText
                            className="w-6 h-6 text-red-500"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {doc.namaDokumen}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {doc.jenisDokumen}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatDateDisplay(doc.tanggalUpload)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FileText
                    className="w-4 h-4 text-blue-600"
                    aria-hidden="true"
                  />
                  Dokumen Arsip Digital Terkait Kontrak
                </h3>
                {arsipDigitalTerkait.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
                    Belum ada dokumen arsip digital yang terhubung dengan nomor
                    kontrak ini.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {arsipDigitalTerkait.map((doc) => (
                      <Link
                        key={doc.id}
                        href={`/dashboard/arsip-digital/ruang-arsip/list-dokumen?kode=${encodeURIComponent(doc.kode)}`}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-blue-50">
                            <FileText
                              className="w-6 h-6 text-blue-600"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {doc.namaDokumen}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {doc.jenisDokumen}
                            </p>
                            <p
                              className="mt-2 inline-flex font-mono text-xs px-2 py-1 rounded"
                              style={{
                                background: "rgba(21, 126, 195, 0.10)",
                                color: "#157ec3",
                              }}
                            >
                              {doc.kode}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "actionplan" && (
            <div>
              {actionPlan.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Belum ada action plan</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {actionPlan.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {formatDateDisplay(item.tanggal)}
                          </span>
                          <StatusBadge status={item.status} />
                        </div>
                        <span className="text-xs text-gray-400">
                          Target: {formatDateDisplay(item.targetTanggal)}
                        </span>
                      </div>
                      <p className="text-gray-900">{item.rencana}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        by {item.createdBy}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "kunjungan" && (
            <div>
              {hasilKunjungan.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Belum ada hasil kunjungan</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hasilKunjungan.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarDays
                          className="w-4 h-4 text-blue-600"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium">
                          {formatDateDisplay(item.tanggalKunjungan)}
                        </span>
                      </div>
                      <p className="text-gray-900 mb-2">
                        {item.hasilKunjungan}
                      </p>
                      <div className="bg-blue-50 rounded-lg p-3 mt-3">
                        <p className="text-xs font-medium text-blue-700 mb-1">
                          Kesimpulan:
                        </p>
                        <p className="text-sm text-blue-900">
                          {item.kesimpulan}
                        </p>
                      </div>
                      {item.fotoKunjungan && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
                          <button
                            type="button"
                            onClick={() =>
                              openPreview(
                                normalizeFileUrl(item.fotoKunjungan!),
                                `Lampiran Kunjungan - ${debitur.namaNasabah}`,
                                item.fotoKunjunganTipe ??
                                  (item
                                    .fotoKunjungan!.toLowerCase()
                                    .endsWith(".pdf")
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
                      <p className="text-xs text-gray-400 mt-2">
                        by {item.createdBy}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "penanganan" && (
            <div>
              {langkahPenanganan.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Belum ada langkah penanganan</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Tanggal
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Langkah
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Hasil
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {langkahPenanganan.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          {formatDateDisplay(item.tanggal)}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {item.langkah}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {item.hasilPenanganan}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "sp" && (
            <div>
              {suratPeringatan.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Belum ada surat peringatan</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Jenis
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Tgl Terbit
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Tgl Kirim
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Keterangan
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        Dokumen
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {suratPeringatan.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="inline-flex px-2 py-1 rounded bg-blue-50 border border-blue-100 text-xs font-bold text-gray-900">
                            {item.jenisSurat}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {formatDateDisplay(item.tanggalTerbit)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {formatDateDisplay(item.tanggalKirim)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <StatusBadge status={item.statusKirim} />
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {item.keterangan || "-"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              (() => {
                                const suratDoc = arsipDigitalTerkait.find(
                                  (d) =>
                                    d.jenisDokumen === "Legal" &&
                                    d.namaDokumen.includes(item.jenisSurat),
                                );
                                const fileUrl =
                                  suratDoc?.fileUrl ??
                                  "/documents/contoh-dok.pdf";
                                openPreview(
                                  fileUrl,
                                  suratDoc
                                    ? `${suratDoc.namaDokumen} (${suratDoc.kode})`
                                    : `Surat Peringatan ${item.jenisSurat}`,
                                  "pdf",
                                );
                              })()
                            }
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#157ec3] hover:bg-[#0d5a8f] transition-colors"
                            title={`Lihat dokumen ${item.jenisSurat}`}
                          >
                            <Eye className="w-4 h-4" aria-hidden="true" />
                            Lihat
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
