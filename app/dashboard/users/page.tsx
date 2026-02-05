"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, Plus, Search, Trash2, Users, X } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { useAppToast } from "@/components/ui/AppToastProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import { useProtectedAction } from "@/hooks/useProtectedAction";
import { dummyDivisiList, dummyUsers, type User } from "@/lib/data";
import {
  RBAC_DENIED_MESSAGE,
  USER_ROLE_LABEL,
  USER_ROLES,
  canManageUsers,
  type UserRole,
} from "@/lib/rbac";

type UserFormState = {
  namaLengkap: string;
  username: string;
  divisi: string;
  tipeAkun: "Internal" | "Eksternal";
  role: UserRole;
  atasanTerkait: string;
  status: "Aktif" | "Nonaktif";
  password: string;
};

const EMPTY_FORM: UserFormState = {
  namaLengkap: "",
  username: "",
  divisi: "",
  tipeAkun: "Internal",
  role: USER_ROLES.FUNGSI_LEGAL,
  atasanTerkait: "",
  status: "Aktif",
  password: "",
};

export default function ManajemenUserPage() {
  const router = useRouter();
  const { role } = useAuth();
  const { showToast } = useAppToast();
  const { ensureAllowed } = useProtectedAction();

  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormState>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const isMaster = role ? canManageUsers(role) : false;

  useEffect(() => {
    if (!role) return;
    if (canManageUsers(role)) return;
    showToast(RBAC_DENIED_MESSAGE, "warning");
    router.replace("/dashboard");
  }, [role, router, showToast]);

  const masterUserCount = useMemo(
    () => users.filter((u) => u.role === USER_ROLES.MASTER_USER).length,
    [users],
  );

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) =>
        u.namaLengkap.toLowerCase().includes(term) ||
        u.username.toLowerCase().includes(term) ||
        u.divisi.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term),
    );
  }, [searchTerm, users]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      aktif: users.filter((u) => u.status === "Aktif").length,
      master: users.filter((u) => u.role === USER_ROLES.MASTER_USER).length,
      restrict: users.filter((u) => u.role === USER_ROLES.AKSES_RESTRICT)
        .length,
    };
  }, [users]);

  const requireMasterAction = () => {
    return ensureAllowed(canManageUsers, { redirectTo: "/dashboard" });
  };

  const resetForm = () => setFormData(EMPTY_FORM);

  const handleAdd = () => {
    if (!requireMasterAction()) return;
    setEditUser(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    if (!requireMasterAction()) return;
    setEditUser(user);
    setFormData({
      namaLengkap: user.namaLengkap,
      username: user.username,
      divisi: user.divisi,
      tipeAkun: user.tipeAkun,
      role: user.role,
      atasanTerkait: user.atasanTerkait || "",
      status: user.status,
      password: "",
    });
    setShowModal(true);
  };

  const handleDelete = (user: User) => {
    if (!requireMasterAction()) return;

    if (user.role === USER_ROLES.MASTER_USER && masterUserCount <= 1) {
      showToast("Tidak bisa menghapus Master User terakhir.", "warning");
      return;
    }

    setDeleteUser(user);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (!requireMasterAction()) return;
    if (!deleteUser) return;

    setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
    showToast("User berhasil dihapus!", "success");
    setShowDelete(false);
    setDeleteUser(null);
  };

  const handleSubmit = () => {
    if (!requireMasterAction()) return;

    if (!formData.namaLengkap || !formData.username || !formData.divisi) {
      showToast("Mohon lengkapi semua field yang diperlukan", "warning");
      return;
    }

    if (!editUser && !formData.password) {
      showToast("Password wajib diisi untuk user baru", "warning");
      return;
    }

    const usernameTaken = users.some((u) => {
      if (editUser && u.id === editUser.id) return false;
      return (
        u.username.toLowerCase() === formData.username.trim().toLowerCase()
      );
    });
    if (usernameTaken) {
      showToast("Username sudah digunakan.", "warning");
      return;
    }

    if (
      editUser?.role === USER_ROLES.MASTER_USER &&
      formData.role !== USER_ROLES.MASTER_USER &&
      masterUserCount <= 1
    ) {
      showToast("Tidak bisa mengubah role Master User terakhir.", "warning");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const payload: Omit<User, "id"> = {
        namaLengkap: formData.namaLengkap.trim(),
        username: formData.username.trim(),
        divisi: formData.divisi,
        tipeAkun: formData.tipeAkun,
        role: formData.role,
        atasanTerkait: formData.atasanTerkait || undefined,
        status: formData.status,
        password: formData.password || undefined,
      };

      if (editUser) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editUser.id ? { ...u, ...payload } : u)),
        );
        showToast("User berhasil diupdate!", "success");
      } else {
        const newUser: User = { id: Date.now(), ...payload };
        setUsers((prev) => [...prev, newUser]);
        showToast("User berhasil ditambahkan!", "success");
      }

      setIsLoading(false);
      setShowModal(false);
      setEditUser(null);
      resetForm();
    }, 900);
  };

  if (!isMaster) return null;

  return (
    <div className="animate-fade-in">
      <FeatureHeader
        title="Manajemen User"
        subtitle="Kelola pengguna, role, dan tipe akun sistem"
        icon={<Users />}
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total User</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.aktif}</p>
          <p className="text-sm text-gray-500">User Aktif</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.master}</p>
          <p className="text-sm text-gray-500">Master User</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.restrict}</p>
          <p className="text-sm text-gray-500">Akses Restrict</p>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cari User
            </label>
            <div className="relative">
              <Search
                className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari berdasarkan nama, username, divisi, atau role..."
                className="input input-with-icon"
              />
            </div>
          </div>
          <button onClick={handleAdd} className="btn btn-primary">
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Tambah User</span>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Username</th>
                <th>Divisi</th>
                <th>Tipe Akun</th>
                <th>Role</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, idx) => {
                const roleBadge =
                  u.role === USER_ROLES.MASTER_USER
                    ? "badge-danger"
                    : u.role === USER_ROLES.FULL_AKSES
                      ? "badge-success"
                      : u.role === USER_ROLES.FUNGSI_LEGAL
                        ? "badge-info"
                        : "badge-warning";

                return (
                  <tr key={u.id}>
                    <td>{idx + 1}</td>
                    <td className="font-medium text-gray-900">
                      {u.namaLengkap}
                    </td>
                    <td>
                      <span className="font-mono text-sm px-2 py-1 rounded bg-gray-100 text-gray-800">
                        {u.username}
                      </span>
                    </td>
                    <td>{u.divisi}</td>
                    <td>{u.tipeAkun}</td>
                    <td>
                      <span className={`badge ${roleBadge}`}>
                        {USER_ROLE_LABEL[u.role]}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${u.status === "Aktif" ? "badge-success" : "badge-danger"}`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(u)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Edit"
                        >
                          <Pencil
                            className="w-4 h-4 text-gray-600"
                            aria-hidden="true"
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          className="p-2 hover:bg-red-50 rounded-lg"
                          title="Hapus"
                        >
                          <Trash2
                            className="w-4 h-4 text-red-600"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-500">
                    Tidak ada user yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editUser ? "Edit User" : "Tambah User"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X className="w-5 h-5 text-gray-500" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.namaLengkap}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, namaLengkap: e.target.value }))
                  }
                  className="input"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, username: e.target.value }))
                  }
                  className="input"
                  placeholder="Masukkan username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Divisi <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.divisi}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, divisi: e.target.value }))
                  }
                  className="select"
                >
                  <option value="">Pilih divisi</option>
                  {dummyDivisiList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipe Akun <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.tipeAkun}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      tipeAkun: e.target.value as UserFormState["tipeAkun"],
                    }))
                  }
                  className="select"
                >
                  <option value="Internal">Internal</option>
                  <option value="Eksternal">Eksternal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      role: e.target.value as UserRole,
                    }))
                  }
                  className="select"
                >
                  <option value={USER_ROLES.MASTER_USER}>
                    {USER_ROLE_LABEL[USER_ROLES.MASTER_USER]}
                  </option>
                  <option value={USER_ROLES.FULL_AKSES}>
                    {USER_ROLE_LABEL[USER_ROLES.FULL_AKSES]}
                  </option>
                  <option value={USER_ROLES.FUNGSI_LEGAL}>
                    {USER_ROLE_LABEL[USER_ROLES.FUNGSI_LEGAL]}
                  </option>
                  <option value={USER_ROLES.AKSES_RESTRICT}>
                    {USER_ROLE_LABEL[USER_ROLES.AKSES_RESTRICT]}
                  </option>
                </select>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Full Akses
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {formData.role === USER_ROLES.FULL_AKSES ||
                      formData.role === USER_ROLES.MASTER_USER
                        ? "Ya"
                        : "Tidak"}
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Fungsi Legal
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {formData.role === USER_ROLES.FUNGSI_LEGAL ||
                      formData.role === USER_ROLES.FULL_AKSES ||
                      formData.role === USER_ROLES.MASTER_USER
                        ? "Ya"
                        : "Tidak"}
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Akses Restrik Data
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {formData.role === USER_ROLES.AKSES_RESTRICT ||
                      formData.role === USER_ROLES.FULL_AKSES ||
                      formData.role === USER_ROLES.MASTER_USER
                        ? "Ya"
                        : "Tidak"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      status: e.target.value as UserFormState["status"],
                    }))
                  }
                  className="select"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Atasan Terkait
                </label>
                <input
                  value={formData.atasanTerkait}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      atasanTerkait: e.target.value,
                    }))
                  }
                  className="input"
                  placeholder="Opsional"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {editUser ? "Password (Opsional)" : "Password *"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, password: e.target.value }))
                  }
                  className="input"
                  placeholder={
                    editUser
                      ? "Kosongkan jika tidak diubah"
                      : "Masukkan password"
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  !formData.namaLengkap ||
                  !formData.username ||
                  !formData.divisi ||
                  (!editUser && !formData.password) ||
                  isLoading
                }
                className="btn btn-primary"
              >
                {isLoading ? (
                  <>
                    <div
                      className="button-spinner"
                      style={
                        {
                          ["--spinner-size"]: "18px",
                          ["--spinner-border"]: "2px",
                        } as React.CSSProperties
                      }
                      aria-hidden="true"
                    />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>Simpan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelete && deleteUser && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Hapus User?
              </h3>
              <p className="text-gray-500 mb-6">
                Apakah Anda yakin ingin menghapus user{" "}
                <strong>{deleteUser.namaLengkap}</strong>?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDelete(false)}
                  className="btn btn-outline"
                >
                  Batal
                </button>
                <button onClick={confirmDelete} className="btn btn-danger">
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
