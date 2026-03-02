"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setValidationMessage("");
    setSuccessMessage("");

    if (!username.trim() || !password.trim()) {
      setValidationMessage("Username dan password wajib diisi.");
      return;
    }

    setIsLoading(true);
    await sleep(1200);
    setIsLoading(false);
    setSuccessMessage(
      `Login berhasil (simulasi). Ingat Saya: ${
        rememberMe ? "aktif" : "nonaktif"
      }.`,
    );
  };

  return (
    <AuthSplitLayout>
      <div className="auth-card animate-auth-in rounded-[28px] px-7 py-8 sm:px-8 sm:py-9">
        <div className="relative z-10">
          <header className="mb-7 text-center">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#157ec3]">
              RUWANG ARSIP
            </h1>
            <p className="mt-2 text-sm text-slate-600">Masuk ke akun Anda</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#157ec3]" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="input-fancy"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#157ec3]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="input-fancy pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-[#157ec3] transition-colors hover:text-[#0d5a8f]"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#157ec3] focus:ring-[#157ec3]"
                />
                Ingat Saya
              </label>

              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-[#157ec3] transition-colors hover:text-[#0d5a8f]"
              >
                Lupa Password?
              </Link>
            </div>

            {validationMessage ? (
              <p className="text-sm font-medium text-red-600">
                {validationMessage}
              </p>
            ) : null}

            {successMessage ? (
              <p className="text-sm font-medium text-emerald-600">
                {successMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="auth-effect-button mt-2"
            >
              <span className="auth-effect-button__top">
                {isLoading ? (
                  <>
                    <span className="button-spinner" aria-hidden="true" />
                    <span>MEMPROSES...</span>
                  </>
                ) : (
                  <span>Masuk</span>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
