"use client";

import { useMemo, useState } from "react";
import {
  Edit2,
  Plus,
  Save,
  Search,
  X,
  Warehouse,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import { useAppToast } from "@/components/ui/AppToastProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { useArsipDigitalMasterData } from "@/components/arsip-digital/ArsipDigitalMasterDataProvider";

type FormState = {
  kodeKantor: string;
  namaKantor: string;
  kodeLemari: string;
  rak: string;
  kapasitas: string;
  status: "Aktif" | "Nonaktif";
};

const EMPTY_FORM: FormState = {
  kodeKantor: "",
  namaKantor: "",
  kodeLemari: "",
  rak: "",
  kapasitas: "",
  status: "Aktif",
};

export default function SetupTempatPenyimpananPage() {
  const { showToast } = useAppToast();
  const { tempatPenyimpanan, setTempatPenyimpanan } =
    useArsipDigitalMasterData();

  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tempatPenyimpanan;
    return tempatPenyimpanan.filter((t) =>
      [
        t.kodeKantor,
        t.namaKantor,
        t.kodeLemari,
        t.rak,
        String(t.kapasitas),
        t.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query, tempatPenyimpanan]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (id: number) => {
    const item = tempatPenyimpanan.find((t) => t.id === id);
    if (!item) return;
    setEditingId(item.id);
    setForm({
      kodeKantor: item.kodeKantor,
      namaKantor: item.namaKantor,
      kodeLemari: item.kodeLemari,
      rak: item.rak,
      kapasitas: String(item.kapasitas),
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
    setTempatPenyimpanan((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Aktif" ? "Nonaktif" : "Aktif" }
          : t,
      ),
    );
    showToast("Status tempat penyimpanan diperbarui", "success");
  };

  const handleSave = () => {
    const kodeKantor = form.kodeKantor.trim().toUpperCase();
    const namaKantor = form.namaKantor.trim();
    const kodeLemari = form.kodeLemari.trim().toUpperCase();
    const rak = form.rak.trim().toUpperCase();
    const kapasitasNum = Number(form.kapasitas);

    if (!kodeKantor || !namaKantor || !kodeLemari || !rak) {
      showToast("Mohon lengkapi semua field", "warning");
      return;
    }

    if (!Number.isFinite(kapasitasNum) || kapasitasNum <= 0) {
      showToast("Kapasitas harus berupa angka > 0", "warning");
      return;
    }

    setTempatPenyimpanan((prev) => {
      if (editingId) {
        return prev.map((t) =>
          t.id === editingId
            ? {
              ...t,
              kodeKantor,
              namaKantor,
              kodeLemari,
              rak,
              kapasitas: kapasitasNum,
              status: form.status,
            }
            : t,
        );
      }

      const nextId = prev.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      return [
        ...prev,
        {
          id: nextId,
          kodeKantor,
          namaKantor,
          kodeLemari,
          rak,
          kapasitas: kapasitasNum,
          status: form.status,
        },
      ];
    });

    showToast(
      editingId
        ? "Tempat penyimpanan diperbarui"
        : "Tempat penyimpanan ditambahkan",
      "success",
    );
    closeModal();
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <FeatureHeader
        title="Setup Tempat Penyimpanan"
        subtitle="Kelola master lokasi penyimpanan dokumen fisik."
        icon={<Warehouse />}
        actions={
          <button onClick={openCreate} className="btn btn-primary">
            <Plus className="w-4 h-4" aria-hidden="true" />
            Tambah Tempat
          </button>
        }
      />

      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kantor / lemari / rak..."
              className="input input-with-icon"
            />
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
                <th>Kode Kantor</th>
                <th>Nama Kantor</th>
                <th>Kode Lemari</th>
                <th>Rak</th>
                <th>Kapasitas</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, idx) => (
                <tr key={t.id}>
                  <td className="font-medium">{idx + 1}</td>
                  <td>
                    <span className="font-mono text-sm px-2 py-1 rounded bg-gray-100 border border-gray-200">
                      {t.kodeKantor}
                    </span>
                  </td>
                  <td className="font-semibold text-gray-900">
                    {t.namaKantor}
                  </td>
                  <td className="font-mono text-sm">{t.kodeLemari}</td>
                  <td className="font-mono text-sm">{t.rak}</td>
                  <td className="tabular-nums">{t.kapasitas}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${t.status === "Aktif"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEdit(t.id)}
                        className="btn btn-outline btn-sm"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => toggleStatus(t.id)}
                        className="btn btn-outline btn-sm"
                        title={
                          t.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"
                        }
                      >
                        {t.status === "Aktif" ? (
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
                  <td colSpan={8} className="text-center py-10 text-gray-500">
                    Tidak ada data tempat penyimpanan.
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
                  {editingId
                    ? "Edit Tempat Penyimpanan"
                    : "Tambah Tempat Penyimpanan"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Isi data lokasi penyimpanan dokumen.
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
                  Kode Kantor
                </label>
                <input
                  value={form.kodeKantor}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, kodeKantor: e.target.value }))
                  }
                  placeholder="KP / KST"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kantor
                </label>
                <input
                  value={form.namaKantor}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, namaKantor: e.target.value }))
                  }
                  placeholder="Kantor Pusat"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Lemari
                </label>
                <input
                  value={form.kodeLemari}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, kodeLemari: e.target.value }))
                  }
                  placeholder="L-020"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rak
                </label>
                <input
                  value={form.rak}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, rak: e.target.value }))
                  }
                  placeholder="RAK 4"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kapasitas
                </label>
                <input
                  value={form.kapasitas}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, kapasitas: e.target.value }))
                  }
                  placeholder="150"
                  inputMode="numeric"
                  className="input"
                />
              </div>
              <div>
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
