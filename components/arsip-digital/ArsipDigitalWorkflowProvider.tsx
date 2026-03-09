"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  dummyDisposisi,
  dummyDokumen,
  dummyPeminjaman,
  type Disposisi,
  type Dokumen,
  type Peminjaman,
} from "@/lib/data";
import { toIsoDate } from "@/lib/utils/date";

const STORAGE_KEY = "ruang-arsip:arsip-digital-workflow:v1";

type WorkflowStorage = {
  dokumen: Dokumen[];
  disposisi: Disposisi[];
  peminjaman: Peminjaman[];
};

type SubmitDisposisiParams = {
  dokumenIds: number[];
  alasanPengajuan: string;
  pemohon: string;
};

type ProcessDisposisiParams = {
  id: number;
  action: "approve" | "reject";
  alasanAksi: string;
  tanggalExpired?: string;
};

type SubmitPeminjamanParams = {
  dokumenIds: number[];
  tanggalPeminjaman: string;
  tanggalPengembalian: string;
  alasan: string;
  peminjam: string;
};

type ProcessPeminjamanParams = {
  id: number;
  action: "approve" | "reject";
  tanggalPenyerahan?: string;
  alasanAksi: string;
  approver?: string;
};

type ArsipDigitalWorkflowValue = {
  dokumen: Dokumen[];
  disposisi: Disposisi[];
  peminjaman: Peminjaman[];
  submitDisposisi: (params: SubmitDisposisiParams) => number;
  processDisposisi: (params: ProcessDisposisiParams) => boolean;
  submitPeminjaman: (params: SubmitPeminjamanParams) => number;
  processPeminjaman: (params: ProcessPeminjamanParams) => boolean;
  resetWorkflowData: () => void;
};

const ArsipDigitalWorkflowContext =
  createContext<ArsipDigitalWorkflowValue | null>(null);

function cloneDokumen(value: Dokumen[]) {
  return value.map((item) => ({ ...item }));
}

function cloneDisposisi(value: Disposisi[]) {
  return value.map((item) => ({ ...item }));
}

function clonePeminjaman(value: Peminjaman[]) {
  return value.map((item) => ({ ...item }));
}

function currentTimeHHmm() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function isValidStorage(value: unknown): value is WorkflowStorage {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<WorkflowStorage>;
  return (
    Array.isArray(candidate.dokumen) &&
    Array.isArray(candidate.disposisi) &&
    Array.isArray(candidate.peminjaman)
  );
}

function loadFromStorage(): WorkflowStorage | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidStorage(parsed)) return null;
    return {
      dokumen: cloneDokumen(parsed.dokumen),
      disposisi: cloneDisposisi(parsed.disposisi),
      peminjaman: clonePeminjaman(parsed.peminjaman),
    };
  } catch {
    return null;
  }
}

function saveToStorage(data: WorkflowStorage) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function mergeById<T extends { id: number }>(stored: T[], defaults: T[]) {
  const map = new Map<number, T>();
  stored.forEach((item) => map.set(item.id, { ...item }));
  defaults.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, { ...item });
    }
  });
  return Array.from(map.values()).sort((a, b) => a.id - b.id);
}

function syncDokumenStatusWithPeminjaman(
  dokumen: Dokumen[],
  peminjaman: Peminjaman[],
) {
  const activeLoanStatusByDoc = new Map<number, "Dipinjam" | "Diajukan">();

  peminjaman.forEach((item) => {
    if (item.status === "Dipinjam") {
      activeLoanStatusByDoc.set(item.dokumenId, "Dipinjam");
      return;
    }

    if (item.status === "Pending" && !activeLoanStatusByDoc.has(item.dokumenId)) {
      activeLoanStatusByDoc.set(item.dokumenId, "Diajukan");
    }
  });

  return dokumen.map((item) => {
    const activeStatus = activeLoanStatusByDoc.get(item.id);
    const statusPinjam: Dokumen["statusPinjam"] = activeStatus ?? "Tersedia";
    const statusPeminjaman: Dokumen["statusPeminjaman"] = statusPinjam;
    return {
      ...item,
      statusPinjam,
      statusPeminjaman,
    };
  });
}

