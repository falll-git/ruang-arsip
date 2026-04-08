export type PihakKetigaKategori = "NOTARIS" | "ASURANSI" | "KJPP";

export interface PihakKetiga {
  id: string;
  nama: string;
  kategori: PihakKetigaKategori;
  kodeDokumen: string;
  jenisDokumen: string;
  namaDokumen: string;
  detailDokumen: string;
  tanggalInput: string;
  userInput: string;
  fileUrl?: string;
  fileType?: "pdf" | "image";
  prosesBerjalan: number;
  laporanSelesai: number;
  lewatExpired: number;
}

export interface PihakKetigaSummary {
  kategori: PihakKetigaKategori;
  jumlahPihakKetiga: number;
  prosesBerjalan: number;
  laporanSelesai: number;
  lewatExpired: number;
}

export interface Kantor {
  id: string;
  namaKantor: string;
}

export interface Lemari {
  id: string;
  kantorId: string;
  kodeLemari: string;
}

export interface Rak {
  id: string;
  lemariId: string;
  namaRak: string;
  totalArsip: number;
}

export type DokumenArsipJenis = "DIGITAL" | "FISIK";
export type DokumenArsipKategori = "Perusahaan" | "Pembiayaan" | "Karyawan" | "Voucher";

export interface DokumenArsip {
  id: string;
  rakId: string;
  namaDokumen: string;
  jenisDokumen: DokumenArsipKategori;
  jenis: DokumenArsipJenis;
  tanggalInput: string;
}

export type DisposisiArsipStatus = "PENDING" | "PROSES" | "SELESAI" | "DITOLAK";

export interface DisposisiArsip {
  id: string;
  lemariId: string;
  dokumenId?: number;
  status: DisposisiArsipStatus;
}

export type PeminjamanArsipStatus =
  | "Pending"
  | "Disetujui"
  | "Ditolak"
  | "Dipinjam"
  | "Dikembalikan";

export interface PeminjamanArsip {
  id: string;
  lemariId: string;
  dokumenId?: number;
  namaDokumen: string;
  peminjam: string;
  tanggalPinjam: string;
  tanggalKembali: string;
  status: PeminjamanArsipStatus;
}

export type ProgressPihakKetigaStatus = "PROSES" | "SELESAI" | "EXPIRED";

export interface ProgressPihakKetiga {
  id: string;
  pihakKetigaId: string;
  namaNasabah: string;
  noKontrak: string;
  status: ProgressPihakKetigaStatus;
  tanggalMulai: string;
  tanggalSelesai?: string;
  keterangan?: string;
}

export interface KolektibilitasItem {
  kol: number;
  label: string;
  jumlahNasabah: number;
  outstandingPokok: number;
}

export interface RiwayatNPF {
  tahun: number;
  bulan: number;
  namaBulan: string;
  jumlahNasabah: number;
  outstandingPokok: number;
  rasioNPF: number;
}

export type NpfKolektibilitasLevel = 1 | 2 | 3 | 4 | 5;

export interface KolektibilitasNasabahItem {
  nama: string;
  noKontrak: string;
  outstandingPokok: number;
  sisaBulan: number;
  kolektibilitas: NpfKolektibilitasLevel;
}

export type JenisTitipan = "NOTARIS" | "ASURANSI" | "ANGSURAN";

export interface TitipanNasabah {
  id: string;
  nama: string;
  jenisTitipan: JenisTitipan;
  pihakKetigaId?: string | null;
  totalTitipan: number;
  saldoTerbayar: number;
  sisaSaldo: number;
}

export interface TitipanSummary {
  jenisTitipan: JenisTitipan;
  totalTitipan: number;
  saldoTerbayar: number;
  sisaSaldo: number;
  jumlahNasabah: number;
  lunas: boolean;
}

export interface RiwayatBPRSLain {
  namaBPRS: string;
  kolektibilitas: number;
  osPokok: number;
  periode: string;
}

export interface IdebRingkasan {
  kolektibilitasBerjalan: number;
  osPokok: number;
  statusPembiayaan: string;
  riwayatBPRSLain: RiwayatBPRSLain[];
  kesimpulan: "AMAN" | "PERHATIAN" | "BERMASALAH";
}

export interface IdebRecord {
  id: string;
  debiturId: string;
  namaNasabah: string;
  noKontrak: string;
  bulan: number;
  namaBulan: string;
  tahun: number;
  tanggalUpload: string;
  status: "CHECKED" | "PENDING";
  ringkasan?: IdebRingkasan;
}

export type CetakDokumenLegalType =
  | "AKAD"
  | "HAFTSHEET"
  | "SURAT_PERINGATAN"
  | "FORMULIR_ASURANSI"
  | "SKL"
  | "SAMSAT";

export interface CetakDokumenRecord {
  id: string;
  nasabahId: string;
  namaNasabah: string;
  noKontrak: string;
  jenisDokumen: CetakDokumenLegalType;
  tanggalCetak: string;
  dicetakOleh: string;
  keterangan?: string;
}

export type ProgresPHK3Kategori =
  | "NOTARIS"
  | "ASURANSI"
  | "TRACKING_CLAIM";

export type ProgresPHK3Status = "AKTIF" | "SELESAI" | "PENDING";

export interface ProgresPHK3Record {
  id: string;
  nasabahId: string;
  namaNasabah: string;
  noKontrak: string;
  kategori: ProgresPHK3Kategori;
  status: ProgresPHK3Status;
  tanggalInput: string;
  keterangan?: string;
}

export interface SuratUser {
  id: string;
  nama: string;
  divisi: string;
}

export interface SuratMasuk {
  id: number;
  namaSurat: string;
  pengirim: string;
  alamatPengirim: string;
  perihal: string;
  tanggalTerima: string;
  sifat: "Biasa" | "Rahasia";
  disposisiKepada: string[];
  statusDisposisi: "Pending" | "Dalam Proses" | "Selesai";
  fileName: string;
  fileUrl?: string;
  tenggatWaktu?: string;
  keteranganTenggat?: string;
}

export interface SuratKeluar {
  id: number;
  namaSurat: string;
  penerima: string;
  alamatPenerima: string;
  perihal: string;
  tanggalKirim: string;
  media: string;
  sifat: "Biasa" | "Rahasia";
  disposisiKepada: string[];
  fileName: string;
  fileUrl?: string;
  tenggatWaktu?: string;
  keteranganTenggat?: string;
}

export interface Memorandum {
  id: number;
  noMemo: string;
  perihal: string;
  divisiPengirim: string;
  pembuatMemo: string;
  tanggal: string;
  keterangan: string;
  penerimaTipe: "divisi" | "perorangan";
  penerima: string[];
  fileName: string;
  fileUrl?: string;
  tenggatWaktu?: string;
  keteranganTenggat?: string;
}
