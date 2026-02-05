"use client";

import { useMemo, useState } from "react";
import { FileSpreadsheet, History, Search } from "lucide-react";
import { dummyDokumen, dummyPeminjaman } from "@/lib/data";
import { exportToExcel } from "@/lib/utils/exportExcel";
import { useAuth } from "@/components/auth/AuthProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { filterDigitalDocuments } from "@/lib/rbac";

export default function HistorisPeminjamanPage() {
  const { role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeminjam, setFilterPeminjam] = useState("Semua");

  const dokumenAkses = useMemo(() => {
    if (!role) return [];
    return filterDigitalDocuments(role, dummyDokumen);
  }, [role]);

  const dokumenAksesById = useMemo(
    () => new Map(dokumenAkses.map((d) => [d.id, d])),
    [dokumenAkses],
  );

  const historisPeminjaman = useMemo(() => {
    return dummyPeminjaman
      .filter(
        (p) => p.status === "Dikembalikan" && dokumenAksesById.has(p.dokumenId),
      )
      .map((p) => {
        const dokumen = dokumenAksesById.get(p.dokumenId);
        const durasi = "5 hari";
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
  }, [dokumenAksesById]);

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
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
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
          <button
            onClick={handleExport}
            className="btn btn-success"
            title="Export Excel"
          >
            <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
            Export
          </button>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-100">
          <p className="text-sm text-gray-600">
            Menampilkan{" "}
            <span className="font-semibold">{filteredData.length}</span> dari{" "}
            {historisPeminjaman.length} riwayat
          </p>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Kode</th>
                <th>Nama Dokumen</th>
                <th>Peminjam</th>
                <th>Tgl Pinjam</th>
                <th>Tgl Kembali</th>
                <th>Durasi</th>
                <th>Approved By</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <span
                      className="font-mono text-sm px-2 py-1 rounded"
                      style={{
                        background: "rgba(21, 126, 195, 0.1)",
                        color: "#157ec3",
                      }}
                    >
                      {item.kode}
                    </span>
                  </td>
                  <td className="font-medium">{item.namaDokumen}</td>
                  <td>
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {item.peminjam}
                    </span>
                  </td>
                  <td>{item.tglPinjam}</td>
                  <td>{item.tglKembali}</td>
                  <td>
                    <span className="badge badge-info">{item.durasi}</span>
                  </td>
                  <td>{item.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
