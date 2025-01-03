import { SiteConfig } from "@/app/config/types";

export interface SiteContextType {
  config: SiteConfig | null;
  loading: boolean;
  error: Error | null;
}

export interface SiteProviderProps {
  children: React.ReactNode;
}
