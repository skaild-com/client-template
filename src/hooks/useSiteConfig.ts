"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { SiteConfig } from "@/app/config/types";

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setError(new Error("Missing Supabase configuration"));
      setLoading(false);
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    let isSubscribed = true;

    const loadConfig = async () => {
      if (!isSubscribed) return;

      try {
        // Afficher les informations de debug dans le DOM
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
            <p>Supabase URL exists: ${!!process.env
              .NEXT_PUBLIC_SUPABASE_URL}</p>
            <p>Supabase Key exists: ${!!process.env
              .NEXT_PUBLIC_SUPABASE_ANON_KEY}</p>
          </div>
        `;

        document.body.appendChild(debugInfo);

        const { data: site, error: siteError } = await supabase
          .from("sites")
          .select(
            `
            *,
            business_profiles (*)
          `
          )
          .eq("domain", domain)
          .single();

        if (siteError) {
          debugInfo.innerHTML += `<p style="color: red">Supabase Error: ${siteError.message}</p>`;
          throw new Error(`Failed to load site config: ${siteError.message}`);
        }

        if (!site) {
          debugInfo.innerHTML += `<p style="color: orange">No site found for domain: ${domain}</p>`;
          throw new Error("No site configuration found");
        }

        debugInfo.innerHTML += `<p style="color: green">Site loaded successfully</p>`;

        if (isSubscribed) {
          setConfig(site);
          setError(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        // Afficher l'erreur dans le DOM
        const errorDiv = document.createElement("div");
        errorDiv.style.position = "fixed";
        errorDiv.style.top = "0";
        errorDiv.style.left = "0";
        errorDiv.style.right = "0";
        errorDiv.style.padding = "1rem";
        errorDiv.style.background = "red";
        errorDiv.style.color = "white";
        errorDiv.style.zIndex = "9999";
        errorDiv.textContent = `Error: ${errorMessage}`;
        document.body.appendChild(errorDiv);

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

    const subscription = supabase
      .channel("sites")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sites" },
        loadConfig
      )
      .subscribe();

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, []);

  return { config, loading, error };
}
