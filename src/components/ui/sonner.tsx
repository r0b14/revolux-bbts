"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";
import { useTheme } from "../ThemeProvider";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();
  // sonner accepts 'light'|'dark'|'system' — map our theme (light|dark) and fallback to 'light'
  const toastTheme: ToasterProps["theme"] = (theme as any) ?? "light";

  return (
    <Sonner
      theme={toastTheme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
