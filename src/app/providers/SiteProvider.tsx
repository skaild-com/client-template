import { createContext, useContext } from "react";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { SiteConfig } from "@/app/config/types";

// Types
interface SiteContextType {
  config: SiteConfig | null;
  loading: boolean;
  error: Error | null;
}

interface SiteProviderProps {
  children: React.ReactNode;
}

// Context
const SiteContext = createContext<SiteContextType>({
  config: null,
  loading: false,
  error: null,
});

// Hook
export const useSite = () => useContext(SiteContext);

// Provider
export function SiteProvider({ children }: SiteProviderProps) {
  const siteConfig = useSiteConfig();

  return (
    <SiteContext.Provider value={siteConfig}>{children}</SiteContext.Provider>
  );
}

export type { SiteContextType, SiteProviderProps };
