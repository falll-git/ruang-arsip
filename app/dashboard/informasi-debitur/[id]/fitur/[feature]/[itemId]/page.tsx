"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye, FileText, UserX } from "lucide-react";
import {
  dummyDokumen,
  formatCurrency,
  getActionPlanByDebiturId,
  getDebiturById,
  getHistorisKolektibilitasByDebiturId,
  getKolektibilitasColor,
  getKolektibilitasLabel,
  getLangkahPenangananByDebiturId,
  getPengecekanBPRSByDebiturId,
  getHasilKunjunganByDebiturId,
  getSuratPeringatanByDebiturId,
} from "@/lib/data";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { useDocumentPreviewContext } from "@/components/ui/DocumentPreviewContext";
import { formatDateDisplay } from "@/lib/utils/date";
import KolBadge from "@/components/marketing/KolBadge";

type FeatureType =
  | "bprs"
  | "historis"
  | "actionplan"
  | "kunjungan"
  | "penanganan"
  | "sp";

const featureLabels: Record<FeatureType, string> = {
  bprs: "Cek BPRS Lain",
  historis: "Historis Kolektibilitas",
  actionplan: "Action Plan",
  kunjungan: "Hasil Kunjungan",
  penanganan: "Langkah Penanganan",
  sp: "Surat Peringatan",
};

const isFeatureType = (value: string): value is FeatureType =>
  Object.keys(featureLabels).includes(value);

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="py-3 border-b border-gray-100 last:border-0">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <div className="text-sm text-gray-900 font-medium">{value}</div>
  </div>
);

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

