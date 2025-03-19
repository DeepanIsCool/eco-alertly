
import { useToastContext, ToastProvider, type ToasterToast } from "@/contexts/toast-context";
import { toast as toastBase } from "@/utils/toast";

// Actual toast implementation that will be used
const createToastMethod = (
  variant: "default" | "destructive" | undefined,
  useToastFn: () => ReturnType<typeof useToastContext>
) => {
  return (props: Omit<ToasterToast, "id" | "open">): string => {
    const toastFn = () => {
      const { addToast } = useToastFn();
      return addToast({ ...props, variant });
    };
    
    if (typeof document !== "undefined") {
      try {
        return toastFn();
      } catch (e) {
        console.error("Toast could not be displayed:", e);
        return "";
      }
    }
    return "";
  };
};

// Hook for using toast inside components
export function useToast() {
  return useToastContext();
}

// Override the placeholder implementations with real ones
export const toast = {
  ...toastBase,
  success: createToastMethod("default", useToastContext),
  error: createToastMethod("destructive", useToastContext),
  warning: createToastMethod(undefined, useToastContext),
  info: createToastMethod(undefined, useToastContext)
};

export { ToastProvider };
export type { ToasterToast };
