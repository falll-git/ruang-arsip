"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpDown,
  Building2,
  CalendarDays,
  ChevronRight,
  FileText,
  Inbox,
  Mail,
  Search,
  SearchX,
  Send,
  Shield,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import DetailModal, {
  DetailRow,
  DetailSection,
} from "@/components/marketing/DetailModal";
import DocumentViewButton from "@/components/manajemen-surat/DocumentViewButton";
import { Button } from "@/components/ui/button";
import { useDocumentPreviewContext } from "@/components/ui/DocumentPreviewContext";
import {
  dummyMemorandum,
  dummySuratKeluar,
  dummySuratMasuk,
  dummyUsers,
  type Memorandum,
  type SuratKeluar,
  type SuratMasuk,
} from "@/lib/data";
import { formatDateDisplay, parseDateString } from "@/lib/utils/date";

type ReportKind = "surat-masuk" | "surat-keluar" | "memorandum";
type SortValue = "terbaru" | "terlama";

type SuratMasukRecord = SuratMasuk & {
  fileUrl: string;
};

type SuratKeluarRecord = SuratKeluar & {
  fileUrl: string;
};

type MemorandumRecord = Memorandum & {
  fileUrl: string;
};

type DetailState =
  | {
      kind: "surat-masuk";
      record: SuratMasukRecord;
    }
  | {
      kind: "surat-keluar";
      record: SuratKeluarRecord;
    }
  | {
      kind: "memorandum";
      record: MemorandumRecord;
    };

