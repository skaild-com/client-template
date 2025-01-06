import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function inspectDatabase() {
  try {
    console.log("🔍 Inspecting database structure...\n");

    // 1. Vérifier la table sites
    console.log("📋 Table sites:");
    const { data: sites, error: sitesError } = await supabase
      .from("sites")
      .select("*")
      .eq("domain", "plumber.skaild.com");

    if (sitesError) throw sitesError;
    console.log(JSON.stringify(sites, null, 2));

    // 2. Vérifier toutes les tables indépendamment
    const tables = [
      "services",
      "features",
      "generated_images",
      "business_profiles",
    ];

    for (const table of tables) {
      console.log(`\n📋 Table ${table}:`);
      const { data, error } = await supabase.from(table).select("*").limit(5);

      if (error) {
        console.log(`❌ Error accessing ${table}:`, error.message);
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

inspectDatabase();
