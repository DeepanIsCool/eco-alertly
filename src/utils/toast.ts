import type { ToasterToast } from "@/contexts/toast-context";

// Function to safely execute a toast function
const executeToast = (toastFn: () => string): string => {
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

// Create a toast object with methods that can be imported and used directly
export const toast = {
  success: (_props: Omit<ToasterToast, "id" | "open">): string => "__TOAST_PLACEHOLDER__",
  
  error: (_props: Omit<ToasterToast, "id" | "open">): string => "__TOAST_PLACEHOLDER__",
  
  warning: (_props: Omit<ToasterToast, "id" | "open">): string => "__TOAST_PLACEHOLDER__",
  
  info: (_props: Omit<ToasterToast, "id" | "open">): string => "__TOAST_PLACEHOLDER__"
};
