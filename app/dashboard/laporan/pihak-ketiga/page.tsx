import Link from "next/link";
import { Users2 } from "lucide-react";

import LaporanPihakKetigaClient from "@/components/laporan/LaporanPihakKetigaClient";
import FeatureHeader from "@/components/ui/FeatureHeader";

export const metadata = {
  title: "Laporan Pihak Ketiga",
};

export default function LaporanPihakKetigaPage() {
  return (
    <div className="mx-auto max-w-7xl animate-fade-in">
      <div className="mb-4">
        <Link href="/dashboard" className="btn btn-outline btn-sm">
          Kembali ke Dashboard
        </Link>
      </div>

      <FeatureHeader
        title="Laporan Pihak Ketiga"
        icon={<Users2 />}
      />

      <LaporanPihakKetigaClient />
    </div>
  );
}
