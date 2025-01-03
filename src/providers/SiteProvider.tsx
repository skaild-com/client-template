"use client";

import { createContext, useContext } from "react";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { SiteContextType, SiteProviderProps } from "@/types/site";

const SiteContext = createContext<SiteContextType>({
  config: null,
  loading: true,
  error: null,
});

export function SiteProvider({ children }: SiteProviderProps) {
  const siteConfig = useSiteConfig();
  return (
    <SiteContext.Provider value={siteConfig}>{children}</SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
