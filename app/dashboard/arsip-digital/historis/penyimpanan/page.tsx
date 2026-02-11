"use client";

import { useMemo, useState } from "react";
import { FileSpreadsheet, History, Search } from "lucide-react";
import { dummyDokumen } from "@/lib/data";
import { exportToExcel } from "@/lib/utils/exportExcel";
import { useAuth } from "@/components/auth/AuthProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { filterDigitalDocuments } from "@/lib/rbac";
import { formatDateDisplay } from "@/lib/utils/date";
import { useArsipDigitalMasterData } from "@/components/arsip-digital/ArsipDigitalMasterDataProvider";

export default function HistorisPenyimpananPage() {
  const { role } = useAuth();
  const { tempatPenyimpanan } = useArsipDigitalMasterData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAksi, setFilterAksi] = useState("Semua");

  const dokumenAkses = useMemo(() => {
    if (!role) return [];
    return filterDigitalDocuments(role, dummyDokumen);
  }, [role]);

  const historisPenyimpanan = useMemo(() => {
    return dokumenAkses.map((d, idx) => {
      const tempat = tempatPenyimpanan.find(
        (t) => t.id === d.tempatPenyimpananId,
      );
      return {
        id: d.id,
        kode: d.kode,
        namaDokumen: d.namaDokumen,
        aksi: "Input Baru",
        lokasiLama: "-",
        lokasiBaru: tempat
          ? `${tempat.namaKantor} - ${tempat.kodeLemari} (${tempat.rak})`
          : `Tempat ID: ${d.tempatPenyimpananId}`,
        user: d.userInput,
        tanggal: d.tglInput,
        jam: `${9 + idx}:${(idx * 15) % 60 < 10 ? "0" : ""}${(idx * 15) % 60}`,
      };
    });
  }, [dokumenAkses, tempatPenyimpanan]);

  const filteredData = historisPenyimpanan.filter((item) => {
    const matchSearch =
      item.namaDokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAksi = filterAksi === "Semua" || item.aksi === filterAksi;
    return matchSearch && matchAksi;
  });

  const handleExport = async () => {
    await exportToExcel({
      filename: "historis-penyimpanan",
      sheetName: "Historis Penyimpanan",
      title: "Historis Penyimpanan Dokumen",
      columns: [
        { header: "No", key: "no", width: 6 },
        { header: "Tanggal", key: "tanggal", width: 15 },
        { header: "Jam", key: "jam", width: 10 },
        { header: "Kode", key: "kode", width: 15 },
        { header: "Nama Dokumen", key: "namaDokumen", width: 30 },
        { header: "Aksi", key: "aksi", width: 15 },
        { header: "Lokasi Lama", key: "lokasiLama", width: 20 },
        { header: "Lokasi Baru", key: "lokasiBaru", width: 20 },
        { header: "User", key: "user", width: 15 },
      ],
      data: filteredData.map((item, idx) => ({
        no: idx + 1,
        tanggal: formatDateDisplay(item.tanggal),
        jam: item.jam,
        kode: item.kode,
        namaDokumen: item.namaDokumen,
        aksi: item.aksi,
        lokasiLama: item.lokasiLama,
        lokasiBaru: item.lokasiBaru,
        user: item.user,
      })),
    });
  };

  return (
    <div className="animate-fade-in">
      <FeatureHeader
        title="Historis Penyimpanan"
        subtitle="Riwayat perubahan lokasi dan data penyimpanan dokumen"
        icon={<History />}
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">
            {historisPenyimpanan.length}
          </p>
          <p className="text-sm text-gray-500">Total Aktivitas</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">
            {historisPenyimpanan.filter((d) => d.aksi === "Input Baru").length}
          </p>
          <p className="text-sm text-gray-500">Input Baru</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">
            {
              historisPenyimpanan.filter((d) => d.aksi === "Pindah Lokasi")
                .length
            }
          </p>
          <p className="text-sm text-gray-500">Pindah Lokasi</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">
            {historisPenyimpanan.filter((d) => d.aksi === "Edit Data").length}
          </p>
          <p className="text-sm text-gray-500">Edit Data</p>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cari
            </label>
            <div className="relative">
              <Search
                className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Cari dokumen atau user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-with-icon"
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter Aksi
            </label>
            <select
              value={filterAksi}
              onChange={(e) => setFilterAksi(e.target.value)}
              className="select"
            >
              <option value="Semua">Semua Aksi</option>
              <option value="Input Baru">Input Baru</option>
              <option value="Pindah Lokasi">Pindah Lokasi</option>
              <option value="Edit Data">Edit Data</option>
            </select>
          </div>
          <button
            onClick={handleExport}
            className="btn btn-export-excel"
            title="Export Excel"
          >
            <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
            Export Excel
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Jam</th>
                <th>Kode</th>
                <th>Nama Dokumen</th>
                <th>Aksi</th>
                <th>Lokasi Lama</th>
                <th>Lokasi Baru</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{formatDateDisplay(item.tanggal)}</td>
                  <td>{item.jam}</td>
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
                    <span
                      className={`badge ${
                        item.aksi === "Input Baru"
                          ? "badge-success"
                          : item.aksi === "Pindah Lokasi"
                            ? "badge-warning"
                            : "badge-info"
                      }`}
                    >
                      {item.aksi}
                    </span>
                  </td>
                  <td className="text-gray-500">{item.lokasiLama}</td>
                  <td className="font-medium">{item.lokasiBaru}</td>
                  <td>
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {item.user}
                    </span>
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
