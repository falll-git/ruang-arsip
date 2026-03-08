import type {
  ActionPlan,
  Debitur,
  DokumenDebitur,
  HasilKunjungan,
  HistorisKolektibilitas,
  KolektibilitasType,
  LangkahPenanganan,
  NotarisDebitur,
  PengecekanBPRS,
  SuratPeringatan,
  UploadRestrik,
  UploadSLIK,
} from "@/lib/types/modul3";
import type {
  CetakDokumenLegalType,
  CetakDokumenRecord,
  IdebRecord,
  IdebRingkasan,
  JenisTitipan,
  KolektibilitasItem,
  KolektibilitasNasabahItem,
  PihakKetiga,
  PihakKetigaKategori,
  PihakKetigaSummary,
  ProgressPihakKetiga,
  ProgresPHK3Record,
  RiwayatBPRSLain,
  RiwayatNPF,
  TitipanNasabah,
  TitipanSummary,
} from "@/lib/types";
import { USER_ROLES, type DataAccessLevel, type UserRole } from "@/lib/rbac";

export interface User {
  id: number;
  namaLengkap: string;
  username: string;
  password?: string;
  divisi: string;
  tipeAkun: "Internal" | "Eksternal";
  role: UserRole;
  atasanTerkait?: string;
  status: "Aktif" | "Nonaktif";
}

export interface TempatPenyimpanan {
  id: number;
  kodeKantor: string;
  namaKantor: string;
  kodeLemari: string;
  rak: string;
  kapasitas: number;
  status: "Aktif" | "Nonaktif";
}

export interface JenisDokumen {
  id: number;
  kode: string;
  nama: string;
  keterangan: string;
  status: "Aktif" | "Nonaktif";
}

export interface Dokumen {
  id: number;
  kode: string;
  jenisDokumen: string;
  namaDokumen: string;
  detail: string;
  tglInput: string;
  userInput: string;
  tempatPenyimpanan?: string;
  tempatPenyimpananId?: number;
  statusPinjam: "Tersedia" | "Dipinjam" | "Dalam Proses" | "Diajukan";
  statusPeminjaman?: "Tersedia" | "Dipinjam" | "Dalam Proses" | "Diajukan";
  noKontrak?: string | null;
  debiturId?: string | null;
  levelAkses: DataAccessLevel;
  restrict: boolean;
  fileUrl?: string;
}

export interface Disposisi {
  id: number;
  dokumenId: number;
  detail: string;
  pemohon: string;
  pemilik: string;
  tglPengajuan: string;
  status: "Pending" | "Approved" | "Rejected";
  alasanPengajuan: string;
  tglExpired: string | null;
  tglAksi: string | null;
  alasanAksi: string | null;
}

export interface Peminjaman {
  id: number;
  dokumenId: number;
  detail: string;
  peminjam: string;
  tglPinjam: string;
  tglKembali: string;
  tglPengembalian: string | null;
  status: "Pending" | "Disetujui" | "Ditolak" | "Dipinjam" | "Dikembalikan";
  alasan: string;
  approver: string | null;
  tglApprove: string | null;
  jamApprove: string | null;
  alasanApprove: string | null;
  tglPenyerahan: string | null;
}

export const dummyUsers: User[] = [
  {
    id: 1,
    password: "demo123",
    namaLengkap: "Faisal Rahman",
    username: "FAISAL",
    divisi: "Legal",
    tipeAkun: "Internal",
    role: USER_ROLES.FULL_AKSES,
    atasanTerkait: "-",
    status: "Aktif",
  },
  {
    id: 2,
    password: "demo123",
    namaLengkap: "Annas Malik",
    username: "ANNAS",
    divisi: "Legal",
    tipeAkun: "Internal",
    role: USER_ROLES.FUNGSI_LEGAL,
    atasanTerkait: "Faisal Rahman",
    status: "Aktif",
  },
  {
    id: 3,
    password: "demo123",
    namaLengkap: "Anggita Sari",
    username: "ANGGITA",
    divisi: "HRD",
    tipeAkun: "Internal",
    role: USER_ROLES.AKSES_RESTRICT,
    atasanTerkait: "Faisal Rahman",
    status: "Aktif",
  },
  {
    id: 4,
    password: "demo123",
    namaLengkap: "Burhan Wijaya",
    username: "BURHAN",
    divisi: "IT",
    tipeAkun: "Internal",
    role: USER_ROLES.MASTER_USER,
    atasanTerkait: "-",
    status: "Aktif",
  },
];

export const dummyTempatPenyimpanan: TempatPenyimpanan[] = [
  {
    id: 1,
    kodeKantor: "KP",
    namaKantor: "Kantor Pusat",
    kodeLemari: "L-020",
    rak: "RAK 4",
    kapasitas: 150,
    status: "Aktif",
  },
  {
    id: 2,
    kodeKantor: "KP",
    namaKantor: "Kantor Pusat",
    kodeLemari: "L-021",
    rak: "RAK 5",
    kapasitas: 200,
    status: "Aktif",
  },
  {
    id: 3,
    kodeKantor: "KST",
    namaKantor: "Kantor Kas ST",
    kodeLemari: "L-001",
    rak: "RAK 1",
    kapasitas: 100,
    status: "Aktif",
  },
];

export const dummyJenisDokumen: JenisDokumen[] = [
  {
    id: 1,
    kode: "JD-001",
    nama: "Perusahaan",
    keterangan: "Dokumen perusahaan",
    status: "Aktif",
  },
  {
    id: 2,
    kode: "JD-002",
    nama: "Pembiayaan",
    keterangan: "Dokumen pembiayaan nasabah",
    status: "Aktif",
  },
  {
    id: 3,
    kode: "JD-003",
    nama: "Karyawan",
    keterangan: "Dokumen kepegawaian",
    status: "Aktif",
  },
  {
    id: 4,
    kode: "JD-004",
    nama: "Voucher",
    keterangan: "Dokumen voucher transaksi",
    status: "Aktif",
  },
];

export const dummyDokumen: Dokumen[] = [
  {
    id: 1,
    kode: "A010253",
    jenisDokumen: "Perusahaan",
    namaDokumen: "Akta Pendirian",
    detail: "Akta Pendirian Awal Tahun 1992",
    tglInput: "21-01-2026",
    userInput: "FAISAL",
    tempatPenyimpanan: "L-020",
    tempatPenyimpananId: 1,
    statusPinjam: "Tersedia",
    statusPeminjaman: "Tersedia",
    levelAkses: "NON_RESTRICT",
    restrict: false,
    fileUrl: "/documents/contoh-dok.pdf",
  },
  {
    id: 2,
    kode: "A010254",
    jenisDokumen: "Pembiayaan",
    namaDokumen: "Dokumen Akad",
    detail: "Dokumen Akad An. Fulan",
    tglInput: "21-01-2026",
    userInput: "ANNAS",
    tempatPenyimpanan: "L-020",
    tempatPenyimpananId: 1,
    statusPinjam: "Tersedia",
    statusPeminjaman: "Tersedia",
    levelAkses: "RESTRICT",
    restrict: true,
    fileUrl: "/documents/contoh-dok.pdf",
  },
  {
    id: 3,
    kode: "A010255",
    jenisDokumen: "Karyawan",
    namaDokumen: "SK Pengangkatan",
    detail: "SK Pengangkatan An. Burhan",
    tglInput: "21-01-2026",
    userInput: "ANGGITA",
    tempatPenyimpanan: "L-020",
    tempatPenyimpananId: 1,
    statusPinjam: "Tersedia",
    statusPeminjaman: "Tersedia",
    levelAkses: "RESTRICT",
    restrict: true,
    fileUrl: "/documents/contoh-dok.pdf",
  },
  {
    id: 4,
    kode: "A010256",
    jenisDokumen: "Pembiayaan",
    namaDokumen: "Dokumen Taksasi",
    detail: "Dokumen Taksasi An. Fulan",
    tglInput: "21-01-2026",
    userInput: "ANNAS",
    tempatPenyimpanan: "L-020",
    tempatPenyimpananId: 1,
    statusPinjam: "Tersedia",
    statusPeminjaman: "Tersedia",
    levelAkses: "RESTRICT",
    restrict: true,
    fileUrl: "/documents/contoh-dok.pdf",
  },
  {
    id: 5,
    kode: "A010257",
    jenisDokumen: "Voucher",
    namaDokumen: "Teller Pusat Juni",
    detail: "Voucher Juni 2025 Kantor Pusat",
    tglInput: "21-01-2026",
    userInput: "BURHAN",
    tempatPenyimpanan: "L-020",
    tempatPenyimpananId: 1,
    statusPinjam: "Tersedia",
    statusPeminjaman: "Tersedia",
    levelAkses: "NON_RESTRICT",
    restrict: false,
    fileUrl: "/documents/contoh-dok.pdf",
  },
  {
    id: 6,
    kode: "A010258",
    jenisDokumen: "Voucher",
    namaDokumen: "Teller KST Juni",
    detail: "Voucher Juni 2025 Kantor Kas KST",
    tglInput: "21-01-2026",
    userInput: "BURHAN",
    tempatPenyimpanan: "L-001",
    tempatPenyimpananId: 3,
    statusPinjam: "Tersedia",
    statusPeminjaman: "Tersedia",
    levelAkses: "NON_RESTRICT",
    restrict: false,
    fileUrl: "/documents/contoh-dok.pdf",
  },
  {
    id: 7,
    kode: "A010259",
    jenisDokumen: "Pembiayaan",
    namaDokumen: "Dokumen Perusahaan",
    detail: "NPWP dan NIB",
    tglInput: "21-01-2026",
    userInput: "ANNAS",
    tempatPenyimpanan: "L-020",
    tempatPenyimpananId: 1,
    statusPinjam: "Tersedia",
    statusPeminjaman: "Tersedia",
    levelAkses: "RESTRICT",
    restrict: true,
    fileUrl: "/documents/contoh-dok.pdf",
  },
];

