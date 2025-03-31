
import { useTheme } from "@/hooks/use-theme";
import { Toaster as Sonner } from "sonner";
import "@/styles/sonner.css";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      expand={false}
      visibleToasts={5}
      closeButton={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:max-w-[320px]",
          title: "group-[.toast]:text-base group-[.toast]:font-semibold",
          description: "group-[.toast]:text-sm group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton: "group-[.toast]:!opacity-100 group-[.toast]:!visible group-[.toast]:!z-50",
          success: "group-[.toaster]:bg-green-50 group-[.toaster]:text-green-800 dark:group-[.toaster]:bg-green-950 dark:group-[.toaster]:text-green-300",
          error: "group-[.toaster]:bg-red-50 group-[.toaster]:text-red-800 dark:group-[.toaster]:bg-red-950 dark:group-[.toaster]:text-red-300",
          warning: "group-[.toaster]:bg-yellow-50 group-[.toaster]:text-yellow-800 dark:group-[.toaster]:bg-yellow-950 dark:group-[.toaster]:text-yellow-300",
          info: "group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-800 dark:group-[.toaster]:bg-blue-950 dark:group-[.toaster]:text-blue-300",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
