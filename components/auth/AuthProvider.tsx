"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { dummyUsers, type User } from "@/lib/data";
import { USER_ROLES, type UserRole } from "@/lib/rbac";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface SignInResultSuccess {
  ok: true;
  user: User;
}

interface SignInResultFailure {
  ok: false;
  message: string;
}

type SignInResult = SignInResultSuccess | SignInResultFailure;

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  role: UserRole | null;
  signIn: (
    username: string,
    password: string,
    options?: { remember?: boolean },
  ) => Promise<SignInResult>;
  signOut: () => void;
}

const LEGACY_LOCAL_STORAGE_KEY = "ruang-arsip.session.userId";
const SESSION_STORAGE_KEY = "ruang-arsip.session.userId";
const PERSISTENT_STORAGE_KEY = "ruang-arsip.session.persisted.userId";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getUserById(id: number): User | null {
  const match = dummyUsers.find((u) => u.id === id);
  if (!match) return null;
  if (match.status !== "Aktif") return null;
  return match;
}

function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

function parseRole(role: unknown): UserRole | null {
  if (role === USER_ROLES.FULL_AKSES) return USER_ROLES.FULL_AKSES;
  if (role === USER_ROLES.FUNGSI_LEGAL) return USER_ROLES.FUNGSI_LEGAL;
  if (role === USER_ROLES.AKSES_RESTRICT) return USER_ROLES.AKSES_RESTRICT;
  if (role === USER_ROLES.MASTER_USER) return USER_ROLES.MASTER_USER;
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if (window.localStorage.getItem(LEGACY_LOCAL_STORAGE_KEY) !== null) {
        window.localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY);
      }

      const raw =
        window.sessionStorage.getItem(SESSION_STORAGE_KEY) ??
        window.localStorage.getItem(PERSISTENT_STORAGE_KEY);

      const id = raw ? Number.parseInt(raw, 10) : NaN;
      const nextUser = Number.isFinite(id) ? getUserById(id) : null;

      if (!nextUser) {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
        window.localStorage.removeItem(PERSISTENT_STORAGE_KEY);
      }

      setUser(nextUser);
      setStatus(nextUser ? "authenticated" : "unauthenticated");
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const signIn = useCallback(
    async (
      username: string,
      password: string,
      options?: { remember?: boolean },
    ): Promise<SignInResult> => {
      const normalized = normalizeUsername(username);
      const remember = options?.remember ?? false;

      const match = dummyUsers.find(
        (u) => normalizeUsername(u.username) === normalized,
      );
      if (!match) return { ok: false, message: "Username atau password salah" };
      if (match.status !== "Aktif")
        return { ok: false, message: "Akun tidak aktif" };
      if (!match.password || match.password !== password) {
        return { ok: false, message: "Username atau password salah" };
      }

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY);

        if (remember) {
          window.localStorage.setItem(PERSISTENT_STORAGE_KEY, String(match.id));
          window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
        } else {
          window.sessionStorage.setItem(SESSION_STORAGE_KEY, String(match.id));
          window.localStorage.removeItem(PERSISTENT_STORAGE_KEY);
        }
      }

      setUser(match);
      setStatus("authenticated");
      return { ok: true, user: match };
    },
    [],
  );

  const signOut = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
        window.localStorage.removeItem(PERSISTENT_STORAGE_KEY);
        window.localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY);
      }
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const resolvedRole = user ? parseRole(user.role) : null;
    return { status, user, role: resolvedRole, signIn, signOut };
  }, [signIn, signOut, status, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
