
import { useToastContext, ToastProvider, type ToasterToast } from "@/contexts/toast";

// Simplified hook for using toast - exports the context
export function useToast() {
  return useToastContext();
}

export { ToastProvider };
export type { ToasterToast };
