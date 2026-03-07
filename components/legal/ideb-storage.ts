import { dummyIdebRecords } from "@/lib/data";
import type { IdebRecord } from "@/lib/types";

const IDEB_UPLOADS_STORAGE_KEY = "ruang-arsip.ideb.uploads";
const IDEB_DELETED_STORAGE_KEY = "ruang-arsip.ideb.deleted";

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function canUseStorage() {
  return typeof window !== "undefined";
}

function compareIdebRecords(a: IdebRecord, b: IdebRecord) {
  if (a.tahun !== b.tahun) return b.tahun - a.tahun;
  if (a.bulan !== b.bulan) return b.bulan - a.bulan;
  return b.tanggalUpload.localeCompare(a.tanggalUpload);
}

export function getStoredIdebUploads(): IdebRecord[] {
  if (!canUseStorage()) return [];

  return parseJson<IdebRecord[]>(
    window.localStorage.getItem(IDEB_UPLOADS_STORAGE_KEY),
    [],
  );
}

export function getStoredDeletedIdebIds(): string[] {
  if (!canUseStorage()) return [];

  return parseJson<string[]>(
    window.localStorage.getItem(IDEB_DELETED_STORAGE_KEY),
    [],
  );
}

export function saveStoredIdebUploads(records: IdebRecord[]) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(
    IDEB_UPLOADS_STORAGE_KEY,
    JSON.stringify(records.sort(compareIdebRecords)),
  );
}

export function saveStoredDeletedIdebIds(ids: string[]) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(
    IDEB_DELETED_STORAGE_KEY,
    JSON.stringify(Array.from(new Set(ids))),
  );
}

export function getMergedIdebRecords(): IdebRecord[] {
  const deletedIds = new Set(getStoredDeletedIdebIds());
  const mergedMap = new Map<string, IdebRecord>();

  [...getStoredIdebUploads(), ...dummyIdebRecords].forEach((record) => {
    if (deletedIds.has(record.id) || mergedMap.has(record.id)) return;
    mergedMap.set(record.id, record);
  });

  return Array.from(mergedMap.values()).sort(compareIdebRecords);
}

export function persistIdebRecord(record: IdebRecord) {
  const uploads = getStoredIdebUploads().filter((item) => item.id !== record.id);
  uploads.unshift(record);
  saveStoredIdebUploads(uploads);
  saveStoredDeletedIdebIds(
    getStoredDeletedIdebIds().filter((deletedId) => deletedId !== record.id),
  );
}

export function removeIdebRecord(recordId: string) {
  saveStoredIdebUploads(
    getStoredIdebUploads().filter((record) => record.id !== recordId),
  );
  saveStoredDeletedIdebIds([...getStoredDeletedIdebIds(), recordId]);
}