export const dummyDisposisi: Disposisi[] = [
  {
    id: 1,
    dokumenId: 2,
    detail: "Dokumen Akad An. Fulan",
    pemohon: "ANGGI",
    pemilik: "ANNAS",
    tglPengajuan: "22-01-2026",
    status: "Pending",
    alasanPengajuan: "Untuk keperluan audit",
    tglExpired: null,
    tglAksi: null,
    alasanAksi: null,
  },
  {
    id: 2,
    dokumenId: 3,
    detail: "SK Pengangkatan An. Burhan",
    pemohon: "ANNAS",
    pemilik: "ANGGITA",
    tglPengajuan: "22-01-2026",
    status: "Approved",
    alasanPengajuan: "Cek Data",
    tglExpired: "25-01-2026",
    tglAksi: "22-01-2026",
    alasanAksi: "Approved by Owner",
  },
  {
    id: 3,
    dokumenId: 1,
    detail: "Akta Pendirian Awal Tahun 1992",
    pemohon: "FAISAL",
    pemilik: "ANNAS",
    tglPengajuan: "23-01-2026",
    status: "Approved",
    alasanPengajuan: "Verifikasi legalitas perusahaan",
    tglExpired: "27-01-2026",
    tglAksi: "23-01-2026",
    alasanAksi: "Disetujui untuk kebutuhan verifikasi dokumen induk",
  },
  {
    id: 4,
    dokumenId: 4,
    detail: "Dokumen Taksasi An. Fulan",
    pemohon: "BURHAN",
    pemilik: "ANNAS",
    tglPengajuan: "24-01-2026",
    status: "Rejected",
    alasanPengajuan: "Pengecekan ulang nilai agunan",
    tglExpired: null,
    tglAksi: "24-01-2026",
    alasanAksi: "Ditolak karena harus melalui approval supervisor",
  },
  {
    id: 5,
    dokumenId: 5,
    detail: "Voucher Juni 2025 Kantor Pusat",
    pemohon: "ANGGITA",
    pemilik: "BURHAN",
    tglPengajuan: "25-01-2026",
    status: "Approved",
    alasanPengajuan: "Audit transaksi teller pusat",
    tglExpired: "28-01-2026",
    tglAksi: "25-01-2026",
    alasanAksi: "Disetujui untuk keperluan audit internal",
  },
  {
    id: 6,
    dokumenId: 6,
    detail: "Voucher Juni 2025 Kantor Kas KST",
    pemohon: "ANNAS",
    pemilik: "BURHAN",
    tglPengajuan: "26-01-2026",
    status: "Rejected",
    alasanPengajuan: "Konfirmasi transaksi kas cabang",
    tglExpired: null,
    tglAksi: "26-01-2026",
    alasanAksi: "Ditolak karena dokumen sedang dipakai tim audit cabang",
  },
  {
    id: 7,
    dokumenId: 7,
    detail: "NPWP dan NIB",
    pemohon: "FAISAL",
    pemilik: "ANNAS",
    tglPengajuan: "27-01-2026",
    status: "Approved",
    alasanPengajuan: "Review kelengkapan dokumen perusahaan",
    tglExpired: "31-01-2026",
    tglAksi: "27-01-2026",
    alasanAksi: "Disetujui untuk review lanjutan",
  },
  {
    id: 8,
    dokumenId: 3,
    detail: "SK Pengangkatan An. Burhan",
    pemohon: "BURHAN",
    pemilik: "ANGGITA",
    tglPengajuan: "28-01-2026",
    status: "Approved",
    alasanPengajuan: "Pelengkap administrasi kepegawaian",
    tglExpired: "01-02-2026",
    tglAksi: "28-01-2026",
    alasanAksi: "Disetujui sesuai kebutuhan administrasi",
  },
  {
    id: 9,
    dokumenId: 2,
    detail: "Dokumen Akad An. Fulan",
    pemohon: "ANGGITA",
    pemilik: "ANNAS",
    tglPengajuan: "29-01-2026",
    status: "Rejected",
    alasanPengajuan: "Pemeriksaan isi akad pembiayaan",
    tglExpired: null,
    tglAksi: "29-01-2026",
    alasanAksi: "Ditolak karena dokumen sedang dalam proses review legal",
  },
  {
    id: 10,
    dokumenId: 4,
    detail: "Dokumen Taksasi An. Fulan",
    pemohon: "FAISAL",
    pemilik: "ANNAS",
    tglPengajuan: "30-01-2026",
    status: "Approved",
    alasanPengajuan: "Komparasi nilai appraisal",
    tglExpired: "03-02-2026",
    tglAksi: "30-01-2026",
    alasanAksi: "Disetujui untuk pengecekan appraisal",
  },
  {
    id: 11,
    dokumenId: 1,
    detail: "Akta Pendirian Awal Tahun 1992",
    pemohon: "ANNAS",
    pemilik: "FAISAL",
    tglPengajuan: "31-01-2026",
    status: "Rejected",
    alasanPengajuan: "Pencocokan data legal perusahaan",
    tglExpired: null,
    tglAksi: "31-01-2026",
    alasanAksi: "Ditolak karena salinan digital sudah tersedia",
  },
  {
    id: 12,
    dokumenId: 5,
    detail: "Voucher Juni 2025 Kantor Pusat",
    pemohon: "FAISAL",
    pemilik: "BURHAN",
    tglPengajuan: "01-02-2026",
    status: "Approved",
    alasanPengajuan: "Rekonsiliasi transaksi kas",
    tglExpired: "05-02-2026",
    tglAksi: "01-02-2026",
    alasanAksi: "Disetujui untuk kebutuhan rekonsiliasi",
  },
  {
    id: 13,
    dokumenId: 7,
    detail: "NPWP dan NIB",
    pemohon: "ANGGITA",
    pemilik: "ANNAS",
    tglPengajuan: "02-02-2026",
    status: "Rejected",
    alasanPengajuan: "Validasi identitas badan usaha",
    tglExpired: null,
    tglAksi: "02-02-2026",
    alasanAksi: "Ditolak karena lampiran sudah tersedia di folder bersama",
  },
  {
    id: 14,
    dokumenId: 6,
    detail: "Voucher Juni 2025 Kantor Kas KST",
    pemohon: "BURHAN",
    pemilik: "FAISAL",
    tglPengajuan: "03-02-2026",
    status: "Approved",
    alasanPengajuan: "Konfirmasi selisih transaksi kas",
    tglExpired: "06-02-2026",
    tglAksi: "03-02-2026",
    alasanAksi: "Disetujui untuk pengecekan selisih transaksi",
  },
  {
    id: 15,
    dokumenId: 3,
    detail: "SK Pengangkatan An. Burhan",
    pemohon: "ANNAS",
    pemilik: "ANGGITA",
    tglPengajuan: "04-02-2026",
    status: "Approved",
    alasanPengajuan: "Pembaruan data personalia",
    tglExpired: "08-02-2026",
    tglAksi: "04-02-2026",
    alasanAksi: "Disetujui untuk pembaruan data internal",
  },
  {
    id: 16,
    dokumenId: 2,
    detail: "Dokumen Akad An. Fulan",
    pemohon: "FAISAL",
    pemilik: "ANNAS",
    tglPengajuan: "05-02-2026",
    status: "Rejected",
    alasanPengajuan: "Penyesuaian berkas pembiayaan",
    tglExpired: null,
    tglAksi: "05-02-2026",
    alasanAksi: "Ditolak karena dokumen sedang diproses untuk cetak ulang",
  },
  {
    id: 17,
    dokumenId: 4,
    detail: "Dokumen Taksasi An. Fulan",
    pemohon: "ANGGITA",
    pemilik: "ANNAS",
    tglPengajuan: "06-02-2026",
    status: "Approved",
    alasanPengajuan: "Pelengkap komite pembiayaan",
    tglExpired: "09-02-2026",
    tglAksi: "06-02-2026",
    alasanAksi: "Disetujui untuk rapat komite",
  },
  {
    id: 18,
    dokumenId: 1,
    detail: "Akta Pendirian Awal Tahun 1992",
    pemohon: "BURHAN",
    pemilik: "FAISAL",
    tglPengajuan: "07-02-2026",
    status: "Approved",
    alasanPengajuan: "Pemeriksaan arsip legal lama",
    tglExpired: "10-02-2026",
    tglAksi: "07-02-2026",
    alasanAksi: "Disetujui untuk kebutuhan arsip legal",
  },
];

export const dummyPeminjaman: Peminjaman[] = [
  {
    id: 1,
    dokumenId: 2,
    detail: "Dokumen Akad An. Fulan",
    peminjam: "ANGGI",
    tglPinjam: "22-01-2026",
    tglKembali: "29-01-2026",
    tglPengembalian: null,
    status: "Dipinjam",
    alasan: "Keperluan verifikasi data nasabah",
    approver: "ANNAS",
    tglApprove: "22-01-2026",
    jamApprove: "09:00",
    alasanApprove: "Disetujui",
    tglPenyerahan: "22-01-2026",
  },
  {
    id: 2,
    dokumenId: 6,
    detail: "Voucher Juni 2025 Kantor Kas KST",
    peminjam: "BURHAN",
    tglPinjam: "20-01-2026",
    tglKembali: "23-01-2026",
    tglPengembalian: null,
    status: "Dipinjam",
    alasan: "Audit Cabang",
    approver: "FAISAL",
    tglApprove: "20-01-2026",
    jamApprove: "09:00",
    alasanApprove: "Ok",
    tglPenyerahan: "20-01-2026",
  },
];

export interface SuratUser {
  id: number;
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
}

export const dummyDivisiList: string[] = [
  "IT",
  "Legal",
  "Operasional",
  "HRD",
  "Marketing",
  "Accounting",
  "Finance",
];

export const dummySuratUsers: SuratUser[] = dummyUsers
  .filter((u) => u.status === "Aktif")
  .map((u) => ({ id: u.id, nama: u.namaLengkap, divisi: u.divisi }));

export const dummySuratMasuk: SuratMasuk[] = [
  {
    id: 1,
    namaSurat: "Surat Penawaran",
    pengirim: "PT. Teknologi Maju",
    alamatPengirim: "Jl. Sudirman No 45",
    perihal: "Penawaran Kerjasama IT",
    tanggalTerima: "22-01-2026",
    sifat: "Biasa",
    disposisiKepada: ["BURHAN", "FAISAL"],
    statusDisposisi: "Dalam Proses",
    fileName: "surat_penawaran.pdf",
  },
  {
    id: 2,
    namaSurat: "Surat Somasi",
    pengirim: "Kantor Hukum A&P",
    alamatPengirim: "Jl. Rasuna Said",
    perihal: "Somasi Terkait Aset",
    tanggalTerima: "23-01-2026",
    sifat: "Rahasia",
    disposisiKepada: ["FAISAL"],
    statusDisposisi: "Selesai",
    fileName: "surat_somasi.pdf",
  },
];

export const dummySuratKeluar: SuratKeluar[] = [
  {
    id: 1,
    namaSurat: "Balasan Penawaran",
    penerima: "PT. Teknologi Maju",
    alamatPenerima: "Jl. Sudirman No 45",
    perihal: "Persetujuan Meeting",
    tanggalKirim: "24-01-2026",
    media: "Email",
    sifat: "Biasa",
    disposisiKepada: ["BURHAN"],
    fileName: "balasan_penawaran.pdf",
  },
];

export const dummyMemorandum: Memorandum[] = [
  {
    id: 1,
    noMemo: "MEMO/001/HRD/2026",
    perihal: "Cuti Bersama",
    divisiPengirim: "HRD",
    pembuatMemo: "ANGGITA",
    tanggal: "20-01-2026",
    keterangan: "Pengumuman Cuti Bersama Tahun Baru Imlek",
    penerimaTipe: "divisi",
    penerima: ["ALL DIVISI"],
    fileName: "memo_cuti.pdf",
  },
];

export const dummyDebiturList: Debitur[] = [
  {
    id: "DBT001",
    noKontrak: "PB/2024/001234",
    noIdentitas: "3201234567890001",
    namaNasabah: "Ahmad Suryanto",
    alamat: "Jl. Merdeka No. 123, Bandung",
    noTelp: "081234567890",
    pokok: 150000000,
    margin: 30000000,
    jangkaWaktu: 36,
    osPokok: 120000000,
    osMargin: 24000000,
    kolektibilitas: "1",
    tanggalAkad: "2024-01-15",
    tanggalJatuhTempo: "2027-01-15",
    cabang: "Cabang Bandung",
    marketing: "Budi Santoso",
  },
  {
    id: "DBT002",
    noKontrak: "PB/2024/001235",
    noIdentitas: "3201234567890002",
    namaNasabah: "Siti Rahayu",
    alamat: "Jl. Asia Afrika No. 45, Bandung",
    noTelp: "082345678901",
    pokok: 200000000,
    margin: 50000000,
    jangkaWaktu: 48,
    osPokok: 0,
    osMargin: 0,
    kolektibilitas: "1",
    tanggalAkad: "2023-06-20",
    tanggalJatuhTempo: "2027-06-20",
    cabang: "Cabang Bandung",
    marketing: "Dewi Lestari",
  },
  {
    id: "DBT003",
    noKontrak: "PB/2023/000987",
    noIdentitas: "3201234567890003",
    namaNasabah: "Hendra Wijaya",
    alamat: "Jl. Braga No. 78, Bandung",
    noTelp: "083456789012",
    pokok: 300000000,
    margin: 75000000,
    jangkaWaktu: 60,
    osPokok: 250000000,
    osMargin: 62500000,
    kolektibilitas: "3",
    tanggalAkad: "2023-03-10",
    tanggalJatuhTempo: "2028-03-10",
    cabang: "Cabang Jakarta",
    marketing: "Rudi Hartono",
  },
  {
    id: "DBT004",
    noKontrak: "PB/2022/000456",
    noIdentitas: "3201234567890004",
    namaNasabah: "Budi Santoso",
    alamat: "Jl. Dago No. 100, Bandung",
    noTelp: "084567890123",
    pokok: 100000000,
    margin: 20000000,
    jangkaWaktu: 24,
    osPokok: 50000000,
    osMargin: 10000000,
    kolektibilitas: "2",
    tanggalAkad: "2022-05-15",
    tanggalJatuhTempo: "2024-05-15",
    cabang: "Cabang Bandung",
    marketing: "Siti Aminah",
  },
  {
    id: "DBT005",
    noKontrak: "PB/2021/000789",
    noIdentitas: "3201234567890005",
    namaNasabah: "Dewi Kartika",
    alamat: "Jl. Riau No. 12, Bandung",
    noTelp: "085678901234",
    pokok: 500000000,
    margin: 100000000,
    jangkaWaktu: 60,
    osPokok: 400000000,
    osMargin: 80000000,
    kolektibilitas: "1",
    tanggalAkad: "2021-12-10",
    tanggalJatuhTempo: "2026-12-10",
    cabang: "Cabang Jakarta",
    marketing: "Ahmad Hidayat",
  },
];

const dummyPengecekanBPRS: PengecekanBPRS[] = [
  {
    id: "BPRS001",
    debiturId: "DBT001",
    namaBPRS: "BPRS Sejahtera",
    status: "Ada - Lancar",
    outstanding: 25000000,
    kolektibilitas: "1",
    tanggalCek: "2024-01-20",
  },
  {
    id: "BPRS002",
    debiturId: "DBT003",
    namaBPRS: "BPRS Amanah",
    status: "Ada - Bermasalah",
    outstanding: 45000000,
    kolektibilitas: "3",
    tanggalCek: "2024-02-10",
  },
  {
    id: "BPRS003",
    debiturId: "DBT002",
    namaBPRS: "BPRS Mitra",
    status: "Tidak Ada",
    outstanding: 0,
    kolektibilitas: "1",
    tanggalCek: "2024-01-25",
  },
];

