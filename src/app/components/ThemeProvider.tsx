"use client";

import { useEffect } from "react";
import { SiteConfig } from "../config/types";

interface ThemeProviderProps {
  config: SiteConfig;
  children: React.ReactNode;
}

const defaultColors = {
  primary: "#2563eb",
  secondary: "#0284c7",
  accent: "#f59e0b",
  background: "#ffffff",
  text: "#0f172a",
};

export function ThemeProvider({ config, children }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    const colors = config?.theme?.colors || defaultColors;

    // Set CSS variables with fallbacks
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--secondary", colors.secondary);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--text", colors.text);

    // Apply layout styles if theme configuration exists
    if (config?.theme?.style?.layout) {
      document.body.className = `
        ${config.theme.style.layout === "boxed" ? "max-w-7xl mx-auto" : ""}
      `;
    }
  }, [config]);

  return <>{children}</>;
}
