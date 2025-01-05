import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../../.env.local") });

async function cleanupTest() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  console.log("🧹 Nettoyage du contenu pour plumber.skaild.com...");

  const { error } = await supabase
    .from("sites")
    .update({ content: null })
    .eq("domain", "plumber.skaild.com");

  if (error) {
    console.error("❌ Erreur:", error);
  } else {
    console.log("✅ Contenu nettoyé avec succès");
  }
}

cleanupTest();
