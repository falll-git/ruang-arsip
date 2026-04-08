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
  DisposisiArsip,
  DokumenArsip,
  IdebRecord,
  IdebRingkasan,
  JenisTitipan,
  Kantor,
  KolektibilitasItem,
  KolektibilitasNasabahItem,
  Lemari,
  PeminjamanArsip,
  PihakKetiga,
  PihakKetigaKategori,
  PihakKetigaSummary,
  ProgressPihakKetiga,
  ProgresPHK3Record,
  Rak,
  RiwayatBPRSLain,
  RiwayatNPF,
  TitipanNasabah,
  TitipanSummary,
} from "@/lib/types";
import { ROLES, type DataAccessLevel, type Role } from "@/lib/rbac";

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: Role;
  division_id: string;
  is_restrict: boolean;
  is_active: boolean;
}

export interface StoredUser extends User {
  password?: string;
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

export const dummyUsers: StoredUser[] = [
  {
    id: "user-viewer",
    password: "demo123",
    username: "MANAJER",
    email: "manajer@ruangarsip.local",
    name: "Budi Manajer",
    role: ROLES.VIEWER,
    division_id: "Manajemen",
    is_restrict: false,
    is_active: true,
  },
  {
    id: "user-admin",
    password: "demo123",
    username: "ADMIN",
    email: "admin@ruangarsip.local",
    name: "Sinta Admin",
    role: ROLES.ADMIN,
    division_id: "Operasional",
    is_restrict: false,
    is_active: true,
  },
  {
    id: "user-admin-restrict",
    password: "demo123",
    username: "ADMIN_RESTRICT",
    email: "admin.restrict@ruangarsip.local",
    name: "Dina Admin Restrict",
    role: ROLES.ADMIN,
    division_id: "Operasional",
    is_restrict: true,
    is_active: true,
  },
  {
    id: "user-legal",
    password: "demo123",
    username: "LEGAL",
    email: "legal@ruangarsip.local",
    name: "Raka Legal",
    role: ROLES.LEGAL,
    division_id: "Legal",
    is_restrict: false,
    is_active: true,
  },
  {
    id: "user-superadmin",
    password: "demo123",
    username: "IT",
    email: "it@ruangarsip.local",
    name: "Nadia IT",
    role: ROLES.SUPERADMIN,
    division_id: "IT",
    is_restrict: false,
    is_active: true,
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
  {
    id: 4,
    kodeKantor: "KCK",
    namaKantor: "Kantor Cabang Kranji",
    kodeLemari: "L-101",
    rak: "RAK 1",
    kapasitas: 120,
    status: "Aktif",
  },
  {
    id: 5,
    kodeKantor: "KCK",
    namaKantor: "Kantor Cabang Kranji",
    kodeLemari: "L-102",
    rak: "RAK 2",
    kapasitas: 140,
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
    userInput: "DWI",
    tempatPenyimpanan: "L-020",
    tempatPenyimpananId: 1,
    statusPinjam: "Dipinjam",
    statusPeminjaman: "Dipinjam",
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
    userInput: "NADIA",
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
    detail: "SK Pengangkatan An. Arya",
    tglInput: "21-01-2026",
    userInput: "RANI",
    tempatPenyimpanan: "L-020",
    tempatPenyimpananId: 1,
    statusPinjam: "Tersedia",
    statusPeminjaman: "Tersedia",
    levelAkses: "NON_RESTRICT",
    restrict: false,
    fileUrl: "/documents/contoh-dok.pdf",
  },
  {
    id: 4,
    kode: "A010256",
    jenisDokumen: "Pembiayaan",
    namaDokumen: "Dokumen Taksasi",
    detail: "Dokumen Taksasi An. Fulan",
    tglInput: "21-01-2026",
    userInput: "NADIA",
    tempatPenyimpanan: "L-020",
    tempatPenyimpananId: 1,
    statusPinjam: "Tersedia",
    statusPeminjaman: "Tersedia",
    levelAkses: "NON_RESTRICT",
    restrict: false,
    fileUrl: "/documents/contoh-dok.pdf",
  },
  {
    id: 5,
    kode: "A010257",
    jenisDokumen: "Voucher",
    namaDokumen: "Teller Pusat Juni",
    detail: "Voucher Juni 2025 Kantor Pusat",
    tglInput: "21-01-2026",
    userInput: "ARYA",
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
    userInput: "ARYA",
    tempatPenyimpanan: "L-001",
    tempatPenyimpananId: 3,
    statusPinjam: "Dipinjam",
    statusPeminjaman: "Dipinjam",
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
    userInput: "NADIA",
    tempatPenyimpanan: "L-020",
    tempatPenyimpananId: 1,
    statusPinjam: "Tersedia",
    statusPeminjaman: "Tersedia",
    levelAkses: "NON_RESTRICT",
    restrict: false,
    fileUrl: "/documents/contoh-dok.pdf",
  },
  {
    id: 8,
    kode: "A010260",
    jenisDokumen: "Pembiayaan",
    namaDokumen: "Akad Murabahah Kranji",
    detail: "Dokumen akad pembiayaan An. Siti Rahayu - Cabang Kranji",
    tglInput: "12-02-2026",
    userInput: "NADIA",
    tempatPenyimpanan: "L-101",
    tempatPenyimpananId: 4,
    statusPinjam: "Dipinjam",
    statusPeminjaman: "Dipinjam",
    noKontrak: "PB/2024/001235",
    debiturId: "DBT002",
    levelAkses: "NON_RESTRICT",
    restrict: false,
    fileUrl: "/documents/contoh-dok.pdf",
  },
  {
    id: 9,
    kode: "A010261",
    jenisDokumen: "Pembiayaan",
    namaDokumen: "Sertifikat Agunan Ruko Kranji",
    detail: "Sertifikat SHM No. 1178 untuk pembiayaan ruko Kranji",
    tglInput: "13-02-2026",
    userInput: "DWI",
    tempatPenyimpanan: "L-102",
    tempatPenyimpananId: 5,
    statusPinjam: "Diajukan",
    statusPeminjaman: "Diajukan",
    noKontrak: "PB/2022/000456",
    debiturId: "DBT004",
    levelAkses: "NON_RESTRICT",
    restrict: false,
    fileUrl: "/documents/contoh-dok.pdf",
  },
  {
    id: 10,
    kode: "A010262",
    jenisDokumen: "Perusahaan",
    namaDokumen: "Laporan Survey Usaha Kranji",
    detail: "Laporan hasil survey usaha nasabah cabang Kranji",
    tglInput: "14-02-2026",
    userInput: "RANI",
    tempatPenyimpanan: "L-101",
    tempatPenyimpananId: 4,
    statusPinjam: "Tersedia",
    statusPeminjaman: "Tersedia",
    noKontrak: "PB/2021/000789",
    debiturId: "DBT005",
    levelAkses: "NON_RESTRICT",
    restrict: false,
    fileUrl: "/documents/contoh-dok.pdf",
  },
  {
    id: 11,
    kode: "A010263",
    jenisDokumen: "Voucher",
    namaDokumen: "Voucher Teller Kranji Juli",
    detail: "Voucher Juli 2025 Kantor Cabang Kranji",
    tglInput: "15-02-2026",
    userInput: "ARYA",
    tempatPenyimpanan: "L-102",
    tempatPenyimpananId: 5,
    statusPinjam: "Dipinjam",
    statusPeminjaman: "Dipinjam",
    levelAkses: "NON_RESTRICT",
    restrict: false,
    fileUrl: "/documents/contoh-dok.pdf",
  },
  {
    id: 12,
    kode: "A010264",
    jenisDokumen: "Karyawan",
    namaDokumen: "SK Mutasi Pegawai Kranji",
    detail: "SK mutasi internal pegawai operasional cabang Kranji",
    tglInput: "16-02-2026",
    userInput: "RANI",
    tempatPenyimpanan: "L-101",
    tempatPenyimpananId: 4,
    statusPinjam: "Diajukan",
    statusPeminjaman: "Diajukan",
    levelAkses: "NON_RESTRICT",
    restrict: false,
    fileUrl: "/documents/contoh-dok.pdf",
  },
  {
    id: 13,
    kode: "A010265",
    jenisDokumen: "Pembiayaan",
    namaDokumen: "NPWP dan NIB CV Kranji Sejahtera",
    detail: "Legalitas usaha nasabah pembiayaan cabang Kranji",
    tglInput: "17-02-2026",
    userInput: "NADIA",
    tempatPenyimpanan: "L-102",
    tempatPenyimpananId: 5,
    statusPinjam: "Tersedia",
    statusPeminjaman: "Tersedia",
    noKontrak: "PB/2024/001234",
    debiturId: "DBT001",
    levelAkses: "NON_RESTRICT",
    restrict: false,
    fileUrl: "/documents/contoh-dok.pdf",
  },
  {
    id: 14,
    kode: "A010266",
    jenisDokumen: "Perusahaan",
    namaDokumen: "Dummy Uji Non Restrict",
    detail:
      "Contoh akses NON RESTRICT. Akun MANAJER, ADMIN, ADMIN_RESTRICT, LEGAL, dan IT bisa melihat dokumen ini selama modulnya memang boleh diakses oleh role-nya.",
    tglInput: "18-02-2026",
    userInput: "IT",
    tempatPenyimpanan: "L-020",
    tempatPenyimpananId: 1,
    statusPinjam: "Tersedia",
    statusPeminjaman: "Tersedia",
    levelAkses: "NON_RESTRICT",
    restrict: false,
    fileUrl: "/documents/contoh-dok.pdf",
  },
];

export const dummyDisposisi: Disposisi[] = [
  {
    id: 1,
    dokumenId: 2,
    detail: "Dokumen Akad An. Fulan",
    pemohon: "ANGGI",
    pemilik: "NADIA",
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
    detail: "SK Pengangkatan An. Arya",
    pemohon: "NADIA",
    pemilik: "RANI",
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
    pemohon: "DWI",
    pemilik: "NADIA",
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
    pemohon: "ARYA",
    pemilik: "NADIA",
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
    pemohon: "RANI",
    pemilik: "ARYA",
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
    pemohon: "NADIA",
    pemilik: "ARYA",
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
    pemohon: "DWI",
    pemilik: "NADIA",
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
    detail: "SK Pengangkatan An. Arya",
    pemohon: "ARYA",
    pemilik: "RANI",
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
    pemohon: "RANI",
    pemilik: "NADIA",
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
    pemohon: "DWI",
    pemilik: "NADIA",
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
    pemohon: "NADIA",
    pemilik: "DWI",
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
    pemohon: "DWI",
    pemilik: "ARYA",
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
    pemohon: "RANI",
    pemilik: "NADIA",
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
    pemohon: "ARYA",
    pemilik: "DWI",
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
    detail: "SK Pengangkatan An. Arya",
    pemohon: "NADIA",
    pemilik: "RANI",
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
    pemohon: "DWI",
    pemilik: "NADIA",
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
    pemohon: "RANI",
    pemilik: "NADIA",
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
    pemohon: "ARYA",
    pemilik: "DWI",
    tglPengajuan: "07-02-2026",
    status: "Approved",
    alasanPengajuan: "Pemeriksaan arsip legal lama",
    tglExpired: "10-02-2026",
    tglAksi: "07-02-2026",
    alasanAksi: "Disetujui untuk kebutuhan arsip legal",
  },
  {
    id: 19,
    dokumenId: 8,
    detail: "Dokumen akad pembiayaan An. Siti Rahayu - Cabang Kranji",
    pemohon: "ARYA",
    pemilik: "NADIA",
    tglPengajuan: "18-02-2026",
    status: "Pending",
    alasanPengajuan: "Review addendum akad untuk audit cabang Kranji",
    tglExpired: null,
    tglAksi: null,
    alasanAksi: null,
  },
  {
    id: 20,
    dokumenId: 9,
    detail: "Sertifikat SHM No. 1178 untuk pembiayaan ruko Kranji",
    pemohon: "RANI",
    pemilik: "DWI",
    tglPengajuan: "19-02-2026",
    status: "Approved",
    alasanPengajuan: "Validasi agunan untuk komite pembiayaan cabang",
    tglExpired: "23-02-2026",
    tglAksi: "19-02-2026",
    alasanAksi: "Disetujui untuk keperluan verifikasi agunan",
  },
  {
    id: 21,
    dokumenId: 10,
    detail: "Laporan hasil survey usaha nasabah cabang Kranji",
    pemohon: "DWI",
    pemilik: "RANI",
    tglPengajuan: "20-02-2026",
    status: "Rejected",
    alasanPengajuan: "Pengecekan ulang hasil survey lapangan",
    tglExpired: null,
    tglAksi: "20-02-2026",
    alasanAksi: "Ditolak karena dokumen sudah tersedia pada folder bersama",
  },
  {
    id: 22,
    dokumenId: 11,
    detail: "Voucher Juli 2025 Kantor Cabang Kranji",
    pemohon: "NADIA",
    pemilik: "ARYA",
    tglPengajuan: "21-02-2026",
    status: "Approved",
    alasanPengajuan: "Rekonsiliasi transaksi teller cabang Kranji",
    tglExpired: "25-02-2026",
    tglAksi: "21-02-2026",
    alasanAksi: "Disetujui untuk audit operasional cabang",
  },
  {
    id: 23,
    dokumenId: 12,
    detail: "SK mutasi internal pegawai operasional cabang Kranji",
    pemohon: "ARYA",
    pemilik: "RANI",
    tglPengajuan: "22-02-2026",
    status: "Pending",
    alasanPengajuan: "Kebutuhan administrasi personalia kantor cabang",
    tglExpired: null,
    tglAksi: null,
    alasanAksi: null,
  },
  {
    id: 24,
    dokumenId: 13,
    detail: "Legalitas usaha nasabah pembiayaan cabang Kranji",
    pemohon: "RANI",
    pemilik: "NADIA",
    tglPengajuan: "23-02-2026",
    status: "Rejected",
    alasanPengajuan: "Validasi dokumen legal untuk monitoring pembiayaan",
    tglExpired: null,
    tglAksi: "23-02-2026",
    alasanAksi: "Ditolak karena review sedang dikerjakan oleh tim legal",
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
    approver: "NADIA",
    tglApprove: "22-01-2026",
    jamApprove: "09:00",
    alasanApprove: "Disetujui",
    tglPenyerahan: "22-01-2026",
  },
  {
    id: 2,
    dokumenId: 6,
    detail: "Voucher Juni 2025 Kantor Kas KST",
    peminjam: "ARYA",
    tglPinjam: "20-01-2026",
    tglKembali: "23-01-2026",
    tglPengembalian: null,
    status: "Dipinjam",
    alasan: "Audit Cabang",
    approver: "DWI",
    tglApprove: "20-01-2026",
    jamApprove: "09:00",
    alasanApprove: "Ok",
    tglPenyerahan: "20-01-2026",
  },
  {
    id: 3,
    dokumenId: 8,
    detail: "Akad Murabahah Kranji",
    peminjam: "DWI",
    tglPinjam: "24-02-2026",
    tglKembali: "03-03-2026",
    tglPengembalian: null,
    status: "Dipinjam",
    alasan: "Review legal addendum akad cabang Kranji",
    approver: "NADIA",
    tglApprove: "24-02-2026",
    jamApprove: "10:15",
    alasanApprove: "Disetujui untuk legal review",
    tglPenyerahan: "24-02-2026",
  },
  {
    id: 4,
    dokumenId: 9,
    detail: "Sertifikat Agunan Ruko Kranji",
    peminjam: "ARYA",
    tglPinjam: "25-02-2026",
    tglKembali: "01-03-2026",
    tglPengembalian: null,
    status: "Pending",
    alasan: "Pengecekan agunan sebelum appraisal internal",
    approver: null,
    tglApprove: null,
    jamApprove: null,
    alasanApprove: null,
    tglPenyerahan: null,
  },
  {
    id: 5,
    dokumenId: 10,
    detail: "Laporan Survey Usaha Kranji",
    peminjam: "RANI",
    tglPinjam: "10-02-2026",
    tglKembali: "14-02-2026",
    tglPengembalian: "14-02-2026",
    status: "Dikembalikan",
    alasan: "Validasi hasil survey usaha nasabah",
    approver: "DWI",
    tglApprove: "10-02-2026",
    jamApprove: "08:45",
    alasanApprove: "Disetujui",
    tglPenyerahan: "10-02-2026",
  },
  {
    id: 6,
    dokumenId: 11,
    detail: "Voucher Teller Kranji Juli",
    peminjam: "NADIA",
    tglPinjam: "26-02-2026",
    tglKembali: "04-03-2026",
    tglPengembalian: null,
    status: "Dipinjam",
    alasan: "Audit transaksi kas cabang Kranji",
    approver: "DWI",
    tglApprove: "26-02-2026",
    jamApprove: "11:00",
    alasanApprove: "Disetujui",
    tglPenyerahan: "26-02-2026",
  },
  {
    id: 7,
    dokumenId: 12,
    detail: "SK Mutasi Pegawai Kranji",
    peminjam: "DWI",
    tglPinjam: "27-02-2026",
    tglKembali: "05-03-2026",
    tglPengembalian: null,
    status: "Pending",
    alasan: "Verifikasi dokumen mutasi untuk kebutuhan audit SDM",
    approver: null,
    tglApprove: null,
    jamApprove: null,
    alasanApprove: null,
    tglPenyerahan: null,
  },
  {
    id: 8,
    dokumenId: 13,
    detail: "NPWP dan NIB CV Kranji Sejahtera",
    peminjam: "RANI",
    tglPinjam: "05-02-2026",
    tglKembali: "12-02-2026",
    tglPengembalian: "12-02-2026",
    status: "Dikembalikan",
    alasan: "Pemeriksaan legalitas nasabah pembiayaan cabang",
    approver: "NADIA",
    tglApprove: "05-02-2026",
    jamApprove: "09:30",
    alasanApprove: "Disetujui",
    tglPenyerahan: "05-02-2026",
  },
];

function parseLegacyDateToIso(dateValue: string) {
  const parts = dateValue.split("-");
  if (parts.length !== 3) return dateValue;

  const [day, month, year] = parts;
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) {
    return dateValue;
  }

  return `${year}-${month}-${day}`;
}

export const kantorData: Kantor[] = [
  { id: "kantor-001", namaKantor: "Kantor Pusat" },
  { id: "kantor-002", namaKantor: "Kantor Cabang Kranji" },
  { id: "kantor-003", namaKantor: "Kantor Kas ST" },
];

export const lemariData: Lemari[] = [
  { id: "lemari-020", kantorId: "kantor-001", kodeLemari: "L-020" },
  { id: "lemari-021", kantorId: "kantor-001", kodeLemari: "L-021" },
  { id: "lemari-022", kantorId: "kantor-001", kodeLemari: "L-022" },
  { id: "lemari-101", kantorId: "kantor-002", kodeLemari: "L-101" },
  { id: "lemari-102", kantorId: "kantor-002", kodeLemari: "L-102" },
  { id: "lemari-201", kantorId: "kantor-003", kodeLemari: "L-201" },
];

export const rakData: Rak[] = [
  { id: "rak-020-1", lemariId: "lemari-020", namaRak: "RAK 1", totalArsip: 2 },
  { id: "rak-020-2", lemariId: "lemari-020", namaRak: "RAK 2", totalArsip: 1 },
  { id: "rak-021-1", lemariId: "lemari-021", namaRak: "RAK 1", totalArsip: 1 },
  { id: "rak-021-2", lemariId: "lemari-021", namaRak: "RAK 2", totalArsip: 2 },
  { id: "rak-022-1", lemariId: "lemari-022", namaRak: "RAK 1", totalArsip: 1 },
  { id: "rak-022-2", lemariId: "lemari-022", namaRak: "RAK 2", totalArsip: 1 },
  { id: "rak-101-1", lemariId: "lemari-101", namaRak: "RAK 1", totalArsip: 1 },
  { id: "rak-101-2", lemariId: "lemari-101", namaRak: "RAK 2", totalArsip: 1 },
  { id: "rak-102-1", lemariId: "lemari-102", namaRak: "RAK 1", totalArsip: 1 },
  { id: "rak-102-2", lemariId: "lemari-102", namaRak: "RAK 2", totalArsip: 1 },
  { id: "rak-201-1", lemariId: "lemari-201", namaRak: "RAK 1", totalArsip: 1 },
];

export const dokumenArsipData: DokumenArsip[] = [
  {
    id: "dok-001",
    rakId: "rak-020-1",
    namaDokumen: "Akta Pendirian",
    jenisDokumen: "Perusahaan",
    jenis: "DIGITAL",
    tanggalInput: "2026-02-01",
  },
  {
    id: "dok-024",
    rakId: "rak-020-1",
    namaDokumen: "Peraturan Internal",
    jenisDokumen: "Karyawan",
    jenis: "FISIK",
    tanggalInput: "2026-02-24",
  },
  {
    id: "dok-003",
    rakId: "rak-020-2",
    namaDokumen: "Voucher Teller Januari",
    jenisDokumen: "Voucher",
    jenis: "DIGITAL",
    tanggalInput: "2026-02-03",
  },
  {
    id: "dok-005",
    rakId: "rak-021-1",
    namaDokumen: "Surat Kuasa",
    jenisDokumen: "Perusahaan",
    jenis: "DIGITAL",
    tanggalInput: "2026-02-05",
  },
  {
    id: "dok-007",
    rakId: "rak-021-2",
    namaDokumen: "Laporan Keuangan",
    jenisDokumen: "Perusahaan",
    jenis: "DIGITAL",
    tanggalInput: "2026-02-07",
  },
  {
    id: "dok-008",
    rakId: "rak-021-2",
    namaDokumen: "Berkas Perjanjian",
    jenisDokumen: "Pembiayaan",
    jenis: "FISIK",
    tanggalInput: "2026-02-08",
  },
  {
    id: "dok-009",
    rakId: "rak-022-1",
    namaDokumen: "Nota Internal",
    jenisDokumen: "Perusahaan",
    jenis: "DIGITAL",
    tanggalInput: "2026-02-09",
  },
  {
    id: "dok-011",
    rakId: "rak-022-2",
    namaDokumen: "Laporan Survey",
    jenisDokumen: "Pembiayaan",
    jenis: "DIGITAL",
    tanggalInput: "2026-02-11",
  },
  {
    id: "dok-013",
    rakId: "rak-101-1",
    namaDokumen: "Akad Pembiayaan",
    jenisDokumen: "Pembiayaan",
    jenis: "DIGITAL",
    tanggalInput: "2026-02-13",
  },
  {
    id: "dok-015",
    rakId: "rak-101-2",
    namaDokumen: "Voucher Operasional",
    jenisDokumen: "Voucher",
    jenis: "DIGITAL",
    tanggalInput: "2026-02-15",
  },
  {
    id: "dok-017",
    rakId: "rak-102-1",
    namaDokumen: "Sertifikat Agunan",
    jenisDokumen: "Pembiayaan",
    jenis: "DIGITAL",
    tanggalInput: "2026-02-17",
  },
  {
    id: "dok-019",
    rakId: "rak-102-2",
    namaDokumen: "Berkas Legalitas",
    jenisDokumen: "Perusahaan",
    jenis: "DIGITAL",
    tanggalInput: "2026-02-19",
  },
  {
    id: "dok-021",
    rakId: "rak-201-1",
    namaDokumen: "Voucher Kas ST",
    jenisDokumen: "Voucher",
    jenis: "DIGITAL",
    tanggalInput: "2026-02-21",
  },
];

const tempatPenyimpananById = new Map(
  dummyTempatPenyimpanan.map((item) => [item.id, item]),
);
const dokumenById = new Map(dummyDokumen.map((item) => [item.id, item]));
const lemariIdByKode = new Map(lemariData.map((item) => [item.kodeLemari, item.id]));
const lemariAliasByKode = new Map([["L-001", "L-201"]]);
const lemariById = new Map(lemariData.map((item) => [item.id, item]));
const lemariIdsByKantor = lemariData.reduce((accumulator, item) => {
  const list = accumulator.get(item.kantorId) ?? [];
  list.push(item.id);
  accumulator.set(item.kantorId, list);
  return accumulator;
}, new Map<string, string[]>());
const dokumenIdsByLemari = new Map<string, number[]>();
const dokumenIdsByKantor = new Map<string, number[]>();

function resolveLemariIdByKode(kodeLemari: string | undefined) {
  if (!kodeLemari) return null;
  const resolved =
    lemariIdByKode.get(kodeLemari) ??
    lemariIdByKode.get(lemariAliasByKode.get(kodeLemari) ?? "");
  return resolved ?? null;
}

function resolveLemariIdByDokumenId(dokumenId: number) {
  const dokumen = dokumenById.get(dokumenId);
  if (!dokumen?.tempatPenyimpananId) return null;
  const tempat = tempatPenyimpananById.get(dokumen.tempatPenyimpananId);
  return resolveLemariIdByKode(tempat?.kodeLemari);
}

dummyDokumen.forEach((item) => {
  const lemariId = resolveLemariIdByDokumenId(item.id);
  if (!lemariId) return;
  const lemari = lemariById.get(lemariId);
  if (!lemari) return;
  const lemariList = dokumenIdsByLemari.get(lemariId) ?? [];
  lemariList.push(item.id);
  dokumenIdsByLemari.set(lemariId, lemariList);
  const kantorList = dokumenIdsByKantor.get(lemari.kantorId) ?? [];
  kantorList.push(item.id);
  dokumenIdsByKantor.set(lemari.kantorId, kantorList);
});

function formatIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, offset: number) {
  const next = new Date(date);
  next.setDate(date.getDate() + offset);
  return next;
}

