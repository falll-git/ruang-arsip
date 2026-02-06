"use client";

import { useMemo, useState } from "react";
import {
  Edit2,
  Filter,
  Lock,
  Plus,
  Save,
  Shield,
  ToggleLeft,
  ToggleRight,
  Unlock,
  X,
} from "lucide-react";

import { useAppToast } from "@/components/ui/AppToastProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { useArsipDigitalMasterData } from "@/components/arsip-digital/ArsipDigitalMasterDataProvider";

type FormState = {
  kode: string;
  nama: string;
  prefix: string;
  isRestricted: boolean;
  status: "Aktif" | "Nonaktif";
};

const EMPTY_FORM: FormState = {
  kode: "",
  nama: "",
  prefix: "",
  isRestricted: false,
  status: "Aktif",
};

export default function SetupJenisDokumenPage() {
  const { showToast } = useAppToast();
  const { jenisDokumen, setJenisDokumen } = useArsipDigitalMasterData();

  const [filterAccess, setFilterAccess] = useState<
    "SEMUA" | "RESTRICT" | "NON_RESTRICT"
  >("SEMUA");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const filtered = useMemo(() => {
    if (filterAccess === "SEMUA") return jenisDokumen;
    const wantRestricted = filterAccess === "RESTRICT";
    return jenisDokumen.filter((j) => j.isRestricted === wantRestricted);
  }, [filterAccess, jenisDokumen]);

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
      prefix: item.prefix,
      isRestricted: item.isRestricted,
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
    const prefix = form.prefix.trim().toUpperCase();

    if (!kode || !nama || !prefix) {
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
              prefix,
              isRestricted: form.isRestricted,
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
          prefix,
          isRestricted: form.isRestricted,
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
        subtitle="Kelola master jenis dokumen dan level aksesnya."
        icon={<Shield />}
        actions={
          <button onClick={openCreate} className="btn btn-primary">
            <Plus className="w-4 h-4" aria-hidden="true" />
            Tambah Jenis
          </button>
        }
      />

      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Filter
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <select
              value={filterAccess}
              onChange={(e) =>
                setFilterAccess(
                  e.target.value === "RESTRICT"
                    ? "RESTRICT"
                    : e.target.value === "NON_RESTRICT"
                      ? "NON_RESTRICT"
                      : "SEMUA",
                )
              }
              className="select input-with-icon"
              title="Filter akses"
            >
              <option value="SEMUA">Semua Akses</option>
              <option value="NON_RESTRICT">Non Restrict</option>
              <option value="RESTRICT">Restrict</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Total:{" "}
            <span className="font-bold text-gray-900">{filtered.length}</span>
          </div>
        </div>

        <div className="table-container mt-6">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Kode</th>
                <th>Nama</th>
                <th>Prefix</th>
                <th>Akses</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((j, idx) => (
                <tr key={j.id}>
                  <td className="font-medium">{idx + 1}</td>
                  <td>
                    <span className="font-mono text-sm px-2 py-1 rounded bg-gray-100 border border-gray-200">
                      {j.kode}
                    </span>
                  </td>
                  <td className="font-semibold text-gray-900">{j.nama}</td>
                  <td className="font-mono text-sm">{j.prefix}</td>
                  <td>
                    <span
                      className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold ${j.isRestricted
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-sky-50 text-sky-700 border border-sky-200"
                        }`}
                      title={j.isRestricted ? "Restrict" : "Non Restrict"}
                    >
                      {j.isRestricted ? (
                        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      {j.isRestricted ? "Restrict" : "Non Restrict"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${j.status === "Aktif"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                    >
                      {j.status}
                    </span>
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
                  <td colSpan={7} className="text-center py-10 text-gray-500">
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
                  Tentukan kode, prefix, dan level akses.
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
                  Prefix Kode Dokumen
                </label>
                <input
                  value={form.prefix}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, prefix: e.target.value }))
                  }
                  placeholder="PRH"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level Akses
                </label>
                <select
                  value={form.isRestricted ? "RESTRICT" : "NON_RESTRICT"}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      isRestricted: e.target.value === "RESTRICT",
                    }))
                  }
                  className="select"
                >
                  <option value="NON_RESTRICT">Non Restrict</option>
                  <option value="RESTRICT">Restrict</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      status: e.target.value === "Aktif" ? "Aktif" : "Nonaktif",
                    }))
                  }
                  className="select"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
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
