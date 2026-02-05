"use client";

import { useState, useEffect } from "react";
import { ClipboardCheck, Plus, X } from "lucide-react";
import {
  dummyDebiturList,
  dummyActionPlan,
  formatCurrency,
  getKolektibilitasColor,
} from "@/lib/data";
import type { ActionPlan } from "@/lib/types/modul3";
import { useAppToast } from "@/components/ui/AppToastProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { formatDateDisplay, todayIsoDate } from "@/lib/utils/date";

export default function ActionPlanPage() {
  const [data, setData] = useState<ActionPlan[]>([...dummyActionPlan]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDebitur, setSelectedDebitur] = useState("");
  const [form, setForm] = useState({
    rencana: "",
    targetTanggal: "",
  });
  const { showToast } = useAppToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebitur || !form.rencana || !form.targetTanggal) {
      showToast("Semua field harus diisi!", "error");
      return;
    }

    const newItem: ActionPlan = {
      id: `AP${Date.now()}`,
      debiturId: selectedDebitur,
      tanggal: todayIsoDate(),
      rencana: form.rencana,
      targetTanggal: form.targetTanggal,
      status: "Pending",
      createdBy: "User",
    };

    setData([newItem, ...data]);
    setIsModalOpen(false);
    setForm({ rencana: "", targetTanggal: "" });
    setSelectedDebitur("");
    showToast("Action Plan berhasil ditambahkan!", "success");
  };

  const getDebiturName = (id: string) => {
    const debitur = dummyDebiturList.find((d) => d.id === id);
    return debitur ? debitur.namaNasabah : id;
  };

  const getDebiturKol = (id: string) => {
    const debitur = dummyDebiturList.find((d) => d.id === id);
    return debitur?.kolektibilitas || "1";
  };

  const KolBadge = ({ kol }: { kol: string }) => {
    const color = getKolektibilitasColor(kol);
    return (
      <span className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-900">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        Kol {kol}
      </span>
    );
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      Pending: "#f59e0b",
      Proses: "#3b82f6",
      Selesai: "#10b981",
    };
    const color = colors[status] || "#6b7280";
    return (
      <span
        className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="bg-white rounded-xl p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FeatureHeader
        title="Action Plan"
        subtitle="Input dan monitoring rencana tindakan untuk debitur bermasalah"
        icon={<ClipboardCheck />}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            title="Tambah Action Plan"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Tambah Action Plan
          </button>
        }
      />

      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-center px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                Tanggal
              </th>
              <th className="text-center px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                Debitur
              </th>
              <th className="text-center px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                Rencana
              </th>
              <th className="text-center px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                Target
              </th>
              <th className="text-center px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-5 py-4 text-sm text-gray-600 text-center">
                  {formatDateDisplay(item.tanggal)}
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-medium text-gray-900">
                      {getDebiturName(item.debiturId)}
                    </span>
                    <KolBadge kol={getDebiturKol(item.debiturId)} />
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 max-w-md text-center">
                  <p className="truncate">{item.rencana}</p>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600 text-center">
                  {formatDateDisplay(item.targetTanggal)}
                </td>
                <td className="px-5 py-4 text-center">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div
          data-dashboard-overlay="true"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Tambah Action Plan
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pilih Debitur
                </label>
                <select
                  value={selectedDebitur}
                  onChange={(e) => setSelectedDebitur(e.target.value)}
                  className="select"
                  required
                >
                  <option value="">-- Pilih Debitur --</option>
                  {dummyDebiturList
                    .filter((d) => parseInt(d.kolektibilitas) >= 2)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.namaNasabah} - Kol {d.kolektibilitas} (
                        {formatCurrency(d.osPokok)})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rencana Tindakan
                </label>
                <textarea
                  value={form.rencana}
                  onChange={(e) =>
                    setForm({ ...form, rencana: e.target.value })
                  }
                  rows={3}
                  className="textarea resize-none"
                  placeholder="Jelaskan rencana tindakan..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Tanggal
                </label>
                <DatePickerInput
                  value={form.targetTanggal}
                  onChange={(nextValue) =>
                    setForm((prev) => ({ ...prev, targetTanggal: nextValue }))
                  }
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90"
                  style={{ backgroundColor: "#157ec3" }}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
