import supabase from "@/lib/supabase";
import { SiteConfig } from "../config/types";

export async function getSiteConfig(
  subdomain: string
): Promise<SiteConfig | null> {
  try {
    const { data: site, error } = await supabase
      .from("sites")
      .select(
        `
        *,
        business_profiles (*)
      `
      )
      .eq("domain", `${subdomain}.skaild.com`)
      .single();

    if (error) throw error;
    return site;
  } catch (error) {
    console.error("Error loading site config:", error);
    return null;
  }
}