const dummyHistorisKolektibilitas: HistorisKolektibilitas[] = [
  {
    id: "HK001",
    debiturId: "DBT001",
    bulan: "2024-10",
    kolektibilitas: "1",
    osPokok: 125000000,
    osMargin: 25000000,
    keterangan: "Lancar",
  },
  {
    id: "HK002",
    debiturId: "DBT001",
    bulan: "2024-11",
    kolektibilitas: "2",
    osPokok: 122000000,
    osMargin: 24400000,
    keterangan: "DPK - keterlambatan ringan",
  },
  {
    id: "HK003",
    debiturId: "DBT003",
    bulan: "2024-11",
    kolektibilitas: "3",
    osPokok: 250000000,
    osMargin: 62500000,
    keterangan: "Kurang lancar",
  },
  {
    id: "HK004",
    debiturId: "DBT003",
    bulan: "2024-12",
    kolektibilitas: "3",
    osPokok: 248000000,
    osMargin: 62000000,
    keterangan: "Perlu penanganan",
  },
];

const dummyDokumenDebitur: DokumenDebitur[] = [
  {
    id: "DOC001",
    debiturId: "DBT001",
    namaDokumen: "KTP Nasabah",
    jenisDokumen: "KTP",
    tanggalUpload: "2024-01-16",
    filePath: "/contoh-dok/ktp-nasabah.pdf",
    fileType: "pdf",
  },
  {
    id: "DOC002",
    debiturId: "DBT001",
    namaDokumen: "Akad Pembiayaan",
    jenisDokumen: "Akad",
    tanggalUpload: "2024-01-15",
    filePath: "/contoh-dok/akad-pembiayaan.pdf",
    fileType: "pdf",
  },
  {
    id: "DOC003",
    debiturId: "DBT003",
    namaDokumen: "Dokumen Jaminan (BPKB)",
    jenisDokumen: "Jaminan",
    tanggalUpload: "2023-03-12",
    filePath: "/contoh-dok/sertifikat-jaminan.pdf",
    fileType: "pdf",
  },
  {
    id: "DOC004",
    debiturId: "DBT001",
    namaDokumen: "KTP Nasabah",
    jenisDokumen: "KTP",
    kategori: "AWAL",
    keterangan: "KTP elektronik nasabah terbaru.",
    tanggalUpload: "2026-01-08",
    filePath: "/contoh-dok/ktp-nasabah.pdf",
    fileType: "pdf",
  },
  {
    id: "DOC005",
    debiturId: "DBT001",
    namaDokumen: "NPWP",
    jenisDokumen: "NPWP",
    kategori: "AWAL",
    keterangan: "NPWP pribadi Ahmad Suryanto.",
    tanggalUpload: "2026-01-08",
    filePath: "/contoh-dok/npwp.pdf",
    fileType: "pdf",
  },
  {
    id: "DOC006",
    debiturId: "DBT001",
    namaDokumen: "Akad Pembiayaan",
    jenisDokumen: "Akad",
    kategori: "AWAL",
    keterangan: "Akad pembiayaan murabahah pembaruan 2026.",
    tanggalUpload: "2026-01-09",
    filePath: "/contoh-dok/akad-pembiayaan.pdf",
    fileType: "pdf",
  },
  {
    id: "DOC007",
    debiturId: "DBT001",
    namaDokumen: "Sertifikat Jaminan",
    jenisDokumen: "Jaminan",
    kategori: "AWAL",
    keterangan: "Sertifikat rumah tinggal yang dijaminkan.",
    tanggalUpload: "2026-01-09",
    filePath: "/contoh-dok/sertifikat-jaminan.pdf",
    fileType: "pdf",
  },
  {
    id: "DOC008",
    debiturId: "DBT001",
    namaDokumen: "Kartu Keluarga",
    jenisDokumen: "KK",
    kategori: "AWAL",
    keterangan: "Kartu keluarga nasabah aktif.",
    tanggalUpload: "2026-01-10",
    filePath: "/contoh-dok/kartu-keluarga.pdf",
    fileType: "pdf",
  },
  {
    id: "DOC009",
    debiturId: "DBT001",
    namaDokumen: "Surat Pernyataan Restrukturisasi",
    jenisDokumen: "Lainnya",
    kategori: "LAINNYA",
    keterangan: "Surat pernyataan restrukturisasi yang ditandatangani nasabah.",
    tanggalUpload: "2026-01-27",
    filePath: "/contoh-dok/surat-pernyataan-restrukturisasi.pdf",
    fileType: "pdf",
  },
];

const dummyNotarisDebitur: NotarisDebitur[] = [
  {
    id: "NTR-DBT-001",
    debiturId: "DBT001",
    jenisDokumen: "Akad",
    namaNotaris: "Notaris Neta",
    keterangan: "Akta akad pembiayaan utama nasabah.",
    filePath: "/contoh-dok/akad-pembiayaan.pdf",
    fileType: "pdf",
  },
  {
    id: "NTR-DBT-002",
    debiturId: "DBT001",
    jenisDokumen: "APHT",
    namaNotaris: "Notaris Boby",
    keterangan: "Pengikatan hak tanggungan agunan pembiayaan.",
    filePath: "/contoh-dok/sertifikat-jaminan.pdf",
    fileType: "pdf",
  },
  {
    id: "NTR-DBT-003",
    debiturId: "DBT001",
    jenisDokumen: "Fidusia",
    namaNotaris: "Notaris Rendra",
    keterangan: "Akta fidusia jaminan kendaraan nasabah.",
    filePath: "/contoh-dok/surat-pernyataan-restrukturisasi.pdf",
    fileType: "pdf",
  },
  {
    id: "NTR-DBT-004",
    debiturId: "DBT001",
    jenisDokumen: "Roya",
    namaNotaris: "Notaris Wulan",
    keterangan: "Proses roya untuk jaminan lama yang telah lunas.",
    filePath: "/contoh-dok/npwp.pdf",
    fileType: "pdf",
  },
  {
    id: "NTR-DBT-005",
    debiturId: "DBT001",
    jenisDokumen: "Surat Kuasa",
    namaNotaris: "Notaris Tegar",
    keterangan: "Surat kuasa pengurusan dokumen legal pembiayaan.",
    filePath: "/contoh-dok/kartu-keluarga.pdf",
    fileType: "pdf",
  },
  {
    id: "NTR-DBT-006",
    debiturId: "DBT002",
    jenisDokumen: "Fidusia",
    namaNotaris: "Notaris B",
    keterangan: "Dokumen jaminan fidusia kendaraan.",
    filePath: "/contoh-dok/sertifikat-jaminan.pdf",
    fileType: "pdf",
  },
];

export const dummyActionPlan: ActionPlan[] = [
  {
    id: "AP001",
    debiturId: "DBT003",
    tanggal: "2024-12-15",
    rencana: "Kunjungan ke alamat nasabah dan verifikasi usaha",
    targetTanggal: "2024-12-20",
    status: "Proses",
    createdBy: "Marketing",
    lampiranFilePath: "/contoh-dok/surat-pernyataan-restrukturisasi.pdf",
    lampiranFileName: "surat-pernyataan-restrukturisasi.pdf",
    lampiranFileType: "pdf",
    lampiranFileSize: 324000,
  },
  {
    id: "AP002",
    debiturId: "DBT001",
    tanggal: "2024-12-01",
    rencana: "Follow up pembayaran tunggakan via telepon",
    targetTanggal: "2024-12-05",
    status: "Selesai",
    createdBy: "Marketing",
  },
  {
    id: "AP003",
    debiturId: "DBT001",
    tanggal: "2026-01-10",
    rencana: "Kunjungan nasabah ke rumah - konfirmasi tunggakan 3 bulan",
    targetTanggal: "2026-01-11",
    status: "Selesai",
    createdBy: "Rudi Hartono",
    timelineGroupId: "DBT001-TL-01",
    lampiranFilePath: "/contoh-dok/ktp-nasabah.pdf",
    lampiranFileName: "ktp-nasabah.pdf",
    lampiranFileType: "pdf",
    lampiranFileSize: 26461,
  },
  {
    id: "AP004",
    debiturId: "DBT001",
    tanggal: "2026-01-25",
    rencana: "Negosiasi restrukturisasi pembiayaan",
    targetTanggal: "2026-01-27",
    status: "Proses",
    createdBy: "Rudi Hartono",
    timelineGroupId: "DBT001-TL-02",
    lampiranFilePath: "/contoh-dok/surat-pernyataan-restrukturisasi.pdf",
    lampiranFileName: "surat-pernyataan-restrukturisasi.pdf",
    lampiranFileType: "pdf",
    lampiranFileSize: 26461,
  },
  {
    id: "AP005",
    debiturId: "DBT001",
    tanggal: "2026-02-10",
    rencana: "Follow up hasil negosiasi",
    targetTanggal: "2026-02-15",
    status: "Belum",
    createdBy: "Rudi Hartono",
    timelineGroupId: "DBT001-TL-03",
  },
];

export const dummyHasilKunjungan: HasilKunjungan[] = [
  {
    id: "HKJ001",
    debiturId: "DBT003",
    tanggalKunjungan: "2024-12-18",
    alamat: "Jl. Braga No. 78, Bandung",
    hasilKunjungan:
      "Nasabah kooperatif, usaha masih berjalan namun cashflow menurun.",
    kesimpulan: "Perlu restrukturisasi / penjadwalan ulang pembayaran.",
    fotoKunjungan: "/contoh-dok/surat-pernyataan-restrukturisasi.pdf",
    fotoKunjunganNama: "surat-pernyataan-restrukturisasi.pdf",
    fotoKunjunganTipe: "pdf",
    createdBy: "Marketing",
  },
  {
    id: "HKJ002",
    debiturId: "DBT001",
    tanggalKunjungan: "2026-01-11",
    alamat: "Jl. Soekarno Hatta No. 15, Bandung",
    hasilKunjungan: "Nasabah kooperatif, berjanji bayar tanggal 20 Jan",
    kesimpulan: "Komunikasi positif, perlu monitoring realisasi pembayaran.",
    status: "Positif",
    fotoKunjungan: "/contoh-dok/ktp-nasabah.pdf",
    fotoKunjunganNama: "ktp-nasabah.pdf",
    fotoKunjunganTipe: "pdf",
    createdBy: "Rudi Hartono",
    timelineGroupId: "DBT001-TL-01",
  },
  {
    id: "HKJ003",
    debiturId: "DBT001",
    tanggalKunjungan: "2026-01-27",
    alamat: "Jl. Soekarno Hatta No. 15, Bandung",
    hasilKunjungan: "Nasabah minta perpanjangan waktu 1 bulan",
    kesimpulan: "Negosiasi dilanjutkan dengan evaluasi restrukturisasi.",
    status: "Netral",
    fotoKunjungan: "/contoh-dok/surat-pernyataan-restrukturisasi.pdf",
    fotoKunjunganNama: "surat-pernyataan-restrukturisasi.pdf",
    fotoKunjunganTipe: "pdf",
    createdBy: "Rudi Hartono",
    timelineGroupId: "DBT001-TL-02",
  },
];

export const dummyLangkahPenanganan: LangkahPenanganan[] = [
  {
    id: "LP001",
    debiturId: "DBT003",
    tanggal: "2024-12-19",
    langkah: "Surat peringatan dan koordinasi dengan legal",
    hasilPenanganan: "SP-1 dipersiapkan",
    status: "Proses",
    createdBy: "Marketing",
    lampiranFilePath: "/contoh-dok/surat-pernyataan-restrukturisasi.pdf",
    lampiranFileName: "surat-pernyataan-restrukturisasi.pdf",
    lampiranFileType: "pdf",
    lampiranFileSize: 301000,
  },
  {
    id: "LP002",
    debiturId: "DBT001",
    tanggal: "2024-12-03",
    langkah: "Reminder pembayaran",
    hasilPenanganan: "Nasabah berjanji membayar minggu ini",
    status: "Pending",
    createdBy: "Marketing",
  },
  {
    id: "LP003",
    debiturId: "DBT001",
    tanggal: "2026-01-20",
    langkah: "Pembayaran sebagian diterima Rp 5.000.000",
    hasilPenanganan: "Pembayaran parsial diterima dan dicatat ke rekening pembiayaan.",
    status: "Selesai",
    createdBy: "Rudi Hartono",
    timelineGroupId: "DBT001-TL-01",
    lampiranFilePath: "/contoh-dok/akad-pembiayaan.pdf",
    lampiranFileName: "akad-pembiayaan.pdf",
    lampiranFileType: "pdf",
    lampiranFileSize: 26461,
  },
  {
    id: "LP004",
    debiturId: "DBT001",
    tanggal: "2026-02-05",
    langkah: "Surat peringatan pertama diterbitkan",
    hasilPenanganan: "SP1 diterbitkan sambil menunggu hasil restrukturisasi.",
    status: "Selesai",
    createdBy: "Rudi Hartono",
    timelineGroupId: "DBT001-TL-02",
    lampiranFilePath: "/contoh-dok/surat-pernyataan-restrukturisasi.pdf",
    lampiranFileName: "surat-pernyataan-restrukturisasi.pdf",
    lampiranFileType: "pdf",
    lampiranFileSize: 26461,
  },
];

