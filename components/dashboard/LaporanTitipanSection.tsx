import Link from "next/link";
import {
  Banknote,
  CheckCircle,
  ChevronRight,
  Clock,
  FileSignature,
  HeartPulse,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { titipanNasabahData } from "@/lib/data";
import type { JenisTitipan } from "@/lib/types";

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

const jenisMeta: Record<
  JenisTitipan,
  {
    icon: LucideIcon;
    title: string;
    filter: string;
  }
> = {
  NOTARIS: {
    icon: FileSignature,
    title: "Titipan Notaris",
    filter: "notaris",
  },
  ASURANSI: {
    icon: HeartPulse,
    title: "Titipan Asuransi",
    filter: "asuransi",
  },
  ANGSURAN: {
    icon: Banknote,
    title: "Titipan Angsuran",
    filter: "angsuran",
  },
};

export default function LaporanTitipanSection() {
  const summaries = (Object.keys(jenisMeta) as JenisTitipan[]).map(
    (jenisTitipan) => {
      const items = titipanNasabahData.filter(
        (item) => item.jenisTitipan === jenisTitipan,
      );
      const totalTitipan = items.reduce(
        (total, item) => total + item.totalTitipan,
        0,
      );
      const saldoTerbayar = items.reduce(
        (total, item) => total + item.saldoTerbayar,
        0,
      );
      const sisaSaldo = items.reduce((total, item) => total + item.sisaSaldo, 0);

      return {
        jenisTitipan,
        count: items.length,
        totalTitipan,
        saldoTerbayar,
        sisaSaldo,
      };
    },
  );

  return (
    <section className="animate-fade-in">
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <Wallet className="h-6 w-6 text-gray-600" aria-hidden="true" />
          Laporan Titipan
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {summaries.map((item, index) => {
          const meta = jenisMeta[item.jenisTitipan];
          const SummaryIcon = meta.icon;

          return (
            <Link
              key={item.jenisTitipan}
              href={`/dashboard/laporan/titipan?filter=${meta.filter}`}
              className="group animate-slide-up rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
                    <SummaryIcon className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-gray-900">{meta.title}</p>
                  </div>
                </div>

                <div className="flex w-[118px] shrink-0 flex-col items-end text-right">
                  <span className="mb-1 text-xs font-semibold uppercase leading-tight tracking-wider text-gray-400">
                    Jumlah Nasabah
                  </span>
                  <span className="text-2xl font-bold tabular-nums text-gray-800">
                    {formatNumber(item.count)}
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
                    <CheckCircle className="h-4 w-4" aria-hidden="true" />
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
                  {item.sisaSaldo > 0 ? (
                    <span className="font-semibold text-red-600">
                      {formatRupiah(item.sisaSaldo)}
                    </span>
                  ) : (
                    <span className="font-semibold text-emerald-600">Lunas</span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between font-medium text-primary-600 transition-transform group-hover:translate-x-1">
                <span className="text-sm">Lihat Nasabah</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
