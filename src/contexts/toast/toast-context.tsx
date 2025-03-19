
import { useState, useEffect, createContext, useContext } from "react";
import type { ToastContextType, ToasterToast, State } from "./types";
import { toastTimeouts } from "./toast-reducer";
import { generateId, TOAST_TIMEOUT } from "./toast-utils";

// Custom hook to manage toast state
function useToastState() {
  const [state, setState] = useState<State>({ toasts: [] });

  const addToast = (props: Omit<ToasterToast, "id" | "open">) => {
    const id = generateId();

    const newToast = {
      ...props,
      id,
      open: true,
    };

    setState((prev) => ({
      ...prev,
      toasts: [...prev.toasts, newToast],
    }));

    return id;
  };

  const updateToast = (toast: Partial<ToasterToast>) => {
    if (!toast.id) {
      return;
    }

    setState((prev) => ({
      ...prev,
      toasts: prev.toasts.map((t) =>
        t.id === toast.id ? { ...t, ...toast } : t
      ),
    }));
  };

  const dismissToast = (toastId?: string) => {
    setState((prev) => ({
      ...prev,
      toasts: prev.toasts.map((t) =>
        toastId ? (t.id === toastId ? { ...t, open: false } : t) : { ...t, open: false }
      ),
    }));
  };

  const removeToast = (toastId?: string) => {
    setState((prev) => ({
      ...prev,
      toasts: prev.toasts.filter((t) => (toastId ? t.id !== toastId : false)),
    }));
  };

  // Toast variants
  const toast = {
    success: (props: Omit<ToasterToast, "id" | "open">) => {
      return addToast({ ...props, variant: "default" });
    },
    error: (props: Omit<ToasterToast, "id" | "open">) => {
      return addToast({ ...props, variant: "destructive" });
    },
    warning: (props: Omit<ToasterToast, "id" | "open">) => {
      return addToast({ ...props });
    },
    info: (props: Omit<ToasterToast, "id" | "open">) => {
      return addToast({ ...props });
    },
  };

  // Manage timeouts
  useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toast.open && !toastTimeouts.has(toast.id)) {
        const timeout = setTimeout(() => {
          dismissToast(toast.id);
          toastTimeouts.delete(toast.id);
        }, TOAST_TIMEOUT);

        toastTimeouts.set(toast.id, timeout);
      }
    });

    return () => {
      toastTimeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });
      toastTimeouts.clear();
    };
  }, [state.toasts]);

  return {
    toasts: state.toasts,
    addToast,
    updateToast,
    dismissToast, 
    removeToast,
    toast
  };
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => "",
  updateToast: () => {},
  dismissToast: () => {},
  removeToast: () => {},
  toast: {
    success: () => "",
    error: () => "",
    warning: () => "",
    info: () => "",
  },
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastState = useToastState();
  
  return (
    <ToastContext.Provider value={toastState}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }

  return context;
}
