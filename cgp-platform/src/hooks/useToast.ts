import { Toast } from "primereact/toast";
import { createContext, RefObject, useContext } from "react";

export const ToastContext = createContext<RefObject<Toast> | null>(null);

export function useToast() {
  const toast = useContext(ToastContext);

  if (!toast) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return toast;
}
