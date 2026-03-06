# Penyesuaian Fitur Aplikasi Ruang Arsip

## Ringkasan Perubahan Berdasarkan Gambar

### 1. MANAJEMEN SURAT

**Perubahan:**

- ✅ Tambahkan menu "Cetak Dokumen" (sudah ditambahkan)

**Struktur Menu:**

```
MANAJEMEN SURAT
├── Surat Masuk
│   ├── Input Surat Masuk
│   └── Laporan Surat Masuk
├── Surat Keluar
│   ├── Input Surat Keluar
│   └── Laporan Surat Keluar
├── Memorandum
│   ├── Input Memorandum
│   └── Laporan Memorandum
└── Cetak Dokumen (BARU)
```

---

### 2. INFORMASI DEBITUR

**Perubahan:**

1. "Menu Marketing" di ganti menjadi "INPUT PROGRES"
2. Hilangkan Menu Admin (Pindahkan Ke Menu Administrator)
3. Tambahkan Laporan Summary (di Detail Debitur)
4. Tambahkan menu (Tambah Dokumen) di menu Detail Debitur - Dokumen

**Struktur Menu Baru:**

```
INFORMASI DEBITUR
├── Menu Marketing (UBAH NAMA → "INPUT PROGRES")
│   ├── Input Action Plan
│   ├── Input Hasil Kunjungan
│   └── Input Langkah Penanganan
├── Tambahkan Laporan Summary (di Detail Debitur)
└── Tambahkan menu (Tambah Dokumen) di menu Detail Debitur - Dokumen
```

**Catatan:**

- Menu Admin (Upload SLIK & Upload Restrik) dipindahkan ke menu Administrator

---

### 3. LEGAL

**Perubahan:**

1. Hapus Menu "Link Dokumen"
2. Menu "Input Progres" di ubah menjadi "Input Progres PHK3"
3. Tambahkan Menu "Upload Ideb"
4. Menu Upload Ideb: Pilih Nasabah, Input Bulan dan Tahun, Upload ideb, Ringkasan Hasil Ideb

**Struktur Menu Baru:**

```
LEGAL
├── Cetak Dokumen (tetap)
├── Data Titipan (tetap)
├── Input Progres PHK3 (UBAH NAMA dari "Input Progress")
│   ├── Progress Notaris
│   ├── Progress Asuransi
│   └── Tracking Claim Asuransi
├── Upload Ideb (BARU)
│   ├── Pilih Nasabah
│   ├── Input Bulan dan Tahun
│   ├── Upload Ideb
│   └── Ringkasan Hasil Ideb
└── Cek Data Debitur di BPRS Lain (tetap)
```

**Catatan:**

- Menu "Link Dokumen" dihapus

---

### 4. ADMINISTRATOR (BARU)

**Perubahan:**

- Ubah section "Administrasi" menjadi "Administrator"
- Tambahkan "Upload Data Pembiayaan"
- Pindahkan menu Admin dari Informasi Debitur ke sini

**Struktur Menu:**

```
ADMINISTRATOR
├── Upload Data Pembiayaan (BARU)
│   ├── Upload Data SLIK (pindahan dari Informasi Debitur)
│   └── Upload Data Restrik (pindahan dari Informasi Debitur)
└── Manajemen User (tetap)
```

---

## Status Implementasi

### ✅ Sudah Dikerjakan:

1. Menambahkan menu "Cetak Dokumen" di Manajemen Surat
2. Mengubah struktur menu Informasi Debitur (placeholder)
3. Mengubah struktur menu Legal (placeholder)
4. Menambahkan section Administrator dengan Upload Data Pembiayaan

### 🔄 Perlu Dikerjakan Selanjutnya:

1. Membuat halaman `/dashboard/surat/cetak-dokumen/page.tsx`
2. Mengubah nama menu "Marketing" menjadi "INPUT PROGRES" di UI
3. Membuat halaman Laporan Summary di Detail Debitur
4. Menambahkan fitur "Tambah Dokumen" di Detail Debitur
5. Menghapus menu "Link Dokumen" dari Legal
6. Mengubah nama "Input Progress" menjadi "Input Progres PHK3"
7. Membuat halaman `/dashboard/legal/upload-ideb/page.tsx` dengan fitur:
   - Pilih Nasabah
   - Input Bulan dan Tahun
   - Upload Ideb
   - Ringkasan Hasil Ideb
8. Membuat halaman `/dashboard/admin/upload-pembiayaan/page.tsx`
9. Memindahkan Upload SLIK dan Upload Restrik ke menu Administrator

---

## File yang Perlu Dibuat/Dimodifikasi

### File Baru:

1. `app/dashboard/surat/cetak-dokumen/page.tsx`
2. `app/dashboard/legal/upload-ideb/page.tsx`
3. `app/dashboard/admin/upload-pembiayaan/page.tsx`

### File yang Perlu Dimodifikasi:

1. `app/dashboard/layout.tsx` - Update struktur menu (sudah dimodifikasi sebagian)
2. `app/dashboard/informasi-debitur/[id]/page.tsx` - Tambah Laporan Summary
3. `app/dashboard/informasi-debitur/[id]/fitur/[feature]/[itemId]/page.tsx` - Tambah fitur Tambah Dokumen
4. `lib/rbac.ts` - Update permission untuk menu baru

---

## Catatan Penting:

- Semua perubahan harus mempertimbangkan RBAC (Role-Based Access Control)
- UI/UX harus konsisten dengan design system yang ada
- Pastikan semua route baru terdaftar di routing Next.js
