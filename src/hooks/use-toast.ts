
// This is the actual implementation that the rest of the app uses
import { useState, useEffect, createContext, useContext } from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_TIMEOUT = 5000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function generateId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      if (toastId) {
        toastTimeouts.forEach((_, id) => {
          if (id === toastId) {
            toastTimeouts.delete(id);
          }
        });

        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId
              ? {
                  ...t,
                  open: false,
                }
              : t
          ),
        };
      }

      return {
        ...state,
        toasts: state.toasts.map((t) => ({
          ...t,
          open: false,
        })),
      };
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId) {
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== action.toastId),
        };
      }
      return {
        ...state,
        toasts: [],
      };
    default:
      return state;
  }
};

const ToastContext = createContext<{
  toasts: ToasterToast[];
  addToast: (toast: Omit<ToasterToast, "id" | "open">) => void;
  updateToast: (toast: Partial<ToasterToast>) => void;
  dismissToast: (toastId?: string) => void;
  removeToast: (toastId?: string) => void;
}>({
  toasts: [],
  addToast: () => {},
  updateToast: () => {},
  dismissToast: () => {},
  removeToast: () => {},
});

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>({ toasts: [] });

  const addToast = (toast: Omit<ToasterToast, "id" | "open">) => {
    const id = toast.id || generateId();

    const newToast = {
      ...toast,
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

  return (
    <ToastContext.Provider
      value={{
        toasts: state.toasts,
        addToast,
        updateToast,
        dismissToast,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export const toast = {
  success: (props: Omit<ToasterToast, "id" | "open">) => {
    const context = useContext(ToastContext);
    if (!context) return "";
    return context.addToast({ ...props, variant: "default" });
  },
  error: (props: Omit<ToasterToast, "id" | "open">) => {
    const context = useContext(ToastContext);
    if (!context) return "";
    return context.addToast({ ...props, variant: "destructive" });
  },
  warning: (props: Omit<ToasterToast, "id" | "open">) => {
    const context = useContext(ToastContext);
    if (!context) return "";
    return context.addToast({ ...props });
  },
  info: (props: Omit<ToasterToast, "id" | "open">) => {
    const context = useContext(ToastContext);
    if (!context) return "";
    return context.addToast({ ...props });
  }
};