interface SummaryRow {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface SummaryCardConfig {
  kind: ReportKind;
  title: string;
  icon: LucideIcon;
  totalLabel: string;
  totalValue: number;
  ctaLabel: string;
  infoRows: SummaryRow[];
}

interface ActiveSectionConfig {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  searchPlaceholder: string;
}

const DEFAULT_FILE_URL = "/documents/contoh-dok.pdf";

const personLookup = new Map(
  dummyUsers.flatMap((user) => [
    [user.username.toLowerCase(), user.namaLengkap],
    [user.namaLengkap.toLowerCase(), user.namaLengkap],
  ]),
);

function normalizePersonName(value: string) {
  return personLookup.get(value.toLowerCase()) ?? value;
}

function sortByDate<T>(
  records: T[],
  getDate: (record: T) => string,
  sort: SortValue,
) {
  return [...records].sort((left, right) => {
    const leftDate = parseDateString(getDate(left)) ?? new Date(0);
    const rightDate = parseDateString(getDate(right)) ?? new Date(0);

    if (sort === "terlama") {
      return leftDate.getTime() - rightDate.getTime();
    }

    return rightDate.getTime() - leftDate.getTime();
  });
}

function formatDisplayDate(value: string) {
  return formatDateDisplay(value);
}

function summarize(values: string[], limit = 2) {
  if (values.length === 0) {
    return "-";
  }

  if (values.length <= limit) {
    return values.join(", ");
  }

  return `${values.slice(0, limit).join(", ")} +${values.length - limit}`;
}

const suratMasukRecords: SuratMasukRecord[] = sortByDate(
  dummySuratMasuk.map((record) => ({
    ...record,
    disposisiKepada: record.disposisiKepada.map((name) => normalizePersonName(name)),
    fileUrl: record.fileUrl ?? DEFAULT_FILE_URL,
  })),
  (record) => record.tanggalTerima,
  "terbaru",
);

const suratKeluarRecords: SuratKeluarRecord[] = sortByDate(
  dummySuratKeluar.map((record) => ({
    ...record,
    disposisiKepada: record.disposisiKepada.map((name) => normalizePersonName(name)),
    fileUrl: record.fileUrl ?? DEFAULT_FILE_URL,
  })),
  (record) => record.tanggalKirim,
  "terbaru",
);

const memorandumRecords: MemorandumRecord[] = sortByDate(
  dummyMemorandum.map((record) => ({
    ...record,
    pembuatMemo: normalizePersonName(record.pembuatMemo),
    penerima:
      record.penerimaTipe === "perorangan"
        ? record.penerima.map((name) => normalizePersonName(name))
        : record.penerima,
    fileUrl: record.fileUrl ?? DEFAULT_FILE_URL,
  })),
  (record) => record.tanggal,
  "terbaru",
);

const summaryCards: SummaryCardConfig[] = [
  {
    kind: "surat-masuk",
    title: "Surat Masuk",
    icon: Inbox,
    totalLabel: "TOTAL SURAT",
    totalValue: suratMasukRecords.length,
    ctaLabel: "Lihat Daftar Surat",
    infoRows: [
      {
        icon: CalendarDays,
        label: "Terbaru",
        value: formatDisplayDate(suratMasukRecords[0]?.tanggalTerima ?? ""),
      },
      {
        icon: Shield,
        label: "Sifat",
        value: "Rahasia & Biasa",
      },
      {
        icon: Users,
        label: "Disposisi",
        value: `${new Set(
          suratMasukRecords
            .filter((record) => record.statusDisposisi !== "Selesai")
            .flatMap((record) => record.disposisiKepada),
        ).size} User`,
      },
    ],
  },
  {
    kind: "surat-keluar",
    title: "Surat Keluar",
    icon: Send,
    totalLabel: "TOTAL SURAT",
    totalValue: suratKeluarRecords.length,
    ctaLabel: "Lihat Daftar Surat",
    infoRows: [
      {
        icon: CalendarDays,
        label: "Terbaru",
        value: formatDisplayDate(suratKeluarRecords[0]?.tanggalKirim ?? ""),
      },
      {
        icon: Shield,
        label: "Sifat",
        value: "Rahasia & Biasa",
      },
      {
        icon: Mail,
        label: "Media",
        value: summarize(
          [...new Set(suratKeluarRecords.map((record) => record.media))],
          3,
        ),
      },
    ],
  },
  {
    kind: "memorandum",
    title: "Memorandum",
    icon: FileText,
    totalLabel: "TOTAL MEMO",
    totalValue: memorandumRecords.length,
    ctaLabel: "Lihat Daftar Memo",
    infoRows: [
      {
        icon: CalendarDays,
        label: "Terbaru",
        value: formatDisplayDate(memorandumRecords[0]?.tanggal ?? ""),
      },
      {
        icon: Building2,
        label: "Divisi",
        value: summarize(
          [...new Set(memorandumRecords.map((record) => record.divisiPengirim))],
          3,
        ),
      },
      {
        icon: UserRound,
        label: "Pembuat",
        value: `${new Set(memorandumRecords.map((record) => record.pembuatMemo)).size} User`,
      },
    ],
  },
];

const activeSectionConfig: Record<ReportKind, ActiveSectionConfig> = {
  "surat-masuk": {
    title: "Daftar Surat Masuk",
    subtitle: "Klik dua kali pada baris untuk membuka detail surat masuk.",
    icon: Inbox,
    searchPlaceholder: "Cari nama pengirim, perihal, atau nomor surat",
  },
  "surat-keluar": {
    title: "Daftar Surat Keluar",
    subtitle: "Klik dua kali pada baris untuk membuka detail surat keluar.",
    icon: Send,
    searchPlaceholder: "Cari nama penerima, perihal, atau nomor surat",
  },
  memorandum: {
    title: "Daftar Memorandum",
    subtitle: "Klik dua kali pada baris untuk membuka detail memorandum.",
    icon: FileText,
    searchPlaceholder: "Cari nomor memo, perihal, divisi, atau pembuat",
  },
};

function SelectionState() {
  return (
    <div className="rounded-2xl border border-dashed border-blue-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Mail className="h-8 w-8" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">
        Pilih kategori persuratan
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        Klik salah satu kartu di atas untuk menampilkan daftar surat atau memorandum.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-300">
        <SearchX className="h-8 w-8" aria-hidden="true" />
      </div>
      <p className="text-lg font-medium text-gray-900">
        Tidak ada data yang sesuai filter
      </p>
    </div>
  );
}

function DetailButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      Detail
    </Button>
  );
}

