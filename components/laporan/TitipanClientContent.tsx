"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Filter,
  Scale,
  Search,
  SearchX,
  Shield,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import type { JenisTitipan, TitipanNasabah, TitipanSummary } from "@/lib/types";
import { formatNumber, formatRupiah } from "@/lib/utils/laporan";

type FilterJenis = "ALL" | JenisTitipan;

function parseFilterJenis(value: string | null): FilterJenis {
  const normalized = value?.toLowerCase() ?? "";

  if (normalized === "notaris") {
    return "NOTARIS";
  }

  if (normalized === "asuransi") {
    return "ASURANSI";
  }

  if (normalized === "angsuran") {
    return "ANGSURAN";
  }

  return "ALL";
}

const jenisMeta: Record<
  JenisTitipan,
  {
    label: string;
    title: string;
    icon: LucideIcon;
  }
> = {
  NOTARIS: {
    label: "Notaris",
    title: "Titipan Notaris",
    icon: Scale,
  },
  ASURANSI: {
    label: "Asuransi",
    title: "Titipan Asuransi",
    icon: Shield,
  },
  ANGSURAN: {
    label: "Angsuran",
    title: "Titipan Angsuran",
    icon: CreditCard,
  },
};

function SummaryCard({
  item,
  isActive,
  onClick,
  index,
}: {
  item: TitipanSummary;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const SummaryIcon = jenisMeta[item.jenisTitipan].icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group animate-slide-up rounded-2xl border bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isActive
          ? "border-primary-200 ring-1 ring-primary-100"
          : "border-gray-100"
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="mb-6 flex items-start gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-110"
            style={{
              background: "linear-gradient(135deg, #157ec3 0%, #0d5a8f 100%)",
            }}
          >
            <SummaryIcon className="h-7 w-7 text-white" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-gray-900">
              {jenisMeta[item.jenisTitipan].title}
            </p>
            <p className="text-sm text-gray-500">Ringkasan titipan nasabah</p>
          </div>
        </div>

        <div className="flex w-[118px] shrink-0 flex-col items-end text-right">
          <span className="mb-1 text-xs font-semibold uppercase leading-tight tracking-wider text-gray-400">
            Jumlah Nasabah
          </span>
          <span className="text-2xl font-bold tabular-nums text-gray-800">
            {formatNumber(item.jumlahNasabah)}
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="flex items-center gap-2 text-gray-500">
            <Wallet className="h-4 w-4" aria-hidden="true" />
            Total Titipan
          </span>
          <span className="font-semibold text-gray-800">
            {formatRupiah(item.totalTitipan)}
          </span>
        </div>
        <div className="my-3 h-px w-full bg-gray-200" />
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="flex items-center gap-2 text-gray-500">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Saldo Terbayar
          </span>
          <span className="font-semibold text-emerald-600">
            {formatRupiah(item.saldoTerbayar)}
          </span>
        </div>
        <div className="my-3 h-px w-full bg-gray-200" />
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="flex items-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" aria-hidden="true" />
            Sisa Saldo
          </span>
          {item.lunas ? (
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              Lunas
            </span>
          ) : (
            <span className="font-semibold text-red-600">
              {formatRupiah(item.sisaSaldo)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between font-medium text-primary-600 transition-transform group-hover:translate-x-1">
        <span className="text-sm">Lihat Nasabah</span>
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </div>
    </button>
  );
}

export default function TitipanClientContent({
  summary,
  nasabah,
}: {
  summary: TitipanSummary[];
  nasabah: TitipanNasabah[];
}) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState<FilterJenis>(() =>
    parseFilterJenis(searchParams.get("filter")),
  );
  const tableSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setFilterJenis(parseFilterJenis(searchParams.get("filter")));
  }, [searchParams]);

  const filteredNasabah = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return nasabah.filter((item) => {
      const matchSearch = keyword ? item.nama.toLowerCase().includes(keyword) : true;
      const matchJenis =
        filterJenis === "ALL" || item.jenisTitipan === filterJenis;

      return matchSearch && matchJenis;
    });
  }, [filterJenis, nasabah, searchTerm]);

  const totals = useMemo(
    () =>
      filteredNasabah.reduce(
        (result, item) => ({
          totalTitipan: result.totalTitipan + item.totalTitipan,
          saldoTerbayar: result.saldoTerbayar + item.saldoTerbayar,
          sisaSaldo: result.sisaSaldo + item.sisaSaldo,
        }),
        {
          totalTitipan: 0,
          saldoTerbayar: 0,
          sisaSaldo: 0,
        },
      ),
    [filteredNasabah],
  );

  const handleCardClick = (jenisTitipan: JenisTitipan) => {
    setFilterJenis(jenisTitipan);
    tableSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {summary.map((item, index) => (
          <SummaryCard
            key={item.jenisTitipan}
            item={item}
            index={index}
            isActive={filterJenis === item.jenisTitipan}
            onClick={() => handleCardClick(item.jenisTitipan)}
          />
        ))}
      </div>

      <div ref={tableSectionRef} className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Data Nasabah Titipan</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gunakan pencarian atau filter jenis titipan untuk mempersempit data.
          </p>
        </div>

        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Cari Nasabah
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="input input-with-icon"
                  placeholder="Cari nama nasabah..."
                />
              </div>
            </div>

            <div className="md:col-span-5">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Filter Jenis
              </label>
              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <select
                  value={filterJenis}
                  onChange={(event) =>
                    setFilterJenis(event.target.value as FilterJenis)
                  }
                  className="select input-with-icon"
                >
                  <option value="ALL">Semua Jenis</option>
                  {Object.entries(jenisMeta).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {filteredNasabah.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Nama Nasabah
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Jenis Titipan
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Total Titipan
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Saldo Terbayar
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Sisa Saldo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredNasabah.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {item.nama}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {jenisMeta[item.jenisTitipan].label}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-700">
                        {formatRupiah(item.totalTitipan)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-emerald-600">
                        {formatRupiah(item.saldoTerbayar)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold">
                        {item.sisaSaldo === 0 ? (
                          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                            Lunas
                          </span>
                        ) : (
                          <span className="text-red-600">
                            {formatRupiah(item.sisaSaldo)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-gray-500">
                      -
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                      {formatRupiah(totals.totalTitipan)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-emerald-700">
                      {formatRupiah(totals.saldoTerbayar)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-red-700">
                      {formatRupiah(totals.sisaSaldo)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                <SearchX className="h-8 w-8" aria-hidden="true" />
              </div>
              <p className="text-lg font-medium text-gray-900">
                Tidak ada data yang sesuai filter
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
