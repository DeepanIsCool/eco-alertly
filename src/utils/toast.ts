
import type { ToasterToast } from "@/contexts/toast";
import { useToastContext } from "@/contexts/toast";

// Get the toast context
let toastContext: ReturnType<typeof useToastContext> | null = null;

// Function to initialize the toast context
export const setToastContext = (context: ReturnType<typeof useToastContext>) => {
  toastContext = context;
};

// Create a toast object with methods that can be imported and used directly
export const toast = {
  success: (props: Omit<ToasterToast, "id" | "open">): string => {
    if (toastContext) {
      return toastContext.toast.success(props);
    }
    console.error("Toast context not initialized");
    return "";
  },
  
  error: (props: Omit<ToasterToast, "id" | "open">): string => {
    if (toastContext) {
      return toastContext.toast.error(props);
    }
    console.error("Toast context not initialized");
    return "";
  },
  
  warning: (props: Omit<ToasterToast, "id" | "open">): string => {
    if (toastContext) {
      return toastContext.toast.warning(props);
    }
    console.error("Toast context not initialized");
    return "";
  },
  
  info: (props: Omit<ToasterToast, "id" | "open">): string => {
    if (toastContext) {
      return toastContext.toast.info(props);
    }
    console.error("Toast context not initialized");
    return "";
  }
};