function buildDefaultState(): WorkflowStorage {
  const basePeminjaman = clonePeminjaman(dummyPeminjaman);
  const baseDokumen = syncDokumenStatusWithPeminjaman(
    cloneDokumen(dummyDokumen),
    basePeminjaman,
  );
  return {
    dokumen: baseDokumen,
    disposisi: cloneDisposisi(dummyDisposisi),
    peminjaman: basePeminjaman,
  };
}

export function ArsipDigitalWorkflowProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [dokumen, setDokumen] = useState<Dokumen[]>(() => buildDefaultState().dokumen);
  const [disposisi, setDisposisi] = useState<Disposisi[]>(
    () => buildDefaultState().disposisi,
  );
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>(
    () => buildDefaultState().peminjaman,
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    if (!stored) {
      setHydrated(true);
      return;
    }

    const mergedPeminjaman = mergeById(stored.peminjaman, dummyPeminjaman);
    const mergedDokumen = syncDokumenStatusWithPeminjaman(
      mergeById(stored.dokumen, dummyDokumen),
      mergedPeminjaman,
    );
    const mergedDisposisi = mergeById(stored.disposisi, dummyDisposisi);

    setDokumen(mergedDokumen);
    setDisposisi(mergedDisposisi);
    setPeminjaman(mergedPeminjaman);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage({ dokumen, disposisi, peminjaman });
  }, [disposisi, dokumen, hydrated, peminjaman]);

  const submitDisposisi = useCallback(
    ({ dokumenIds, alasanPengajuan, pemohon }: SubmitDisposisiParams) => {
      const uniqueIds = Array.from(new Set(dokumenIds));
      const documents = uniqueIds
        .map((id) => dokumen.find((item) => item.id === id))
        .filter((item): item is Dokumen => item !== undefined);

      if (documents.length === 0) return 0;

      let nextId = disposisi.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      const today = toIsoDate(new Date());

      const newDisposisi = documents.map((item) => ({
        id: nextId++,
        dokumenId: item.id,
        detail: item.detail,
        pemohon: pemohon.trim() || "SYSTEM",
        pemilik: item.userInput,
        tglPengajuan: today,
        status: "Pending" as const,
        alasanPengajuan: alasanPengajuan.trim(),
        tglExpired: null,
        tglAksi: null,
        alasanAksi: null,
      }));

      setDisposisi((prev) => [...prev, ...newDisposisi]);
      return newDisposisi.length;
    },
    [disposisi, dokumen],
  );

  const processDisposisi = useCallback(
    ({ id, action, alasanAksi, tanggalExpired }: ProcessDisposisiParams) => {
      const target = disposisi.find((item) => item.id === id);
      if (!target || target.status !== "Pending") return false;

      const today = toIsoDate(new Date());
      const nextStatus = action === "approve" ? "Approved" : "Rejected";

      setDisposisi((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: nextStatus,
                tglExpired: action === "approve" ? (tanggalExpired ?? null) : null,
                tglAksi: today,
                alasanAksi: alasanAksi.trim() || null,
              }
            : item,
        ),
      );

      return true;
    },
    [disposisi],
  );

  const submitPeminjaman = useCallback(
    ({
      dokumenIds,
      tanggalPeminjaman,
      tanggalPengembalian,
      alasan,
      peminjam,
    }: SubmitPeminjamanParams) => {
      const uniqueIds = Array.from(new Set(dokumenIds));
      const availableDocs = uniqueIds
        .map((id) => dokumen.find((item) => item.id === id))
        .filter((item): item is Dokumen => item !== undefined)
        .filter((item) => item.statusPinjam === "Tersedia");

      if (availableDocs.length === 0) return 0;

      let nextId = peminjaman.reduce((max, item) => Math.max(max, item.id), 0) + 1;

      const newPeminjaman = availableDocs.map((item) => ({
        id: nextId++,
        dokumenId: item.id,
        detail: item.namaDokumen,
        peminjam: peminjam.trim() || "SYSTEM",
        tglPinjam: tanggalPeminjaman,
        tglKembali: tanggalPengembalian,
        tglPengembalian: null,
        status: "Pending" as const,
        alasan: alasan.trim(),
        approver: null,
        tglApprove: null,
        jamApprove: null,
        alasanApprove: null,
        tglPenyerahan: null,
      }));

      const nextPeminjaman = [...peminjaman, ...newPeminjaman];
      setPeminjaman(nextPeminjaman);
      setDokumen(syncDokumenStatusWithPeminjaman(dokumen, nextPeminjaman));

      return newPeminjaman.length;
    },
    [dokumen, peminjaman],
  );

  const processPeminjaman = useCallback(
    ({
      id,
      action,
      tanggalPenyerahan,
      alasanAksi,
      approver,
    }: ProcessPeminjamanParams) => {
      const target = peminjaman.find((item) => item.id === id);
      if (!target) return false;

      const today = toIsoDate(new Date());
      const nowTime = currentTimeHHmm();

      const nextPeminjaman = peminjaman.map((item) => {
        if (item.id !== id) return item;

        if (item.status === "Pending") {
          if (action === "approve") {
            return {
              ...item,
              status: "Dipinjam" as const,
              approver: approver ?? item.approver,
              tglApprove: today,
              jamApprove: nowTime,
              alasanApprove: alasanAksi.trim() || item.alasanApprove,
              tglPenyerahan: tanggalPenyerahan ?? today,
            };
          }

          return {
            ...item,
            status: "Ditolak" as const,
            approver: approver ?? item.approver,
            tglApprove: today,
            jamApprove: nowTime,
            alasanApprove: alasanAksi.trim() || item.alasanApprove,
            tglPenyerahan: null,
          };
        }

        if (item.status === "Dipinjam") {
          if (action === "approve") {
            return {
              ...item,
              status: "Dikembalikan" as const,
              tglPengembalian: tanggalPenyerahan ?? today,
              approver: approver ?? item.approver,
              tglApprove: item.tglApprove ?? today,
              jamApprove: item.jamApprove ?? nowTime,
              alasanApprove: alasanAksi.trim() || item.alasanApprove,
            };
          }

          return {
            ...item,
            approver: approver ?? item.approver,
            tglApprove: today,
            jamApprove: nowTime,
            alasanApprove: alasanAksi.trim() || item.alasanApprove,
          };
        }

        return item;
      });

      setPeminjaman(nextPeminjaman);
      setDokumen(syncDokumenStatusWithPeminjaman(dokumen, nextPeminjaman));

      return true;
    },
    [dokumen, peminjaman],
  );

  const resetWorkflowData = useCallback(() => {
    const next = buildDefaultState();
    setDokumen(next.dokumen);
    setDisposisi(next.disposisi);
    setPeminjaman(next.peminjaman);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  const value = useMemo<ArsipDigitalWorkflowValue>(
    () => ({
      dokumen,
      disposisi,
      peminjaman,
      submitDisposisi,
      processDisposisi,
      submitPeminjaman,
      processPeminjaman,
      resetWorkflowData,
    }),
    [
      disposisi,
      dokumen,
      peminjaman,
      processDisposisi,
      processPeminjaman,
      resetWorkflowData,
      submitDisposisi,
      submitPeminjaman,
    ],
  );

  return (
    <ArsipDigitalWorkflowContext.Provider value={value}>
      {children}
    </ArsipDigitalWorkflowContext.Provider>
  );
}

export function useArsipDigitalWorkflow() {
  const context = useContext(ArsipDigitalWorkflowContext);
  if (!context) {
    throw new Error(
      "useArsipDigitalWorkflow must be used within ArsipDigitalWorkflowProvider",
    );
  }
  return context;
}
