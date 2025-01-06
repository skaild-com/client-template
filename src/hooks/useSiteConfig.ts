"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { SiteConfig, SiteContent } from "@/app/config/types";
import { generateBusinessContent } from "@/services/aiContent";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// Définir le type pour les données du site
interface SiteData {
  id: string;
  content?: Record<string, unknown>;
  content_generated: boolean;
  business_profiles: {
    name: string;
    phone: string;
    email: string;
    business_type: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    hours: {
      weekdays: string;
      weekends: string;
    };
  };
}

function formatSiteConfig(siteData: SiteData): SiteConfig {
  const defaultContent: SiteContent = {
    hero: {
      title: "",
      subtitle: "",
      cta: { primary: "", secondary: "" },
    },
    services: [],
    features: [],
  };

  const content = siteData.content
    ? {
        hero: siteData.content.hero as SiteContent["hero"],
        services: siteData.content.services as SiteContent["services"],
        features: siteData.content.features as SiteContent["features"],
      }
    : defaultContent;

  return {
    id: siteData.id,
    business: {
      name: siteData.business_profiles.name,
      phone: siteData.business_profiles.phone,
      email: siteData.business_profiles.email,
      businessType: siteData.business_profiles.business_type,
      address: siteData.business_profiles.address,
      hours: siteData.business_profiles.hours,
    },
    theme: {
      colors: {
        primary: "#2563eb",
        secondary: "#0284c7",
        accent: "#f59e0b",
        background: "#ffffff",
        text: "#0f172a",
      },
      style: {
        layout: "wide",
        buttonRadius: "rounded",
        headerStyle: "standard",
      },
    },
    content,
  };
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const generationInProgress = useRef(false);

  useEffect(() => {
    let isSubscribed = true;

    const loadConfig = async () => {
      if (!isSubscribed || generationInProgress.current) return;

      try {
        setLoading(true);
        const domain = window.location.hostname;

        // Add support for Vercel preview domains
        const searchDomain =
          domain === "localhost"
            ? "plumber.skaild.com"
            : domain.includes("vercel.app")
            ? "plumber.skaild.com" // Use the same fallback for Vercel deployments
            : domain;

        // 1. D'abord, vérifions si nous avons déjà le contenu en cache
        const cacheKey = `site_config_${searchDomain}`;
        const cachedConfig = sessionStorage.getItem(cacheKey);

        if (cachedConfig) {
          console.log("📦 Utilisation du contenu en cache");
          setConfig(JSON.parse(cachedConfig));
          setLoading(false);
          return;
        }

        const { data: siteData, error } = await supabase
          .from("sites")
          .select(
            `
            *,
            business_profiles(*),
            services!services_site_id_fkey(*),
            features!features_site_id_fkey(*)
          `
          )
          .eq("domain", searchDomain)
          .single();

        if (error) throw error;

        // 2. Si le contenu existe déjà dans la base de données, on l'utilise
        if (siteData.content_generated && siteData.content) {
          console.log("✅ Contenu existant trouvé dans la base de données");
          const formattedConfig = formatSiteConfig(siteData);
          sessionStorage.setItem(cacheKey, JSON.stringify(formattedConfig));
          setConfig(formattedConfig);
          setLoading(false);
          return;
        }

        // 3. Sinon, on génère le contenu
        if (!generationInProgress.current) {
          generationInProgress.current = true;
          console.log("🔄 Génération du contenu...");

          const content = await generateBusinessContent(
            siteData.business_profiles.name,
            siteData.business_profiles.business_type
          );

          const { error: updateError } = await supabase
            .from("sites")
            .update({
              content,
              content_generated: true,
              status: "published",
            })
            .eq("id", siteData.id);

          if (updateError) throw updateError;

          const updatedSiteData = {
            ...siteData,
            content,
            content_generated: true,
          };

          const formattedConfig = formatSiteConfig(updatedSiteData);
          sessionStorage.setItem(cacheKey, JSON.stringify(formattedConfig));

          if (isSubscribed) {
            setConfig(formattedConfig);
          }
        }
      } catch (err) {
        console.error("Error loading site config:", {
          error: err,
          domain: window.location.hostname,
          searchDomain: searchDomain,
        });
        if (isSubscribed) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        generationInProgress.current = false;
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadConfig();
    return () => {
      isSubscribed = false;
    };
  }, []);

  return { config, loading, error };
}