function DocumentSection({
  fileName,
  onPreview,
}: {
  fileName: string;
  onPreview: () => void;
}) {
  return (
    <DetailSection title="Dokumen">
      <DetailRow label="Nama File" value={fileName} />
      <DetailRow
        label="Aksi"
        value={<DocumentViewButton onClick={onPreview} title="View dokumen" />}
      />
    </DetailSection>
  );
}

function ReportSectionShell({
  title,
  subtitle,
  icon: Icon,
  countLabel,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  sortValue,
  onSortChange,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  countLabel: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  sortValue: SortValue;
  onSortChange: (value: SortValue) => void;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50 px-6 py-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1d8fe1] to-[#0d5a8f] text-white shadow-md">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
            {countLabel}
          </span>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" aria-hidden="true" />
            Tutup List
          </Button>
        </div>
      </div>

      <div className="border-b border-gray-100 px-6 py-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Cari Data
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                className="input input-with-icon"
                placeholder={searchPlaceholder}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Urutkan
            </label>
            <div className="relative">
              <ArrowUpDown
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <select
                value={sortValue}
                onChange={(event) => onSortChange(event.target.value as SortValue)}
                className="select input-with-icon"
                aria-label={`Urutkan ${title}`}
              >
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export default function LaporanPersuratanClient() {
  const { openPreview } = useDocumentPreviewContext();
  const [activeKind, setActiveKind] = useState<ReportKind | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState<SortValue>("terbaru");
  const [selectedDetail, setSelectedDetail] = useState<DetailState | null>(null);
  const reportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activeKind || !reportRef.current) return;

    reportRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [activeKind]);

  const filteredSuratMasuk = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    return sortByDate(
      suratMasukRecords.filter((record) => {
        if (!keyword) return true;

        return [
          record.namaSurat,
          record.pengirim,
          record.alamatPengirim,
          record.perihal,
          record.sifat,
          record.disposisiKepada.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      }),
      (record) => record.tanggalTerima,
      sortValue,
    );
  }, [searchValue, sortValue]);

  const filteredSuratKeluar = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    return sortByDate(
      suratKeluarRecords.filter((record) => {
        if (!keyword) return true;

        return [
          record.namaSurat,
          record.penerima,
          record.alamatPenerima,
          record.perihal,
          record.media,
          record.sifat,
          record.disposisiKepada.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      }),
      (record) => record.tanggalKirim,
      sortValue,
    );
  }, [searchValue, sortValue]);

  const filteredMemorandum = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    return sortByDate(
      memorandumRecords.filter((record) => {
        if (!keyword) return true;

        return [
          record.noMemo,
          record.perihal,
          record.divisiPengirim,
          record.pembuatMemo,
          record.keterangan,
          record.penerima.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      }),
      (record) => record.tanggal,
      sortValue,
    );
  }, [searchValue, sortValue]);

  const activeConfig = activeKind ? activeSectionConfig[activeKind] : null;

  const activeCountLabel =
    activeKind === "surat-masuk"
      ? `${filteredSuratMasuk.length} surat`
      : activeKind === "surat-keluar"
        ? `${filteredSuratKeluar.length} surat`
        : activeKind === "memorandum"
          ? `${filteredMemorandum.length} memorandum`
          : "";

  const handleSelectCard = (kind: ReportKind) => {
    setActiveKind(kind);
    setSearchValue("");
    setSortValue("terbaru");
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const isActive = activeKind === card.kind;

          return (
            <button
              key={card.kind}
              type="button"
              onClick={() => handleSelectCard(card.kind)}
              className={`group rounded-2xl border bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isActive
                  ? "border-blue-200 ring-2 ring-blue-100"
                  : "border-gray-100 hover:border-blue-200"
              }`}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1d8fe1] to-[#0d5a8f] text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="flex flex-col items-end">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {card.totalLabel}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 tabular-nums">
                    {card.totalValue}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {card.title}
                </h3>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                {card.infoRows.map((row, index) => {
                  const RowIcon = row.icon;

                  return (
                    <div
                      key={`${card.kind}-${row.label}`}
                      className={index === 0 ? "" : "pt-3"}
                    >
                      {index > 0 ? <div className="mb-3 h-px w-full bg-gray-200" /> : null}
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-2 text-gray-500">
                          <RowIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
                          {row.label}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {row.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between text-sm font-medium text-primary-600">
                <span>{card.ctaLabel}</span>
                <ChevronRight
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </div>
            </button>
          );
        })}
      </div>

      <div ref={reportRef}>
        {!activeConfig ? (
          <SelectionState />
        ) : (
          <ReportSectionShell
            title={activeConfig.title}
            subtitle={activeConfig.subtitle}
            icon={activeConfig.icon}
            countLabel={activeCountLabel}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder={activeConfig.searchPlaceholder}
            sortValue={sortValue}
            onSortChange={setSortValue}
            onClose={() => setActiveKind(null)}
          >
            {activeKind === "surat-masuk" ? (
              filteredSuratMasuk.length > 0 ? (
                <table className="w-full border-collapse text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Nama Pengirim
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Perihal
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Tgl Penerimaan
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                        Sifat
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Disposisi
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSuratMasuk.map((record, index) => (
                      <tr
                        key={record.id}
                        className="cursor-pointer bg-white hover:bg-gray-50"
                        onDoubleClick={() =>
                          setSelectedDetail({ kind: "surat-masuk", record })
                        }
                      >
                        <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {record.pengirim}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{record.perihal}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDisplayDate(record.tanggalTerima)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              record.sifat === "Rahasia"
                                ? "border border-red-300 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {record.sifat}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {record.disposisiKepada.join(", ")}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <DetailButton
                            onClick={() =>
                              setSelectedDetail({ kind: "surat-masuk", record })
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState />
              )
            ) : null}

            {activeKind === "surat-keluar" ? (
              filteredSuratKeluar.length > 0 ? (
                <table className="w-full border-collapse text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Nama Penerima
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Perihal
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Tgl Pengiriman
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                        Sifat
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Media
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSuratKeluar.map((record, index) => (
                      <tr
                        key={record.id}
                        className="cursor-pointer bg-white hover:bg-gray-50"
                        onDoubleClick={() =>
                          setSelectedDetail({ kind: "surat-keluar", record })
                        }
                      >
                        <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {record.penerima}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{record.perihal}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDisplayDate(record.tanggalKirim)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              record.sifat === "Rahasia"
                                ? "border border-red-300 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {record.sifat}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{record.media}</td>
                        <td className="px-6 py-4 text-center">
                          <DetailButton
                            onClick={() =>
                              setSelectedDetail({ kind: "surat-keluar", record })
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState />
              )
            ) : null}

            {activeKind === "memorandum" ? (
              filteredMemorandum.length > 0 ? (
                <table className="w-full border-collapse text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        No Memo
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Perihal
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Divisi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Pembuat
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Tanggal
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredMemorandum.map((record, index) => (
                      <tr
                        key={record.id}
                        className="cursor-pointer bg-white hover:bg-gray-50"
                        onDoubleClick={() =>
                          setSelectedDetail({ kind: "memorandum", record })
                        }
                      >
                        <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 text-gray-900">
                          <span className="rounded border border-blue-100 bg-blue-50 px-2 py-1 font-mono text-blue-700">
                            {record.noMemo}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{record.perihal}</td>
                        <td className="px-6 py-4 text-gray-700">
                          {record.divisiPengirim}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {record.pembuatMemo}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDisplayDate(record.tanggal)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <DetailButton
                            onClick={() =>
                              setSelectedDetail({ kind: "memorandum", record })
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState />
              )
            ) : null}
          </ReportSectionShell>
        )}
      </div>
      <DetailModal
        isOpen={selectedDetail !== null}
        onClose={() => setSelectedDetail(null)}
        title={
          selectedDetail?.kind === "surat-masuk"
            ? "Detail Surat Masuk"
            : selectedDetail?.kind === "surat-keluar"
              ? "Detail Surat Keluar"
              : "Detail Memorandum"
        }
      >
        {selectedDetail?.kind === "surat-masuk" ? (
          <div className="space-y-6">
            <DetailSection title="Informasi Surat">
              <DetailRow label="Nama Pengirim" value={selectedDetail.record.pengirim} />
              <DetailRow
                label="Alamat Pengirim"
                value={selectedDetail.record.alamatPengirim}
              />
              <DetailRow
                label="Nama / Nomor Surat"
                value={selectedDetail.record.namaSurat}
              />
              <DetailRow label="Perihal Surat" value={selectedDetail.record.perihal} />
              <DetailRow
                label="Tanggal Penerimaan"
                value={formatDisplayDate(selectedDetail.record.tanggalTerima)}
              />
              <DetailRow label="Sifat Surat" value={selectedDetail.record.sifat} />
              <DetailRow
                label="Disposisi Kepada"
                value={selectedDetail.record.disposisiKepada.join(", ")}
              />
              <DetailRow
                label="Status Disposisi"
                value={selectedDetail.record.statusDisposisi}
              />
            </DetailSection>

            <DocumentSection
              fileName={selectedDetail.record.fileName}
              onPreview={() =>
                openPreview(
                  selectedDetail.record.fileUrl,
                  selectedDetail.record.fileName,
                )
              }
            />
          </div>
        ) : null}

        {selectedDetail?.kind === "surat-keluar" ? (
          <div className="space-y-6">
            <DetailSection title="Informasi Surat">
              <DetailRow label="Nama Penerima" value={selectedDetail.record.penerima} />
              <DetailRow
                label="Alamat Penerima"
                value={selectedDetail.record.alamatPenerima}
              />
              <DetailRow
                label="Nama / Nomor Surat"
                value={selectedDetail.record.namaSurat}
              />
              <DetailRow label="Perihal Surat" value={selectedDetail.record.perihal} />
              <DetailRow
                label="Tanggal Pengiriman"
                value={formatDisplayDate(selectedDetail.record.tanggalKirim)}
              />
              <DetailRow
                label="Media Pengiriman"
                value={selectedDetail.record.media}
              />
              <DetailRow label="Sifat Surat" value={selectedDetail.record.sifat} />
              <DetailRow
                label="Disposisi Kepada"
                value={selectedDetail.record.disposisiKepada.join(", ")}
              />
            </DetailSection>

            <DocumentSection
              fileName={selectedDetail.record.fileName}
              onPreview={() =>
                openPreview(
                  selectedDetail.record.fileUrl,
                  selectedDetail.record.fileName,
                )
              }
            />
          </div>
        ) : null}

        {selectedDetail?.kind === "memorandum" ? (
          <div className="space-y-6">
            <DetailSection title="Informasi Memorandum">
              <DetailRow label="No Memo" value={selectedDetail.record.noMemo} />
              <DetailRow
                label="Divisi Pengirim"
                value={selectedDetail.record.divisiPengirim}
              />
              <DetailRow
                label="Pembuat Memo"
                value={selectedDetail.record.pembuatMemo}
              />
              <DetailRow
                label="Tanggal Memo"
                value={formatDisplayDate(selectedDetail.record.tanggal)}
              />
              <DetailRow label="Perihal Memo" value={selectedDetail.record.perihal} />
              <DetailRow
                label="Keterangan Memo"
                value={selectedDetail.record.keterangan}
              />
              <DetailRow
                label="Tipe Penerima"
                value={
                  selectedDetail.record.penerimaTipe === "divisi"
                    ? "Per Divisi"
                    : "Perorangan"
                }
              />
              <DetailRow
                label="Penerima Memo"
                value={selectedDetail.record.penerima.join(", ")}
              />
            </DetailSection>

            <DocumentSection
              fileName={selectedDetail.record.fileName}
              onPreview={() =>
                openPreview(
                  selectedDetail.record.fileUrl,
                  selectedDetail.record.fileName,
                )
              }
            />
          </div>
        ) : null}
      </DetailModal>
    </div>
  );
}
