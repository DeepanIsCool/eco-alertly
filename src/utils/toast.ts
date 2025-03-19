
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
  success: (props: Omit<ToasterToast, "id" | "open">): string => {
    // This will be dynamically imported in use-toast.ts
    return "__TOAST_PLACEHOLDER__"; // This is replaced in use-toast.ts
  },
  
  error: (props: Omit<ToasterToast, "id" | "open">): string => {
    // This will be dynamically imported in use-toast.ts
    return "__TOAST_PLACEHOLDER__"; // This is replaced in use-toast.ts
  },
  
  warning: (props: Omit<ToasterToast, "id" | "open">): string => {
    // This will be dynamically imported in use-toast.ts
    return "__TOAST_PLACEHOLDER__"; // This is replaced in use-toast.ts
  },
  
  info: (props: Omit<ToasterToast, "id" | "open">): string => {
    // This will be dynamically imported in use-toast.ts
    return "__TOAST_PLACEHOLDER__"; // This is replaced in use-toast.ts
  }
};
