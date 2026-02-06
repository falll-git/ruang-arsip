"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Link2,
  Download,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileText,
  ExternalLink,
  Trash2,
  Eye,
} from "lucide-react";
import {
  dummyLinkedDocuments,
  dummyNasabahLegal,
  NasabahLegal,
  LinkedDocument,
} from "@/lib/data";
import { useDocumentPreviewContext } from "@/components/ui/DocumentPreviewContext";
import { useAppToast } from "@/components/ui/AppToastProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { exportToExcel } from "@/lib/utils/exportExcel";
import { formatDateDisplay, todayIsoDate } from "@/lib/utils/date";

const KATEGORI_OPTIONS = [
  "Akad",
  "Jaminan",
  "Legalitas",
  "Asuransi",
  "Identitas",
  "Lainnya",
] as const;
type KategoriOption = (typeof KATEGORI_OPTIONS)[number];

export default function LinkDokumenPage() {
  const { openPreview } = useDocumentPreviewContext();
  const { showToast } = useAppToast();
  const [data, setData] = useState<LinkedDocument[]>(dummyLinkedDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNasabah, setSelectedNasabah] = useState<NasabahLegal | null>(
    null,
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterKategori, setFilterKategori] = useState<
    "Semua" | KategoriOption
  >("Semua");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [showAddModal, setShowAddModal] = useState(false);
  const [formNoKontrak, setFormNoKontrak] = useState("");
  const [formNamaDokumen, setFormNamaDokumen] = useState("");
  const [formKategori, setFormKategori] = useState<KategoriOption>("Akad");
  const [formLinkGdrive, setFormLinkGdrive] = useState("");
  const [formKeterangan, setFormKeterangan] = useState("");

  const filteredNasabah = useMemo(() => {
    if (!searchQuery) return [];
    return dummyNasabahLegal.filter(
      (n) =>
        n.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.noKontrak.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const handleSelectNasabah = (nasabah: NasabahLegal) => {
    setSelectedNasabah(nasabah);
    setSearchQuery(nasabah.nama);
    setShowDropdown(false);
    setCurrentPage(1);
  };

  const nasabahDocs = useMemo(() => {
    if (!selectedNasabah) return data;
    let result = data.filter((d) => d.noKontrak === selectedNasabah.noKontrak);
    if (filterKategori !== "Semua")
      result = result.filter((d) => d.jenisDokumen === filterKategori);
    if (search)
      result = result.filter((d) =>
        d.namaDokumen.toLowerCase().includes(search.toLowerCase()),
      );
    return result;
  }, [data, selectedNasabah, filterKategori, search]);

  const totalPages = Math.ceil(nasabahDocs.length / itemsPerPage);
  const paginatedData = nasabahDocs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleAdd = () => {
    if (!formNoKontrak || !formNamaDokumen) {
      showToast("Lengkapi No Kontrak dan Nama Dokumen!", "error");
      return;
    }
    const nasabah = dummyNasabahLegal.find(
      (n) => n.noKontrak === formNoKontrak,
    );
    const tanggal = todayIsoDate();
    const nextId = Math.max(0, ...data.map((d) => d.id)) + 1;
    const newItem: LinkedDocument = {
      id: nextId,
      noKontrak: formNoKontrak,
      namaNasabah: nasabah?.nama || "-",
      kodeDokumen: `LNK-${String(nextId).padStart(4, "0")}`,
      namaDokumen: formNamaDokumen,
      jenisDokumen: formKategori,
      fileUrl: "/documents/contoh-dok.pdf",
      linkGdrive: formLinkGdrive,
      tanggalUpload: tanggal,
      tanggalLink: tanggal,
      userUpload: "Faisal",
      user: "Faisal",
      keterangan: formKeterangan,
      status: "Tersedia",
    };
    setData([newItem, ...data]);
    setShowAddModal(false);
    resetForm();
    showToast("Link dokumen berhasil ditambahkan!", "success");
  };

  const handleDelete = (id: number) => {
    if (confirm("Hapus link dokumen?")) {
      setData(data.filter((d) => d.id !== id));
      showToast("Data berhasil dihapus!", "success");
    }
  };
  const resetForm = () => {
    setFormNoKontrak(selectedNasabah?.noKontrak || "");
    setFormNamaDokumen("");
    setFormKategori("Akad");
    setFormLinkGdrive("");
    setFormKeterangan("");
  };

  const handleExportExcel = async () => {
    await exportToExcel({
      filename: "link_dokumen",
      sheetName: "Link Dokumen",
      title: "DAFTAR LINK DOKUMEN PEMBIAYAAN",
      columns: [
        { header: "No", key: "no", width: 5 },
        { header: "No Kontrak", key: "noKontrak", width: 15 },
        { header: "Nama", key: "namaNasabah", width: 20 },
        { header: "Dokumen", key: "namaDokumen", width: 25 },
        { header: "Kategori", key: "jenisDokumen", width: 12 },
        { header: "Link", key: "linkGdrive", width: 40 },
        { header: "Tgl Link", key: "tanggalLink", width: 12 },
      ],
      data: nasabahDocs.map((item, idx) => ({ ...item, no: idx + 1 })),
    });
    showToast("Export Excel berhasil!", "success");
  };

  const getKategoriBadge = (kategori: string) => {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        {kategori}
      </span>
    );
  };

  const kategorySummary = useMemo(() => {
    const docs = selectedNasabah
      ? data.filter((d) => d.noKontrak === selectedNasabah.noKontrak)
      : [];
    return KATEGORI_OPTIONS.map((k) => ({
      kategori: k,
      count: docs.filter((d) => d.jenisDokumen === k).length,
    }));
  }, [data, selectedNasabah]);

  const handleGdriveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast("Fitur Google Drive Integration: Coming Soon!", "warning");
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <FeatureHeader
        title="Link Dokumen Pembiayaan"
        subtitle="Kelola link dokumen pembiayaan nasabah"
        icon={<Link2 />}
      />

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Cari Nasabah
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="No Kontrak / Nama..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
              if (!e.target.value) setSelectedNasabah(null);
            }}
            onFocus={() => setShowDropdown(true)}
            className="input input-with-icon"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedNasabah(null);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {showDropdown && filteredNasabah.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {filteredNasabah.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleSelectNasabah(n)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <div className="font-medium text-gray-800">{n.nama}</div>
                  <div className="text-sm text-gray-500">{n.noKontrak}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedNasabah && (
        <>
          <div className="card p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Nasabah Terpilih</p>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedNasabah.nama}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedNasabah.noKontrak} • {selectedNasabah.produk}
                </p>
              </div>
              <button
                onClick={() => {
                  setFormNoKontrak(selectedNasabah.noKontrak);
                  setShowAddModal(true);
                }}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4" />
                Tambah Link
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {kategorySummary.map((k) => (
              <button
                key={k.kategori}
                onClick={() =>
                  setFilterKategori(
                    filterKategori === k.kategori ? "Semua" : k.kategori,
                  )
                }
                className={`card p-3 text-left transition-all ${filterKategori === k.kategori ? "ring-2 ring-[#157ec3]" : "hover:ring-1 hover:ring-[#157ec3]/20"}`}
              >
                <p
                  className="text-2xl font-bold"
                  style={{
                    color:
                      filterKategori === k.kategori ? "#157ec3" : "#111827",
                  }}
                >
                  {k.count}
                </p>
                <p className="text-xs text-gray-500">{k.kategori}</p>
              </button>
            ))}
          </div>

          <div className="card p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-primary" />
                Daftar Dokumen
              </h2>
              <button
                onClick={handleExportExcel}
                className="btn btn-success btn-sm"
              >
                <Download className="w-4 h-4" />
                Export Excel
              </button>
            </div>
            <div className="relative mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari dokumen..."
                className="input input-with-icon"
              />
              <Filter className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedData.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-gray-100 rounded-xl p-4 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-800">
                        {doc.namaDokumen}
                      </span>
                    </div>
                    {getKategoriBadge(doc.jenisDokumen)}
                  </div>
                  <p
                    className="text-xs text-gray-500 mb-3 truncate"
                    title={doc.linkGdrive || "Tidak ada link"}
                  >
                    {doc.linkGdrive || "Link belum diset"}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {formatDateDisplay(doc.tanggalUpload || doc.tanggalLink)}{" "}
                      • {doc.userUpload || doc.user}
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          openPreview(
                            doc.fileUrl || "/documents/contoh-dok.pdf",
                            doc.namaDokumen,
                          )
                        }
                        className="p-1.5 rounded-lg hover:bg-gray-100"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <a
                        href="#"
                        onClick={(e) => handleGdriveClick(e)}
                        className="p-1.5 rounded-lg hover:bg-blue-100"
                        title="Buka di GDrive"
                      >
                        <ExternalLink className="w-4 h-4 text-blue-500" />
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1.5 rounded-lg hover:bg-red-100"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {paginatedData.length === 0 && (
                <div className="col-span-2 py-12 text-center text-gray-500">
                  Tidak ada dokumen
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Menampilkan {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, nasabahDocs.length)}{" "}
                  dari {nasabahDocs.length}
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
        </>
      )}

      {!selectedNasabah && (
        <div className="card p-12 text-center">
          <Link2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Pilih Nasabah
          </h3>
          <p className="text-gray-400">
            Cari dan pilih nasabah untuk melihat dokumen terkait
          </p>
        </div>
      )}

      {showAddModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowAddModal(false);
            resetForm();
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tambah Link Dokumen</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
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
                  value={formNoKontrak}
                  onChange={(e) => setFormNoKontrak(e.target.value)}
                  className="input"
                  placeholder="PB/2024/001234"
                  readOnly={!!selectedNasabah}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Dokumen
                  </label>
                  <input
                    type="text"
                    value={formNamaDokumen}
                    onChange={(e) => setFormNamaDokumen(e.target.value)}
                    className="input"
                    placeholder="Akad Murabahah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={formKategori}
                    onChange={(e) =>
                      setFormKategori(e.target.value as KategoriOption)
                    }
                    className="select"
                  >
                    {KATEGORI_OPTIONS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link Google Drive (Coming Soon)
                </label>
                <input
                  type="text"
                  value={formLinkGdrive}
                  onChange={(e) => setFormLinkGdrive(e.target.value)}
                  className="input"
                  placeholder="https://drive.google.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Keterangan
                </label>
                <input
                  type="text"
                  value={formKeterangan}
                  onChange={(e) => setFormKeterangan(e.target.value)}
                  className="input"
                  placeholder="Keterangan tambahan..."
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
    </div>
  );
}
