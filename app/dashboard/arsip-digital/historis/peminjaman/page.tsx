"use client";

import { useMemo, useState } from "react";
import { FileSpreadsheet, History, Search } from "lucide-react";
import { exportToExcel } from "@/lib/utils/exportExcel";
import { useAuth } from "@/components/auth/AuthProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { filterDigitalDocuments } from "@/lib/rbac";
import { parseDateString } from "@/lib/utils/date";
import { useArsipDigitalWorkflow } from "@/components/arsip-digital/ArsipDigitalWorkflowProvider";

function getDurationText(startValue: string, endValue: string) {
  const startDate = parseDateString(startValue);
  const endDate = parseDateString(endValue);
  if (!startDate || !endDate) return "0 hari";

  const oneDay = 24 * 60 * 60 * 1000;
  const diff = Math.round(
    (endDate.setHours(0, 0, 0, 0) - startDate.setHours(0, 0, 0, 0)) / oneDay,
  );
  const days = Number.isFinite(diff) ? Math.max(diff, 0) : 0;
  return `${days} hari`;
}

export default function HistorisPeminjamanPage() {
  const { role } = useAuth();
  const { dokumen, peminjaman } = useArsipDigitalWorkflow();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeminjam, setFilterPeminjam] = useState("Semua");

  const dokumenAkses = useMemo(() => {
    if (!role) return [];
    return filterDigitalDocuments(role, dokumen);
  }, [dokumen, role]);

  const dokumenAksesById = useMemo(
    () => new Map(dokumenAkses.map((d) => [d.id, d])),
    [dokumenAkses],
  );

  const historisPeminjaman = useMemo(() => {
    return peminjaman
      .filter(
        (p) => p.status === "Dikembalikan" && dokumenAksesById.has(p.dokumenId),
      )
      .map((p) => {
        const dokumen = dokumenAksesById.get(p.dokumenId);
        const durasi = getDurationText(
          p.tglPinjam,
          p.tglPengembalian ?? p.tglKembali,
        );
        return {
          id: p.id,
          kode: dokumen?.kode ?? `DOK-${p.dokumenId}`,
          namaDokumen: dokumen?.namaDokumen ?? "-",
          peminjam: p.peminjam,
          tglPinjam: p.tglPinjam,
          tglKembali: p.tglPengembalian ?? p.tglKembali,
          durasi,
          approvedBy: p.approver ?? "-",
        };
      });
  }, [dokumenAksesById, peminjaman]);

  const peminjamList = [
    "Semua",
    ...Array.from(new Set(historisPeminjaman.map((d) => d.peminjam))),
  ];

  const filteredData = historisPeminjaman.filter((item) => {
    const matchSearch =
      item.namaDokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPeminjam =
      filterPeminjam === "Semua" || item.peminjam === filterPeminjam;
    return matchSearch && matchPeminjam;
  });

  const handleExport = async () => {
    await exportToExcel({
      filename: "historis-peminjaman",
      sheetName: "Historis Peminjaman",
      title: "Historis Peminjaman Dokumen",
      columns: [
        { header: "No", key: "no", width: 6 },
        { header: "Kode", key: "kode", width: 15 },
        { header: "Nama Dokumen", key: "namaDokumen", width: 30 },
        { header: "Peminjam", key: "peminjam", width: 20 },
        { header: "Tgl Pinjam", key: "tglPinjam", width: 15 },
        { header: "Tgl Kembali", key: "tglKembali", width: 15 },
        { header: "Durasi", key: "durasi", width: 12 },
        { header: "Approved By", key: "approvedBy", width: 15 },
      ],
      data: filteredData.map((item, idx) => ({
        no: idx + 1,
        kode: item.kode,
        namaDokumen: item.namaDokumen,
        peminjam: item.peminjam,
        tglPinjam: item.tglPinjam,
        tglKembali: item.tglKembali,
        durasi: item.durasi,
        approvedBy: item.approvedBy,
      })),
    });
  };

  const totalPeminjaman = historisPeminjaman.length;
  const uniquePeminjam = new Set(historisPeminjaman.map((d) => d.peminjam))
    .size;
  const avgDurasi = Math.round(
    historisPeminjaman.length === 0
      ? 0
      : historisPeminjaman.reduce((acc, d) => acc + parseInt(d.durasi), 0) /
          historisPeminjaman.length,
  );

  return (
    <div className="animate-fade-in">
      <FeatureHeader
        title="Historis Peminjaman Dokumen"
        subtitle="Riwayat lengkap peminjaman dokumen yang sudah dikembalikan"
        icon={<History />}
        actions={
          <button
            onClick={handleExport}
            className="btn btn-export-excel"
            title="Export Excel"
          >
            <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
            <span>Export Excel</span>
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{totalPeminjaman}</p>
          <p className="text-sm text-gray-500">Total Riwayat</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{uniquePeminjam}</p>
          <p className="text-sm text-gray-500">Jumlah Peminjam</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{avgDurasi} hari</p>
          <p className="text-sm text-gray-500">Rata-rata Durasi</p>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cari Dokumen
            </label>
            <div className="relative">
              <Search
                className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau kode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-with-icon"
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter Peminjam
            </label>
            <select
              value={filterPeminjam}
              onChange={(e) => setFilterPeminjam(e.target.value)}
              className="select"
            >
              {peminjamList.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <p className="text-sm text-gray-600">
            Menampilkan{" "}
            <span className="font-semibold">{filteredData.length}</span> dari{" "}
            {historisPeminjaman.length} riwayat
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  No
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Kode
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Nama Dokumen
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Peminjam
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Tgl Pinjam
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Tgl Kembali
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Durasi
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Approved By
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item, idx) => (
                <tr key={item.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <span className="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 tabular-nums">
                      {item.kode}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {item.namaDokumen}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      {item.peminjam}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.tglPinjam}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.tglKembali}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                      {item.durasi}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.approvedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
