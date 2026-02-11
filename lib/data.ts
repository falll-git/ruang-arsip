import type {
  ActionPlan,
  Debitur,
  DokumenDebitur,
  HasilKunjungan,
  HistorisKolektibilitas,
  KolektibilitasType,
  LangkahPenanganan,
  PengecekanBPRS,
  SuratPeringatan,
  UploadRestrik,
  UploadSLIK,
} from "@/lib/types/modul3";
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
    filePath: "/documents/contoh-dok.pdf",
  },
  {
    id: "DOC002",
    debiturId: "DBT001",
    namaDokumen: "Akad Pembiayaan",
    jenisDokumen: "Akad",
    tanggalUpload: "2024-01-15",
    filePath: "/documents/contoh-dok.pdf",
  },
  {
    id: "DOC003",
    debiturId: "DBT003",
    namaDokumen: "Dokumen Jaminan (BPKB)",
    jenisDokumen: "Jaminan",
    tanggalUpload: "2023-03-12",
    filePath: "/documents/contoh-dok.pdf",
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
    lampiranFilePath: "/documents/contoh-dok.pdf",
    lampiranFileName: "action_plan_hendra.pdf",
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
    fotoKunjungan: "/documents/contoh-dok.pdf",
    fotoKunjunganNama: "foto_kunjungan.pdf",
    fotoKunjunganTipe: "pdf",
    createdBy: "Marketing",
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
    lampiranFilePath: "/documents/contoh-dok.pdf",
    lampiranFileName: "langkah_penanganan_sp1.pdf",
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
  status: "Belum Dibayar" | "Sudah Dibayar" | "Dikembalikan";
  userInput: string;
  keterangan: string;
  tanggalBayar?: string;
  noAkta?: string;
  tanggalKembali?: string;
  alasanKembali?: string;
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

export interface BPRSLain {
  id: number;
  nik: string;
  nama: string;
  namaBPRS: string;
  lokasi: string;
  produk: string;
  plafond: number;
  status: "Aktif" | "Lunas" | "Bermasalah";
  kolektibilitas: number;
  lastUpdate: string;
  keterangan?: string;
}

export interface HistoryCekBPRS {
  id: number;
  tanggal: string;
  keyword: string;
  hasilDitemukan: number;
  user: string;
}

export const dummyBPRSLain: BPRSLain[] = [
  {
    id: 1,
    nik: "3201234567890001",
    nama: "Ahmad Suryanto",
    namaBPRS: "BPRS Sejahtera",
    lokasi: "Bandung",
    produk: "Pembiayaan Kendaraan",
    plafond: 120000000,
    status: "Aktif",
    kolektibilitas: 2,
    lastUpdate: "2026-02-01",
    keterangan: "Terdapat tunggakan 1x angsuran",
  },
  {
    id: 2,
    nik: "3201234567890099",
    nama: "Rina Kartika",
    namaBPRS: "BPRS Amanah",
    lokasi: "Jakarta",
    produk: "Pembiayaan Multiguna",
    plafond: 80000000,
    status: "Bermasalah",
    kolektibilitas: 4,
    lastUpdate: "2026-01-27",
    keterangan: "Dalam proses penagihan",
  },
  {
    id: 3,
    nik: "3201234567890011",
    nama: "Doni Pratama",
    namaBPRS: "BPRS Mitra",
    lokasi: "Bekasi",
    produk: "Pembiayaan Modal Kerja",
    plafond: 150000000,
    status: "Lunas",
    kolektibilitas: 1,
    lastUpdate: "2025-12-30",
  },
];

export const dummyHistoryCekBPRS: HistoryCekBPRS[] = [
  {
    id: 1,
    tanggal: "2026-01-25",
    keyword: "3201234567890001",
    hasilDitemukan: 1,
    user: "Faisal",
  },
  {
    id: 2,
    tanggal: "2026-02-01",
    keyword: "Rina",
    hasilDitemukan: 1,
    user: "Faisal",
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
    lampiranFilePath: "/documents/contoh-dok.pdf",
    lampiranFileName: "tracking_claim_ahmad.pdf",
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
    nominal: 1500000,
    tanggalSetor: "2024-01-20",
    status: "Belum Dibayar",
    userInput: "Faisal",
    keterangan: "Biaya APHT",
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
  status: "Belum Dibayar" | "Sudah Dibayar" | "Dikembalikan";
  userInput: string;
  keterangan: string;
  noPolis?: string;
  noBuktiBayar?: string;
  tanggalBayar?: string;
  tanggalKembali?: string;
  alasanKembali?: string;
}

export interface TitipanAngsuran {
  id: number;
  noKontrak: string;
  namaNasabah: string;
  keperluan: string;
  nominal: number;
  tanggalSetor: string;
  status: "Pending" | "Sudah Diproses" | "Dikembalikan";
  userInput: string;
  keterangan: string;
  tanggalProses?: string;
  tanggalKembali?: string;
  alasanKembali?: string;
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
  },
];

export interface HistorisTitipanDebitur {
  id: string;
  sumberId: number;
  jenisTitipan: "Notaris" | "Asuransi" | "Angsuran";
  noKontrak: string;
  tanggal: string;
  nominal: number;
  status: string;
  keterangan: string;
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

export function getHistorisTitipanByNoKontrak(
  noKontrak: string,
): HistorisTitipanDebitur[] {
  const { notaris, asuransi, angsuran } = getTitipanByNoKontrak(noKontrak);
  return [
    ...notaris.map((item) => ({
      id: `notaris-${item.id}`,
      sumberId: item.id,
      jenisTitipan: "Notaris" as const,
      noKontrak: item.noKontrak,
      tanggal: item.tanggalSetor,
      nominal: item.nominal,
      status: item.status,
      keterangan: item.keterangan,
    })),
    ...asuransi.map((item) => ({
      id: `asuransi-${item.id}`,
      sumberId: item.id,
      jenisTitipan: "Asuransi" as const,
      noKontrak: item.noKontrak,
      tanggal: item.tanggalSetor,
      nominal: item.nominal,
      status: item.status,
      keterangan: item.keterangan,
    })),
    ...angsuran.map((item) => ({
      id: `angsuran-${item.id}`,
      sumberId: item.id,
      jenisTitipan: "Angsuran" as const,
      noKontrak: item.noKontrak,
      tanggal: item.tanggalSetor,
      nominal: item.nominal,
      status: item.status,
      keterangan: item.keterangan,
    })),
  ].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
}

export function getSaldoDanaTitipanByNoKontrak(noKontrak: string): number {
  const { notaris, asuransi, angsuran } = getTitipanByNoKontrak(noKontrak);
  const saldoNotaris = notaris
    .filter((item) => item.status === "Belum Dibayar")
    .reduce((total, item) => total + item.nominal, 0);
  const saldoAsuransi = asuransi
    .filter((item) => item.status === "Belum Dibayar")
    .reduce((total, item) => total + item.nominal, 0);
  const saldoAngsuran = angsuran
    .filter((item) => item.status === "Pending")
    .reduce((total, item) => total + item.nominal, 0);
  return saldoNotaris + saldoAsuransi + saldoAngsuran;
}
