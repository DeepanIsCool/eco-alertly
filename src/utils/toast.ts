
import type { ToasterToast } from "@/contexts/toast";
import { useToastContext } from "@/contexts/toast";
import { toast as sonnerToast } from "sonner";

// Get the toast context
let toastContext: ReturnType<typeof useToastContext> | null = null;

// Function to initialize the toast context
export const setToastContext = (context: ReturnType<typeof useToastContext>) => {
  toastContext = context;
};

// Map variant to sonner toast type
const mapVariantToType = (variant?: string) => {
  switch (variant) {
    case "destructive": return "error";
    default: return "default";
  }
};

// Create a toast object with methods that can be imported and used directly
export const toast = {
  success: (props: Omit<ToasterToast, "id" | "open">): string => {
    if (toastContext) {
      const id = toastContext.toast.success(props);
      
      // Also show with Sonner
      sonnerToast.success(props.title as string, {
        id,
        description: props.description as string,
        className: "compact-toast",
      });
      
      return id;
    }
    console.error("Toast context not initialized");
    return "";
  },
  
  error: (props: Omit<ToasterToast, "id" | "open">): string => {
    if (toastContext) {
      const id = toastContext.toast.error(props);
      
      // Also show with Sonner
      sonnerToast.error(props.title as string, {
        id,
        description: props.description as string,
        className: "compact-toast",
      });
      
      return id;
    }
    console.error("Toast context not initialized");
    return "";
  },
  
  warning: (props: Omit<ToasterToast, "id" | "open">): string => {
    if (toastContext) {
      const id = toastContext.toast.warning(props);
      
      // Also show with Sonner
      sonnerToast.warning(props.title as string, {
        id,
        description: props.description as string,
        className: "compact-toast",
      });
      
      return id;
    }
    console.error("Toast context not initialized");
    return "";
  },
  
  info: (props: Omit<ToasterToast, "id" | "open">): string => {
    if (toastContext) {
      const id = toastContext.toast.info(props);
      
      // Also show with Sonner
      sonnerToast.info(props.title as string, {
        id,
        description: props.description as string,
        className: "compact-toast",
      });
      
      return id;
    }
    console.error("Toast context not initialized");
    return "";
  }
};
