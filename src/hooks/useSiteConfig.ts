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

        // 1. Gérer le domaine Vercel
        const hostname = window.location.hostname;
        let searchDomain = hostname;

        if (hostname.includes(".vercel.app")) {
          const siteName = hostname.split(".")[0];
          searchDomain = `${siteName}.skaild.com`;
          console.log("🔍 Searching for parent site:", searchDomain);
        }

        const cacheKey = `site_config_${searchDomain}`;
        const cachedConfig = localStorage.getItem(cacheKey);

        if (cachedConfig) {
          console.log("📦 Using cached config");
          setConfig(JSON.parse(cachedConfig));
          setLoading(false);
          return;
        }

        // 2. Chercher le site dans Supabase
        const { data, error: fetchError } = await supabase
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

        let siteData = data;

        if (fetchError) {
          if (fetchError.code === "PGRST116") {
            console.error(`Site not found for domain: ${searchDomain}`);
            throw new Error(`Site not found for domain: ${searchDomain}`);
          }
          throw fetchError;
        }

        // 2. Si le contenu n'existe pas, le générer
        if (
          !siteData.content ||
          !siteData.content.hero ||
          !siteData.content.services ||
          !siteData.content.features
        ) {
          console.log("🔄 Génération du contenu...");
          generationInProgress.current = true;

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

          if (content.services?.length > 0) {
            const { error: servicesError } = await supabase
              .from("services")
              .insert(
                content.services.map((service) => ({
                  site_id: siteData.id,
                  name: service.title,
                  description: service.description,
                  icon: service.icon || "default",
                  image_url: service.imageUrl,
                }))
              );
            if (servicesError) throw servicesError;
          }

          if (content.features?.length > 0) {
            const { error: featuresError } = await supabase
              .from("features")
              .insert(
                content.features.map((feature) => ({
                  site_id: siteData.id,
                  title: feature.title,
                  description: feature.description,
                  icon: feature.icon || "default",
                  image_url: feature.imageUrl,
                }))
              );
            if (featuresError) throw featuresError;
          }

          console.log("🎨 Content generated:", {
            heroTitle: content.hero.title,
            servicesCount: content.services.length,
            featuresCount: content.features.length,
          });

          siteData = {
            ...siteData,
            content,
            content_generated: true,
          };
        }

        // 3. Formater et mettre en cache
        const formattedConfig = formatSiteConfig(siteData);
        localStorage.setItem(cacheKey, JSON.stringify(formattedConfig));

        if (isSubscribed) {
          setConfig(formattedConfig);
        }

        console.log("📦 Site data retrieved:", {
          name: siteData.business_profiles.name,
          contentGenerated: siteData.content_generated,
          hasServices: siteData.services?.length > 0,
          hasFeatures: siteData.features?.length > 0,
        });

        console.log("🎨 Config cached:", {
          business: formattedConfig.business.name,
          hasContent: !!formattedConfig.content,
        });
      } catch (err) {
        console.error("Error loading site config:", err);
        if (isSubscribed) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
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