const dummySuratPeringatan: SuratPeringatan[] = [
  {
    id: "SP001",
    debiturId: "DBT003",
    jenisSurat: "SP1",
    tanggalTerbit: "2024-12-20",
    tanggalKirim: "2024-12-21",
    statusKirim: "Sudah Dikirim",
    keterangan: "Tunggakan > 30 hari",
  },
];

export const dummyUploadSLIK: UploadSLIK[] = [
  {
    id: "SLIK001",
    fileName: "slik_januari_2026.xlsx",
    uploadDate: "2026-01-10",
    uploadBy: "Admin",
    status: "Selesai",
    totalRecord: 128,
  },
  {
    id: "SLIK002",
    fileName: "slik_februari_2026.xlsx",
    uploadDate: "2026-02-01",
    uploadBy: "Admin",
    status: "Diproses",
    totalRecord: 154,
  },
];

export const dummyUploadRestrik: UploadRestrik[] = [
  {
    id: "RST001",
    fileName: "restrik_januari_2026.xlsx",
    uploadDate: "2026-01-12",
    uploadBy: "Admin",
    status: "Selesai",
    totalRecord: 42,
  },
  {
    id: "RST002",
    fileName: "restrik_februari_2026.xlsx",
    uploadDate: "2026-02-02",
    uploadBy: "Admin",
    status: "Pending",
    totalRecord: 55,
  },
];

export function getDebiturById(id: string): Debitur | undefined {
  return dummyDebiturList.find((d) => d.id === id);
}

export function getDebiturByNoKontrak(noKontrak: string): Debitur | undefined {
  return dummyDebiturList.find((d) => d.noKontrak === noKontrak);
}

export function getNasabahLegalByNoKontrak(
  noKontrak: string,
): NasabahLegal | undefined {
  return dummyNasabahLegal.find((item) => item.noKontrak === noKontrak);
}

export function getArsipDokumenByKode(kode: string): Dokumen | undefined {
  return dummyDokumen.find((item) => item.kode === kode);
}

export function getPengecekanBPRSByDebiturId(id: string): PengecekanBPRS[] {
  return dummyPengecekanBPRS.filter((d) => d.debiturId === id);
}

export function getHistorisKolektibilitasByDebiturId(
  id: string,
): HistorisKolektibilitas[] {
  return dummyHistorisKolektibilitas
    .filter((d) => d.debiturId === id)
    .sort((a, b) => a.bulan.localeCompare(b.bulan));
}

export function getDokumenByDebiturId(id: string): DokumenDebitur[] {
  return dummyDokumenDebitur.filter((d) => d.debiturId === id);
}

export function getNotarisByDebiturId(id: string): NotarisDebitur[] {
  const notarisByDebitur = dummyNotarisDebitur.filter((item) => item.debiturId === id);
  if (notarisByDebitur.length > 0) {
    return notarisByDebitur;
  }

  const debitur = getDebiturById(id);
  if (!debitur) {
    return [];
  }

  return dummyProgressNotaris
    .filter((item) => item.noKontrak === debitur.noKontrak)
    .map((item) => ({
      id: `NTR-${item.id}`,
      debiturId: id,
      jenisDokumen: item.jenisAkta,
      namaNotaris: item.namaNotaris,
      keterangan: item.catatan,
      filePath: item.lampiranFilePath,
      fileType: item.lampiranFileType,
    }));
}

export function getActionPlanByDebiturId(id: string): ActionPlan[] {
  return dummyActionPlan.filter((d) => d.debiturId === id);
}

export function getHasilKunjunganByDebiturId(id: string): HasilKunjungan[] {
  return dummyHasilKunjungan.filter((d) => d.debiturId === id);
}

export function getLangkahPenangananByDebiturId(
  id: string,
): LangkahPenanganan[] {
  return dummyLangkahPenanganan.filter((d) => d.debiturId === id);
}

