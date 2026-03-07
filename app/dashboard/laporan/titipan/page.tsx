import Link from "next/link";
import { Wallet } from "lucide-react";

import TitipanClientContent from "@/components/laporan/TitipanClientContent";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { titipanNasabahData, titipanSummary } from "@/lib/data";

export const metadata = {
  title: "Laporan Titipan",
};

export default function LaporanTitipanPage() {
  return (
    <div className="mx-auto max-w-7xl animate-fade-in">
      <div className="mb-4">
        <Link href="/dashboard" className="btn btn-outline btn-sm">
          Kembali ke Dashboard
        </Link>
      </div>

      <FeatureHeader
        title="Laporan Titipan"
        icon={<Wallet />}
      />

      <TitipanClientContent
        summary={titipanSummary}
        nasabah={titipanNasabahData}
      />
    </div>
  );
}
