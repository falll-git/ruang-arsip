import Link from "next/link";
import { TrendingDown } from "lucide-react";

import FeatureHeader from "@/components/ui/FeatureHeader";
import NpfClientContent from "@/components/laporan/NpfClientContent";
import {
  kolektibilitasData,
  laporanNpfSummary,
  riwayatNPFData,
} from "@/lib/data";

export const metadata = {
  title: "Laporan NPF",
};

export default function LaporanNpfPage() {
  return (
    <div className="mx-auto max-w-7xl animate-fade-in">
      <div className="mb-4">
        <Link href="/dashboard" className="btn btn-outline btn-sm">
          Kembali ke Dashboard
        </Link>
      </div>

      <FeatureHeader
        title="Laporan NPF"
        icon={<TrendingDown />}
      />

      <NpfClientContent
        kolektibilitas={kolektibilitasData}
        riwayat={riwayatNPFData}
        summary={laporanNpfSummary}
      />
    </div>
  );
}
