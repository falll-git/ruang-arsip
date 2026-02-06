"use client";

import { useState, useMemo, type ReactNode } from "react";
import {
  Shield,
  FileText,
  Download,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Trash2,
  Edit2,
  Eye,
} from "lucide-react";
import {
  dummyProgressAsuransi,
  perusahaanAsuransiOptions,
  jenisAsuransiOptions,
  dummyNasabahLegal,
  ProgressAsuransi,
} from "@/lib/data";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { useAppToast } from "@/components/ui/AppToastProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { exportToExcel } from "@/lib/utils/exportExcel";
import { formatDateDisplay } from "@/lib/utils/date";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export default function ProgressAsuransiPage() {
  const { showToast } = useAppToast();
  const [data, setData] = useState(dummyProgressAsuransi);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterPerusahaan, setFilterPerusahaan] = useState("Semua");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailItem, setDetailItem] = useState<ProgressAsuransi | null>(null);
  const [selectedItem, setSelectedItem] = useState<ProgressAsuransi | null>(
    null,
  );

  const [formNoKontrak, setFormNoKontrak] = useState("");
  const [formPerusahaan, setFormPerusahaan] = useState(
    perusahaanAsuransiOptions[0],
  );
  const [formJenis, setFormJenis] = useState<
    "Jiwa" | "Kebakaran" | "Kendaraan"
  >("Jiwa");
  const [formNilai, setFormNilai] = useState("");
  const [formStatus, setFormStatus] = useState<
    "Proses" | "Aktif" | "Expired" | "Klaim"
  >("Proses");
  const [formNoPolis, setFormNoPolis] = useState("");
  const [formPeriodeAwal, setFormPeriodeAwal] = useState("");
  const [formPeriodeAkhir, setFormPeriodeAkhir] = useState("");
  const [formCatatan, setFormCatatan] = useState("");

  const summary = useMemo(() => {
    return {
      total: data.length,
      proses: data.filter((d) => d.status === "Proses").length,
      aktif: data.filter((d) => d.status === "Aktif").length,
      expired: data.filter((d) => d.status === "Expired").length,
      klaim: data.filter((d) => d.status === "Klaim").length,
    };
  }, [data]);

  const filteredData = useMemo(() => {
    let result = [...data];
    if (filterStatus !== "Semua")
      result = result.filter((d) => d.status === filterStatus);
    if (filterPerusahaan !== "Semua")
      result = result.filter((d) => d.perusahaanAsuransi === filterPerusahaan);
    if (search)
      result = result.filter(
        (d) =>
          d.namaNasabah.toLowerCase().includes(search.toLowerCase()) ||
          d.noKontrak.toLowerCase().includes(search.toLowerCase()),
      );
    return result;
  }, [data, filterStatus, filterPerusahaan, search]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleAdd = () => {
    const nasabah = dummyNasabahLegal.find(
      (n) => n.noKontrak === formNoKontrak,
    );
    if (!nasabah) {
      showToast("No kontrak tidak ditemukan!", "error");
      return;
    }

    const nilaiPertanggungan = Number.parseInt(formNilai, 10) || 0;
    if (nilaiPertanggungan <= 0) {
      showToast("Nilai pertanggungan wajib diisi!", "warning");
      return;
    }
    if (!formPeriodeAwal || !formPeriodeAkhir) {
      showToast("Periode awal dan akhir wajib diisi!", "warning");
      return;
    }
    if (formPeriodeAwal > formPeriodeAkhir) {
      showToast("Periode awal tidak boleh melebihi periode akhir!", "error");
      return;
    }
    const newItem: ProgressAsuransi = {
      id: data.length + 1,
      noKontrak: formNoKontrak,
      namaNasabah: nasabah.nama,
      perusahaanAsuransi: formPerusahaan,
      jenisAsuransi: formJenis,
      nilaiPertanggungan,
      periodeAwal: formPeriodeAwal,
      periodeAkhir: formPeriodeAkhir,
      status: "Proses",
      catatan: formCatatan,
      userInput: "Faisal",
    };
    setData([newItem, ...data]);
    setShowAddModal(false);
    resetForm();
    showToast("Progress asuransi berhasil ditambahkan!", "success");
  };

  const handleUpdate = () => {
    if (!selectedItem) return;
    if (
      formStatus === "Aktif" &&
      !(formNoPolis.trim() || selectedItem.noPolis?.trim())
    ) {
      showToast("No Polis wajib diisi saat status Aktif!", "warning");
      return;
    }
    setData(
      data.map((d) =>
        d.id === selectedItem.id
          ? {
              ...d,
              status: formStatus,
              noPolis: formNoPolis || d.noPolis,
              catatan: formCatatan || d.catatan,
            }
          : d,
      ),
    );
    setShowUpdateModal(false);
    setSelectedItem(null);
    showToast("Progress berhasil diupdate!", "success");
  };

  const handleDelete = (id: number) => {
    if (confirm("Hapus data?")) {
      setData(data.filter((d) => d.id !== id));
      showToast("Data berhasil dihapus!", "success");
    }
  };
  const resetForm = () => {
    setFormNoKontrak("");
    setFormPerusahaan(perusahaanAsuransiOptions[0]);
    setFormJenis("Jiwa");
    setFormNilai("");
    setFormStatus("Proses");
    setFormNoPolis("");
    setFormPeriodeAwal("");
    setFormPeriodeAkhir("");
    setFormCatatan("");
  };

  const handleExportExcel = async () => {
    await exportToExcel({
      filename: "progress_asuransi",
      sheetName: "Progress Asuransi",
      title: "LAPORAN PROGRESS ASURANSI",
      columns: [
        { header: "No", key: "no", width: 5 },
        { header: "No Kontrak", key: "noKontrak", width: 15 },
        { header: "Nama", key: "namaNasabah", width: 20 },
        { header: "Perusahaan", key: "perusahaanAsuransi", width: 18 },
        { header: "Jenis", key: "jenisAsuransi", width: 12 },
        { header: "Nilai", key: "nilaiText", width: 15 },
        { header: "Periode", key: "periode", width: 22 },
        { header: "Status", key: "status", width: 12 },
      ],
      data: filteredData.map((item, idx) => ({
        ...item,
        no: idx + 1,
        nilaiText: formatCurrency(item.nilaiPertanggungan),
        periode: `${formatDateDisplay(item.periodeAwal)} - ${formatDateDisplay(item.periodeAkhir)}`,
      })),
    });
    showToast("Export Excel berhasil!", "success");
  };

  const getStatusBadge = (status: string) => {
    const classes: { [key: string]: string } = {
      Proses: "bg-yellow-100 text-yellow-700",
      Aktif: "bg-green-100 text-green-700",
      Expired: "bg-red-100 text-red-700",
      Klaim: "bg-orange-100 text-orange-700",
    };
    const icons: Record<string, ReactNode> = {
      Proses: <Clock className="w-3 h-3" />,
      Aktif: <CheckCircle className="w-3 h-3" />,
      Expired: <AlertTriangle className="w-3 h-3" />,
      Klaim: <Shield className="w-3 h-3" />,
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${classes[status]}`}
      >
        {icons[status]}
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <FeatureHeader
        title="Progress Asuransi"
        subtitle="Monitoring status polis asuransi nasabah"
        icon={<Shield />}
      />

      <div className="card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <p className="text-gray-900">
          Total: <span className="font-semibold">{data.length}</span> data polis
        </p>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Tambah Progress
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-7 h-7 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900 leading-none">
                {summary.total}
              </p>
              <p className="text-sm text-gray-900 mt-1">Total</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-7 h-7 text-amber-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900 leading-none">
                {summary.proses}
              </p>
              <p className="text-sm text-gray-900 mt-1">Proses</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle
                className="w-7 h-7 text-emerald-600"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900 leading-none">
                {summary.aktif}
              </p>
              <p className="text-sm text-gray-900 mt-1">Aktif</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
              <AlertTriangle
                className="w-7 h-7 text-rose-600"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900 leading-none">
                {summary.expired}
              </p>
              <p className="text-sm text-gray-900 mt-1">Expired</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Shield className="w-7 h-7 text-orange-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900 leading-none">
                {summary.klaim}
              </p>
              <p className="text-sm text-gray-900 mt-1">Klaim</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Daftar Progress
          </h2>
          <button
            onClick={handleExportExcel}
            className="btn btn-success btn-sm"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select"
          >
            <option value="Semua">Semua Status</option>
            <option value="Proses">Proses</option>
            <option value="Aktif">Aktif</option>
            <option value="Expired">Expired</option>
            <option value="Klaim">Klaim</option>
          </select>
          <select
            value={filterPerusahaan}
            onChange={(e) => setFilterPerusahaan(e.target.value)}
            className="select"
          >
            <option value="Semua">Semua Perusahaan</option>
            {perusahaanAsuransiOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <div className="relative flex-1 min-w-50">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari..."
              className="input input-with-icon"
            />
            <Filter className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  No Kontrak
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Nasabah
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Perusahaan
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Jenis
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                  Nilai
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-primary">
                    {item.noKontrak}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.namaNasabah}</td>
                  <td className="px-4 py-3 text-sm">
                    {item.perusahaanAsuransi}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.jenisAsuransi}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    {formatCurrency(item.nilaiPertanggungan)}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => {
                          setDetailItem(item);
                          setShowDetailModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100"
                        title="Detail"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setFormStatus(item.status);
                          setFormNoPolis(item.noPolis || "");
                          setFormCatatan(item.catatan || "");
                          setShowUpdateModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-blue-100"
                        title="Update"
                      >
                        <Edit2 className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-100"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowAddModal(false);
            resetForm();
          }}
        >
          <div
            className="modal-content modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Tambah Progress Asuransi
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  No Kontrak
                </label>
                <input
                  type="text"
                  list="nasabah-kontrak-asuransi"
                  value={formNoKontrak}
                  onChange={(e) => setFormNoKontrak(e.target.value)}
                  className="input"
                  placeholder="PB/2024/001234"
                />
                <datalist id="nasabah-kontrak-asuransi">
                  {dummyNasabahLegal.map((n) => (
                    <option
                      key={n.noKontrak}
                      value={n.noKontrak}
                      label={n.nama}
                    />
                  ))}
                </datalist>
                <p className="text-xs text-gray-500 mt-1">
                  Tips: pilih No Kontrak dari daftar agar data nasabah valid.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Perusahaan
                  </label>
                  <select
                    value={formPerusahaan}
                    onChange={(e) => setFormPerusahaan(e.target.value)}
                    className="select"
                  >
                    {perusahaanAsuransiOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jenis
                  </label>
                  <select
                    value={formJenis}
                    onChange={(e) =>
                      setFormJenis(e.target.value as typeof formJenis)
                    }
                    className="select"
                  >
                    {jenisAsuransiOptions.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nilai Pertanggungan
                </label>
                <input
                  type="text"
                  value={
                    formNilai
                      ? formatCurrency(Number.parseInt(formNilai, 10))
                      : ""
                  }
                  onChange={(e) =>
                    setFormNilai(e.target.value.replace(/\D/g, ""))
                  }
                  className="input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Periode Awal
                  </label>
                  <DatePickerInput
                    value={formPeriodeAwal}
                    onChange={setFormPeriodeAwal}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Periode Akhir
                  </label>
                  <DatePickerInput
                    value={formPeriodeAkhir}
                    onChange={setFormPeriodeAkhir}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catatan
                </label>
                <textarea
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  rows={2}
                  className="textarea"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="btn btn-outline flex-1"
              >
                Batal
              </button>
              <button onClick={handleAdd} className="btn btn-primary flex-1">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && selectedItem && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowUpdateModal(false);
            setSelectedItem(null);
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Update Progress</h3>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedItem(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl mb-4">
              <p className="text-sm text-blue-800">
                <strong>{selectedItem.namaNasabah}</strong>
              </p>
              <p className="text-sm text-blue-600">
                {selectedItem.perusahaanAsuransi} - {selectedItem.jenisAsuransi}
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) =>
                    setFormStatus(e.target.value as typeof formStatus)
                  }
                  className="select"
                >
                  <option value="Proses">Proses</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Expired">Expired</option>
                  <option value="Klaim">Klaim</option>
                </select>
              </div>
              {formStatus === "Aktif" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    No Polis
                  </label>
                  <input
                    type="text"
                    value={formNoPolis}
                    onChange={(e) => setFormNoPolis(e.target.value)}
                    className="input"
                    placeholder="POL-XXXX-XXXXX"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catatan
                </label>
                <textarea
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  rows={2}
                  className="textarea"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedItem(null);
                }}
                className="btn btn-outline flex-1"
              >
                Batal
              </button>
              <button onClick={handleUpdate} className="btn btn-primary flex-1">
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && detailItem && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowDetailModal(false);
            setDetailItem(null);
          }}
        >
          <div
            className="modal-content modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #157ec3 0%, #0d5a8f 100%)",
                  }}
                >
                  <Shield className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Detail Progress Asuransi
                  </h2>
                  <p className="text-sm text-gray-500">
                    {detailItem.noKontrak}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setDetailItem(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X className="w-5 h-5 text-gray-500" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Nama Nasabah</label>
                  <p className="font-medium text-gray-800">
                    {detailItem.namaNasabah}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Perusahaan</label>
                  <p className="font-medium text-gray-800">
                    {detailItem.perusahaanAsuransi}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    Jenis Asuransi
                  </label>
                  <p className="font-medium text-gray-800">
                    {detailItem.jenisAsuransi}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    Nilai Pertanggungan
                  </label>
                  <p className="font-medium text-gray-800">
                    {formatCurrency(detailItem.nilaiPertanggungan)}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Periode</label>
                  <p className="font-medium text-gray-800">
                    {formatDateDisplay(detailItem.periodeAwal)} -{" "}
                    {formatDateDisplay(detailItem.periodeAkhir)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(detailItem.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">No Polis</label>
                  <p className="font-medium text-gray-800">
                    {detailItem.noPolis?.trim() ? detailItem.noPolis : "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">User Input</label>
                  <p className="font-medium text-gray-800">
                    {detailItem.userInput}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Catatan</h3>
              <p className="text-sm text-gray-700">
                {detailItem.catatan?.trim() ? detailItem.catatan : "-"}
              </p>
            </div>

            <button
              onClick={() => {
                setShowDetailModal(false);
                setDetailItem(null);
              }}
              className="btn btn-primary w-full"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
