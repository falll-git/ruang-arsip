"use client";

import { useMemo, useState } from "react";
import {
  Edit2,
  Plus,
  Save,
  Shield,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";

import { useAppToast } from "@/components/ui/AppToastProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { useArsipDigitalMasterData } from "@/components/arsip-digital/ArsipDigitalMasterDataProvider";

type FormState = {
  kode: string;
  nama: string;
  keterangan: string;
  status: "Aktif" | "Nonaktif";
};

const EMPTY_FORM: FormState = {
  kode: "",
  nama: "",
  keterangan: "",
  status: "Aktif",
};

export default function SetupJenisDokumenPage() {
  const { showToast } = useAppToast();
  const { jenisDokumen, setJenisDokumen } = useArsipDigitalMasterData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const filtered = useMemo(() => jenisDokumen, [jenisDokumen]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (id: number) => {
    const item = jenisDokumen.find((j) => j.id === id);
    if (!item) return;
    setEditingId(item.id);
    setForm({
      kode: item.kode,
      nama: item.nama,
      keterangan: item.keterangan,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const toggleStatus = (id: number) => {
    setJenisDokumen((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, status: j.status === "Aktif" ? "Nonaktif" : "Aktif" }
          : j,
      ),
    );
    showToast("Status jenis dokumen diperbarui", "success");
  };

  const handleSave = () => {
    const kode = form.kode.trim().toUpperCase();
    const nama = form.nama.trim();
    const keterangan = form.keterangan.trim();

    if (!kode || !nama || !keterangan) {
      showToast("Mohon lengkapi semua field", "warning");
      return;
    }

    setJenisDokumen((prev) => {
      if (editingId) {
        return prev.map((j) =>
          j.id === editingId
            ? {
                ...j,
                kode,
                nama,
                keterangan,
                status: form.status,
              }
            : j,
        );
      }

      const nextId = prev.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      return [
        ...prev,
        {
          id: nextId,
          kode,
          nama,
          keterangan,
          status: form.status,
        },
      ];
    });

    showToast(
      editingId ? "Jenis dokumen diperbarui" : "Jenis dokumen ditambahkan",
      "success",
    );
    closeModal();
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <FeatureHeader
        title="Setup Jenis Dokumen"
        subtitle="Kelola master jenis dokumen."
        icon={<Shield />}
        actions={
          <button onClick={openCreate} className="btn btn-primary">
            <Plus className="w-4 h-4" aria-hidden="true" />
            Tambah Jenis
          </button>
        }
      />

      <div className="card p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Total Jenis Dokumen:{" "}
            <span className="font-bold text-gray-900">{filtered.length}</span>
          </div>
        </div>

        <div className="table-container mt-6">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Kode</th>
                <th>Nama Jenis Dokumen</th>
                <th>Keterangan</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((j, idx) => (
                <tr key={j.id}>
                  <td className="text-sm text-gray-600">{idx + 1}</td>
                  <td>
                    <span className="font-mono text-sm px-2 py-1 rounded bg-gray-100 border border-gray-200">
                      {j.kode}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">
                        {j.nama}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          j.status === "Aktif"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {j.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-700">
                      {j.keterangan || "-"}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEdit(j.id)}
                        className="btn btn-outline btn-sm"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => toggleStatus(j.id)}
                        className="btn btn-outline btn-sm"
                        title={
                          j.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"
                        }
                      >
                        {j.status === "Aktif" ? (
                          <ToggleRight className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    Tidak ada data jenis dokumen.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 p-4"
          style={{
            background: "rgba(0, 0, 0, 0.55)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? "Edit Jenis Dokumen" : "Tambah Jenis Dokumen"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Tentukan kode, nama, dan keterangan dokumen.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="btn btn-ghost btn-sm"
                title="Tutup"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode
                </label>
                <input
                  value={form.kode}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, kode: e.target.value }))
                  }
                  placeholder="PRH / PMB"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama
                </label>
                <input
                  value={form.nama}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nama: e.target.value }))
                  }
                  placeholder="Pembiayaan"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keterangan
                </label>
                <input
                  value={form.keterangan}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, keterangan: e.target.value }))
                  }
                  placeholder="Dokumen perusahaan"
                  className="input"
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button onClick={closeModal} className="btn btn-outline">
                Batal
              </button>
              <button onClick={handleSave} className="btn btn-primary">
                <Save className="w-4 h-4" aria-hidden="true" />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