export function getSuratPeringatanByDebiturId(id: string): SuratPeringatan[] {
  return dummySuratPeringatan.filter((d) => d.debiturId === id);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getKolektibilitasLabel(
  kol: KolektibilitasType | string,
): string {
  const normalized = String(kol);
  const labels: Record<string, string> = {
    "1": "Kol 1 - Lancar",
    "2": "Kol 2 - DPK",
    "3": "Kol 3 - Kurang Lancar",
    "4": "Kol 4 - Diragukan",
    "5": "Kol 5 - Macet",
  };
  return labels[normalized] ?? `Kol ${normalized}`;
}

export function getKolektibilitasColor(
  kol: KolektibilitasType | string,
): string {
  const normalized = String(kol);
  const colors: Record<string, string> = {
    "1": "#10b981",
    "2": "#f59e0b",
    "3": "#f97316",
    "4": "#ef4444",
    "5": "#b91c1c",
  };
  return colors[normalized] ?? "#6b7280";
}

export interface NasabahAsuransiInfo {
  perusahaan: string;
  jenisAsuransi: "Jiwa" | "Kebakaran" | "Kendaraan";
  nilaiPertanggungan: number;
  periodeAwal: string;
  periodeAkhir: string;
  noPolis: string;
}

export interface KendaraanAgunan {
  noPolisi: string;
  merk: string;
  type: string;
  tahun: number;
  noBPKB: string;
  noRangka: string;
  noMesin: string;
}

export interface NasabahLegal {
  id: number;
  noKontrak: string;
  nama: string;
  nik: string;
  alamat: string;
  cabang: string;
  status: "Aktif" | "Lunas" | "Bermasalah";
  produk: string;
  jenisAkad: string;
  plafond: number;
  margin: number;
  jangkaWaktu: number;
  tanggalAkad: string;
  objekPembiayaan: string;
  agunan: string;
  kolektibilitas: number;
  tunggakanPokok: number;
  tunggakanMargin: number;
  kendaraan?: KendaraanAgunan;
  asuransi?: NasabahAsuransiInfo;
}

export interface TitipanNotaris {
  id: number;
  noKontrak: string;
  namaNasabah: string;
  notarisId?: number;
  namaNotaris: string;
  jenisAkta: "APHT" | "Fidusia" | "Roya" | "Surat Kuasa";
  nominal: number;
  tanggalSetor: string;
  status:
    | "Belum Dibayar"
    | "Sebagian Dibayar"
    | "Sudah Dibayar"
    | "Dikembalikan";
  userInput: string;
  keterangan: string;
  nominalBayar?: number;
  tanggalBayar?: string;
  noAkta?: string;
  tanggalKembali?: string;
  alasanKembali?: string;
  riwayatTransaksi?: TitipanRiwayatTransaksi[];
}

export interface HistoryCetak {
  id: number;
  tanggal: string;
  jenis: string;
  noSurat: string;
  noKontrak: string;
  namaNasabah: string;
  detail: string;
  user: string;
}

export const jenisAkadOptions = [
  "Murabahah",
  "Ijarah",
  "Musyarakah",
  "Mudharabah",
  "Qardh",
];

export interface MasterNotaris {
  id: number;
  nama: string;
  kantor: string;
  telepon: string;
  status: "Aktif" | "Nonaktif";
}

export const dummyMasterNotaris: MasterNotaris[] = [
  {
    id: 1,
    nama: "Notaris A",
    kantor: "Bandung",
    telepon: "022-7001001",
    status: "Aktif",
  },
  {
    id: 2,
    nama: "Notaris B",
    kantor: "Bandung",
    telepon: "022-7001002",
    status: "Aktif",
  },
  {
    id: 3,
    nama: "Notaris C",
    kantor: "Jakarta",
    telepon: "021-7001003",
    status: "Aktif",
  },
];

export const notarisOptions = dummyMasterNotaris
  .filter((n) => n.status === "Aktif")
  .map((n) => n.nama);
export const jenisAktaOptions = ["APHT", "Fidusia", "Roya", "Surat Kuasa"];

export const dummyNasabahLegal: NasabahLegal[] = [
  {
    id: 1,
    noKontrak: "PB/2024/001234",
    nama: "Ahmad Suryanto",
    nik: "3201234567890001",
    alamat: "Jl. Merdeka No. 123, Bandung",
    cabang: "Bandung",
    status: "Aktif",
    produk: "Pembiayaan Kendaraan",
    jenisAkad: "Murabahah",
    plafond: 150000000,
    margin: 30000000,
    jangkaWaktu: 36,
    tanggalAkad: "2024-01-15",
    objekPembiayaan: "Toyota Avanza 1.3 G",
    agunan: "BPKB Toyota Avanza",
    kolektibilitas: 2,
    tunggakanPokok: 5000000,
    tunggakanMargin: 500000,
    kendaraan: {
      noPolisi: "D 1234 ABC",
      merk: "Toyota",
      type: "Avanza 1.3 G",
      tahun: 2021,
      noBPKB: "BPKB-0012345",
      noRangka: "MHKA12345ABCDE678",
      noMesin: "K3VE1234567",
    },
    asuransi: {
      perusahaan: "Askrindo",
      jenisAsuransi: "Kendaraan",
      nilaiPertanggungan: 120000000,
      periodeAwal: "2024-01-15",
      periodeAkhir: "2025-01-15",
      noPolis: "POL-ASK-0001",
    },
  },
  {
    id: 2,
    noKontrak: "PB/2024/001235",
    nama: "Siti Rahayu",
    nik: "3201234567890002",
    alamat: "Jl. Asia Afrika No. 45, Bandung",
    cabang: "Bandung",
    status: "Lunas",
    produk: "Pembiayaan Modal Kerja",
    jenisAkad: "Murabahah",
    plafond: 200000000,
    margin: 50000000,
    jangkaWaktu: 48,
    tanggalAkad: "2023-06-20",
    objekPembiayaan: "Modal kerja usaha retail",
    agunan: "Sertifikat Rumah",
    kolektibilitas: 1,
    tunggakanPokok: 0,
    tunggakanMargin: 0,
  },
  {
    id: 3,
    noKontrak: "PB/2023/000987",
    nama: "Hendra Wijaya",
    nik: "3201234567890003",
    alamat: "Jl. Braga No. 78, Bandung",
    cabang: "Jakarta",
    status: "Aktif",
    produk: "Pembiayaan Multiguna",
    jenisAkad: "Ijarah",
    plafond: 300000000,
    margin: 75000000,
    jangkaWaktu: 60,
    tanggalAkad: "2023-03-10",
    objekPembiayaan: "Multiguna (renovasi rumah)",
    agunan: "SHM No. 12345",
    kolektibilitas: 3,
    tunggakanPokok: 15000000,
    tunggakanMargin: 1500000,
  },
];

export interface LinkedDocument {
  id: number;
  noKontrak: string;
  noBerkas: string;
  keterangan: string;
  tanggalInput: string;
  userInput: string;
}

export const dummyLinkedDocuments: LinkedDocument[] = [
  {
    id: 1,
    noKontrak: "PB/2024/001234",
    noBerkas: "A010254",
    keterangan: "Dokumen akad pembiayaan",
    tanggalInput: "2026-01-20",
    userInput: "Faisal",
  },
  {
    id: 2,
    noKontrak: "PB/2023/000987",
    noBerkas: "A010259",
    keterangan: "Dokumen pembiayaan terkait agunan",
    tanggalInput: "2026-01-22",
    userInput: "Faisal",
  },
];

export interface ProgressAsuransi {
  id: number;
  noKontrak: string;
  namaNasabah: string;
  perusahaanAsuransi: string;
  jenisAsuransi: "Jiwa" | "Kebakaran" | "Kendaraan";
  nilaiPertanggungan: number;
  periodeAwal: string;
  periodeAkhir: string;
  status: "Proses" | "Aktif" | "Expired" | "Klaim";
  userInput: string;
  catatan: string;
  noPolis?: string;
  lampiranFilePath?: string;
  lampiranFileName?: string;
  lampiranFileType?: "pdf";
  lampiranFileSize?: number;
}

export const dummyProgressAsuransi: ProgressAsuransi[] = [
  {
    id: 1,
    noKontrak: "PB/2024/001234",
    namaNasabah: "Ahmad Suryanto",
    perusahaanAsuransi: "Askrindo",
    jenisAsuransi: "Kendaraan",
    nilaiPertanggungan: 120000000,
    periodeAwal: "2024-01-15",
    periodeAkhir: "2025-01-15",
    status: "Aktif",
    userInput: "Faisal",
    catatan: "Polis sudah aktif",
    noPolis: "POL-ASK-0001",
    lampiranFilePath: "/documents/contoh-dok.pdf",
    lampiranFileName: "progress_asuransi_askrindo.pdf",
    lampiranFileType: "pdf",
    lampiranFileSize: 280000,
  },
  {
    id: 2,
    noKontrak: "PB/2023/000987",
    namaNasabah: "Hendra Wijaya",
    perusahaanAsuransi: "Allianz",
    jenisAsuransi: "Jiwa",
    nilaiPertanggungan: 250000000,
    periodeAwal: "2023-03-10",
    periodeAkhir: "2024-03-10",
    status: "Expired",
    userInput: "Faisal",
    catatan: "Perlu perpanjangan polis",
  },
];

export interface ProgressNotaris {
  id: number;
  noKontrak: string;
  namaNasabah: string;
  notarisId?: number;
  namaNotaris: string;
  jenisAkta: "APHT" | "Fidusia" | "Roya" | "Surat Kuasa";
  tanggalMasuk: string;
  estimasiSelesai: string;
  status: "Proses" | "Selesai" | "Bermasalah";
  userInput: string;
  catatan: string;
  noAkta?: string;
  tanggalSelesai?: string;
  lampiranFilePath?: string;
  lampiranFileName?: string;
  lampiranFileType?: "pdf";
  lampiranFileSize?: number;
}

export const dummyProgressNotaris: ProgressNotaris[] = [
  {
    id: 1,
    noKontrak: "PB/2024/001234",
    namaNasabah: "Ahmad Suryanto",
    notarisId: 1,
    namaNotaris: "Notaris A",
    jenisAkta: "APHT",
    tanggalMasuk: "2026-01-15",
    estimasiSelesai: "2026-02-10",
    status: "Proses",
    userInput: "Faisal",
    catatan: "Berkas sedang diproses",
    lampiranFilePath: "/documents/contoh-dok.pdf",
    lampiranFileName: "progress_notaris_apht.pdf",
    lampiranFileType: "pdf",
    lampiranFileSize: 290000,
  },
  {
    id: 2,
    noKontrak: "PB/2024/001235",
    namaNasabah: "Siti Rahayu",
    notarisId: 2,
    namaNotaris: "Notaris B",
    jenisAkta: "Fidusia",
    tanggalMasuk: "2025-12-01",
    estimasiSelesai: "2025-12-20",
    status: "Selesai",
    userInput: "Faisal",
    catatan: "Akta sudah terbit",
    noAkta: "AKTA-2025-0091",
    tanggalSelesai: "2025-12-18",
  },
];

export interface KlaimAsuransi {
  id: number;
  noKontrak: string;
  namaNasabah: string;
  noPolis: string;
  perusahaanAsuransi: string;
  jenisKlaim:
    | "Meninggal Dunia"
    | "Kecelakaan"
    | "Sakit Kritis"
    | "Kebakaran"
    | "Kehilangan";
  nilaiKlaim: number;
  tanggalPengajuan: string;
  status: "Pengajuan" | "Verifikasi" | "Disetujui" | "Ditolak" | "Cair";
  userInput: string;
  catatan: string;
  nilaiCair?: number;
  tanggalCair?: string;
  alasanTolak?: string;
  lampiranFilePath?: string;
  lampiranFileName?: string;
  lampiranFileType?: "pdf";
  lampiranFileSize?: number;
}

export const dummyKlaimAsuransi: KlaimAsuransi[] = [
  {
    id: 1,
    noKontrak: "PB/2024/001234",
    namaNasabah: "Ahmad Suryanto",
    noPolis: "POL-ASK-0001",
    perusahaanAsuransi: "Askrindo",
    jenisKlaim: "Kecelakaan",
    nilaiKlaim: 15000000,
    tanggalPengajuan: "2026-01-28",
    status: "Verifikasi",
    userInput: "Faisal",
    catatan: "Menunggu kelengkapan dokumen",
    lampiranFilePath: "/contoh-dok/surat-pernyataan-restrukturisasi.pdf",
    lampiranFileName: "surat-pernyataan-restrukturisasi.pdf",
    lampiranFileType: "pdf",
    lampiranFileSize: 315000,
  },
  {
    id: 2,
    noKontrak: "PB/2023/000987",
    namaNasabah: "Hendra Wijaya",
    noPolis: "POL-ALL-0098",
    perusahaanAsuransi: "Allianz",
    jenisKlaim: "Sakit Kritis",
    nilaiKlaim: 50000000,
    tanggalPengajuan: "2025-12-10",
    status: "Cair",
    userInput: "Faisal",
    catatan: "Klaim selesai",
    nilaiCair: 48000000,
    tanggalCair: "2026-01-05",
  },
];

export const dummyTitipanNotaris: TitipanNotaris[] = [
  {
    id: 1,
    noKontrak: "PB/2024/001234",
    namaNasabah: "Ahmad Suryanto",
    notarisId: 1,
    namaNotaris: "Notaris A",
    jenisAkta: "APHT",
    nominal: 50000000,
    nominalBayar: 30000000,
    tanggalSetor: "2024-01-20",
    tanggalBayar: "2024-01-22",
    status: "Sebagian Dibayar",
    userInput: "Faisal",
    keterangan: "Biaya APHT",
    riwayatTransaksi: [
      {
        tanggal: "2024-01-20",
        aksi: "Input titipan notaris",
        nominal: 50000000,
        keterangan: "Setoran awal titipan notaris",
      },
      {
        tanggal: "2024-01-21",
        aksi: "Bayar termin 1",
        nominal: 25000000,
        keterangan: "Pembayaran termin pertama",
      },
      {
        tanggal: "2024-01-22",
        aksi: "Bayar termin 2",
        nominal: 5000000,
        keterangan: "Pembayaran termin kedua",
      },
    ],
  },
];

export const dummyHistoryCetak: HistoryCetak[] = [
  {
    id: 1,
    tanggal: "2024-01-20",
    jenis: "Haftsheet",
    noSurat: "HFS/001/I/2024",
    noKontrak: "PB/2024/001234",
    namaNasabah: "Ahmad Suryanto",
    detail: "Checklist dokumen (5/10)",
    user: "Faisal",
  },
];
export interface TitipanAsuransi {
  id: number;
  noKontrak: string;
  namaNasabah: string;
  jenisAsuransi: "Jiwa" | "Kebakaran" | "Kendaraan";
  perusahaanAsuransi: string;
  nominal: number;
  tanggalSetor: string;
  status:
    | "Belum Dibayar"
    | "Sebagian Dibayar"
    | "Sudah Dibayar"
    | "Dikembalikan";
  userInput: string;
  keterangan: string;
  nominalBayar?: number;
  noPolis?: string;
  noBuktiBayar?: string;
  tanggalBayar?: string;
  tanggalKembali?: string;
  alasanKembali?: string;
  riwayatTransaksi?: TitipanRiwayatTransaksi[];
}

export interface TitipanAngsuran {
  id: number;
  noKontrak: string;
  namaNasabah: string;
  keperluan: string;
  nominal: number;
  tanggalSetor: string;
  status: "Pending" | "Sebagian Diproses" | "Sudah Diproses" | "Dikembalikan";
  userInput: string;
  keterangan: string;
  nominalDiproses?: number;
  tanggalProses?: string;
  keteranganProses?: string;
  tanggalKembali?: string;
  alasanKembali?: string;
  riwayatTransaksi?: TitipanRiwayatTransaksi[];
}

export interface TitipanRiwayatTransaksi {
  tanggal: string;
  nominal: number;
  aksi: string;
  keterangan?: string;
}

export const jenisAsuransiOptions = ["Jiwa", "Kebakaran", "Kendaraan"];
export const perusahaanAsuransiOptions = [
  "Askrindo",
  "Jamkrindo",
  "Allianz",
  "Sinarmas",
];

export const dummyTitipanAsuransi: TitipanAsuransi[] = [
  {
    id: 1,
    noKontrak: "PB/2024/001234",
    namaNasabah: "Ahmad Suryanto",
    jenisAsuransi: "Jiwa",
    perusahaanAsuransi: "Askrindo",
    nominal: 500000,
    tanggalSetor: "2024-01-22",
    status: "Belum Dibayar",
    userInput: "Faisal",
    keterangan: "Premi Asuransi Jiwa",
    riwayatTransaksi: [
      {
        tanggal: "2024-01-22",
        aksi: "Input titipan asuransi",
        nominal: 500000,
        keterangan: "Setoran premi asuransi jiwa",
      },
    ],
  },
];

export const dummyTitipanAngsuran: TitipanAngsuran[] = [
  {
    id: 1,
    noKontrak: "PB/2024/001234",
    namaNasabah: "Ahmad Suryanto",
    keperluan: "Angsuran",
    nominal: 4500000,
    tanggalSetor: "2024-01-23",
    status: "Pending",
    userInput: "Faisal",
    keterangan: "Titipan Angsuran ke-1",
    riwayatTransaksi: [
      {
        tanggal: "2024-01-23",
        aksi: "Input titipan angsuran",
        nominal: 4500000,
        keterangan: "Titipan angsuran ke-1",
      },
    ],
  },
];

export interface HistorisTitipanDebitur {
  id: string;
  sumberId: number;
  jenisTitipan: "Notaris" | "Asuransi" | "Angsuran";
  noKontrak: string;
  tanggal: string;
  nominal: number;
  nominalTitipan: number;
  nominalTerbayar: number;
  saldoAkhir: number;
  status: string;
  keterangan: string;
  riwayatTransaksi: TitipanRiwayatTransaksi[];
}

export function getKlaimAsuransiByNoKontrak(
  noKontrak: string,
): KlaimAsuransi[] {
  return dummyKlaimAsuransi.filter((item) => item.noKontrak === noKontrak);
}

export function getTitipanByNoKontrak(noKontrak: string): {
  notaris: TitipanNotaris[];
  asuransi: TitipanAsuransi[];
  angsuran: TitipanAngsuran[];
} {
  return {
    notaris: dummyTitipanNotaris.filter((item) => item.noKontrak === noKontrak),
    asuransi: dummyTitipanAsuransi.filter(
      (item) => item.noKontrak === noKontrak,
    ),
    angsuran: dummyTitipanAngsuran.filter(
      (item) => item.noKontrak === noKontrak,
    ),
  };
}

function toSafeNominal(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(value, 0);
}

function sortRiwayatDesc(riwayat: TitipanRiwayatTransaksi[]) {
  return [...riwayat].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
}

function getNominalTerbayarNotaris(item: TitipanNotaris): number {
  if (typeof item.nominalBayar === "number") {
    return Math.min(toSafeNominal(item.nominalBayar), item.nominal);
  }
  const fromRiwayat = (item.riwayatTransaksi ?? [])
    .filter((r) => /(bayar|termin)/i.test(r.aksi))
    .reduce((sum, r) => sum + toSafeNominal(r.nominal), 0);
  if (fromRiwayat > 0) {
    return Math.min(fromRiwayat, item.nominal);
  }
  if (item.status === "Sudah Dibayar") {
    return item.nominal;
  }
  return 0;
}

function getNominalTerbayarAsuransi(item: TitipanAsuransi): number {
  if (typeof item.nominalBayar === "number") {
    return Math.min(toSafeNominal(item.nominalBayar), item.nominal);
  }
  const fromRiwayat = (item.riwayatTransaksi ?? [])
    .filter((r) => /(bayar|termin)/i.test(r.aksi))
    .reduce((sum, r) => sum + toSafeNominal(r.nominal), 0);
  if (fromRiwayat > 0) {
    return Math.min(fromRiwayat, item.nominal);
  }
  if (item.status === "Sudah Dibayar") {
    return item.nominal;
  }
  return 0;
}

function getNominalTerbayarAngsuran(item: TitipanAngsuran): number {
  if (typeof item.nominalDiproses === "number") {
    return Math.min(toSafeNominal(item.nominalDiproses), item.nominal);
  }
  const fromRiwayat = (item.riwayatTransaksi ?? [])
    .filter((r) => /(proses|termin|bayar)/i.test(r.aksi))
    .reduce((sum, r) => sum + toSafeNominal(r.nominal), 0);
  if (fromRiwayat > 0) {
    return Math.min(fromRiwayat, item.nominal);
  }
  if (item.status === "Sudah Diproses") {
    return item.nominal;
  }
  return 0;
}

function getRiwayatNotaris(item: TitipanNotaris): TitipanRiwayatTransaksi[] {
  if (item.riwayatTransaksi && item.riwayatTransaksi.length > 0) {
    return sortRiwayatDesc(item.riwayatTransaksi);
  }

  const riwayat: TitipanRiwayatTransaksi[] = [
    {
      tanggal: item.tanggalSetor,
      nominal: item.nominal,
      aksi: "Input titipan notaris",
      keterangan: item.keterangan,
    },
  ];
  const nominalTerbayar = getNominalTerbayarNotaris(item);
  if (nominalTerbayar > 0) {
    riwayat.push({
      tanggal: item.tanggalBayar ?? item.tanggalSetor,
      nominal: nominalTerbayar,
      aksi: "Pembayaran titipan notaris",
      keterangan: item.noAkta ? `No Akta: ${item.noAkta}` : undefined,
    });
  }
  if (item.tanggalKembali) {
    riwayat.push({
      tanggal: item.tanggalKembali,
      nominal: Math.max(item.nominal - nominalTerbayar, 0),
      aksi: "Pengembalian titipan notaris",
      keterangan: item.alasanKembali,
    });
  }

  return sortRiwayatDesc(riwayat);
}

function getRiwayatAsuransi(item: TitipanAsuransi): TitipanRiwayatTransaksi[] {
  if (item.riwayatTransaksi && item.riwayatTransaksi.length > 0) {
    return sortRiwayatDesc(item.riwayatTransaksi);
  }

  const riwayat: TitipanRiwayatTransaksi[] = [
    {
      tanggal: item.tanggalSetor,
      nominal: item.nominal,
      aksi: "Input titipan asuransi",
      keterangan: item.keterangan,
    },
  ];
  const nominalTerbayar = getNominalTerbayarAsuransi(item);
  if (nominalTerbayar > 0) {
    riwayat.push({
      tanggal: item.tanggalBayar ?? item.tanggalSetor,
      nominal: nominalTerbayar,
      aksi: "Pembayaran titipan asuransi",
      keterangan: item.noBuktiBayar
        ? `No Bukti Bayar: ${item.noBuktiBayar}`
        : undefined,
    });
  }
  if (item.tanggalKembali) {
    riwayat.push({
      tanggal: item.tanggalKembali,
      nominal: Math.max(item.nominal - nominalTerbayar, 0),
      aksi: "Pengembalian titipan asuransi",
      keterangan: item.alasanKembali,
    });
  }

  return sortRiwayatDesc(riwayat);
}

function getRiwayatAngsuran(item: TitipanAngsuran): TitipanRiwayatTransaksi[] {
  if (item.riwayatTransaksi && item.riwayatTransaksi.length > 0) {
    return sortRiwayatDesc(item.riwayatTransaksi);
  }

  const riwayat: TitipanRiwayatTransaksi[] = [
    {
      tanggal: item.tanggalSetor,
      nominal: item.nominal,
      aksi: "Input titipan angsuran",
      keterangan: item.keterangan,
    },
  ];
  const nominalTerproses = getNominalTerbayarAngsuran(item);
  if (nominalTerproses > 0) {
    riwayat.push({
      tanggal: item.tanggalProses ?? item.tanggalSetor,
      nominal: nominalTerproses,
      aksi: "Proses titipan angsuran",
      keterangan: item.keteranganProses,
    });
  }
  if (item.tanggalKembali) {
    riwayat.push({
      tanggal: item.tanggalKembali,
      nominal: Math.max(item.nominal - nominalTerproses, 0),
      aksi: "Pengembalian titipan angsuran",
      keterangan: item.alasanKembali,
    });
  }

  return sortRiwayatDesc(riwayat);
}

export function getHistorisTitipanByNoKontrak(
  noKontrak: string,
): HistorisTitipanDebitur[] {
  const { notaris, asuransi, angsuran } = getTitipanByNoKontrak(noKontrak);
  return [
    ...notaris.map((item) => {
      const nominalTitipan = item.nominal;
      const nominalTerbayar = getNominalTerbayarNotaris(item);
      const saldoAkhir = Math.max(nominalTitipan - nominalTerbayar, 0);
      const riwayatTransaksi = getRiwayatNotaris(item);
      return {
        id: `notaris-${item.id}`,
        sumberId: item.id,
        jenisTitipan: "Notaris" as const,
        noKontrak: item.noKontrak,
        tanggal: riwayatTransaksi[0]?.tanggal ?? item.tanggalSetor,
        nominal: nominalTitipan,
        nominalTitipan,
        nominalTerbayar,
        saldoAkhir,
        status: item.status,
        keterangan: item.keterangan,
        riwayatTransaksi,
      };
    }),
    ...asuransi.map((item) => {
      const nominalTitipan = item.nominal;
      const nominalTerbayar = getNominalTerbayarAsuransi(item);
      const saldoAkhir = Math.max(nominalTitipan - nominalTerbayar, 0);
      const riwayatTransaksi = getRiwayatAsuransi(item);
      return {
        id: `asuransi-${item.id}`,
        sumberId: item.id,
        jenisTitipan: "Asuransi" as const,
        noKontrak: item.noKontrak,
        tanggal: riwayatTransaksi[0]?.tanggal ?? item.tanggalSetor,
        nominal: nominalTitipan,
        nominalTitipan,
        nominalTerbayar,
        saldoAkhir,
        status: item.status,
        keterangan: item.keterangan,
        riwayatTransaksi,
      };
    }),
    ...angsuran.map((item) => {
      const nominalTitipan = item.nominal;
      const nominalTerbayar = getNominalTerbayarAngsuran(item);
      const saldoAkhir = Math.max(nominalTitipan - nominalTerbayar, 0);
      const riwayatTransaksi = getRiwayatAngsuran(item);
      return {
        id: `angsuran-${item.id}`,
        sumberId: item.id,
        jenisTitipan: "Angsuran" as const,
        noKontrak: item.noKontrak,
        tanggal: riwayatTransaksi[0]?.tanggal ?? item.tanggalSetor,
        nominal: nominalTitipan,
        nominalTitipan,
        nominalTerbayar,
        saldoAkhir,
        status: item.status,
        keterangan: item.keterangan,
        riwayatTransaksi,
      };
    }),
  ].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
}

export function getSaldoDanaTitipanByNoKontrak(noKontrak: string): number {
  return getHistorisTitipanByNoKontrak(noKontrak)
    .filter((item) => item.status !== "Dikembalikan")
    .reduce((total, item) => total + item.saldoAkhir, 0);
}

const IDEB_MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

const pihakKetigaSeed = {
  NOTARIS: [
    {
      id: "pk-001",
      nama: "Notaris Ahmad Subagyo SH",
      kodeDokumen: "NTR-001",
      jenisDokumen: "Akta",
      namaDokumen: "Akta Pembiayaan Kolektif",
      detailDokumen: "Dokumen akta pembiayaan untuk batch awal tahun 2026.",
      tanggalInput: "2026-01-10",
      userInput: "Faisal",
      prosesBerjalan: 4,
      laporanSelesai: 15,
      lewatExpired: 1,
    },
    {
      id: "pk-002",
      nama: "Notaris Siti Rahayu SH MKn",
      kodeDokumen: "NTR-002",
      jenisDokumen: "Pengikatan",
      namaDokumen: "Dokumen Pengikatan Jaminan",
      detailDokumen: "Pengikatan jaminan pembiayaan produktif dan konsumer.",
      tanggalInput: "2026-01-14",
      userInput: "Annas",
      prosesBerjalan: 5,
      laporanSelesai: 18,
      lewatExpired: 0,
    },
  ],
  ASURANSI: [
    {
      id: "pk-003",
      nama: "PT Asuransi Jiwa Syariah",
      kodeDokumen: "ASR-001",
      jenisDokumen: "Polis",
      namaDokumen: "Polis Penjaminan Pembiayaan",
      detailDokumen: "Dokumen polis penjaminan nasabah pembiayaan aktif.",
      tanggalInput: "2026-01-12",
      userInput: "Anggita",
      prosesBerjalan: 3,
      laporanSelesai: 12,
      lewatExpired: 1,
    },
    {
      id: "pk-004",
      nama: "PT Asuransi Takaful Keluarga",
      kodeDokumen: "ASR-002",
      jenisDokumen: "Klaim",
      namaDokumen: "Dokumen Klaim Penutupan",
      detailDokumen: "Dokumen klaim dan penutupan asuransi pembiayaan.",
      tanggalInput: "2026-01-18",
      userInput: "Burhan",
      prosesBerjalan: 5,
      laporanSelesai: 20,
      lewatExpired: 0,
    },
  ],
  KJPP: [
    {
      id: "pk-005",
      nama: "KJPP Rengganis & Rekan",
      kodeDokumen: "KJP-001",
      jenisDokumen: "Appraisal",
      namaDokumen: "Laporan Penilaian Agunan",
      detailDokumen: "Penilaian agunan ruko dan properti pembiayaan komersial.",
      tanggalInput: "2026-01-20",
      userInput: "Faisal",
      prosesBerjalan: 2,
      laporanSelesai: 8,
      lewatExpired: 1,
    },
    {
      id: "pk-006",
      nama: "KJPP Toto Suharto & Rekan",
      kodeDokumen: "KJP-002",
      jenisDokumen: "Review",
      namaDokumen: "Review Nilai Agunan",
      detailDokumen: "Review penilaian ulang agunan untuk pembiayaan restrukturisasi.",
      tanggalInput: "2026-01-22",
      userInput: "Annas",
      prosesBerjalan: 3,
      laporanSelesai: 10,
      lewatExpired: 1,
    },
  ],
} satisfies Record<
  PihakKetigaKategori,
  Array<{
    id: string;
    nama: string;
    kodeDokumen: string;
    jenisDokumen: string;
    namaDokumen: string;
    detailDokumen: string;
    tanggalInput: string;
    userInput: string;
    prosesBerjalan: number;
    laporanSelesai: number;
    lewatExpired: number;
  }>
>;

const pihakKetigaKategoriOrder: PihakKetigaKategori[] = [
  "NOTARIS",
  "ASURANSI",
  "KJPP",
];

export const pihakKetigaData: PihakKetiga[] = pihakKetigaKategoriOrder.flatMap(
  (kategori) =>
    pihakKetigaSeed[kategori].map((item) => ({
      ...item,
      kategori,
    })),
);

export const pihakKetigaSummary: PihakKetigaSummary[] =
  pihakKetigaKategoriOrder.map((kategori) => {
    const items = pihakKetigaData.filter((item) => item.kategori === kategori);

    return {
      kategori,
      jumlahPihakKetiga: items.length,
      prosesBerjalan: items.reduce(
        (total, item) => total + item.prosesBerjalan,
        0,
      ),
      laporanSelesai: items.reduce(
        (total, item) => total + item.laporanSelesai,
        0,
      ),
      lewatExpired: items.reduce((total, item) => total + item.lewatExpired, 0),
    };
  });

const progressPihakKetigaBaseDate: Record<string, string> = {
  "pk-001": "2025-12-10",
  "pk-002": "2025-12-16",
  "pk-003": "2025-12-08",
  "pk-004": "2025-12-18",
  "pk-005": "2025-12-04",
  "pk-006": "2025-12-14",
};

const progressPihakKetigaContractPrefix: Record<string, string> = {
  "pk-001": "PB/2024/001",
  "pk-002": "PB/2024/002",
  "pk-003": "PB/2024/003",
  "pk-004": "PB/2024/004",
  "pk-005": "PB/2024/005",
  "pk-006": "PB/2024/006",
};

const progressPihakKetigaFirstNames = [
  "Ahmad",
  "Budi",
  "Cahya",
  "Dewi",
  "Eko",
  "Fajar",
  "Gina",
  "Hendra",
  "Intan",
  "Joko",
  "Kartika",
  "Lia",
  "Maya",
  "Nanda",
  "Oki",
  "Putri",
  "Qori",
  "Rizky",
  "Siti",
  "Teguh",
  "Ulfa",
  "Vina",
  "Wahyu",
  "Yusuf",
  "Zahra",
];

const progressPihakKetigaLastNames = [
  "Suryanto",
  "Santoso",
  "Pratama",
  "Lestari",
  "Saputra",
  "Rahmawati",
  "Wijaya",
  "Permata",
  "Hidayat",
  "Maulana",
  "Kurniasih",
  "Gunawan",
  "Amelia",
  "Prasetyo",
  "Handayani",
  "Ramadhan",
  "Nugraha",
  "Puspita",
  "Setiawan",
  "Herlambang",
  "Maesaroh",
  "Ramadhani",
  "Wicaksono",
  "Fadilah",
  "Salsabila",
];

function addDaysToIsoDate(value: string, days: number) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function getProgressPihakKetigaName(entityIndex: number, entryIndex: number) {
  const firstName =
    progressPihakKetigaFirstNames[
      (entityIndex * 7 + entryIndex) % progressPihakKetigaFirstNames.length
    ];
  const lastName =
    progressPihakKetigaLastNames[
      (entityIndex * 11 + entryIndex) % progressPihakKetigaLastNames.length
    ];

  return `${firstName} ${lastName}`;
}

function getProgressPihakKetigaNote(
  kategori: PihakKetigaKategori,
  status: ProgressPihakKetiga["status"],
) {
  if (kategori === "NOTARIS") {
    if (status === "SELESAI") {
      return "Dokumen akta dan pengikatan telah selesai diverifikasi.";
    }

    if (status === "PROSES") {
      return "Menunggu penjadwalan tanda tangan dan finalisasi dokumen.";
    }

    return "Dokumen melewati target penyelesaian dan perlu follow up.";
  }

  if (kategori === "ASURANSI") {
    if (status === "SELESAI") {
      return "Polis atau klaim telah diselesaikan dan diarsipkan.";
    }

    if (status === "PROSES") {
      return "Masih menunggu approval pihak asuransi.";
    }

    return "Dokumen klaim melewati SLA dan perlu eskalasi.";
  }

  if (status === "SELESAI") {
    return "Laporan appraisal telah diterima dan tervalidasi.";
  }

  if (status === "PROSES") {
    return "Penilaian lapangan dan review agunan masih berjalan.";
  }

  return "Laporan penilaian terlambat dari jadwal yang ditetapkan.";
}

export const progressPihakKetiga: ProgressPihakKetiga[] = pihakKetigaData.flatMap(
  (item, entityIndex) => {
    const statuses: ProgressPihakKetiga["status"][] = [
      ...Array.from({ length: item.laporanSelesai }, () => "SELESAI" as const),
      ...Array.from({ length: item.prosesBerjalan }, () => "PROSES" as const),
      ...Array.from({ length: item.lewatExpired }, () => "EXPIRED" as const),
    ];
    const baseDate = progressPihakKetigaBaseDate[item.id];
    const contractPrefix = progressPihakKetigaContractPrefix[item.id];

    return statuses.map((status, index) => {
      const startOffset = index * 2;
      const tanggalMulai = addDaysToIsoDate(baseDate, startOffset);
      const tanggalSelesai =
        status === "PROSES"
          ? undefined
          : addDaysToIsoDate(baseDate, startOffset + (status === "SELESAI" ? 6 : 14));

      return {
        id: `ppk-${item.id}-${String(index + 1).padStart(3, "0")}`,
        pihakKetigaId: item.id,
        namaNasabah: getProgressPihakKetigaName(entityIndex, index),
        noKontrak: `${contractPrefix}/${String(index + 1).padStart(3, "0")}`,
        status,
        tanggalMulai,
        tanggalSelesai,
        keterangan: getProgressPihakKetigaNote(item.kategori, status),
      };
    });
  },
);

export const npfKolektibilitasColors: Record<number, string> = {
  1: "#22c55e",
  2: "#eab308",
  3: "#f97316",
  4: "#ef4444",
  5: "#991b1b",
};

export const kolektibilitasData: KolektibilitasItem[] = [
  {
    kol: 1,
    label: "Kol 1 / Lancar",
    jumlahNasabah: 132,
    outstandingPokok: 28600000000,
  },
  {
    kol: 2,
    label: "Kol 2 / Dalam Perhatian",
    jumlahNasabah: 21,
    outstandingPokok: 3650000000,
  },
  {
    kol: 3,
    label: "Kol 3 / Kurang Lancar",
    jumlahNasabah: 11,
    outstandingPokok: 2140000000,
  },
  {
    kol: 4,
    label: "Kol 4 / Diragukan",
    jumlahNasabah: 5,
    outstandingPokok: 1190000000,
  },
  {
    kol: 5,
    label: "Kol 5 / Macet",
    jumlahNasabah: 3,
    outstandingPokok: 820000000,
  },
];

export const nasabahKolektibilitasData: KolektibilitasNasabahItem[] = [
  {
    nama: "Ahmad Suryanto",
    noKontrak: "PB/2025/010101",
    outstandingPokok: 185000000,
    sisaBulan: 42,
    kolektibilitas: 1,
  },
  {
    nama: "Rani Permata",
    noKontrak: "PB/2025/010102",
    outstandingPokok: 142000000,
    sisaBulan: 36,
    kolektibilitas: 1,
  },
  {
    nama: "Fajar Hidayat",
    noKontrak: "PB/2024/010103",
    outstandingPokok: 98000000,
    sisaBulan: 24,
    kolektibilitas: 1,
  },
  {
    nama: "Dewi Kartika",
    noKontrak: "PB/2024/010104",
    outstandingPokok: 76000000,
    sisaBulan: 18,
    kolektibilitas: 1,
  },
  {
    nama: "Yusuf Maulana",
    noKontrak: "PB/2025/010105",
    outstandingPokok: 56000000,
    sisaBulan: 12,
    kolektibilitas: 1,
  },
  {
    nama: "Siti Rahayu",
    noKontrak: "PB/2024/020201",
    outstandingPokok: 146000000,
    sisaBulan: 30,
    kolektibilitas: 2,
  },
  {
    nama: "Budi Santoso",
    noKontrak: "PB/2024/020202",
    outstandingPokok: 94000000,
    sisaBulan: 18,
    kolektibilitas: 2,
  },
  {
    nama: "Nina Aprilia",
    noKontrak: "PB/2025/020203",
    outstandingPokok: 61000000,
    sisaBulan: 12,
    kolektibilitas: 2,
  },
  {
    nama: "Rizki Ananda",
    noKontrak: "PB/2025/020204",
    outstandingPokok: 33000000,
    sisaBulan: 8,
    kolektibilitas: 2,
  },
  {
    nama: "Hendra Wijaya",
    noKontrak: "PB/2023/030301",
    outstandingPokok: 92000000,
    sisaBulan: 20,
    kolektibilitas: 3,
  },
  {
    nama: "Lia Kurniasih",
    noKontrak: "PB/2024/030302",
    outstandingPokok: 58000000,
    sisaBulan: 11,
    kolektibilitas: 3,
  },
  {
    nama: "Teguh Saputra",
    noKontrak: "PB/2025/030303",
    outstandingPokok: 27000000,
    sisaBulan: 4,
    kolektibilitas: 3,
  },
  {
    nama: "Maya Fitriani",
    noKontrak: "PB/2024/040401",
    outstandingPokok: 72000000,
    sisaBulan: 9,
    kolektibilitas: 4,
  },
  {
    nama: "Joko Prasetyo",
    noKontrak: "PB/2023/040402",
    outstandingPokok: 21000000,
    sisaBulan: 2,
    kolektibilitas: 4,
  },
  {
    nama: "Rudi Hartono",
    noKontrak: "PB/2023/050501",
    outstandingPokok: 54000000,
    sisaBulan: 5,
    kolektibilitas: 5,
  },
  {
    nama: "Anisa Rahma",
    noKontrak: "PB/2024/050502",
    outstandingPokok: 18000000,
    sisaBulan: 1,
    kolektibilitas: 5,
  },
];

export const riwayatNPFData: RiwayatNPF[] = [
  {
    tahun: 2025,
    bulan: 4,
    namaBulan: "April",
    jumlahNasabah: 156,
    outstandingPokok: 33980000000,
    rasioNPF: 9.4,
  },
  {
    tahun: 2025,
    bulan: 5,
    namaBulan: "Mei",
    jumlahNasabah: 158,
    outstandingPokok: 34240000000,
    rasioNPF: 9.1,
  },
  {
    tahun: 2025,
    bulan: 6,
    namaBulan: "Juni",
    jumlahNasabah: 160,
    outstandingPokok: 34470000000,
    rasioNPF: 9.0,
  },
  {
    tahun: 2025,
    bulan: 7,
    namaBulan: "Juli",
    jumlahNasabah: 161,
    outstandingPokok: 34610000000,
    rasioNPF: 8.9,
  },
  {
    tahun: 2025,
    bulan: 8,
    namaBulan: "Agustus",
    jumlahNasabah: 163,
    outstandingPokok: 34940000000,
    rasioNPF: 8.7,
  },
  {
    tahun: 2025,
    bulan: 9,
    namaBulan: "September",
    jumlahNasabah: 165,
    outstandingPokok: 35220000000,
    rasioNPF: 8.3,
  },
  {
    tahun: 2025,
    bulan: 10,
    namaBulan: "Oktober",
    jumlahNasabah: 167,
    outstandingPokok: 35650000000,
    rasioNPF: 8.1,
  },
  {
    tahun: 2025,
    bulan: 11,
    namaBulan: "November",
    jumlahNasabah: 168,
    outstandingPokok: 36030000000,
    rasioNPF: 7.8,
  },
  {
    tahun: 2025,
    bulan: 12,
    namaBulan: "Desember",
    jumlahNasabah: 169,
    outstandingPokok: 36380000000,
    rasioNPF: 7.6,
  },
  {
    tahun: 2026,
    bulan: 1,
    namaBulan: "Januari",
    jumlahNasabah: 170,
    outstandingPokok: 36640000000,
    rasioNPF: 7.3,
  },
  {
    tahun: 2026,
    bulan: 2,
    namaBulan: "Februari",
    jumlahNasabah: 171,
    outstandingPokok: 36920000000,
    rasioNPF: 7.0,
  },
  {
    tahun: 2026,
    bulan: 3,
    namaBulan: "Maret",
    jumlahNasabah: 172,
    outstandingPokok: 36400000000,
    rasioNPF: 11.4,
  },
];

export const titipanNasabahData: TitipanNasabah[] = [
  {
    id: "titipan-001",
    nama: "Ahmad Fauzi",
    jenisTitipan: "NOTARIS",
    pihakKetigaId: "pk-001",
    totalTitipan: 85000000,
    saldoTerbayar: 60000000,
    sisaSaldo: 25000000,
  },
  {
    id: "titipan-002",
    nama: "Siti Aminah",
    jenisTitipan: "NOTARIS",
    pihakKetigaId: "pk-001",
    totalTitipan: 65000000,
    saldoTerbayar: 40000000,
    sisaSaldo: 25000000,
  },
  {
    id: "titipan-003",
    nama: "Budi Wicaksono",
    jenisTitipan: "NOTARIS",
    pihakKetigaId: "pk-002",
    totalTitipan: 72000000,
    saldoTerbayar: 72000000,
    sisaSaldo: 0,
  },
  {
    id: "titipan-004",
    nama: "Dewi Lestari",
    jenisTitipan: "ASURANSI",
    pihakKetigaId: "pk-003",
    totalTitipan: 45000000,
    saldoTerbayar: 45000000,
    sisaSaldo: 0,
  },
  {
    id: "titipan-005",
    nama: "Rizky Pratama",
    jenisTitipan: "ASURANSI",
    pihakKetigaId: "pk-003",
    totalTitipan: 55000000,
    saldoTerbayar: 30000000,
    sisaSaldo: 25000000,
  },
  {
    id: "titipan-006",
    nama: "Hendra Gunawan",
    jenisTitipan: "ASURANSI",
    pihakKetigaId: "pk-004",
    totalTitipan: 38000000,
    saldoTerbayar: 20000000,
    sisaSaldo: 18000000,
  },
  {
    id: "titipan-007",
    nama: "Budi Santoso",
    jenisTitipan: "ANGSURAN",
    pihakKetigaId: null,
    totalTitipan: 120000000,
    saldoTerbayar: 95000000,
    sisaSaldo: 25000000,
  },
  {
    id: "titipan-008",
    nama: "Nurul Hidayah",
    jenisTitipan: "ANGSURAN",
    pihakKetigaId: null,
    totalTitipan: 95000000,
    saldoTerbayar: 80000000,
    sisaSaldo: 15000000,
  },
  {
    id: "titipan-009",
    nama: "Eko Prasetyo",
    jenisTitipan: "ANGSURAN",
    pihakKetigaId: null,
    totalTitipan: 150000000,
    saldoTerbayar: 150000000,
    sisaSaldo: 0,
  },
];

const titipanSummaryOrder: JenisTitipan[] = ["NOTARIS", "ASURANSI", "ANGSURAN"];

export const titipanSummary: TitipanSummary[] = titipanSummaryOrder.map(
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
      totalTitipan,
      saldoTerbayar,
      sisaSaldo,
      jumlahNasabah: items.length,
      lunas: sisaSaldo === 0,
    };
  },
);

