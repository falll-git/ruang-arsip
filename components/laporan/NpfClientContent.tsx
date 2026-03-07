"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  XCircle,
} from "lucide-react";

import DonutNPF from "@/components/charts/DonutNPF";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  KolektibilitasItem,
  LaporanNpfSummary,
  RiwayatNPF,
} from "@/lib/types";
import { formatNumber, formatRupiah } from "@/lib/utils/laporan";

const kolColors: Record<number, string> = {
  1: "#22c55e",
  2: "#eab308",
  3: "#f97316",
  4: "#ef4444",
  5: "#991b1b",
};

function formatRatio(value: number) {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export default function NpfClientContent({
  kolektibilitas,
  riwayat,
  summary,
}: {
  kolektibilitas: KolektibilitasItem[];
  riwayat: RiwayatNPF[];
  summary: LaporanNpfSummary;
}) {
  const [yearFilter, setYearFilter] = useState("ALL");

  const availableYears = useMemo(
    () =>
      Array.from(new Set(riwayat.map((item) => String(item.tahun)))).sort(
        (left, right) => Number(right) - Number(left),
      ),
    [riwayat],
  );

  const donutData = useMemo(
    () =>
      kolektibilitas.map((item) => ({
        label: item.label,
        value: item.outstandingPokok,
        color: kolColors[item.kol] ?? "#64748b",
      })),
    [kolektibilitas],
  );

  const detailRows = useMemo(
    () =>
      kolektibilitas.map((item) => ({
        ...item,
        color: kolColors[item.kol] ?? "#64748b",
        persentase:
          summary.totalOutstandingPokok === 0
            ? 0
            : (item.outstandingPokok / summary.totalOutstandingPokok) * 100,
      })),
    [kolektibilitas, summary.totalOutstandingPokok],
  );

  const filteredRiwayat = useMemo(() => {
    if (yearFilter === "ALL") {
      return riwayat;
    }

    return riwayat.filter((item) => String(item.tahun) === yearFilter);
  }, [riwayat, yearFilter]);

  const banner = useMemo(() => {
    if (summary.latestRasioNpf < 5) {
      return {
        icon: CheckCircle2,
        classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
        text: "NPF dalam batas aman",
      };
    }

    if (summary.latestRasioNpf <= 10) {
      return {
        icon: AlertTriangle,
        classes: "border-amber-200 bg-amber-50 text-amber-700",
        text: "NPF mendekati batas perhatian",
      };
    }

    return {
      icon: XCircle,
      classes: "border-red-200 bg-red-50 text-red-700",
      text: "NPF melewati batas maksimum - perlu tindakan segera",
    };
  }, [summary.latestRasioNpf]);

  const BannerIcon = banner.icon;

  return (
    <>
      <div className={`mb-4 rounded-xl border p-4 ${banner.classes}`}>
        <div className="flex items-start gap-3">
          <BannerIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">{banner.text}</p>
            {summary.latestRiwayat ? (
              <p className="mt-1 text-sm opacity-90">
                Posisi {summary.latestRiwayat.namaBulan} {summary.latestRiwayat.tahun}:{" "}
                {formatRatio(summary.latestRasioNpf)}%
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Kolektibilitas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <DonutNPF data={donutData} ratio={summary.rasioNpf} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detail Kolektibilitas</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Kolektibilitas
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Nasabah
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Outstanding Pokok
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Persentase
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {detailRows.map((item) => (
                  <tr key={item.kol} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.label}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700">
                      {formatNumber(item.jumlahNasabah)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700">
                      {formatRupiah(item.outstandingPokok)}
                    </td>
                    <td
                      className="px-6 py-4 text-right text-sm font-semibold"
                      style={{ color: item.color }}
                    >
                      {formatRatio(item.persentase)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    {formatNumber(summary.totalNasabah)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    {formatRupiah(summary.totalOutstandingPokok)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    100%
                  </td>
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>
      </section>

      <Card className="mt-6">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:space-y-0">
          <CardTitle>Riwayat NPF - 12 Bulan Terakhir</CardTitle>
          <div className="w-full sm:w-[220px]">
            <label className="mb-2 block text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:text-right">
              Filter Tahun
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
                className="select input-with-icon"
              >
                <option value="ALL">Semua Tahun</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Tahun
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Bulan
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Jumlah Nasabah
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Outstanding Pokok
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Rasio NPF (%)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRiwayat.length > 0 ? (
                filteredRiwayat.map((item) => (
                  <tr
                    key={`${item.tahun}-${item.bulan}`}
                    className={`transition-colors ${
                      item.rasioNPF > 10
                        ? "bg-red-50/40 hover:bg-red-50/60"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">{item.tahun}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {item.namaBulan}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700">
                      {formatNumber(item.jumlahNasabah)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700">
                      {formatRupiah(item.outstandingPokok)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {formatRatio(item.rasioNPF)}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    Tidak ada riwayat NPF untuk filter tahun ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}
