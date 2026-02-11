"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Filter,
  Link2,
  Plus,
  Search,
  X,
} from "lucide-react";
import {
  LinkedDocument,
  NasabahLegal,
  dummyLinkedDocuments,
  dummyNasabahLegal,
  getArsipDokumenByKode,
  getDebiturByNoKontrak,
  getNasabahLegalByNoKontrak,
} from "@/lib/data";
import { useDocumentPreviewContext } from "@/components/ui/DocumentPreviewContext";
import { useAppToast } from "@/components/ui/AppToastProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { exportToExcel } from "@/lib/utils/exportExcel";
import { formatDateDisplay, todayIsoDate } from "@/lib/utils/date";

type LinkedDocumentDetail = {
  item: LinkedDocument;
  nasabah?: NasabahLegal;
};

export default function LinkDokumenPage() {
  const { openPreview } = useDocumentPreviewContext();
  const { showToast } = useAppToast();

  const [data, setData] = useState<LinkedDocument[]>(dummyLinkedDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNasabah, setSelectedNasabah] = useState<NasabahLegal | null>(
    null,
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailItem, setDetailItem] = useState<LinkedDocumentDetail | null>(
    null,
  );

  const [formNoKontrak, setFormNoKontrak] = useState("");
  const [formNoBerkas, setFormNoBerkas] = useState("");
  const [formKeterangan, setFormKeterangan] = useState("");

  const filteredNasabah = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const keyword = searchQuery.toLowerCase();
    return dummyNasabahLegal.filter(
      (item) =>
        item.nama.toLowerCase().includes(keyword) ||
        item.noKontrak.toLowerCase().includes(keyword),
    );
  }, [searchQuery]);

  const handleSelectNasabah = (nasabah: NasabahLegal) => {
    setSelectedNasabah(nasabah);
    setSearchQuery(nasabah.nama);
    setShowDropdown(false);
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    let result = [...data];
    if (selectedNasabah) {
      result = result.filter(
        (item) => item.noKontrak === selectedNasabah.noKontrak,
      );
    }
    if (search.trim()) {
      const keyword = search.toLowerCase();
      result = result.filter((item) => {
        const nasabah = getNasabahLegalByNoKontrak(item.noKontrak);
        const namaNasabah = nasabah?.nama.toLowerCase() ?? "";
        return (
          item.noBerkas.toLowerCase().includes(keyword) ||
          item.keterangan.toLowerCase().includes(keyword) ||
          namaNasabah.includes(keyword)
        );
      });
    }
    return result;
  }, [data, search, selectedNasabah]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const resetForm = () => {
    setFormNoKontrak(selectedNasabah?.noKontrak || "");
    setFormNoBerkas("");
    setFormKeterangan("");
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const handleAdd = () => {
    if (
      !formNoKontrak.trim() ||
      !formNoBerkas.trim() ||
      !formKeterangan.trim()
    ) {
      showToast("No Kontrak, No Berkas, dan Keterangan wajib diisi.", "error");
      return;
    }

    const nasabah = getNasabahLegalByNoKontrak(formNoKontrak.trim());
    if (!nasabah) {
      showToast("No Kontrak tidak ditemukan pada data internal.", "error");
      return;
    }

    const dokumen = getArsipDokumenByKode(formNoBerkas.trim());
    if (!dokumen) {
      showToast("No Berkas tidak ditemukan pada data arsip internal.", "error");
      return;
    }

    const newId = Math.max(0, ...data.map((item) => item.id)) + 1;
    const nextItem: LinkedDocument = {
      id: newId,
      noKontrak: formNoKontrak.trim(),
      noBerkas: formNoBerkas.trim(),
      keterangan: formKeterangan.trim(),
      tanggalInput: todayIsoDate(),
      userInput: "Faisal",
    };

    setData((prev) => [nextItem, ...prev]);
    closeAddModal();
    showToast("Link dokumen pembiayaan berhasil ditambahkan.", "success");
  };

  const handleOpenDetail = (item: LinkedDocument) => {
    setDetailItem({
      item,
      nasabah: getNasabahLegalByNoKontrak(item.noKontrak),
    });
    setShowDetailModal(true);
  };

  const handleExportExcel = async () => {
    await exportToExcel({
      filename: "link_dokumen_pembiayaan_internal",
      sheetName: "Link Dokumen Pembiayaan",
      title: "DAFTAR LINK DOKUMEN PEMBIAYAAN (INTERNAL)",
      columns: [
        { header: "No", key: "no", width: 5 },
        { header: "No Kontrak", key: "noKontrak", width: 18 },
        { header: "No Berkas", key: "noBerkas", width: 14 },
        { header: "Nama Nasabah", key: "namaNasabah", width: 25 },
        { header: "Produk", key: "produk", width: 25 },
        { header: "Tanggal Input", key: "tanggalInput", width: 14 },
        { header: "Keterangan", key: "keterangan", width: 35 },
      ],
      data: filteredData.map((item, idx) => {
        const nasabah = getNasabahLegalByNoKontrak(item.noKontrak);
        return {
          no: idx + 1,
          noKontrak: item.noKontrak,
          noBerkas: item.noBerkas,
          namaNasabah: nasabah?.nama ?? "-",
          produk: nasabah?.produk ?? "-",
          tanggalInput: item.tanggalInput,
          keterangan: item.keterangan,
        };
      }),
    });
    showToast("Export Excel berhasil.", "success");
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <FeatureHeader
        title="Link Dokumen Pembiayaan"
        subtitle="Relasi internal dokumen pembiayaan nasabah"
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
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setShowDropdown(true);
              if (!event.target.value.trim()) {
                setSelectedNasabah(null);
                setCurrentPage(1);
              }
            }}
            onFocus={() => setShowDropdown(true)}
            className="input input-with-icon"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedNasabah(null);
                setCurrentPage(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Reset pencarian"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {showDropdown && filteredNasabah.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {filteredNasabah.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectNasabah(item)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <div className="font-medium text-gray-800">{item.nama}</div>
                  <div className="text-sm text-gray-500">{item.noKontrak}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedNasabah ? (
        <>
          <div className="card p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Nasabah Terpilih</p>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedNasabah.nama}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedNasabah.noKontrak} - {selectedNasabah.produk}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormNoKontrak(selectedNasabah.noKontrak);
                  setShowAddModal(true);
                }}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4" />
                Tambah Link Internal
              </button>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-primary" />
                Daftar Link Dokumen
              </h2>
              <button
                type="button"
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
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari no berkas / keterangan..."
                className="input input-with-icon"
              />
              <Filter className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedData.map((item) => {
                const nasabah = getNasabahLegalByNoKontrak(item.noKontrak);
                const arsipDokumen = getArsipDokumenByKode(item.noBerkas);
                return (
                  <div
                    key={item.id}
                    className="border border-gray-100 rounded-xl p-4 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-800">
                          {item.noBerkas}
                        </span>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Internal
                      </span>
                    </div>

                    <p className="text-sm text-gray-800 font-medium">
                      {nasabah?.nama ?? "-"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.noKontrak}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      No Berkas: {item.noBerkas}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Dokumen: {arsipDokumen?.namaDokumen ?? "-"}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {item.keterangan}
                    </p>
                    <p className="text-xs text-gray-400 mt-3">
                      {formatDateDisplay(item.tanggalInput)} - {item.userInput}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(item)}
                        className="btn btn-outline btn-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Detail Internal
                      </button>
                    </div>
                  </div>
                );
              })}

              {paginatedData.length === 0 && (
                <div className="col-span-2 py-12 text-center text-gray-500">
                  Tidak ada data link dokumen internal.
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Menampilkan {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredData.length)}{" "}
                  dari {filteredData.length}
                </p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
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
      ) : (
        <div className="card p-12 text-center">
          <Link2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Pilih Nasabah
          </h3>
          <p className="text-gray-400">
            Cari dan pilih nasabah untuk menampilkan relasi dokumen internal.
          </p>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal}>
          <div
            className="modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Tambah Link Dokumen Pembiayaan
              </h3>
              <button
                type="button"
                onClick={closeAddModal}
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
                  onChange={(event) => setFormNoKontrak(event.target.value)}
                  className="input"
                  placeholder="PB/2024/001234"
                  readOnly={!!selectedNasabah}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  No Berkas
                </label>
                <input
                  type="text"
                  value={formNoBerkas}
                  onChange={(event) => setFormNoBerkas(event.target.value)}
                  className="input"
                  placeholder="Contoh: A010254"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Keterangan
                </label>
                <input
                  type="text"
                  value={formKeterangan}
                  onChange={(event) => setFormKeterangan(event.target.value)}
                  className="input"
                  placeholder="Keterangan dokumen pembiayaan..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={closeAddModal}
                className="btn btn-outline flex-1"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAdd}
                className="btn btn-primary flex-1"
              >
                Simpan
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
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detail Internal Dokumen</h3>
              <button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  setDetailItem(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {(() => {
                const nasabah = detailItem.nasabah;
                const debitur = getDebiturByNoKontrak(
                  detailItem.item.noKontrak,
                );
                const dokumen = getArsipDokumenByKode(detailItem.item.noBerkas);

                return (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">No Kontrak</p>
                        <p className="font-semibold text-gray-800">
                          {detailItem.item.noKontrak}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">No Berkas</p>
                        <p className="font-semibold text-gray-800">
                          {detailItem.item.noBerkas}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">Nama Nasabah</p>
                        <p className="font-semibold text-gray-800">
                          {nasabah?.nama ?? debitur?.namaNasabah ?? "-"}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">NIK</p>
                        <p className="font-semibold text-gray-800">
                          {nasabah?.nik ?? "-"}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">Alamat</p>
                        <p className="font-semibold text-gray-800">
                          {nasabah?.alamat ?? debitur?.alamat ?? "-"}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">Cabang</p>
                        <p className="font-semibold text-gray-800">
                          {nasabah?.cabang ?? debitur?.cabang ?? "-"}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">Produk</p>
                        <p className="font-semibold text-gray-800">
                          {nasabah?.produk ?? "-"}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">Jenis Akad</p>
                        <p className="font-semibold text-gray-800">
                          {nasabah?.jenisAkad ?? "-"}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">Nama Dokumen</p>
                        <p className="font-semibold text-gray-800">
                          {dokumen?.namaDokumen ?? "-"}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">Jenis Dokumen</p>
                        <p className="font-semibold text-gray-800">
                          {dokumen?.jenisDokumen ?? "-"}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">Tanggal Input</p>
                        <p className="font-semibold text-gray-800">
                          {formatDateDisplay(detailItem.item.tanggalInput)}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">User Input</p>
                        <p className="font-semibold text-gray-800">
                          {detailItem.item.userInput}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Keterangan</p>
                      <p className="text-sm text-gray-800">
                        {detailItem.item.keterangan || "-"}
                      </p>
                    </div>

                    {dokumen?.fileUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          openPreview(
                            dokumen.fileUrl!,
                            `${dokumen.namaDokumen} (${dokumen.kode})`,
                            "pdf",
                          )
                        }
                        className="btn btn-primary w-full"
                      >
                        <Eye className="w-4 h-4" />
                        Buka Dokumen Internal
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