function parseDateValue(value: string) {
  const iso = parseLegacyDateToIso(value);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

const disposisiStatusMap: Record<Disposisi["status"], DisposisiArsip["status"]> = {
  Pending: "PENDING",
  Approved: "SELESAI",
  Rejected: "DITOLAK",
};

const baseDisposisiData: DisposisiArsip[] = dummyDisposisi.flatMap((item) => {
  const lemariId = resolveLemariIdByDokumenId(item.dokumenId);
  if (!lemariId) return [];
  return [
    {
      id: `disp-${String(item.id).padStart(3, "0")}`,
      lemariId,
      dokumenId: item.dokumenId,
      status: disposisiStatusMap[item.status],
    },
  ];
});

const activeDisposisiStatuses: DisposisiArsip["status"][] = ["PENDING", "PROSES"];
const activeDisposisiCountByKantor = new Map<string, number>();
baseDisposisiData.forEach((item) => {
  if (!activeDisposisiStatuses.includes(item.status)) return;
  const kantorId = lemariById.get(item.lemariId)?.kantorId;
  if (!kantorId) return;
  activeDisposisiCountByKantor.set(
    kantorId,
    (activeDisposisiCountByKantor.get(kantorId) ?? 0) + 1,
  );
});

const disposisiExtras: DisposisiArsip[] = [];
let disposisiExtraIndex = 1;
kantorData.forEach((kantor) => {
  const current = activeDisposisiCountByKantor.get(kantor.id) ?? 0;
  const needed = Math.max(0, 2 - current);
  if (needed === 0) return;
  const lemariIds = lemariIdsByKantor.get(kantor.id) ?? [];
  const targetLemariId = lemariIds[0];
  if (!targetLemariId) return;
  const dokumenIds = dokumenIdsByLemari.get(targetLemariId) ?? [];
  for (let i = 0; i < needed; i += 1) {
    const docId =
      dokumenIds.length > 0 ? dokumenIds[i % dokumenIds.length] : undefined;
    disposisiExtras.push({
      id: `disp-extra-${String(disposisiExtraIndex).padStart(3, "0")}`,
      lemariId: targetLemariId,
      dokumenId: docId,
      status: i % 2 === 0 ? "PENDING" : "PROSES",
    });
    disposisiExtraIndex += 1;
  }
});

export const disposisiData: DisposisiArsip[] = [
  ...baseDisposisiData,
  ...disposisiExtras,
];

const today = new Date();
const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

const basePeminjamanData: PeminjamanArsip[] = dummyPeminjaman.flatMap((item) => {
  const lemariId = resolveLemariIdByDokumenId(item.dokumenId);
  if (!lemariId) return [];
  const dokumen = dokumenById.get(item.dokumenId);
  return [
    {
      id: `pinj-${String(item.id).padStart(3, "0")}`,
      lemariId,
      dokumenId: item.dokumenId,
      namaDokumen: dokumen?.namaDokumen ?? item.detail,
      peminjam: item.peminjam,
      tanggalPinjam: item.tglPinjam,
      tanggalKembali: item.tglKembali,
      status: item.status,
    },
  ];
});

const peminjamanCountByKantor = new Map<
  string,
  { future: number; past: number }
>();

basePeminjamanData.forEach((item) => {
  if (item.status !== "Dipinjam") return;
  const kantorId = lemariById.get(item.lemariId)?.kantorId;
  if (!kantorId) return;
  const dateValue = parseDateValue(item.tanggalKembali);
  const entry = peminjamanCountByKantor.get(kantorId) ?? { future: 0, past: 0 };
  if (dateValue && dateValue < todayStart) {
    entry.past += 1;
  } else if (dateValue && dateValue > todayStart) {
    entry.future += 1;
  }
  peminjamanCountByKantor.set(kantorId, entry);
});

const peminjamanExtras: PeminjamanArsip[] = [];
let peminjamanExtraIndex = 1;
const peminjamOptions = ["DWI", "NADIA", "RANI", "ARYA"];

kantorData.forEach((kantor) => {
  const counts = peminjamanCountByKantor.get(kantor.id) ?? { future: 0, past: 0 };
  const futureNeeded = Math.max(0, 2 - counts.future);
  const pastNeeded = Math.max(0, 1 - counts.past);
  const docIds = dokumenIdsByKantor.get(kantor.id) ?? [];
  const fallbackLemariId = (lemariIdsByKantor.get(kantor.id) ?? [])[0];

  for (let i = 0; i < futureNeeded; i += 1) {
    const docId = docIds.length > 0 ? docIds[(peminjamanExtraIndex + i) % docIds.length] : undefined;
    const lemariId = docId ? resolveLemariIdByDokumenId(docId) : fallbackLemariId;
    if (!lemariId) continue;
    const dueDate = formatIsoDate(addDays(todayStart, 7 + i));
    const pinjamDate = formatIsoDate(addDays(todayStart, -(3 + i)));
    peminjamanExtras.push({
      id: `pinj-extra-${String(peminjamanExtraIndex).padStart(3, "0")}`,
      lemariId,
      dokumenId: docId,
      namaDokumen:
        (docId ? dokumenById.get(docId)?.namaDokumen : undefined) ??
        "Dokumen Arsip",
      peminjam: peminjamOptions[peminjamanExtraIndex % peminjamOptions.length],
      tanggalPinjam: pinjamDate,
      tanggalKembali: dueDate,
      status: "Dipinjam",
    });
    peminjamanExtraIndex += 1;
  }

  for (let i = 0; i < pastNeeded; i += 1) {
    const docId = docIds.length > 0 ? docIds[(peminjamanExtraIndex + i) % docIds.length] : undefined;
    const lemariId = docId ? resolveLemariIdByDokumenId(docId) : fallbackLemariId;
    if (!lemariId) continue;
    const dueDate = formatIsoDate(addDays(todayStart, -(4 + i)));
    const pinjamDate = formatIsoDate(addDays(todayStart, -(10 + i)));
    peminjamanExtras.push({
      id: `pinj-extra-${String(peminjamanExtraIndex).padStart(3, "0")}`,
      lemariId,
      dokumenId: docId,
      namaDokumen:
        (docId ? dokumenById.get(docId)?.namaDokumen : undefined) ??
        "Dokumen Arsip",
      peminjam: peminjamOptions[peminjamanExtraIndex % peminjamOptions.length],
      tanggalPinjam: pinjamDate,
      tanggalKembali: dueDate,
      status: "Dipinjam",
    });
    peminjamanExtraIndex += 1;
  }
});

export const peminjamanData: PeminjamanArsip[] = [
  ...basePeminjamanData,
  ...peminjamanExtras,
];

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

export const dummyDivisiList: string[] = [
  "IT",
  "Legal",
  "Manajemen",
  "Operasional",
  "HRD",
  "Marketing",
  "Accounting",
  "Finance",
];

export const dummySuratUsers: SuratUser[] = dummyUsers
  .filter((u) => u.is_active)
  .map((u) => ({ id: u.id, nama: u.name, divisi: u.division_id }));

export const dummySuratMasuk: SuratMasuk[] = [
  {
    id: 1,
    namaSurat: "Surat Penawaran",
    pengirim: "PT. Teknologi Maju",
    alamatPengirim: "Jl. Sudirman No 45",
    perihal: "Penawaran Kerjasama IT",
    tanggalTerima: "22-01-2026",
    sifat: "Biasa",
    disposisiKepada: ["ARYA", "DWI"],
    statusDisposisi: "Dalam Proses",
    fileName: "surat_penawaran.pdf",
    tenggatWaktu: "2026-03-20",
    keteranganTenggat: "Segera tindak lanjuti surat ini",
  },
  {
    id: 2,
    namaSurat: "Surat Somasi",
    pengirim: "Kantor Hukum A&P",
    alamatPengirim: "Jl. Rasuna Said",
    perihal: "Somasi Terkait Aset",
    tanggalTerima: "23-01-2026",
    sifat: "Rahasia",
    disposisiKepada: ["DWI"],
    statusDisposisi: "Selesai",
    fileName: "surat_somasi.pdf",
    tenggatWaktu: "2026-02-28",
    keteranganTenggat: "Pastikan tindak lanjut sesuai arahan pimpinan",
  },
  {
    id: 3,
    namaSurat: "Surat Undangan",
    pengirim: "PT. Nusantara Abadi",
    alamatPengirim: "Jl. Gatot Subroto No 18",
    perihal: "Undangan Rapat Koordinasi",
    tanggalTerima: "25-01-2026",
    sifat: "Biasa",
    disposisiKepada: ["RANI"],
    statusDisposisi: "Pending",
    fileName: "surat_undangan.pdf",
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
    disposisiKepada: ["ARYA"],
    fileName: "balasan_penawaran.pdf",
    tenggatWaktu: "2026-03-18",
    keteranganTenggat: "Konfirmasi kehadiran sebelum tenggat",
  },
  {
    id: 2,
    namaSurat: "Surat Konfirmasi",
    penerima: "CV. Sinar Abadi",
    alamatPenerima: "Jl. Merdeka No 10",
    perihal: "Konfirmasi Kesepakatan",
    tanggalKirim: "26-01-2026",
    media: "Email",
    sifat: "Biasa",
    disposisiKepada: ["RANI"],
    fileName: "surat_konfirmasi.pdf",
    tenggatWaktu: "2026-02-28",
    keteranganTenggat: "Susun jawaban resmi dan dokumentasi pendukung",
  },
  {
    id: 3,
    namaSurat: "Surat Pengantar",
    penerima: "PT. Cipta Mandiri",
    alamatPenerima: "Jl. Pahlawan No 7",
    perihal: "Pengiriman Dokumen Legal",
    tanggalKirim: "28-01-2026",
    media: "Kurir",
    sifat: "Rahasia",
    disposisiKepada: ["DWI"],
    fileName: "surat_pengantar.pdf",
  },
];

export const dummyMemorandum: Memorandum[] = [
  {
    id: 1,
    noMemo: "MEMO/001/HRD/2026",
    perihal: "Cuti Bersama",
    divisiPengirim: "HRD",
    pembuatMemo: "RANI",
    tanggal: "20-01-2026",
    keterangan: "Pengumuman Cuti Bersama Tahun Baru Imlek",
    penerimaTipe: "divisi",
    penerima: ["ALL DIVISI"],
    fileName: "memo_cuti.pdf",
    tenggatWaktu: "2026-03-20",
    keteranganTenggat: "Koordinasi jadwal pengganti sebelum tenggat",
  },
  {
    id: 2,
    noMemo: "MEMO/002/IT/2026",
    perihal: "Pemeliharaan Sistem",
    divisiPengirim: "IT",
    pembuatMemo: "ARYA",
    tanggal: "22-01-2026",
    keterangan: "Maintenance server utama pada akhir pekan.",
    penerimaTipe: "divisi",
    penerima: ["Operasional", "Finance"],
    fileName: "memo_maintenance.pdf",
    tenggatWaktu: "2026-02-28",
    keteranganTenggat: "Siapkan backup data sebelum maintenance",
  },
  {
    id: 3,
    noMemo: "MEMO/003/LEGAL/2026",
    perihal: "Review Kontrak Vendor",
    divisiPengirim: "Legal",
    pembuatMemo: "DWI",
    tanggal: "24-01-2026",
    keterangan: "Peninjauan klausul kontrak vendor baru.",
    penerimaTipe: "perorangan",
    penerima: ["NADIA", "RANI"],
    fileName: "memo_review_vendor.pdf",
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
    namaNotaris: "Notaris A",
    keterangan: "Akta akad pembiayaan utama untuk fasilitas murabahah nasabah.",
    filePath: "/contoh-dok/akad-pembiayaan.pdf",
    fileType: "pdf",
  },
  {
    id: "NTR-DBT-002",
    debiturId: "DBT001",
    jenisDokumen: "APHT",
    namaNotaris: "Notaris A",
    keterangan: "Pengikatan hak tanggungan atas sertifikat agunan pembiayaan.",
    filePath: "/contoh-dok/sertifikat-jaminan.pdf",
    fileType: "pdf",
  },
  {
    id: "NTR-DBT-003",
    debiturId: "DBT001",
    jenisDokumen: "Surat Kuasa",
    namaNotaris: "Notaris B",
    keterangan: "Surat kuasa pengurusan dokumen legal untuk pencairan akad.",
    filePath: "/contoh-dok/surat-pernyataan-restrukturisasi.pdf",
    fileType: "pdf",
  },
  {
    id: "NTR-DBT-004",
    debiturId: "DBT002",
    jenisDokumen: "Akad",
    namaNotaris: "Notaris B",
    keterangan: "Akta akad pembiayaan investasi atas nama debitur.",
    filePath: "/contoh-dok/akad-pembiayaan.pdf",
    fileType: "pdf",
  },
  {
    id: "NTR-DBT-005",
    debiturId: "DBT002",
    jenisDokumen: "Fidusia",
    namaNotaris: "Notaris B",
    keterangan: "Akta fidusia untuk pengikatan jaminan kendaraan operasional.",
    filePath: "/contoh-dok/sertifikat-jaminan.pdf",
    fileType: "pdf",
  },
  {
    id: "NTR-DBT-006",
    debiturId: "DBT003",
    jenisDokumen: "APHT",
    namaNotaris: "Notaris C",
    keterangan: "Dokumen APHT untuk pengikatan agunan ruko nasabah.",
    filePath: "/contoh-dok/sertifikat-jaminan.pdf",
    fileType: "pdf",
  },
  {
    id: "NTR-DBT-007",
    debiturId: "DBT003",
    jenisDokumen: "Roya",
    namaNotaris: "Notaris C",
    keterangan: "Proses roya atas jaminan sebelumnya yang telah diselesaikan.",
    filePath: "/contoh-dok/surat-pernyataan-restrukturisasi.pdf",
    fileType: "pdf",
  },
  {
    id: "NTR-DBT-008",
    debiturId: "DBT004",
    jenisDokumen: "Fidusia",
    namaNotaris: "Notaris A",
    keterangan: "Dokumen fidusia atas jaminan kendaraan pembiayaan nasabah.",
    filePath: "/contoh-dok/sertifikat-jaminan.pdf",
    fileType: "pdf",
  },
  {
    id: "NTR-DBT-009",
    debiturId: "DBT004",
    jenisDokumen: "Surat Kuasa",
    namaNotaris: "Notaris A",
    keterangan: "Surat kuasa pengurusan balik nama dan administrasi jaminan.",
    filePath: "/contoh-dok/surat-pernyataan-restrukturisasi.pdf",
    fileType: "pdf",
  },
  {
    id: "NTR-DBT-010",
    debiturId: "DBT005",
    jenisDokumen: "Akad",
    namaNotaris: "Notaris C",
    keterangan: "Akta akad pembiayaan korporasi untuk fasilitas modal kerja.",
    filePath: "/contoh-dok/akad-pembiayaan.pdf",
    fileType: "pdf",
  },
  {
    id: "NTR-DBT-011",
    debiturId: "DBT005",
    jenisDokumen: "APHT",
    namaNotaris: "Notaris C",
    keterangan: "APHT atas aset tanah dan bangunan yang dijadikan agunan utama.",
    filePath: "/contoh-dok/sertifikat-jaminan.pdf",
    fileType: "pdf",
  },
  {
    id: "NTR-DBT-012",
    debiturId: "DBT005",
    jenisDokumen: "Surat Kuasa",
    namaNotaris: "Notaris B",
    keterangan: "Surat kuasa pelengkap untuk penandatanganan dan legal review.",
    filePath: "/contoh-dok/surat-pernyataan-restrukturisasi.pdf",
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

const notarisDocumentOrder: Record<NotarisDebitur["jenisDokumen"], number> = {
  Akad: 0,
  APHT: 1,
  Fidusia: 2,
  Roya: 3,
  "Surat Kuasa": 4,
};

function sortNotarisDebitur(items: NotarisDebitur[]) {
  return [...items].sort((left, right) => {
    const documentOrder =
      notarisDocumentOrder[left.jenisDokumen] -
      notarisDocumentOrder[right.jenisDokumen];
    if (documentOrder !== 0) return documentOrder;

    const notarisOrder = left.namaNotaris.localeCompare(right.namaNotaris);
    if (notarisOrder !== 0) return notarisOrder;

    return left.id.localeCompare(right.id);
  });
}

export function getNotarisByDebiturId(id: string): NotarisDebitur[] {
  const notarisByDebitur = sortNotarisDebitur(
    dummyNotarisDebitur.filter((item) => item.debiturId === id),
  );
  if (notarisByDebitur.length > 0) {
    return notarisByDebitur;
  }

  const debitur = getDebiturById(id);
  if (!debitur) {
    return [];
  }

  return sortNotarisDebitur(
    dummyProgressNotaris
      .filter((item) => item.noKontrak === debitur.noKontrak)
      .map((item) => ({
        id: `NTR-${item.id}`,
        debiturId: id,
        jenisDokumen: item.jenisAkta,
        namaNotaris: item.namaNotaris,
        keterangan: item.catatan,
        filePath: item.lampiranFilePath,
        fileType: item.lampiranFileType,
      })),
  );
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
    userInput: "Dwi",
  },
  {
    id: 2,
    noKontrak: "PB/2023/000987",
    noBerkas: "A010259",
    keterangan: "Dokumen pembiayaan terkait agunan",
    tanggalInput: "2026-01-22",
    userInput: "Dwi",
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
    userInput: "Dwi",
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
    userInput: "Dwi",
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
    userInput: "Dwi",
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
    userInput: "Dwi",
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
    userInput: "Dwi",
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
    userInput: "Dwi",
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
    userInput: "Dwi",
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
    user: "Dwi",
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
    userInput: "Dwi",
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
    userInput: "Dwi",
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
      userInput: "Dwi",
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
      userInput: "Nadia",
      prosesBerjalan: 5,
      laporanSelesai: 18,
      lewatExpired: 0,
    },
    {
      id: "pk-007",
      nama: "Notaris Budi Hartono SH MKn",
      kodeDokumen: "NTR-003",
      jenisDokumen: "Akta",
      namaDokumen: "Akta Pembiayaan Murabahah",
      detailDokumen: "Pembuatan akta pembiayaan murabahah untuk nasabah retail.",
      tanggalInput: "2026-01-25",
      userInput: "Dwi",
      prosesBerjalan: 4,
      laporanSelesai: 11,
      lewatExpired: 1,
    },
    {
      id: "pk-008",
      nama: "Notaris Rini Wulandari SH",
      kodeDokumen: "NTR-004",
      jenisDokumen: "Legalisasi",
      namaDokumen: "Legalisasi Dokumen Jaminan",
      detailDokumen: "Legalisasi dokumen jaminan kendaraan dan properti.",
      tanggalInput: "2026-01-27",
      userInput: "Nadia",
      prosesBerjalan: 3,
      laporanSelesai: 9,
      lewatExpired: 2,
    },
    {
      id: "pk-009",
      nama: "Notaris Hendra Kusuma SH MKn",
      kodeDokumen: "NTR-005",
      jenisDokumen: "Pengikatan",
      namaDokumen: "Pengikatan Fidusia",
      detailDokumen: "Pengikatan fidusia untuk pembiayaan kendaraan operasional.",
      tanggalInput: "2026-01-29",
      userInput: "Rani",
      prosesBerjalan: 2,
      laporanSelesai: 7,
      lewatExpired: 1,
    },
    {
      id: "pk-010",
      nama: "Notaris Fatimah Zahra SH",
      kodeDokumen: "NTR-006",
      jenisDokumen: "Akta",
      namaDokumen: "Akta Restrukturisasi Pembiayaan",
      detailDokumen: "Akta restrukturisasi untuk pembiayaan kolektif semester I.",
      tanggalInput: "2026-02-01",
      userInput: "Arya",
      prosesBerjalan: 5,
      laporanSelesai: 10,
      lewatExpired: 1,
    },
    {
      id: "pk-011",
      nama: "Notaris Agus Salim SH MKn",
      kodeDokumen: "NTR-007",
      jenisDokumen: "Pengikatan",
      namaDokumen: "Pengikatan Hak Tanggungan",
      detailDokumen: "Pengikatan hak tanggungan untuk nasabah komersial.",
      tanggalInput: "2026-02-03",
      userInput: "Dwi",
      prosesBerjalan: 3,
      laporanSelesai: 8,
      lewatExpired: 2,
    },
    {
      id: "pk-012",
      nama: "Notaris Dewi Permatasari SH",
      kodeDokumen: "NTR-008",
      jenisDokumen: "Legalisasi",
      namaDokumen: "Legalisasi Akta Addendum",
      detailDokumen: "Legalisasi addendum akad pembiayaan lanjutan.",
      tanggalInput: "2026-02-05",
      userInput: "Nadia",
      prosesBerjalan: 4,
      laporanSelesai: 12,
      lewatExpired: 1,
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
      userInput: "Rani",
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
      userInput: "Arya",
      prosesBerjalan: 5,
      laporanSelesai: 20,
      lewatExpired: 0,
    },
    {
      id: "pk-013",
      nama: "PT Asuransi Allianz Syariah",
      kodeDokumen: "ASR-003",
      jenisDokumen: "Polis",
      namaDokumen: "Polis Asuransi Jiwa Pembiayaan",
      detailDokumen: "Polis asuransi jiwa untuk portofolio pembiayaan mikro.",
      tanggalInput: "2026-01-24",
      userInput: "Rani",
      prosesBerjalan: 4,
      laporanSelesai: 13,
      lewatExpired: 1,
    },
    {
      id: "pk-014",
      nama: "PT Sun Life Financial Syariah",
      kodeDokumen: "ASR-004",
      jenisDokumen: "Klaim",
      namaDokumen: "Dokumen Klaim Meninggal Dunia",
      detailDokumen: "Dokumen klaim asuransi jiwa nasabah pembiayaan berjalan.",
      tanggalInput: "2026-01-26",
      userInput: "Arya",
      prosesBerjalan: 3,
      laporanSelesai: 11,
      lewatExpired: 2,
    },
    {
      id: "pk-015",
      nama: "PT Asuransi Prudential Syariah",
      kodeDokumen: "ASR-005",
      jenisDokumen: "Endorsement",
      namaDokumen: "Endorsement Polis Pembiayaan",
      detailDokumen: "Perubahan manfaat polis untuk pembiayaan multiguna.",
      tanggalInput: "2026-01-30",
      userInput: "Dwi",
      prosesBerjalan: 5,
      laporanSelesai: 14,
      lewatExpired: 1,
    },
    {
      id: "pk-016",
      nama: "PT AXA Mandiri Syariah",
      kodeDokumen: "ASR-006",
      jenisDokumen: "Klaim",
      namaDokumen: "Dokumen Klaim Kecelakaan",
      detailDokumen: "Proses klaim kecelakaan untuk debitur pembiayaan konsumtif.",
      tanggalInput: "2026-02-02",
      userInput: "Nadia",
      prosesBerjalan: 2,
      laporanSelesai: 9,
      lewatExpired: 2,
    },
    {
      id: "pk-017",
      nama: "PT Asuransi BRI Life Syariah",
      kodeDokumen: "ASR-007",
      jenisDokumen: "Polis",
      namaDokumen: "Polis Perlindungan Pembiayaan UMKM",
      detailDokumen: "Polis perlindungan pembiayaan untuk segmen UMKM cabang.",
      tanggalInput: "2026-02-06",
      userInput: "Rani",
      prosesBerjalan: 4,
      laporanSelesai: 10,
      lewatExpired: 1,
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
      userInput: "Dwi",
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
      userInput: "Nadia",
      prosesBerjalan: 3,
      laporanSelesai: 10,
      lewatExpired: 1,
    },
    {
      id: "pk-018",
      nama: "KJPP Hartono & Rekan",
      kodeDokumen: "KJP-003",
      jenisDokumen: "Appraisal",
      namaDokumen: "Laporan Appraisal Ruko",
      detailDokumen: "Penilaian agunan ruko untuk pembiayaan komersial.",
      tanggalInput: "2026-01-28",
      userInput: "Dwi",
      prosesBerjalan: 2,
      laporanSelesai: 7,
      lewatExpired: 1,
    },
    {
      id: "pk-019",
      nama: "KJPP Susanto Appraisal",
      kodeDokumen: "KJP-004",
      jenisDokumen: "Review",
      namaDokumen: "Review Nilai Agunan Kendaraan",
      detailDokumen: "Review penilaian agunan kendaraan niaga dan operasional.",
      tanggalInput: "2026-01-31",
      userInput: "Arya",
      prosesBerjalan: 3,
      laporanSelesai: 6,
      lewatExpired: 2,
    },
    {
      id: "pk-020",
      nama: "KJPP Wibowo & Partners",
      kodeDokumen: "KJP-005",
      jenisDokumen: "Appraisal",
      namaDokumen: "Laporan Appraisal Rumah Tinggal",
      detailDokumen: "Penilaian properti rumah tinggal untuk akad baru.",
      tanggalInput: "2026-02-04",
      userInput: "Nadia",
      prosesBerjalan: 1,
      laporanSelesai: 8,
      lewatExpired: 1,
    },
    {
      id: "pk-021",
      nama: "KJPP Handayani & Rekan",
      kodeDokumen: "KJP-006",
      jenisDokumen: "Review",
      namaDokumen: "Review Agunan Tanah dan Bangunan",
      detailDokumen: "Review nilai agunan tanah dan bangunan untuk perpanjangan pembiayaan.",
      tanggalInput: "2026-02-07",
      userInput: "Rani",
      prosesBerjalan: 2,
      laporanSelesai: 9,
      lewatExpired: 1,
    },
    {
      id: "pk-022",
      nama: "KJPP Pratama Konsultan",
      kodeDokumen: "KJP-007",
      jenisDokumen: "Appraisal",
      namaDokumen: "Laporan Penilaian Agunan Campuran",
      detailDokumen: "Penilaian agunan campuran untuk pembiayaan investasi.",
      tanggalInput: "2026-02-09",
      userInput: "Dwi",
      prosesBerjalan: 3,
      laporanSelesai: 8,
      lewatExpired: 2,
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
  "pk-007": "2025-12-06",
  "pk-008": "2025-12-09",
  "pk-009": "2025-12-12",
  "pk-010": "2025-12-15",
  "pk-011": "2025-12-19",
  "pk-012": "2025-12-21",
  "pk-013": "2025-12-07",
  "pk-014": "2025-12-11",
  "pk-015": "2025-12-13",
  "pk-016": "2025-12-17",
  "pk-017": "2025-12-20",
  "pk-018": "2025-12-05",
  "pk-019": "2025-12-22",
  "pk-020": "2025-12-23",
  "pk-021": "2025-12-24",
  "pk-022": "2025-12-26",
};

const progressPihakKetigaContractPrefix: Record<string, string> = {
  "pk-001": "PB/2024/001",
  "pk-002": "PB/2024/002",
  "pk-003": "PB/2024/003",
  "pk-004": "PB/2024/004",
  "pk-005": "PB/2024/005",
  "pk-006": "PB/2024/006",
  "pk-007": "PB/2024/007",
  "pk-008": "PB/2024/008",
  "pk-009": "PB/2024/009",
  "pk-010": "PB/2024/010",
  "pk-011": "PB/2024/011",
  "pk-012": "PB/2024/012",
  "pk-013": "PB/2024/013",
  "pk-014": "PB/2024/014",
  "pk-015": "PB/2024/015",
  "pk-016": "PB/2024/016",
  "pk-017": "PB/2024/017",
  "pk-018": "PB/2024/018",
  "pk-019": "PB/2024/019",
  "pk-020": "PB/2024/020",
  "pk-021": "PB/2024/021",
  "pk-022": "PB/2024/022",
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
        noKontrak: `${contractPrefix}${String(index + 1).padStart(3, "0")}`,
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
    id: "titipan-010",
    nama: "Andi Pranata",
    jenisTitipan: "NOTARIS",
    pihakKetigaId: "pk-007",
    totalTitipan: 78000000,
    saldoTerbayar: 50000000,
    sisaSaldo: 28000000,
  },
  {
    id: "titipan-011",
    nama: "Rina Maharani",
    jenisTitipan: "NOTARIS",
    pihakKetigaId: "pk-007",
    totalTitipan: 64000000,
    saldoTerbayar: 64000000,
    sisaSaldo: 0,
  },
  {
    id: "titipan-012",
    nama: "Yoga Saputra",
    jenisTitipan: "NOTARIS",
    pihakKetigaId: "pk-008",
    totalTitipan: 83000000,
    saldoTerbayar: 60000000,
    sisaSaldo: 23000000,
  },
  {
    id: "titipan-013",
    nama: "Melati Kusuma",
    jenisTitipan: "NOTARIS",
    pihakKetigaId: "pk-008",
    totalTitipan: 59000000,
    saldoTerbayar: 42000000,
    sisaSaldo: 17000000,
  },
  {
    id: "titipan-014",
    nama: "Fikri Ramadhan",
    jenisTitipan: "NOTARIS",
    pihakKetigaId: "pk-009",
    totalTitipan: 71000000,
    saldoTerbayar: 71000000,
    sisaSaldo: 0,
  },
  {
    id: "titipan-015",
    nama: "Nabila Putri",
    jenisTitipan: "NOTARIS",
    pihakKetigaId: "pk-009",
    totalTitipan: 68000000,
    saldoTerbayar: 45000000,
    sisaSaldo: 23000000,
  },
  {
    id: "titipan-016",
    nama: "Arief Setiawan",
    jenisTitipan: "NOTARIS",
    pihakKetigaId: "pk-010",
    totalTitipan: 92000000,
    saldoTerbayar: 65000000,
    sisaSaldo: 27000000,
  },
  {
    id: "titipan-017",
    nama: "Salsa Amelia",
    jenisTitipan: "NOTARIS",
    pihakKetigaId: "pk-010",
    totalTitipan: 57000000,
    saldoTerbayar: 30000000,
    sisaSaldo: 27000000,
  },
  {
    id: "titipan-018",
    nama: "Bagus Wicaksono",
    jenisTitipan: "NOTARIS",
    pihakKetigaId: "pk-011",
    totalTitipan: 76000000,
    saldoTerbayar: 76000000,
    sisaSaldo: 0,
  },
  {
    id: "titipan-019",
    nama: "Citra Lestari",
    jenisTitipan: "NOTARIS",
    pihakKetigaId: "pk-011",
    totalTitipan: 61000000,
    saldoTerbayar: 39000000,
    sisaSaldo: 22000000,
  },
  {
    id: "titipan-020",
    nama: "Dimas Pratomo",
    jenisTitipan: "NOTARIS",
    pihakKetigaId: "pk-012",
    totalTitipan: 88000000,
    saldoTerbayar: 52000000,
    sisaSaldo: 36000000,
  },
  {
    id: "titipan-021",
    nama: "Hana Oktaviani",
    jenisTitipan: "NOTARIS",
    pihakKetigaId: "pk-012",
    totalTitipan: 66000000,
    saldoTerbayar: 66000000,
    sisaSaldo: 0,
  },
  {
    id: "titipan-022",
    nama: "Rudi Saputra",
    jenisTitipan: "ASURANSI",
    pihakKetigaId: "pk-013",
    totalTitipan: 47000000,
    saldoTerbayar: 28000000,
    sisaSaldo: 19000000,
  },
  {
    id: "titipan-023",
    nama: "Farah Nursari",
    jenisTitipan: "ASURANSI",
    pihakKetigaId: "pk-013",
    totalTitipan: 53000000,
    saldoTerbayar: 53000000,
    sisaSaldo: 0,
  },
  {
    id: "titipan-024",
    nama: "Bayu Pradana",
    jenisTitipan: "ASURANSI",
    pihakKetigaId: "pk-014",
    totalTitipan: 62000000,
    saldoTerbayar: 41000000,
    sisaSaldo: 21000000,
  },
  {
    id: "titipan-025",
    nama: "Karina Putri",
    jenisTitipan: "ASURANSI",
    pihakKetigaId: "pk-014",
    totalTitipan: 44000000,
    saldoTerbayar: 24000000,
    sisaSaldo: 20000000,
  },
  {
    id: "titipan-026",
    nama: "Taufik Hidayat",
    jenisTitipan: "ASURANSI",
    pihakKetigaId: "pk-015",
    totalTitipan: 58000000,
    saldoTerbayar: 58000000,
    sisaSaldo: 0,
  },
  {
    id: "titipan-027",
    nama: "Nadia Permata",
    jenisTitipan: "ASURANSI",
    pihakKetigaId: "pk-015",
    totalTitipan: 49000000,
    saldoTerbayar: 27000000,
    sisaSaldo: 22000000,
  },
  {
    id: "titipan-028",
    nama: "Gilang Maulana",
    jenisTitipan: "ASURANSI",
    pihakKetigaId: "pk-016",
    totalTitipan: 65000000,
    saldoTerbayar: 43000000,
    sisaSaldo: 22000000,
  },
  {
    id: "titipan-029",
    nama: "Wulan Sari",
    jenisTitipan: "ASURANSI",
    pihakKetigaId: "pk-016",
    totalTitipan: 56000000,
    saldoTerbayar: 36000000,
    sisaSaldo: 20000000,
  },
  {
    id: "titipan-030",
    nama: "Reza Akbar",
    jenisTitipan: "ASURANSI",
    pihakKetigaId: "pk-017",
    totalTitipan: 52000000,
    saldoTerbayar: 30000000,
    sisaSaldo: 22000000,
  },
  {
    id: "titipan-031",
    nama: "Intan Rahma",
    jenisTitipan: "ASURANSI",
    pihakKetigaId: "pk-017",
    totalTitipan: 48000000,
    saldoTerbayar: 48000000,
    sisaSaldo: 0,
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
    dicetakOleh: "Dwi",
    keterangan: "Akad Murabahah pembiayaan kendaraan dicetak ulang.",
  },
  {
    id: "CETAK-LEGAL-003",
    nasabahId: getLegalNasabahId("PB/2024/001235"),
    namaNasabah: "Siti Rahayu",
    noKontrak: "PB/2024/001235",
    jenisDokumen: "SURAT_PERINGATAN",
    tanggalCetak: "2026-03-05",
    dicetakOleh: "Nadia",
    keterangan: "Surat peringatan tahap pertama untuk monitoring kolektibilitas.",
  },
  {
    id: "CETAK-LEGAL-004",
    nasabahId: getLegalNasabahId("PB/2023/000987"),
    namaNasabah: "Hendra Wijaya",
    noKontrak: "PB/2023/000987",
    jenisDokumen: "FORMULIR_ASURANSI",
    tanggalCetak: "2026-02-19",
    dicetakOleh: "Dwi",
    keterangan: "Formulir klaim asuransi kendaraan.",
  },
  {
    id: "CETAK-LEGAL-005",
    nasabahId: getLegalNasabahId("PB/2024/001234"),
    namaNasabah: "Ahmad Suryanto",
    noKontrak: "PB/2024/001234",
    jenisDokumen: "SAMSAT",
    tanggalCetak: "2026-03-01",
    dicetakOleh: "Rani",
    keterangan: "Surat pengantar pengurusan samsat tahunan.",
  },
  {
    id: "CETAK-LEGAL-006",
    nasabahId: getLegalNasabahId("PB/2024/001235"),
    namaNasabah: "Siti Rahayu",
    noKontrak: "PB/2024/001235",
    jenisDokumen: "SKL",
    tanggalCetak: "2026-01-22",
    dicetakOleh: "Arya",
    keterangan: "Surat keterangan lunas pembiayaan modal kerja.",
  },
  {
    id: "CETAK-LEGAL-007",
    nasabahId: getLegalNasabahId("PB/2023/000987"),
    namaNasabah: "Hendra Wijaya",
    noKontrak: "PB/2023/000987",
    jenisDokumen: "AKAD",
    tanggalCetak: "2025-12-17",
    dicetakOleh: "Dwi",
    keterangan: "Draft akad pembiayaan multiguna untuk arsip legal.",
  },
  {
    id: "CETAK-LEGAL-008",
    nasabahId: getLegalNasabahId("PB/2024/001234"),
    namaNasabah: "Ahmad Suryanto",
    noKontrak: "PB/2024/001234",
    jenisDokumen: "HAFTSHEET",
    tanggalCetak: "2026-02-12",
    dicetakOleh: "Nadia",
    keterangan: "Checklist kelengkapan dokumen akad kendaraan.",
  },
  {
    id: "CETAK-LEGAL-009",
    nasabahId: getLegalNasabahId("PB/2024/001235"),
    namaNasabah: "Siti Rahayu",
    noKontrak: "PB/2024/001235",
    jenisDokumen: "FORMULIR_ASURANSI",
    tanggalCetak: "2026-03-06",
    dicetakOleh: "Rani",
    keterangan: "Formulir asuransi kebakaran untuk pembaruan polis.",
  },
  {
    id: "CETAK-LEGAL-010",
    nasabahId: getLegalNasabahId("PB/2023/000987"),
    namaNasabah: "Hendra Wijaya",
    noKontrak: "PB/2023/000987",
    jenisDokumen: "SURAT_PERINGATAN",
    tanggalCetak: "2026-03-07",
    dicetakOleh: "Arya",
    keterangan: "Surat peringatan kedua atas keterlambatan angsuran.",
  },
  {
    id: "CETAK-LEGAL-011",
    nasabahId: getLegalNasabahId("PB/2024/001234"),
    namaNasabah: "Ahmad Suryanto",
    noKontrak: "PB/2024/001234",
    jenisDokumen: "SKL",
    tanggalCetak: "2025-11-08",
    dicetakOleh: "Dwi",
    keterangan: "Simulasi surat keterangan lunas untuk pelunasan dipercepat.",
  },
  {
    id: "CETAK-LEGAL-012",
    nasabahId: getLegalNasabahId("PB/2024/001235"),
    namaNasabah: "Siti Rahayu",
    noKontrak: "PB/2024/001235",
    jenisDokumen: "SAMSAT",
    tanggalCetak: "2026-02-27",
    dicetakOleh: "Nadia",
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
