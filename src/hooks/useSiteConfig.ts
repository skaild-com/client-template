"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { SiteConfig } from "@/app/config/types";
import { generateBusinessContent } from "@/services/aiContent";

// Créer le client Supabase une seule fois en dehors du hook
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const defaultConfig: SiteConfig = {
  id: "default",
  business: {
    name: "Business Test",
    phone: "+1 234 567 8900",
    email: "contact@test-business.skaild.com",
    businessType: "default",
    address: {
      street: "123 Test Street",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
    hours: {
      weekdays: "9:00 AM - 6:00 PM",
      weekends: "Closed",
    },
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
  content: {
    hero: {
      title: "Test Website",
      subtitle: "Default configuration for development",
      cta: {
        primary: "Get Started",
        secondary: "Learn More",
      },
    },
    services: [
      {
        title: "Service 1",
        description: "Description of service 1",
      },
      {
        title: "Service 2",
        description: "Description of service 2",
      },
      {
        title: "Service 3",
        description: "Description of service 3",
      },
    ],
    features: [
      {
        title: "Feature 1",
        description: "Description of feature 1",
      },
      {
        title: "Feature 2",
        description: "Description of feature 2",
      },
      {
        title: "Feature 3",
        description: "Description of feature 3",
      },
      {
        title: "Feature 4",
        description: "Description of feature 4",
      },
    ],
  },
};

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isSubscribed = true;

    const loadConfig = async () => {
      if (!isSubscribed) return;

      try {
        // Debug element creation (commented out but preserved)
        /*
        const debugInfo = document.createElement("div");
        debugInfo.style.position = "fixed";
        debugInfo.style.bottom = "0";
        debugInfo.style.left = "0";
        debugInfo.style.padding = "1rem";
        debugInfo.style.background = "rgba(0,0,0,0.8)";
        debugInfo.style.color = "white";
        debugInfo.style.zIndex = "9999";
        debugInfo.style.maxHeight = "200px";
        debugInfo.style.overflowY = "auto";
        */

        const hostname = window.location.hostname;
        const domain =
          hostname === "localhost"
            ? "plumber.skaild.com"
            : `${hostname.split(".")[0]}.skaild.com`;

        console.log("Hostname:", hostname);
        console.log("Domain utilisé:", domain);

        /*
        debugInfo.innerHTML = `
          <div>
            <p>Hostname: ${hostname}</p>
            <p>Domain: ${domain}</p>
            <p>Supabase URL: ${
              process.env.NEXT_PUBLIC_SUPABASE_URL || "Non définie"
            }</p>
            <p>Query: sites?domain=eq.${domain}</p>
          </div>
        `;

        document.body.appendChild(debugInfo);
        */

        // Test de connexion Supabase
        try {
          const { error: testError } = await supabase
            .from("sites")
            .select("count")
            .limit(1);

          if (testError) {
            // debugInfo.innerHTML += `<p style="color: red">Erreur de connexion Supabase: ${testError.message}</p>`;
            throw testError;
          }

          // debugInfo.innerHTML += `<p style="color: green">Connexion Supabase OK</p>`;
        } catch (testErr) {
          // debugInfo.innerHTML += `<p style="color: red">Erreur test Supabase: ${testErr}</p>`;
          throw testErr;
        }

        const { data: sites, error: siteError } = await supabase
          .from("sites")
          .select("*, business_profiles(*)")
          .eq("domain", domain);

        if (siteError) {
          // debugInfo.innerHTML += `<p style="color: red">Error: ${siteError.message}</p>`;
          throw siteError;
        }

        if (!sites || sites.length === 0) {
          if (process.env.NODE_ENV === "development") {
            // debugInfo.innerHTML += `<p style="color: yellow">Using default configuration for development</p>`;
            setConfig(defaultConfig);
            setError(null);
          } else {
            // debugInfo.innerHTML += `<p style="color: orange">No site found for domain: ${domain}</p>`;
            throw new Error(
              `No site configuration found for domain: ${domain}`
            );
          }
        } else {
          const site = sites[0];
          // debugInfo.innerHTML += `<p style="color: green">Site loaded successfully (ID: ${site.id})</p>`;

          const formattedConfig: SiteConfig = {
            id: site.id,
            business: {
              name: site.business_profiles?.name || "Business Name",
              phone:
                site.business_profiles?.phone || "Contact number not available",
              email: site.business_profiles?.email || "Email not available",
              businessType: site.business_profiles?.business_type || "general",
              address: site.business_profiles?.address || {
                street: "Street Address",
                city: "City",
                state: "State",
                zip: "ZIP",
              },
              hours: site.business_profiles?.hours || {
                weekdays: "9:00 AM - 5:00 PM",
                weekends: "Closed",
              },
            },
            theme: {
              colors: site.theme_config?.colors || defaultConfig.theme.colors,
              style: site.theme_config?.style || defaultConfig.theme.style,
            },
            content: site.content || defaultConfig.content,
          };

          // Si le contenu n'est pas personnalisé et qu'on a un business_type
          if (
            !site.content?.services ||
            site.content.services.length < 3 ||
            !site.content?.features ||
            site.content.features.length < 4
          ) {
            try {
              console.log("Attempting AI content generation...");
              const generatedContent = await generateBusinessContent(
                site.business_profiles?.name || defaultConfig.business.name,
                site.business_profiles?.business_type || "default"
              );

              formattedConfig.content = {
                ...formattedConfig.content,
                ...generatedContent,
              };
              console.log("Content generated successfully");
            } catch (error) {
              console.warn(
                "Échec de la génération AI, utilisation du contenu par défaut:",
                error
              );
            }
          }

          console.log("Formatted configuration:", formattedConfig);

          setConfig(formattedConfig);
          setError(null);
        }
      } catch (err) {
        console.error("Error loading site config:", err);
        if (isSubscribed) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setConfig(null);
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