function deriveIdebRiwayatBprsLain(debiturId: string): RiwayatBPRSLain[] {
  const shortMonthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ] as const;

  return dummyPengecekanBPRS
    .filter((item) => item.debiturId === debiturId && item.status !== "Tidak Ada")
    .map((item) => ({
      namaBPRS: item.namaBPRS,
      kolektibilitas: Number(item.kolektibilitas),
      osPokok: item.outstanding,
      periode: (() => {
        const [year, month] = item.tanggalCek.split("-");
        const monthIndex = Number(month);

        if (!year || !Number.isFinite(monthIndex) || monthIndex < 1 || monthIndex > 12) {
          return item.tanggalCek;
        }

        return `${shortMonthNames[monthIndex - 1]} ${year}`;
      })(),
    }));
}

const idebRingkasanTemplates: Partial<Record<string, IdebRingkasan>> = {
  DBT001: {
    kolektibilitasBerjalan: 1,
    osPokok: 120000000,
    statusPembiayaan: "Lancar",
    riwayatBPRSLain: [
      {
        namaBPRS: "BPRS Amanah Sejahtera",
        kolektibilitas: 1,
        osPokok: 45000000,
        periode: "Des 2024",
      },
      {
        namaBPRS: "BPRS Barokah Mandiri",
        kolektibilitas: 1,
        osPokok: 0,
        periode: "Nov 2024",
      },
    ],
    kesimpulan: "AMAN",
  },
  DBT002: {
    kolektibilitasBerjalan: 2,
    osPokok: 0,
    statusPembiayaan: "Dalam perhatian khusus",
    riwayatBPRSLain: [
      {
        namaBPRS: "BPRS Dana Syariah",
        kolektibilitas: 2,
        osPokok: 18000000,
        periode: "Agu 2025",
      },
    ],
    kesimpulan: "PERHATIAN",
  },
  DBT004: {
    kolektibilitasBerjalan: 3,
    osPokok: 50000000,
    statusPembiayaan: "Perlu penanganan",
    riwayatBPRSLain: [
      {
        namaBPRS: "BPRS Mitra Syariah",
        kolektibilitas: 3,
        osPokok: 25000000,
        periode: "Feb 2025",
      },
      {
        namaBPRS: "BPRS Sejahtera",
        kolektibilitas: 2,
        osPokok: 12000000,
        periode: "Jan 2025",
      },
    ],
    kesimpulan: "BERMASALAH",
  },
  DBT005: {
    kolektibilitasBerjalan: 1,
    osPokok: 400000000,
    statusPembiayaan: "Lancar",
    riwayatBPRSLain: [],
    kesimpulan: "AMAN",
  },
};

