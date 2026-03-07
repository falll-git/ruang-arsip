"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import PihakKetigaOverview from "@/components/laporan/PihakKetigaOverview";
import { getPihakKetigaKategoriBySlug, pihakKetigaKategoriSlugs } from "@/lib/data";
import type { PihakKetigaKategori } from "@/lib/types";

export default function LaporanPihakKetigaClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedKategori, setSelectedKategori] =
    useState<PihakKetigaKategori | null>(null);

  useEffect(() => {
    const slug = searchParams.get("kategori");
    setSelectedKategori(slug ? getPihakKetigaKategoriBySlug(slug) : null);
  }, [searchParams]);

  const handleKategoriChange = (kategori: PihakKetigaKategori | null) => {
    setSelectedKategori(kategori);

    const nextParams = new URLSearchParams(searchParams.toString());

    if (kategori) {
      nextParams.set("kategori", pihakKetigaKategoriSlugs[kategori]);
    } else {
      nextParams.delete("kategori");
    }

    const queryString = nextParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  return (
    <PihakKetigaOverview
      selectedKategori={selectedKategori}
      onKategoriChange={handleKategoriChange}
    />
  );
}
