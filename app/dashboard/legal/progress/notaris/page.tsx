"use client";

import { useState, useMemo } from "react";
import {
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
  dummyProgressNotaris,
  notarisOptions,
  jenisAktaOptions,
  dummyNasabahLegal,
  ProgressNotaris,
} from "@/lib/data";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { useAppToast } from "@/components/ui/AppToastProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { exportToExcel } from "@/lib/utils/exportExcel";
import { formatDateDisplay, todayIsoDate } from "@/lib/utils/date";

export default function ProgressNotarisPage() {
  const { showToast } = useAppToast();
  const [data, setData] = useState(dummyProgressNotaris);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterNotaris, setFilterNotaris] = useState("Semua");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailItem, setDetailItem] = useState<ProgressNotaris | null>(null);
  const [selectedItem, setSelectedItem] = useState<ProgressNotaris | null>(
    null,
  );

  const [formNoKontrak, setFormNoKontrak] = useState("");
  const [formNotaris, setFormNotaris] = useState(notarisOptions[0]);
  const [formJenisAkta, setFormJenisAkta] = useState<
    "APHT" | "Fidusia" | "Roya" | "Surat Kuasa"
  >("APHT");
  const [formStatus, setFormStatus] = useState<
    "Proses" | "Selesai" | "Bermasalah"
  >("Proses");
  const [formTanggalMasuk, setFormTanggalMasuk] = useState("");
  const [formEstimasiSelesai, setFormEstimasiSelesai] = useState("");
  const [formNoAkta, setFormNoAkta] = useState("");
  const [formCatatan, setFormCatatan] = useState("");

  const summary = useMemo(() => {
    return {
      total: data.length,
      proses: data.filter((d) => d.status === "Proses").length,
      selesai: data.filter((d) => d.status === "Selesai").length,
      bermasalah: data.filter((d) => d.status === "Bermasalah").length,
    };
  }, [data]);

  const filteredData = useMemo(() => {
    let result = [...data];
    if (filterStatus !== "Semua")
      result = result.filter((d) => d.status === filterStatus);
    if (filterNotaris !== "Semua")
      result = result.filter((d) => d.namaNotaris === filterNotaris);
    if (search)
      result = result.filter(
        (d) =>
          d.namaNasabah.toLowerCase().includes(search.toLowerCase()) ||
          d.noKontrak.toLowerCase().includes(search.toLowerCase()),
      );
    return result;
  }, [data, filterStatus, filterNotaris, search]);

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
    if (!formEstimasiSelesai) {
      showToast("Estimasi selesai belum diisi!", "warning");
      return;
    }
    const newItem: ProgressNotaris = {
      id: data.length + 1,
      noKontrak: formNoKontrak,
      namaNasabah: nasabah.nama,
      namaNotaris: formNotaris,
      jenisAkta: formJenisAkta,
      tanggalMasuk: formTanggalMasuk || todayIsoDate(),
      estimasiSelesai: formEstimasiSelesai,
      status: "Proses",
      catatan: formCatatan,
      userInput: "Faisal",
    };
    setData([newItem, ...data]);
    setShowAddModal(false);
    resetForm();
    showToast("Progress notaris berhasil ditambahkan!", "success");
  };

  const handleUpdate = () => {
    if (!selectedItem) return;
    if (
      formStatus === "Selesai" &&
      !(formNoAkta.trim() || selectedItem.noAkta?.trim())
    ) {
      showToast("No Akta wajib diisi saat status Selesai!", "warning");
      return;
    }
    setData(
      data.map((d) =>
        d.id === selectedItem.id
          ? {
              ...d,
              status: formStatus,
              noAkta: formNoAkta || d.noAkta,
              tanggalSelesai:
                formStatus === "Selesai" ? todayIsoDate() : d.tanggalSelesai,
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
    setFormNotaris(notarisOptions[0]);
    setFormJenisAkta("APHT");
    setFormStatus("Proses");
    setFormTanggalMasuk("");
    setFormEstimasiSelesai("");
    setFormNoAkta("");
    setFormCatatan("");
  };

  const handleExportExcel = async () => {
    await exportToExcel({
      filename: "progress_notaris",
      sheetName: "Progress Notaris",
      title: "LAPORAN PROGRESS NOTARIS",
      columns: [
        { header: "No", key: "no", width: 5 },
        { header: "No Kontrak", key: "noKontrak", width: 15 },
        { header: "Nama", key: "namaNasabah", width: 20 },
        { header: "Notaris", key: "namaNotaris", width: 25 },
        { header: "Jenis Akta", key: "jenisAkta", width: 12 },
        { header: "Tgl Masuk", key: "tanggalMasuk", width: 12 },
        { header: "Estimasi", key: "estimasiSelesai", width: 12 },
        { header: "Status", key: "status", width: 12 },
      ],
      data: filteredData.map((item, idx) => ({ ...item, no: idx + 1 })),
    });
    showToast("Export Excel berhasil!", "success");
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      Proses: "bg-yellow-100 text-yellow-700",
      Selesai: "bg-green-100 text-green-700",
      Bermasalah: "bg-red-100 text-red-700",
    };
    const icons = {
      Proses: <Clock className="w-3 h-3" />,
      Selesai: <CheckCircle className="w-3 h-3" />,
      Bermasalah: <AlertTriangle className="w-3 h-3" />,
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${classes[status as keyof typeof classes]}`}
      >
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <FeatureHeader
        title="Progress Notaris"
        subtitle="Monitoring progress pengerjaan akta notaris"
        icon={<FileText />}
      />

      <div className="card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <p className="text-gray-900">
          Total: <span className="font-semibold">{data.length}</span> progress
        </p>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Tambah Progress
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-7 h-7 text-blue-600" />
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
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">
              <Clock className="w-7 h-7 text-yellow-600" />
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
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900 leading-none">
                {summary.selesai}
              </p>
              <p className="text-sm text-gray-900 mt-1">Selesai</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900 leading-none">
                {summary.bermasalah}
              </p>
              <p className="text-sm text-gray-900 mt-1">Bermasalah</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
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
            <option value="Selesai">Selesai</option>
            <option value="Bermasalah">Bermasalah</option>
          </select>
          <select
            value={filterNotaris}
            onChange={(e) => setFilterNotaris(e.target.value)}
            className="select"
          >
            <option value="Semua">Semua Notaris</option>
            {notarisOptions.map((n) => (
              <option key={n} value={n}>
                {n}
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
                  Notaris
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Jenis
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Masuk
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Estimasi
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
                  <td className="px-4 py-3 text-sm">{item.namaNotaris}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {item.jenisAkta}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDateDisplay(item.tanggalMasuk)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDateDisplay(item.estimasiSelesai)}
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
                      {item.status !== "Selesai" && (
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setFormStatus(item.status);
                            setFormNoAkta(item.noAkta || "");
                            setFormCatatan(item.catatan || "");
                            setShowUpdateModal(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-blue-100"
                          title="Update"
                        >
                          <Edit2 className="w-4 h-4 text-blue-500" />
                        </button>
                      )}
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
                    colSpan={8}
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
              <h3 className="text-lg font-semibold">Tambah Progress Notaris</h3>
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
                  list="nasabah-kontrak-notaris"
                  value={formNoKontrak}
                  onChange={(e) => setFormNoKontrak(e.target.value)}
                  className="input"
                  placeholder="PB/2024/001234"
                />
                <datalist id="nasabah-kontrak-notaris">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notaris
                  </label>
                  <select
                    value={formNotaris}
                    onChange={(e) => setFormNotaris(e.target.value)}
                    className="select"
                  >
                    {notarisOptions.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jenis Akta
                  </label>
                  <select
                    value={formJenisAkta}
                    onChange={(e) =>
                      setFormJenisAkta(e.target.value as typeof formJenisAkta)
                    }
                    className="select"
                  >
                    {jenisAktaOptions.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal Masuk
                  </label>
                  <DatePickerInput
                    value={formTanggalMasuk}
                    onChange={setFormTanggalMasuk}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estimasi Selesai
                  </label>
                  <DatePickerInput
                    value={formEstimasiSelesai}
                    onChange={setFormEstimasiSelesai}
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
            <div className="p-4 bg-gray-50 rounded-xl mb-4">
              <p className="text-sm text-gray-800">
                <strong>{selectedItem.namaNasabah}</strong>
              </p>
              <p className="text-sm text-gray-600">
                {selectedItem.namaNotaris} - {selectedItem.jenisAkta}
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
                  <option value="Selesai">Selesai</option>
                  <option value="Bermasalah">Bermasalah</option>
                </select>
              </div>
              {formStatus === "Selesai" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    No Akta
                  </label>
                  <input
                    type="text"
                    value={formNoAkta}
                    onChange={(e) => setFormNoAkta(e.target.value)}
                    className="input"
                    placeholder="APHT/001/I/2026"
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
                  <FileText className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Detail Progress Notaris
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
                  <label className="text-sm text-gray-500">Notaris</label>
                  <p className="font-medium text-gray-800">
                    {detailItem.namaNotaris}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Jenis Akta</label>
                  <p className="font-medium text-gray-800">
                    {detailItem.jenisAkta}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Tanggal Masuk</label>
                  <p className="font-medium text-gray-800">
                    {formatDateDisplay(detailItem.tanggalMasuk)}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">
                    Estimasi Selesai
                  </label>
                  <p className="font-medium text-gray-800">
                    {formatDateDisplay(detailItem.estimasiSelesai)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(detailItem.status)}
                  </div>
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
              <h3 className="font-semibold text-gray-800 mb-3">
                Informasi Akta
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">No Akta</label>
                  <p className="font-medium text-gray-800">
                    {detailItem.noAkta || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    Tanggal Selesai
                  </label>
                  <p className="font-medium text-gray-800">
                    {formatDateDisplay(detailItem.tanggalSelesai)}
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