function cloneIdebRingkasan(ringkasan: IdebRingkasan): IdebRingkasan {
  return {
    ...ringkasan,
    riwayatBPRSLain: ringkasan.riwayatBPRSLain.map((item) => ({ ...item })),
  };
}

export function buildIdebRingkasanByDebiturId(debiturId: string): IdebRingkasan {
  const debitur = getDebiturById(debiturId);
  const template = idebRingkasanTemplates[debiturId];

  if (template) {
    return cloneIdebRingkasan(template);
  }

  const kolektibilitasBerjalan = Number(debitur?.kolektibilitas ?? 1);
  const riwayatBPRSLain = deriveIdebRiwayatBprsLain(debiturId);

  let kesimpulan: IdebRingkasan["kesimpulan"] = "AMAN";
  if (
    kolektibilitasBerjalan >= 3 ||
    riwayatBPRSLain.some((item) => item.kolektibilitas >= 3)
  ) {
    kesimpulan = "BERMASALAH";
  } else if (
    kolektibilitasBerjalan === 2 ||
    riwayatBPRSLain.some((item) => item.kolektibilitas === 2)
  ) {
    kesimpulan = "PERHATIAN";
  }

  return {
    kolektibilitasBerjalan,
    osPokok: debitur?.osPokok ?? 0,
    statusPembiayaan:
      kolektibilitasBerjalan >= 3
        ? "Perlu penanganan"
        : kolektibilitasBerjalan === 2
          ? "Dalam perhatian"
          : "Lancar",
    riwayatBPRSLain,
    kesimpulan,
  };
}

