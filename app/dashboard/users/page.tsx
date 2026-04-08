"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Save, Search, Trash2, Users, X } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { useAppToast } from "@/components/ui/AppToastProvider";
import FeatureHeader from "@/components/ui/FeatureHeader";
import UiverseCheckbox from "@/components/ui/UiverseCheckbox";
import { useProtectedAction } from "@/hooks/useProtectedAction";
import { dummyDivisiList, dummyUsers, type StoredUser } from "@/lib/data";
import {
  RBAC_DENIED_MESSAGE,
  ROLE_LABELS,
  ROLES,
  canManageUsers,
  type Role,
} from "@/lib/rbac";

type UserFormState = {
  name: string;
  username: string;
  email: string;
  division_id: string;
  role: Role;
  is_restrict: boolean;
  is_active: boolean;
  password: string;
};

const EMPTY_FORM: UserFormState = {
  name: "",
  username: "",
  email: "",
  division_id: "",
  role: ROLES.VIEWER,
  is_restrict: false,
  is_active: true,
  password: "",
};

const ROLE_OPTIONS: Role[] = [
  ROLES.VIEWER,
  ROLES.ADMIN,
  ROLES.LEGAL,
  ROLES.SUPERADMIN,
];

const PILL_BASE_CLASS =
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold";

function getRolePillClass(role: Role) {
  switch (role) {
    case ROLES.SUPERADMIN:
      return `${PILL_BASE_CLASS} border-rose-200 bg-rose-50 text-rose-700`;
    case ROLES.ADMIN:
      return `${PILL_BASE_CLASS} border-emerald-200 bg-emerald-50 text-emerald-700`;
    case ROLES.LEGAL:
      return `${PILL_BASE_CLASS} border-blue-200 bg-blue-50 text-blue-700`;
    case ROLES.VIEWER:
    default:
      return `${PILL_BASE_CLASS} border-amber-200 bg-amber-50 text-amber-700`;
  }
}

function getRestrictPillClass(isRestrict: boolean) {
  return isRestrict
    ? `${PILL_BASE_CLASS} border-emerald-200 bg-emerald-50 text-emerald-700`
    : `${PILL_BASE_CLASS} border-amber-200 bg-amber-50 text-amber-700`;
}

function getStatusPillClass(isActive: boolean) {
  return isActive
    ? `${PILL_BASE_CLASS} border-emerald-200 bg-emerald-50 text-emerald-700`
    : `${PILL_BASE_CLASS} border-gray-200 bg-gray-100 text-gray-700`;
}

