"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { FiCheckCircle, FiInfo, FiAlertTriangle, FiXCircle, FiX } from "react-icons/fi";

export type ToastType = "success" | "info" | "warning" | "error";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  remove: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({
  children,
  position = "bottom-right",
}: {
  children: React.ReactNode;
  position?: ToastPosition;
}) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = "info", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }
  }, [remove]);

  const success = useCallback((msg: string, dur?: number) => addToast(msg, "success", dur), [addToast]);
  const info = useCallback((msg: string, dur?: number) => addToast(msg, "info", dur), [addToast]);
  const warning = useCallback((msg: string, dur?: number) => addToast(msg, "warning", dur), [addToast]);
  const error = useCallback((msg: string, dur?: number) => addToast(msg, "error", dur), [addToast]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.toast = {
        toast: addToast,
        success,
        info,
        warning,
        error,
      };
    }
  }, [addToast, success, info, warning, error]);

  const value = {
    toast: addToast,
    success,
    info,
    warning,
    error,
    remove,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} remove={remove} position={position} />
    </ToastContext.Provider>
  );
}

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
};

function ToastContainer({
  toasts,
  remove,
  position,
}: {
  toasts: ToastMessage[];
  remove: (id: string) => void;
  position: ToastPosition;
}) {
  return (
    <div className={`fixed z-[9999] flex w-full max-w-sm flex-col gap-3 px-4 sm:px-0 ${positionClasses[position]}`}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  const { type, message } = toast;

  // Custom styling based on ToastType
  const config = {
    success: {
      icon: <FiCheckCircle className="h-5 w-5 text-[var(--color-success)]" />,
      borderColor: "border-[var(--color-success)]/30",
      glowColor: "shadow-[0_0_15px_rgba(103,182,107,0.15)]",
      barBg: "bg-[var(--color-success)]",
    },
    info: {
      icon: <FiInfo className="h-5 w-5 text-[var(--color-accent)]" />,
      borderColor: "border-[var(--color-accent)]/30",
      glowColor: "shadow-[0_0_15px_rgba(111,147,218,0.15)]",
      barBg: "bg-[var(--color-accent)]",
    },
    warning: {
      icon: <FiAlertTriangle className="h-5 w-5 text-[var(--color-warning)]" />,
      borderColor: "border-[var(--color-warning)]/30",
      glowColor: "shadow-[0_0_15px_rgba(197,157,74,0.15)]",
      barBg: "bg-[var(--color-warning)]",
    },
    error: {
      icon: <FiXCircle className="h-5 w-5 text-[var(--color-danger)]" />,
      borderColor: "border-[var(--color-danger)]/30",
      glowColor: "shadow-[0_0_15px_rgba(217,107,100,0.15)]",
      barBg: "bg-[var(--color-danger)]",
    },
  }[type];

  return (
    <div
      role="alert"
      className={`glass relative flex w-full items-start gap-3 overflow-hidden rounded-xl border ${config.borderColor} p-4 text-[var(--color-text-primary)] transition-all duration-300 animate-slide-in ${config.glowColor}`}
      style={{
        animation: "fadeIn 0.3s ease-out, slideIn 0.3s ease-out",
      }}
    >
      {/* Visual Accent Bar */}
      <div className={`absolute bottom-0 left-0 top-0 w-1 ${config.barBg}`} />

      {/* Icon */}
      <div className="flex-shrink-0 pt-0.5">{config.icon}</div>

      {/* Message */}
      <div className="flex-1 text-sm font-medium leading-relaxed pr-2">
        {message}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="flex-shrink-0 rounded-lg p-1 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]"
        aria-label="Close notification"
      >
        <FiX className="h-4 w-4" />
      </button>
    </div>
  );
}
