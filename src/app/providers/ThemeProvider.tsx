import { ReactNode } from "react";
import { SiteConfig } from "@/app/config/types";

interface ThemeProviderProps {
  config: SiteConfig | null;
  children: ReactNode;
}

export function ThemeProvider({ config, children }: ThemeProviderProps) {
  if (!config) return null;

  const { primary, secondary, accent, background, text } = config.theme.colors;

  return (
    <div
      style={
        {
          "--color-primary": primary,
          "--color-secondary": secondary,
          "--color-accent": accent,
          "--color-background": background,
          "--color-text": text,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