export default function ManajemenUserPage() {
  const router = useRouter();
  const { role } = useAuth();
  const { showToast } = useAppToast();
  const { ensureAllowed } = useProtectedAction();

  const [users, setUsers] = useState<StoredUser[]>(dummyUsers);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<StoredUser | null>(null);
  const [formData, setFormData] = useState<UserFormState>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteUser, setDeleteUser] = useState<StoredUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const isSuperAdmin = role ? canManageUsers(role) : false;

  useEffect(() => {
    if (!role) return;
    if (canManageUsers(role)) return;
    showToast(RBAC_DENIED_MESSAGE, "warning");
    router.replace("/dashboard");
  }, [role, router, showToast]);

  const superAdminCount = useMemo(
    () => users.filter((user) => user.role === ROLES.SUPERADMIN).length,
    [users],
  );

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.division_id.toLowerCase().includes(term) ||
        ROLE_LABELS[user.role].toLowerCase().includes(term)
      );
    });
  }, [searchTerm, users]);

  const stats = useMemo(
    () => ({
      total: users.length,
      aktif: users.filter((user) => user.is_active).length,
      it: users.filter((user) => user.role === ROLES.SUPERADMIN).length,
      restrict: users.filter((user) => user.is_restrict).length,
    }),
    [users],
  );

  const requireSuperAdminAction = () => {
    return ensureAllowed(canManageUsers, { redirectTo: "/dashboard" });
  };

  const resetForm = () => setFormData(EMPTY_FORM);

  const handleAdd = () => {
    if (!requireSuperAdminAction()) return;
    setEditUser(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (user: StoredUser) => {
    if (!requireSuperAdminAction()) return;
    setEditUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      division_id: user.division_id,
      role: user.role,
      is_restrict: user.is_restrict,
      is_active: user.is_active,
      password: "",
    });
    setShowModal(true);
  };

  const handleDelete = (user: StoredUser) => {
    if (!requireSuperAdminAction()) return;

    if (user.role === ROLES.SUPERADMIN && superAdminCount <= 1) {
      showToast("Tidak bisa menghapus user IT terakhir.", "warning");
      return;
    }

    setDeleteUser(user);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (!requireSuperAdminAction()) return;
    if (!deleteUser) return;

    setUsers((prev) => prev.filter((user) => user.id !== deleteUser.id));
    showToast("User berhasil dihapus!", "success");
    setShowDelete(false);
    setDeleteUser(null);
  };

  const handleSubmit = () => {
    if (!requireSuperAdminAction()) return;

    if (
      !formData.name.trim() ||
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.division_id
    ) {
      showToast("Mohon lengkapi semua field yang diperlukan", "warning");
      return;
    }

    if (!editUser && !formData.password) {
      showToast("Password wajib diisi untuk user baru", "warning");
      return;
    }

    const normalizedUsername = formData.username.trim().toLowerCase();
    const normalizedEmail = formData.email.trim().toLowerCase();

    const usernameTaken = users.some((user) => {
      if (editUser && user.id === editUser.id) return false;
      return user.username.toLowerCase() === normalizedUsername;
    });
    if (usernameTaken) {
      showToast("Username sudah digunakan.", "warning");
      return;
    }

    const emailTaken = users.some((user) => {
      if (editUser && user.id === editUser.id) return false;
      return user.email.toLowerCase() === normalizedEmail;
    });
    if (emailTaken) {
      showToast("Email sudah digunakan.", "warning");
      return;
    }

    if (
      editUser?.role === ROLES.SUPERADMIN &&
      formData.role !== ROLES.SUPERADMIN &&
      superAdminCount <= 1
    ) {
      showToast("Tidak bisa mengubah role IT terakhir.", "warning");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const payload: StoredUser = {
        id: editUser?.id ?? crypto.randomUUID(),
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        division_id: formData.division_id,
        role: formData.role,
        is_restrict: formData.is_restrict,
        is_active: formData.is_active,
        password: formData.password || editUser?.password,
      };

      if (editUser) {
        setUsers((prev) =>
          prev.map((user) => (user.id === editUser.id ? payload : user)),
        );
        showToast("User berhasil diupdate!", "success");
      } else {
        setUsers((prev) => [...prev, payload]);
        showToast("User berhasil ditambahkan!", "success");
      }

      setIsLoading(false);
      setShowModal(false);
      setEditUser(null);
      resetForm();
    }, 900);
  };

  if (!isSuperAdmin) return null;

  return (
    <div className="animate-fade-in">
      <FeatureHeader
        title="Manajemen User"
        subtitle="Kelola pengguna, role, dan akses restrict sistem"
        icon={<Users />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total User</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.aktif}</p>
          <p className="text-sm text-gray-500">User Aktif</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.it}</p>
          <p className="text-sm text-gray-500">User IT</p>
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
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Cari berdasarkan nama, username, email, divisi, atau role..."
                className="input input-with-icon"
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="btn btn-upload w-full lg:w-auto"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Tambah User</span>
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-230">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Divisi
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Akses Restrict
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {user.division_id}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={getRolePillClass(user.role)}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={getRestrictPillClass(user.is_restrict)}>
                      {user.is_restrict ? "Ya" : "Tidak"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={getStatusPillClass(user.is_active)}>
                      {user.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                        title="Edit"
                      >
                        <Pencil
                          className="w-4 h-4 text-gray-600"
                          aria-hidden="true"
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    Tidak ada user yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div
          data-dashboard-overlay="true"
          className="fixed inset-0 p-4"
          style={{
            background: "rgba(0, 0, 0, 0.55)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editUser ? "Edit User" : "Tambah User"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Isi data akun pengguna sistem.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-ghost btn-sm"
                title="Tutup"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="input"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.username}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: event.target.value,
                    }))
                  }
                  className="input"
                  placeholder="Masukkan username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, email: event.target.value }))
                  }
                  className="input"
                  placeholder="Masukkan email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Divisi <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.division_id}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      division_id: event.target.value,
                    }))
                  }
                  className="select"
                >
                  <option value="">Pilih divisi</option>
                  {dummyDivisiList.map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      role: event.target.value as Role,
                    }))
                  }
                  className="select"
                >
                  {ROLE_OPTIONS.map((roleOption) => (
                    <option key={roleOption} value={roleOption}>
                      {ROLE_LABELS[roleOption]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.is_active ? "Aktif" : "Nonaktif"}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: event.target.value === "Aktif",
                    }))
                  }
                  className="select"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Akses Restrict
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Centang jika user dapat melihat data restrict
                    </p>
                  </div>
                  <UiverseCheckbox
                    checked={formData.is_restrict}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_restrict: checked }))
                    }
                    disabled={!isSuperAdmin}
                    label={formData.is_restrict ? "Ya" : "Tidak"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password{" "}
                  {editUser ? (
                    <span className="text-gray-400">(Opsional)</span>
                  ) : (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
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

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  !formData.name.trim() ||
                  !formData.username.trim() ||
                  !formData.email.trim() ||
                  !formData.division_id ||
                  (!editUser && !formData.password) ||
                  isLoading
                }
                className={editUser ? "btn btn-primary" : "btn btn-upload"}
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
                    <Save className="w-4 h-4" aria-hidden="true" />
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
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Hapus User?
              </h3>
              <p className="text-gray-500 mb-6">
                Apakah Anda yakin ingin menghapus user{" "}
                <strong>{deleteUser.name}</strong>?
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
