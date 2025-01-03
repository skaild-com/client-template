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
        console.log("=== DEBUG SITE CONFIG ===");
        const hostname = window.location.hostname;
        console.log("Hostname:", hostname);

        const domain =
          hostname === "localhost"
            ? "test-business.skaild.com"
            : `${hostname.split(".")[0]}.skaild.com`;

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
          console.error("Supabase error:", siteError);
          throw new Error(`Failed to load site config: ${siteError.message}`);
        }

        if (!site) {
          throw new Error("No site configuration found");
        }

        console.log("Site loaded successfully:", site);
        if (isSubscribed) {
          setConfig(site);
          setError(null);
        }
      } catch (err) {
        console.error("Error loading config:", err);
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
