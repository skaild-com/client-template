import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function updatePlumberSite() {
  try {
    console.log("🔄 Mise à jour du site plumber.skaild.com...");

    // 1. Récupérer le site avec toutes ses relations
    const { data: site, error: fetchError } = await supabase
      .from("sites")
      .select(
        `
        *,
        business_profiles (*),
        services!services_site_id_fkey (*),
        features!features_site_id_fkey (*)
      `
      )
      .eq("domain", "plumber.skaild.com")
      .single();

    if (fetchError) throw fetchError;

    // 2. Préparer le contenu du site
    const siteContent = {
      hero: {
        title: `Professional Plumbing Services in ${site.business_profiles.address.city}`,
        subtitle: "Expert plumbing solutions for your home and business",
        cta: {
          primary: "Contact Us",
          secondary: "Our Services",
        },
      },
      social: {
        twitter: "",
        facebook: "",
        instagram: "",
      },
      contact: {
        email: site.business_profiles.email,
        phone: site.business_profiles.phone,
        address: `${site.business_profiles.address.street}, ${site.business_profiles.address.city}, ${site.business_profiles.address.state} ${site.business_profiles.address.zip}`,
        hours: site.business_profiles.hours,
      },
      business_name: site.business_profiles.name,
      services: site.services || [],
      features: site.features || [],
    };

    // 3. Mettre à jour le site
    const { error: updateError } = await supabase
      .from("sites")
      .update({
        content: siteContent,
        content_generated: true,
      })
      .eq("domain", "plumber.skaild.com");

    if (updateError) throw updateError;

    console.log("✅ Site mis à jour avec succès");
    console.log("📋 Services ajoutés:", site.services?.length || 0);
    console.log("📋 Features ajoutées:", site.features?.length || 0);
  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

updatePlumberSite();