export default function DetailFiturDebiturPage() {
  const params = useParams<{
    id: string;
    feature: string;
    itemId: string;
  }>();
  const { openPreview } = useDocumentPreviewContext();

  const debiturId = params.id;
  const feature = params.feature;
  const itemId = params.itemId;

  const debitur = getDebiturById(debiturId);

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

  if (!debitur || !isFeatureType(feature)) {
    return (
      <div className="bg-white rounded-xl p-12 text-center">
        <UserX className="w-14 h-14 mx-auto text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Detail fitur tidak ditemukan
        </h2>
        <Link
          href="/dashboard/informasi-debitur"
          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke List Debitur
        </Link>
      </div>
    );
  }

  const bprsItem = getPengecekanBPRSByDebiturId(debiturId).find(
    (item) => item.id === itemId,
  );
  const historisItem = getHistorisKolektibilitasByDebiturId(debiturId).find(
    (item) => item.id === itemId,
  );
  const actionPlanItem = getActionPlanByDebiturId(debiturId).find(
    (item) => item.id === itemId,
  );
  const kunjunganItem = getHasilKunjunganByDebiturId(debiturId).find(
    (item) => item.id === itemId,
  );
  const penangananItem = getLangkahPenangananByDebiturId(debiturId).find(
    (item) => item.id === itemId,
  );
  const spItem = getSuratPeringatanByDebiturId(debiturId).find(
    (item) => item.id === itemId,
  );

  const arsipDigitalTerkait = dummyDokumen.filter((doc) =>
    doc.detail.toLowerCase().includes(debitur.noKontrak.toLowerCase()),
  );

  const selectedItem =
    feature === "bprs"
      ? bprsItem
      : feature === "historis"
        ? historisItem
        : feature === "actionplan"
          ? actionPlanItem
          : feature === "kunjungan"
            ? kunjunganItem
            : feature === "penanganan"
              ? penangananItem
              : spItem;

  if (!selectedItem) {
    return (
      <div className="bg-white rounded-xl p-12 text-center">
        <FileText className="w-14 h-14 mx-auto text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Data detail tidak ditemukan
        </h2>
        <p className="text-gray-500 mb-4">
          Item detail yang dipilih tidak tersedia untuk debitur ini.
        </p>
        <Link
          href={`/dashboard/informasi-debitur/${debitur.id}`}
          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Detail Debitur
        </Link>
      </div>
    );
  }

  const headerKolColor = getKolektibilitasColor(debitur.kolektibilitas);

  return (
    <div className="space-y-6">
      <FeatureHeader
        title={`Detail ${featureLabels[feature]}`}
        subtitle={`${debitur.namaNasabah} • ${debitur.noKontrak}`}
        icon={<FileText />}
        actions={
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/informasi-debitur/${debitur.id}`}
              className="btn btn-outline btn-sm"
              title="Kembali ke Detail Debitur"
            >
              <ArrowLeft className="w-4 h-4" />
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
        className="bg-white rounded-xl p-6"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        {feature === "bprs" && bprsItem && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-gray-50 rounded-lg p-4">
              <DetailRow label="Nama BPRS" value={bprsItem.namaBPRS} />
              <DetailRow label="Status" value={bprsItem.status} />
              <DetailRow
                label="Outstanding"
                value={formatCurrency(bprsItem.outstanding)}
              />
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <DetailRow
                label="Kolektibilitas"
                value={<KolBadge kol={bprsItem.kolektibilitas} />}
              />
              <DetailRow
                label="Tanggal Cek"
                value={formatDateDisplay(bprsItem.tanggalCek)}
              />
            </div>
          </div>
        )}

        {feature === "historis" && historisItem && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-gray-50 rounded-lg p-4">
              <DetailRow label="Bulan" value={historisItem.bulan} />
              <DetailRow
                label="Kolektibilitas"
                value={<KolBadge kol={historisItem.kolektibilitas} />}
              />
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <DetailRow
                label="OS Pokok"
                value={formatCurrency(historisItem.osPokok)}
              />
              <DetailRow
                label="OS Margin"
                value={formatCurrency(historisItem.osMargin)}
              />
              <DetailRow label="Keterangan" value={historisItem.keterangan} />
            </div>
          </div>
        )}

        {feature === "actionplan" && actionPlanItem && (
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailRow
              label="Tanggal Input"
              value={formatDateDisplay(actionPlanItem.tanggal)}
            />
            <DetailRow label="Rencana" value={actionPlanItem.rencana} />
            <DetailRow
              label="Target Tanggal"
              value={formatDateDisplay(actionPlanItem.targetTanggal)}
            />
            <DetailRow
              label="Status"
              value={<StatusBadge status={actionPlanItem.status} />}
            />
            <DetailRow
              label="Lampiran"
              value={
                actionPlanItem.lampiranFilePath ? (
                  <button
                    type="button"
                    onClick={() =>
                      openPreview(
                        normalizeFileUrl(actionPlanItem.lampiranFilePath!),
                        actionPlanItem.lampiranFileName ||
                          "lampiran_action_plan.pdf",
                        "pdf",
                      )
                    }
                    className="btn btn-view-pdf btn-sm inline-flex"
                    title="Lihat lampiran"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                ) : (
                  "-"
                )
              }
            />
          </div>
        )}

        {feature === "kunjungan" && kunjunganItem && (
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailRow
              label="Tanggal Kunjungan"
              value={formatDateDisplay(kunjunganItem.tanggalKunjungan)}
            />
            <DetailRow label="Alamat" value={kunjunganItem.alamat || "-"} />
            <DetailRow
              label="Hasil Kunjungan"
              value={kunjunganItem.hasilKunjungan}
            />
            <DetailRow label="Kesimpulan" value={kunjunganItem.kesimpulan} />
            <DetailRow
              label="Lampiran"
              value={
                kunjunganItem.fotoKunjungan ? (
                  <button
                    type="button"
                    onClick={() =>
                      openPreview(
                        normalizeFileUrl(kunjunganItem.fotoKunjungan!),
                        kunjunganItem.fotoKunjunganNama ||
                          `Lampiran Kunjungan - ${debitur.namaNasabah}`,
                        kunjunganItem.fotoKunjunganTipe ??
                          (kunjunganItem
                            .fotoKunjungan!.toLowerCase()
                            .endsWith(".pdf")
                            ? "pdf"
                            : "image"),
                      )
                    }
                    className="btn btn-view-pdf btn-sm inline-flex"
                    title="Lihat lampiran"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                ) : (
                  "-"
                )
              }
            />
          </div>
        )}

        {feature === "penanganan" && penangananItem && (
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailRow
              label="Tanggal Input"
              value={formatDateDisplay(penangananItem.tanggal)}
            />
            <DetailRow label="Langkah" value={penangananItem.langkah} />
            <DetailRow
              label="Hasil Penanganan"
              value={penangananItem.hasilPenanganan}
            />
            <DetailRow
              label="Status"
              value={<StatusBadge status={penangananItem.status} />}
            />
            <DetailRow
              label="Lampiran"
              value={
                penangananItem.lampiranFilePath ? (
                  <button
                    type="button"
                    onClick={() =>
                      openPreview(
                        normalizeFileUrl(penangananItem.lampiranFilePath!),
                        penangananItem.lampiranFileName ||
                          "lampiran_langkah_penanganan.pdf",
                        "pdf",
                      )
                    }
                    className="btn btn-view-pdf btn-sm inline-flex"
                    title="Lihat lampiran"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                ) : (
                  "-"
                )
              }
            />
          </div>
        )}

        {feature === "sp" && spItem && (
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailRow label="Jenis Surat" value={spItem.jenisSurat} />
            <DetailRow
              label="Tanggal Terbit"
              value={formatDateDisplay(spItem.tanggalTerbit)}
            />
            <DetailRow
              label="Tanggal Kirim"
              value={formatDateDisplay(spItem.tanggalKirim)}
            />
            <DetailRow
              label="Status Kirim"
              value={<StatusBadge status={spItem.statusKirim} />}
            />
            <DetailRow label="Keterangan" value={spItem.keterangan || "-"} />
            <DetailRow
              label="Dokumen"
              value={
                <button
                  type="button"
                  onClick={() => {
                    const suratDoc = arsipDigitalTerkait.find(
                      (doc) =>
                        doc.jenisDokumen === "Legal" &&
                        doc.namaDokumen.includes(spItem.jenisSurat),
                    );
                    const fileUrl =
                      suratDoc?.fileUrl ?? "/documents/contoh-dok.pdf";
                    openPreview(
                      fileUrl,
                      suratDoc
                        ? `${suratDoc.namaDokumen} (${suratDoc.kode})`
                        : `Surat Peringatan ${spItem.jenisSurat}`,
                      "pdf",
                    );
                  }}
                  className="btn btn-view-pdf btn-sm inline-flex"
                  title="Lihat dokumen"
                >
                  <Eye className="w-4 h-4" />
                </button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
