"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Mail, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="star-container">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-auth-in">
        <div className="auth-card rounded-3xl px-8 py-8">
          {!isSuccess ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold mb-1 leading-none tracking-tight text-[#157ec3]">
                  RUWANG ARSIP
                </h1>
                <h2 className="text-lg font-semibold text-gray-800 mt-3 mb-1">
                  Lupa Password?
                </h2>
                <p className="text-gray-500 text-sm">
                  Masukkan email Anda dan kami akan mengirimkan link reset
                  password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                      style={{ color: "#157ec3" }}
                    >
                      <Mail className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan email address"
                      className="input-fancy"
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="button">
                  <div className="button-outer">
                    <div className="button-inner">
                      {isLoading ? (
                        <>
                          <div className="button-spinner" aria-hidden="true" />
                          <span>MEMPROSES...</span>
                        </>
                      ) : (
                        <>
                          <span>KIRIM LINK RESET</span>
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </div>
                  </div>
                </button>
              </form>

              <div className="mt-4 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium
                             cursor-pointer
                             transition-all duration-200
                             hover:opacity-90 hover:underline"
                  style={{ color: "#157ec3" }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Halaman Login
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  boxShadow: "0 12px 32px rgba(16, 185, 129, 0.22)",
                }}
              >
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Cek Email Anda
              </h2>
              <p className="text-gray-500 text-sm mb-1">
                Kami telah mengirimkan link reset ke:
              </p>
              <p className="font-semibold mb-4" style={{ color: "#157ec3" }}>
                {email}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                  className="button"
                >
                  <div className="button-outer">
                    <div className="button-inner">
                      <span>KIRIM ULANG EMAIL</span>
                    </div>
                  </div>
                </button>

                <Link
                  href="/"
                  className="inline-flex justify-center items-center gap-2
                             cursor-pointer
                             font-semibold text-sm
                             transition-all duration-200
                             hover:opacity-90 hover:underline"
                  style={{ color: "#157ec3" }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Halaman Login
                </Link>
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">© 2026 RUWANG ARSIP v1.0</p>
          </div>
        </div>
      </div>
    </main>
  );
}
