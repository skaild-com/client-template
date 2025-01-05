import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Charger les variables d'environnement
config({ path: resolve(__dirname, "../../../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    console.log("🔍 Testing Supabase connection...");

    // Récupérer la structure complète
    const { data: sites, error: sitesError } = await supabase
      .from("sites")
      .select("*, business_profiles(*)");

    if (sitesError) throw sitesError;

    // Afficher la structure exacte pour chaque site
    sites.forEach((site, index) => {
      console.log(`\n🌐 Site ${index + 1}:`, {
        id: site.id,
        domain: site.domain,
        content: site.content,
      });
    });
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Exécuter le test
testSupabaseConnection();
