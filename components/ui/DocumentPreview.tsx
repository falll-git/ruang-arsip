"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Download,
  FileText,
  Image as ImageIcon,
  Minus,
  Plus,
  X,
} from "lucide-react";
import NewtonsCradleLoader from "@/components/ui/NewtonsCradleLoader";

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType: "pdf" | "image";
}

export default function DocumentPreview({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType,
}: DocumentPreviewProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(100);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setIsLoading(true);
      setZoom(100);
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`doc-preview-overlay ${isClosing ? "closing" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`doc-preview-container ${isClosing ? "closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="doc-preview-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e6f2fa] flex items-center justify-center">
              {fileType === "pdf" ? (
                <FileText className="w-5 h-5 text-[#0d5a8f]" />
              ) : (
                <ImageIcon className="w-5 h-5 text-[#0d5a8f]" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{fileName}</h3>
              <p className="text-sm text-gray-500">
                {fileType === "pdf" ? "PDF Document" : "Image"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {fileType === "image" && (
              <div className="flex items-center gap-1 mr-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="text-sm font-medium text-gray-700 min-w-12.5 text-center">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}

            <button
              onClick={handleDownload}
              className="p-2.5 bg-[#157ec3] hover:bg-[#0d5a8f] text-white rounded-xl transition-colors flex items-center gap-2"
              title="Download"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">
                Download
              </span>
            </button>

            <button
              onClick={handleClose}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="doc-preview-content">
          {isLoading && (
            <div className="doc-preview-loading">
              <NewtonsCradleLoader
                size={56}
                color="#157ec3"
                label="Memuat dokumen..."
              />
              <p className="text-gray-600 font-medium mt-4">
                Memuat dokumen...
              </p>
            </div>
          )}

          {fileType === "pdf" ? (
            <iframe
              src={fileUrl}
              className="doc-preview-iframe"
              onLoad={() => setIsLoading(false)}
              title={fileName}
            />
          ) : (
            <div
              className="doc-preview-image-container"
              style={{ overflow: "auto" }}
            >
              <Image
                src={fileUrl}
                alt={fileName}
                className="doc-preview-image"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "center center",
                }}
                onLoad={() => setIsLoading(false)}
                width={800}
                height={600}
                unoptimized
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
