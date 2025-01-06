import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function inspectSupabaseStructure() {
  try {
    console.log("🔍 Vérification de l'état du site plumber.skaild.com...\n");

    const { data: site, error } = await supabase
      .from("sites")
      .select(
        `
        *,
        business_profiles (*),
        services (*),
        features (*)
      `
      )
      .eq("domain", "plumber.skaild.com")
      .single();

    if (error) throw error;

    console.log("État actuel du site:");
    console.log("-------------------");
    console.log("🎯 Content Generated:", site.content_generated);
    console.log("📄 Status:", site.status);
    console.log("🏢 Business Profile:", site.business_profiles?.name);
    console.log("\n📊 Contenu:");
    console.log("Content:", site.content);
    console.log("\n🛠 Services:", site.services?.length || 0, "services");
    console.log("✨ Features:", site.features?.length || 0, "features");
  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

inspectSupabaseStructure();
