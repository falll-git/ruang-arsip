"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

import DocumentPreview from "./DocumentPreview";

export type DocumentPreviewFileType = "pdf" | "image";

export interface DocumentPreviewState {
  fileUrl: string;
  fileName: string;
  fileType: DocumentPreviewFileType;
}

interface DocumentPreviewContextType {
  isPreviewOpen: boolean;
  preview: DocumentPreviewState | null;
  openPreview: (
    fileUrl: string,
    fileName: string,
    fileType?: DocumentPreviewFileType,
  ) => void;
  closePreview: () => void;
}

const DocumentPreviewContext = createContext<
  DocumentPreviewContextType | undefined
>(undefined);

export function DocumentPreviewProvider({ children }: { children: ReactNode }) {
  const [preview, setPreview] = useState<DocumentPreviewState | null>(null);

  const isPreviewOpen = preview !== null;

  const openPreview = useCallback(
    (fileUrl: string, fileName: string, fileType?: DocumentPreviewFileType) => {
      const normalizedType =
        fileType ?? (fileUrl.toLowerCase().endsWith(".pdf") ? "pdf" : "image");

      const safeBaseName = (fileName || "document")
        .trim()
        .replace(/[<>:"/\\|?*]+/g, "-");

      const normalizedName =
        normalizedType === "pdf" && !safeBaseName.toLowerCase().endsWith(".pdf")
          ? `${safeBaseName}.pdf`
          : safeBaseName;

      setPreview({
        fileUrl,
        fileName: normalizedName,
        fileType: normalizedType,
      });
    },
    [],
  );

  const closePreview = useCallback(() => setPreview(null), []);

  const value = useMemo(
    () => ({ isPreviewOpen, preview, openPreview, closePreview }),
    [closePreview, isPreviewOpen, openPreview, preview],
  );

  return (
    <DocumentPreviewContext.Provider value={value}>
      {children}
      <DocumentPreview
        isOpen={isPreviewOpen}
        onClose={closePreview}
        fileUrl={preview?.fileUrl ?? ""}
        fileName={preview?.fileName ?? ""}
        fileType={preview?.fileType ?? "pdf"}
      />
    </DocumentPreviewContext.Provider>
  );
}

export function useDocumentPreviewContext() {
  const context = useContext(DocumentPreviewContext);
  if (context === undefined) {
    throw new Error(
      "useDocumentPreviewContext must be used within a DocumentPreviewProvider",
    );
  }
  return context;
}
