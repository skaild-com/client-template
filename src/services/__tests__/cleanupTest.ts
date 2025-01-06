import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../../.env.local") });

async function cleanupTest() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    console.log("🔍 Nettoyage complet du site plumber.skaild.com...");

    // 1. Trouver l'ID du site
    const { data: site, error: siteError } = await supabase
      .from("sites")
      .select("id")
      .eq("domain", "plumber.skaild.com")
      .single();

    if (siteError) throw siteError;
    console.log("📍 Site trouvé:", site.id);

    // 2. Supprimer TOUT le contenu lié au site
    const { error: rpcError } = await supabase.rpc("delete_site_content", {
      site_id_input: site.id,
    });

    if (rpcError) throw rpcError;
    console.log("✅ Contenu supprimé");

    // 3. Vérification finale
    const { data: check, error: checkError } = await supabase
      .from("sites")
      .select(
        `
        services (count),
        features (count)
      `
      )
      .eq("id", site.id)
      .single();

    if (checkError) throw checkError;

    const servicesCount = check.services[0].count;
    const featuresCount = check.features[0].count;

    if (servicesCount > 0 || featuresCount > 0) {
      throw new Error(
        `Il reste des données: ${servicesCount} services, ${featuresCount} features`
      );
    }

    console.log("\n✅ Nettoyage réussi !");
  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

// Exécuter le test
cleanupTest();
