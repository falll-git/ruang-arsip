import { notFound, redirect } from "next/navigation";
import {
  getPihakKetigaKategoriBySlug,
  pihakKetigaKategoriOrder,
  pihakKetigaKategoriSlugs,
} from "@/lib/data";

interface PihakKetigaKategoriPageProps {
  params: Promise<{
    kategori: string;
  }>;
}

export function generateStaticParams() {
  return pihakKetigaKategoriOrder.map((kategori) => ({
    kategori: pihakKetigaKategoriSlugs[kategori],
  }));
}

export async function generateMetadata({
  params,
}: PihakKetigaKategoriPageProps) {
  const { kategori: slug } = await params;
  const kategori = getPihakKetigaKategoriBySlug(slug);

  return {
    title: kategori ? `Pihak Ketiga - ${kategori}` : "Pihak Ketiga",
  };
}

export default async function PihakKetigaKategoriPage({
  params,
}: PihakKetigaKategoriPageProps) {
  const { kategori: slug } = await params;
  const kategori = getPihakKetigaKategoriBySlug(slug);

  if (!kategori) {
    notFound();
  }

  redirect(`/dashboard/laporan/pihak-ketiga?kategori=${slug}`);
}
