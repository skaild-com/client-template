"use client";

import { useEffect } from "react";
import { SiteConfig } from "../config/types";

interface ThemeProviderProps {
  config: SiteConfig;
  children: React.ReactNode;
}

export function ThemeProvider({ config, children }: ThemeProviderProps) {
  useEffect(() => {
    // Mettre à jour les variables CSS
    const root = document.documentElement;
    const { colors } = config.theme;

    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--secondary", colors.secondary);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--text", colors.text);

    // Appliquer les styles globaux basés sur la configuration
    document.body.className = `
      ${config.theme.style.layout === "boxed" ? "max-w-7xl mx-auto" : ""}
    `;
  }, [config]);

  return <>{children}</>;
}
