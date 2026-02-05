"use client";

import { useState, ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

type ModalType = "danger" | "warning" | "info" | "success";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string | ReactNode;
  children?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: ModalType;
  isLoading?: boolean;
  isConfirmDisabled?: boolean;
}

const modalStyles = {
  danger: {
    bg: "bg-red-50",
    icon: "text-red-500",
    btn: "bg-red-500 hover:bg-red-600",
  },
  warning: {
    bg: "bg-amber-50",
    icon: "text-amber-500",
    btn: "bg-amber-500 hover:bg-amber-600",
  },
  info: {
    bg: "bg-[#e6f2fa]",
    icon: "text-[#157ec3]",
    btn: "bg-[#157ec3] hover:bg-[#0d5a8f]",
  },
  success: {
    bg: "bg-emerald-50",
    icon: "text-emerald-500",
    btn: "bg-emerald-500 hover:bg-emerald-600",
  },
};

const modalIcons = {
  danger: <AlertTriangle className="w-6 h-6" />,
  warning: <AlertTriangle className="w-6 h-6" />,
  info: <Info className="w-6 h-6" />,
  success: <CheckCircle2 className="w-6 h-6" />,
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
  isLoading = false,
  isConfirmDisabled = false,
}: ConfirmModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    if (isLoading) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  if (!isOpen) return null;

  const style = modalStyles[type];

  return (
    <div
      className="fixed inset-0 p-4"
      style={{
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all duration-300 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${style.bg} p-6 rounded-t-2xl`}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
            }}
          >
            <div className={style.icon} style={{ flexShrink: 0 }}>
              {modalIcons[type]}
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </div>
          </div>
        </div>

        <div className="p-6">
          {message && (
            <div className="text-gray-700 mb-4">
              {typeof message === "string" ? <p>{message}</p> : message}
            </div>
          )}
          {children && <div>{children}</div>}
        </div>

        <div
          className="p-6 bg-gray-50 rounded-b-2xl"
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl font-medium text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || isConfirmDisabled}
            className={`${style.btn} px-6 py-2.5 rounded-xl font-medium text-white disabled:opacity-70 disabled:grayscale-[0.5] disabled:cursor-not-allowed transition-all`}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            {isLoading && (
              <div
                className="button-spinner"
                style={
                  {
                    ["--spinner-size"]: "16px",
                    ["--spinner-border"]: "2px",
                  } as React.CSSProperties
                }
                aria-hidden="true"
              />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
