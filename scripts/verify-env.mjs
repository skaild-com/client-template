import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function loadEnvFile() {
  const envPath = join(__dirname, "../.env.local");
  if (!existsSync(envPath)) {
    console.error("❌ Fichier .env.local manquant");
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
  // Vérifier la clé OpenAI dans .env.local
  const env = loadEnvFile();
  if (!env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY manquante dans .env.local");
    process.exit(1);
  }

  console.log("✅ Configuration vérifiée avec succès");
}

verifyEnv();
