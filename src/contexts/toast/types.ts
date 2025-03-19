
import type { ToastProps } from "@/components/ui/toast";
import type { ToastActionElement } from "@/components/ui/toast";

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

export type ActionType = typeof actionTypes;

export type Action =
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

export interface State {
  toasts: ToasterToast[];
}

export interface ToastContextType {
  toasts: ToasterToast[];
  addToast: (toast: Omit<ToasterToast, "id" | "open">) => string;
  updateToast: (toast: Partial<ToasterToast>) => void;
  dismissToast: (toastId?: string) => void;
  removeToast: (toastId?: string) => void;
  toast: {
    success: (props: Omit<ToasterToast, "id" | "open">) => string;
    error: (props: Omit<ToasterToast, "id" | "open">) => string;
    warning: (props: Omit<ToasterToast, "id" | "open">) => string;
    info: (props: Omit<ToasterToast, "id" | "open">) => string;
  };
}
