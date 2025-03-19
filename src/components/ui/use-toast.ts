
import { useToast } from "@/hooks/use-toast";
import { ToastProvider } from "@/contexts/toast";
import type { ToasterToast } from "@/contexts/toast";

// Re-export for consistency with existing API
export { useToast, ToastProvider };
export type { ToasterToast };
