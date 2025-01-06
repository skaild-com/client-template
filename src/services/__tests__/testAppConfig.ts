import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testAppConfig() {
  try {
    // Simuler window.location.hostname comme dans useSiteConfig
    const testDomain = "fewfewfrrrrrrrew.skaild.com"; // ou .vercel.app
    console.log(`🔍 Testing app config loading for: ${testDomain}\n`);

    // Simuler exactement la requête de useSiteConfig
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
      .eq("domain", testDomain)
      .single();

    if (error) {
      console.error("❌ App would fail to load:", error.message);
      return;
    }

    // Vérifier les données business
    console.log("Business Info that will be used:");
    console.log("-------------------------------");
    console.log("Name:", siteData.business_profiles.name);
    console.log("Type:", siteData.business_profiles.business_type);
    console.log("Email:", siteData.business_profiles.email);
    console.log("Phone:", siteData.business_profiles.phone);

    // Vérifier le contenu
    if (siteData.content_generated && siteData.content) {
      console.log("\n✅ Site has generated content");
      console.log("Hero Title:", siteData.content.hero.title);
      console.log("Services:", siteData.services?.length || 0);
      console.log("Features:", siteData.features?.length || 0);
    } else {
      console.log("\n⚠️ Content will be generated on first load");
    }

    // Simuler le formatage comme dans useSiteConfig
    const formattedConfig = {
      business: siteData.business_profiles,
      content: siteData.content,
      services: siteData.services || [],
      features: siteData.features || [],
    };

    console.log("\nFinal Config Check:");
    console.log("------------------");
    console.log("✓ Business Name:", formattedConfig.business.name);
    console.log("✓ Services:", formattedConfig.services.length);
    console.log("✓ Features:", formattedConfig.features.length);
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Exécuter le test
testAppConfig();
