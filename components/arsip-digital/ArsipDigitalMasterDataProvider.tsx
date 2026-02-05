"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  dummyJenisDokumen,
  dummyTempatPenyimpanan,
  type JenisDokumen,
  type TempatPenyimpanan,
} from "@/lib/data";

const STORAGE_KEY = "ruang-arsip:arsip-digital-parameter:v1";

type ArsipDigitalMasterDataValue = {
  tempatPenyimpanan: TempatPenyimpanan[];
  jenisDokumen: JenisDokumen[];
  setTempatPenyimpanan: Dispatch<SetStateAction<TempatPenyimpanan[]>>;
  setJenisDokumen: Dispatch<SetStateAction<JenisDokumen[]>>;
  resetMasterData: () => void;
};

const ArsipDigitalMasterDataContext =
  createContext<ArsipDigitalMasterDataValue | null>(null);

function isValidTempat(value: unknown): value is TempatPenyimpanan[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (t) =>
      typeof t === "object" &&
      t !== null &&
      typeof (t as { id?: unknown }).id === "number" &&
      typeof (t as { kodeKantor?: unknown }).kodeKantor === "string" &&
      typeof (t as { namaKantor?: unknown }).namaKantor === "string" &&
      typeof (t as { kodeLemari?: unknown }).kodeLemari === "string" &&
      typeof (t as { rak?: unknown }).rak === "string" &&
      typeof (t as { kapasitas?: unknown }).kapasitas === "number" &&
      ((t as { status?: unknown }).status === "Aktif" ||
        (t as { status?: unknown }).status === "Nonaktif"),
  );
}

function isValidJenis(value: unknown): value is JenisDokumen[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (j) =>
      typeof j === "object" &&
      j !== null &&
      typeof (j as { id?: unknown }).id === "number" &&
      typeof (j as { kode?: unknown }).kode === "string" &&
      typeof (j as { nama?: unknown }).nama === "string" &&
      typeof (j as { prefix?: unknown }).prefix === "string" &&
      typeof (j as { isRestricted?: unknown }).isRestricted === "boolean" &&
      ((j as { status?: unknown }).status === "Aktif" ||
        (j as { status?: unknown }).status === "Nonaktif"),
  );
}

function loadFromStorage(): {
  tempatPenyimpanan: TempatPenyimpanan[];
  jenisDokumen: JenisDokumen[];
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("tempatPenyimpanan" in parsed) ||
      !("jenisDokumen" in parsed)
    ) {
      return null;
    }

    const tempat = (parsed as { tempatPenyimpanan: unknown }).tempatPenyimpanan;
    const jenis = (parsed as { jenisDokumen: unknown }).jenisDokumen;
    if (!isValidTempat(tempat) || !isValidJenis(jenis)) return null;

    return { tempatPenyimpanan: tempat, jenisDokumen: jenis };
  } catch {
    return null;
  }
}

function saveToStorage(data: {
  tempatPenyimpanan: TempatPenyimpanan[];
  jenisDokumen: JenisDokumen[];
}) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function ArsipDigitalMasterDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [tempatPenyimpanan, setTempatPenyimpanan] = useState<
    TempatPenyimpanan[]
  >(dummyTempatPenyimpanan);
  const [jenisDokumen, setJenisDokumen] =
    useState<JenisDokumen[]>(dummyJenisDokumen);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTempatPenyimpanan(stored.tempatPenyimpanan);
      setJenisDokumen(stored.jenisDokumen);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage({ tempatPenyimpanan, jenisDokumen });
  }, [hydrated, tempatPenyimpanan, jenisDokumen]);

  const resetMasterData = () => {
    setTempatPenyimpanan(dummyTempatPenyimpanan);
    setJenisDokumen(dummyJenisDokumen);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  const value = useMemo<ArsipDigitalMasterDataValue>(
    () => ({
      tempatPenyimpanan,
      jenisDokumen,
      setTempatPenyimpanan,
      setJenisDokumen,
      resetMasterData,
    }),
    [jenisDokumen, tempatPenyimpanan],
  );

  return (
    <ArsipDigitalMasterDataContext.Provider value={value}>
      {children}
    </ArsipDigitalMasterDataContext.Provider>
  );
}

export function useArsipDigitalMasterData() {
  const ctx = useContext(ArsipDigitalMasterDataContext);
  if (!ctx) {
    throw new Error(
      "useArsipDigitalMasterData must be used within ArsipDigitalMasterDataProvider",
    );
  }
  return ctx;
}
