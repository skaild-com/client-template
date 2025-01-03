"use client";

import { useEffect, useState } from "react";
import {
  createClient,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import { SiteConfig } from "@/app/config/types";

type PostgresChanges = RealtimePostgresChangesPayload<{
  [key: string]: unknown;
}>;

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialiser Supabase uniquement côté client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );

    const loadConfig = async () => {
      try {
        console.log("1. Début du chargement...");

        // Vérification de l'URL de Supabase
        console.log("URL Supabase:", process.env.NEXT_PUBLIC_SUPABASE_URL);

        // Récupération du site
        const { data: site, error: siteError } = await supabase
          .from("sites")
          .select(
            `
            *,
            business_profiles (*)
          `
          )
          .eq("domain", "plumber.skaild.com")
          .single();

        console.log("2. Site data:", site);
        if (siteError) throw siteError;

        console.log("2. Site data brut:", {
          id: site.id,
          business_profiles: site.business_profiles,
          content: JSON.stringify(site.content, null, 2),
          theme_config: JSON.stringify(site.theme_config, null, 2),
        });

        console.log(
          "Site content brut:",
          JSON.stringify(site.content, null, 2)
        );
        console.log(
          "Site theme brut:",
          JSON.stringify(site.theme_config, null, 2)
        );

        // Récupération des services
        const { data: services, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("site_id", site.id);

        console.log("3. Services:", services);
        if (servicesError) throw servicesError;

        console.log("3. Services bruts:", JSON.stringify(services, null, 2));

        // Récupération des features
        const { data: features, error: featuresError } = await supabase
          .from("features")
          .select("*")
          .eq("site_id", site.id);

        console.log("4. Features:", features);
        if (featuresError) throw featuresError;

        console.log("4. Features brutes:", JSON.stringify(features, null, 2));

        console.log("Raw site content:", site.content);
        console.log("Raw theme config:", site.theme_config);

        // Transformer les données pour correspondre à l'interface SiteConfig
        const transformedConfig: SiteConfig = {
          id: site.id,
          business: {
            name: site.business_profiles.name,
            phone: site.business_profiles.phone,
            email: site.business_profiles.email,
            address: {
              street: site.business_profiles.street || "",
              city: site.business_profiles.city || "",
              state: site.business_profiles.state || "",
              zip: site.business_profiles.zip || "",
            },
            hours: site.business_profiles.hours || {
              weekdays: "9:00 AM - 5:00 PM",
              weekends: "Closed",
            },
          },
          theme: {
            colors: {
              primary: site.theme_config?.colors?.primary || "#0891b2",
              secondary: site.theme_config?.colors?.secondary || "#0369a1",
              accent: site.theme_config?.colors?.accent || "#ea580c",
              background: site.theme_config?.colors?.background || "#f8fafc",
              text: site.theme_config?.colors?.text || "#1e293b",
            },
            style: {
              buttonRadius: site.theme_config?.style?.buttonRadius || "pill",
              headerStyle: site.theme_config?.style?.headerStyle || "prominent",
              layout: site.theme_config?.style?.layout || "boxed",
            },
          },
          content: {
            hero: {
              title: site.content?.hero?.title ?? "Your Trusted Local Plumbers",
              subtitle:
                site.content?.hero?.subtitle ??
                "Fast, reliable service when you need it most",
              cta: {
                primary: site.content?.hero?.cta?.primary ?? "Emergency Call",
                secondary: site.content?.hero?.cta?.secondary ?? "Get Quote",
              },
            },
            services: services.map((s) => ({
              title: s.name,
              description: s.description,
              icon: s.icon || "🔧",
            })),
            features: features.map((f) => ({
              title: f.title,
              description: f.description,
              icon: f.icon || "✨",
            })),
          },
        };

        console.log(
          "Final transformed config:",
          JSON.stringify(transformedConfig, null, 2)
        );
        setConfig(transformedConfig);
      } catch (e) {
        console.error("Error details:", e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();

    // Écouter les changements en temps réel
    const subscription = supabase
      .channel("sites")
      .on<PostgresChanges>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sites",
        },
        (payload) => {
          const hostname = window.location.hostname;
          const subdomain = hostname.split(".")[0];
          if (
            payload.new &&
            "domain" in payload.new &&
            payload.new.domain === `${subdomain}.skaild.com`
          ) {
            loadConfig();
          }
        }
      )
      .subscribe();

    // Écouter les changements sur les services
    const servicesSubscription = supabase
      .channel("services")
      .on<PostgresChanges>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "services",
        },
        async () => {
          loadConfig();
        }
      )
      .subscribe();

    // Écouter les changements sur les features
    const featuresSubscription = supabase
      .channel("features")
      .on<PostgresChanges>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "features",
        },
        async () => {
          loadConfig();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      servicesSubscription.unsubscribe();
      featuresSubscription.unsubscribe();
    };
  }, []);

  return { config, loading, error };
}
