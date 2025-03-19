
import { useToast } from "@/hooks/use-toast";
import { ToastProvider } from "@/contexts/toast-context";
import type { ToasterToast } from "@/contexts/toast-context";

// Re-export for consistency with existing API
export { useToast, ToastProvider };
export type { ToasterToast };
