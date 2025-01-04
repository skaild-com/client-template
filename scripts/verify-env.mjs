import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function loadEnvFile() {
  const envPath = join(__dirname, "../.env");
  if (!existsSync(envPath)) {
    console.error("❌ Fichier .env manquant");
    console.error("Copiez .env.example vers .env et ajoutez votre clé OpenAI");
    process.exit(1);
  }

  const envContent = readFileSync(envPath, "utf8");
  return Object.fromEntries(
    envContent
      .split("\n")
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => line.split("="))
  );
}

function verifyEnv() {
  // Vérifier la clé OpenAI dans .env
  const env = loadEnvFile();
  if (!env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY manquante dans .env");
    process.exit(1);
  }

  // Vérifier les variables Supabase dans vercel.json
  const vercelConfig = JSON.parse(
    readFileSync(join(__dirname, "../vercel.json"), "utf8")
  );

  const supabaseVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ];

  const missingVars = supabaseVars.filter(
    (varName) => !vercelConfig.env[varName]
  );

  if (missingVars.length > 0) {
    console.error("❌ Variables Supabase manquantes dans vercel.json:");
    missingVars.forEach((varName) => console.error(`   - ${varName}`));
    process.exit(1);
  }

  console.log("✅ Configuration vérifiée avec succès");
}

verifyEnv();
