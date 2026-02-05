"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, User } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAppToast } from "@/components/ui/AppToastProvider";
import UiverseCheckbox from "@/components/ui/UiverseCheckbox";

export default function LoginPage() {
  const router = useRouter();
  const { status, signIn } = useAuth();
  const { showToast } = useAppToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [router, status]);

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const startedAt = Date.now();
    const result = await signIn(username, password, { remember: rememberMe });
    const elapsed = Date.now() - startedAt;
    const minDelayMs = 900;
    if (elapsed < minDelayMs) await sleep(minDelayMs - elapsed);
    setIsLoading(false);

    if (!result.ok) {
      showToast(result.message, "warning");
      return;
    }

    router.push("/dashboard");
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 leading-none tracking-tight text-[#157ec3]">
              RUWANG ARSIP
            </h1>
            <p className="text-gray-500 text-sm">
              Sistem Manajemen Arsip Digital
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                  style={{ color: "#157ec3" }}
                >
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="input-fancy"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                  style={{ color: "#157ec3" }}
                >
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="input-fancy"
                  style={{ paddingRight: "3rem" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#157ec3] hover:text-[#0d5a8f] z-10 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <UiverseCheckbox
                checked={rememberMe}
                onCheckedChange={setRememberMe}
                label="Ingat Saya"
              />

              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-2 text-sm font-medium
                           cursor-pointer
                           transition-all duration-200 hover:opacity-90 hover:underline"
                style={{ color: "#157ec3" }}
              >
                Lupa Password?
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <button type="submit" disabled={isLoading} className="button mt-4">
              <div className="button-outer">
                <div className="button-inner">
                  {isLoading ? (
                    <>
                      <div className="button-spinner" aria-hidden="true" />
                      <span>MEMPROSES...</span>
                    </>
                  ) : (
                    <>
                      <span>MASUK</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </div>
              </div>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">
              {"\u00A9"} 2026 RUWANG ARSIP v1.0
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
