import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testBusinessInfo() {
  try {
    console.log("🔍 Listing all sites in database:\n");

    // 1. D'abord, lister tous les sites
    const { data: allSites, error: listError } = await supabase.from("sites")
      .select(`
        domain,
        business_profiles (
          name,
          business_type,
          email
        )
      `);

    if (listError) throw listError;

    console.log("Found sites:");
    console.log("------------");
    allSites.forEach((site, index) => {
      console.log(`\n${index + 1}. Domain: ${site.domain}`);
      console.log(`   Business: ${site.business_profiles?.name}`);
      console.log(`   Type: ${site.business_profiles?.business_type}`);
    });

    // 2. Chercher le site spécifique
    const targetDomain = "fewfewfrrrrrrrew.skaild.com"; // Le domaine actuel dans la base
    console.log(`\n🔎 Checking specific site: ${targetDomain}`);

    const { data: site, error: siteError } = await supabase
      .from("sites")
      .select(
        `
        *,
        business_profiles (*)
      `
      )
      .eq("domain", targetDomain)
      .single();

    if (siteError) {
      console.error("❌ Site specific error:", siteError.message);
      return;
    }

    console.log("\nSite Details:");
    console.log("-------------");
    console.log("Domain:", site.domain);
    console.log("Status:", site.status);
    console.log("Content Generated:", site.content_generated);
    console.log("Business Name:", site.business_profiles?.name);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Exécuter le test
testBusinessInfo();
