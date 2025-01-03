"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { SiteConfig } from "@/app/config/types";

// Créer le client Supabase une seule fois en dehors du hook
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const defaultConfig: SiteConfig = {
  id: "default",
  business: {
    name: "Business Test",
    phone: "+33 1 23 45 67 89",
    email: "contact@test-business.skaild.com",
    address: {
      street: "123 Rue Test",
      city: "Paris",
      state: "IDF",
      zip: "75000",
    },
    hours: {
      weekdays: "9:00 - 18:00",
      weekends: "Fermé",
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
      title: "Site de test",
      subtitle: "Configuration par défaut pour le développement",
      cta: {
        primary: "Commencer",
        secondary: "En savoir plus",
      },
    },
    services: [
      {
        title: "Service 1",
        description: "Description du service 1",
        icon: "🚀",
      },
      {
        title: "Service 2",
        description: "Description du service 2",
        icon: "💡",
      },
    ],
    features: [
      {
        title: "Fonctionnalité 1",
        description: "Description de la fonctionnalité 1",
        icon: "⚡",
      },
      {
        title: "Fonctionnalité 2",
        description: "Description de la fonctionnalité 2",
        icon: "🎯",
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

        const hostname = window.location.hostname;
        const domain =
          hostname === "localhost"
            ? "test-business.skaild.com"
            : `${hostname.split(".")[0]}.skaild.com`;

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

        // Test de connexion Supabase
        try {
          const { data: testData, error: testError } = await supabase
            .from("sites")
            .select("count")
            .limit(1);

          if (testError) {
            debugInfo.innerHTML += `<p style="color: red">Erreur de connexion Supabase: ${testError.message}</p>`;
            throw testError;
          }

          debugInfo.innerHTML += `<p style="color: green">Connexion Supabase OK</p>`;
        } catch (testErr) {
          debugInfo.innerHTML += `<p style="color: red">Erreur test Supabase: ${testErr}</p>`;
          throw testErr;
        }

        // Requête principale
        const { data: sites, error: siteError } = await supabase
          .from("sites")
          .select("*, business_profiles(*)")
          .eq("domain", domain);

        if (siteError) {
          debugInfo.innerHTML += `<p style="color: red">Error: ${siteError.message}</p>`;
          throw siteError;
        }

        // Vérifier si nous avons des résultats
        if (!sites || sites.length === 0) {
          if (process.env.NODE_ENV === "development") {
            debugInfo.innerHTML += `<p style="color: yellow">Using default configuration for development</p>`;
            setConfig(defaultConfig);
            setError(null);
          } else {
            debugInfo.innerHTML += `<p style="color: orange">No site found for domain: ${domain}</p>`;
            throw new Error(
              `No site configuration found for domain: ${domain}`
            );
          }
        } else {
          const site = sites[0];
          debugInfo.innerHTML += `<p style="color: green">Site loaded successfully (ID: ${site.id})</p>`;
          setConfig(site);
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