export const dummyIdebRecords: IdebRecord[] = [
  {
    id: "IDEB-2025-01-DBT001",
    debiturId: "DBT001",
    namaNasabah: "Ahmad Suryanto",
    noKontrak: "PB/2024/001234",
    bulan: 1,
    namaBulan: IDEB_MONTH_NAMES[0],
    tahun: 2025,
    tanggalUpload: "2025-01-20",
    status: "CHECKED",
    ringkasan: buildIdebRingkasanByDebiturId("DBT001"),
  },
  {
    id: "IDEB-2025-03-DBT004",
    debiturId: "DBT004",
    namaNasabah: "Budi Santoso",
    noKontrak: "PB/2022/000456",
    bulan: 3,
    namaBulan: IDEB_MONTH_NAMES[2],
    tahun: 2025,
    tanggalUpload: "2025-03-14",
    status: "CHECKED",
    ringkasan: buildIdebRingkasanByDebiturId("DBT004"),
  },
  {
    id: "IDEB-2025-06-DBT005",
    debiturId: "DBT005",
    namaNasabah: "Dewi Kartika",
    noKontrak: "PB/2021/000789",
    bulan: 6,
    namaBulan: IDEB_MONTH_NAMES[5],
    tahun: 2025,
    tanggalUpload: "2025-06-11",
    status: "PENDING",
  },
  {
    id: "IDEB-2025-09-DBT002",
    debiturId: "DBT002",
    namaNasabah: "Siti Rahayu",
    noKontrak: "PB/2024/001235",
    bulan: 9,
    namaBulan: IDEB_MONTH_NAMES[8],
    tahun: 2025,
    tanggalUpload: "2025-09-18",
    status: "CHECKED",
    ringkasan: buildIdebRingkasanByDebiturId("DBT002"),
  },
];

const legalNasabahIdByNoKontrak = new Map(
  dummyNasabahLegal.map((item) => [item.noKontrak, String(item.id)]),
);

function getLegalNasabahId(noKontrak: string) {
  return legalNasabahIdByNoKontrak.get(noKontrak) ?? noKontrak;
}

function mapCetakJenisDokumen(jenis: string): CetakDokumenLegalType {
  switch (jenis.toUpperCase()) {
    case "AKAD":
      return "AKAD";
    case "HAFTSHEET":
      return "HAFTSHEET";
    case "SURAT PERINGATAN":
      return "SURAT_PERINGATAN";
    case "FORMULIR ASURANSI":
      return "FORMULIR_ASURANSI";
    case "SURAT KETERANGAN LUNAS":
      return "SKL";
    case "SAMSAT":
    case "SURAT SAMSAT":
      return "SAMSAT";
    default:
      return "AKAD";
  }
}

export const cetakDokumenLegalData: CetakDokumenRecord[] = [
  ...dummyHistoryCetak.map((item) => ({
    id: `CETAK-${item.id}`,
    nasabahId: getLegalNasabahId(item.noKontrak),
    namaNasabah: item.namaNasabah,
    noKontrak: item.noKontrak,
    jenisDokumen: mapCetakJenisDokumen(item.jenis),
    tanggalCetak: item.tanggal,
    dicetakOleh: item.user,
    keterangan: item.detail,
  })),
  {
    id: "CETAK-LEGAL-002",
    nasabahId: getLegalNasabahId("PB/2024/001234"),
    namaNasabah: "Ahmad Suryanto",
    noKontrak: "PB/2024/001234",
    jenisDokumen: "AKAD",
    tanggalCetak: "2026-03-03",
    dicetakOleh: "Faisal",
    keterangan: "Akad Murabahah pembiayaan kendaraan dicetak ulang.",
  },
  {
    id: "CETAK-LEGAL-003",
    nasabahId: getLegalNasabahId("PB/2024/001235"),
    namaNasabah: "Siti Rahayu",
    noKontrak: "PB/2024/001235",
    jenisDokumen: "SURAT_PERINGATAN",
    tanggalCetak: "2026-03-05",
    dicetakOleh: "Annas",
    keterangan: "Surat peringatan tahap pertama untuk monitoring kolektibilitas.",
  },
  {
    id: "CETAK-LEGAL-004",
    nasabahId: getLegalNasabahId("PB/2023/000987"),
    namaNasabah: "Hendra Wijaya",
    noKontrak: "PB/2023/000987",
    jenisDokumen: "FORMULIR_ASURANSI",
    tanggalCetak: "2026-02-19",
    dicetakOleh: "Faisal",
    keterangan: "Formulir klaim asuransi kendaraan.",
  },
  {
    id: "CETAK-LEGAL-005",
    nasabahId: getLegalNasabahId("PB/2024/001234"),
    namaNasabah: "Ahmad Suryanto",
    noKontrak: "PB/2024/001234",
    jenisDokumen: "SAMSAT",
    tanggalCetak: "2026-03-01",
    dicetakOleh: "Anggita",
    keterangan: "Surat pengantar pengurusan samsat tahunan.",
  },
  {
    id: "CETAK-LEGAL-006",
    nasabahId: getLegalNasabahId("PB/2024/001235"),
    namaNasabah: "Siti Rahayu",
    noKontrak: "PB/2024/001235",
    jenisDokumen: "SKL",
    tanggalCetak: "2026-01-22",
    dicetakOleh: "Burhan",
    keterangan: "Surat keterangan lunas pembiayaan modal kerja.",
  },
  {
    id: "CETAK-LEGAL-007",
    nasabahId: getLegalNasabahId("PB/2023/000987"),
    namaNasabah: "Hendra Wijaya",
    noKontrak: "PB/2023/000987",
    jenisDokumen: "AKAD",
    tanggalCetak: "2025-12-17",
    dicetakOleh: "Faisal",
    keterangan: "Draft akad pembiayaan multiguna untuk arsip legal.",
  },
  {
    id: "CETAK-LEGAL-008",
    nasabahId: getLegalNasabahId("PB/2024/001234"),
    namaNasabah: "Ahmad Suryanto",
    noKontrak: "PB/2024/001234",
    jenisDokumen: "HAFTSHEET",
    tanggalCetak: "2026-02-12",
    dicetakOleh: "Annas",
    keterangan: "Checklist kelengkapan dokumen akad kendaraan.",
  },
  {
    id: "CETAK-LEGAL-009",
    nasabahId: getLegalNasabahId("PB/2024/001235"),
    namaNasabah: "Siti Rahayu",
    noKontrak: "PB/2024/001235",
    jenisDokumen: "FORMULIR_ASURANSI",
    tanggalCetak: "2026-03-06",
    dicetakOleh: "Anggita",
    keterangan: "Formulir asuransi kebakaran untuk pembaruan polis.",
  },
  {
    id: "CETAK-LEGAL-010",
    nasabahId: getLegalNasabahId("PB/2023/000987"),
    namaNasabah: "Hendra Wijaya",
    noKontrak: "PB/2023/000987",
    jenisDokumen: "SURAT_PERINGATAN",
    tanggalCetak: "2026-03-07",
    dicetakOleh: "Burhan",
    keterangan: "Surat peringatan kedua atas keterlambatan angsuran.",
  },
  {
    id: "CETAK-LEGAL-011",
    nasabahId: getLegalNasabahId("PB/2024/001234"),
    namaNasabah: "Ahmad Suryanto",
    noKontrak: "PB/2024/001234",
    jenisDokumen: "SKL",
    tanggalCetak: "2025-11-08",
    dicetakOleh: "Faisal",
    keterangan: "Simulasi surat keterangan lunas untuk pelunasan dipercepat.",
  },
  {
    id: "CETAK-LEGAL-012",
    nasabahId: getLegalNasabahId("PB/2024/001235"),
    namaNasabah: "Siti Rahayu",
    noKontrak: "PB/2024/001235",
    jenisDokumen: "SAMSAT",
    tanggalCetak: "2026-02-27",
    dicetakOleh: "Annas",
    keterangan: "Surat samsat untuk kendaraan operasional usaha.",
  },
];

export const progresPHK3Data: ProgresPHK3Record[] = [
  ...dummyProgressNotaris.map((item) => ({
    id: `PHK3-NOTARIS-${item.id}`,
    nasabahId: getLegalNasabahId(item.noKontrak),
    namaNasabah: item.namaNasabah,
    noKontrak: item.noKontrak,
    kategori: "NOTARIS" as const,
    status:
      item.status === "Selesai"
        ? ("SELESAI" as const)
        : item.status === "Bermasalah"
          ? ("PENDING" as const)
          : ("AKTIF" as const),
    tanggalInput: item.tanggalMasuk,
    keterangan: item.catatan,
  })),
  ...dummyProgressAsuransi.map((item) => ({
    id: `PHK3-ASURANSI-${item.id}`,
    nasabahId: getLegalNasabahId(item.noKontrak),
    namaNasabah: item.namaNasabah,
    noKontrak: item.noKontrak,
    kategori: "ASURANSI" as const,
    status:
      item.status === "Aktif" || item.status === "Proses"
        ? ("AKTIF" as const)
        : item.status === "Expired"
          ? ("PENDING" as const)
          : ("SELESAI" as const),
    tanggalInput: item.periodeAwal,
    keterangan: item.catatan,
  })),
  ...dummyKlaimAsuransi.map((item) => ({
    id: `PHK3-KLAIM-${item.id}`,
    nasabahId: getLegalNasabahId(item.noKontrak),
    namaNasabah: item.namaNasabah,
    noKontrak: item.noKontrak,
    kategori: "TRACKING_CLAIM" as const,
    status:
      item.status === "Cair" || item.status === "Disetujui"
        ? ("SELESAI" as const)
        : ("PENDING" as const),
    tanggalInput: item.tanggalPengajuan,
    keterangan: item.catatan,
  })),
  {
    id: "PHK3-NOTARIS-EXTRA-001",
    nasabahId: getLegalNasabahId("PB/2024/001235"),
    namaNasabah: "Siti Rahayu",
    noKontrak: "PB/2024/001235",
    kategori: "NOTARIS",
    status: "PENDING",
    tanggalInput: "2026-03-02",
    keterangan: "Menunggu draft akta final dari notaris rekanan.",
  },
  {
    id: "PHK3-ASURANSI-EXTRA-001",
    nasabahId: getLegalNasabahId("PB/2023/000987"),
    namaNasabah: "Hendra Wijaya",
    noKontrak: "PB/2023/000987",
    kategori: "ASURANSI",
    status: "AKTIF",
    tanggalInput: "2026-03-04",
    keterangan: "Perpanjangan polis kendaraan sedang aktif diverifikasi.",
  },
  {
    id: "PHK3-KLAIM-EXTRA-001",
    nasabahId: getLegalNasabahId("PB/2024/001234"),
    namaNasabah: "Ahmad Suryanto",
    noKontrak: "PB/2024/001234",
    kategori: "TRACKING_CLAIM",
    status: "SELESAI",
    tanggalInput: "2026-02-20",
    keterangan: "Dokumen klaim lengkap dan pembayaran penggantian sudah diterima.",
  },
];
