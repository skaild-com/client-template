import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const vercelConfig = require("../vercel.json");
const __dirname = fileURLToPath(new URL(".", import.meta.url));

function loadEnvFile() {
  // Vérifier d'abord vercel.json
  if (vercelConfig.env?.OPENAI_API_KEY) {
    return { OPENAI_API_KEY: vercelConfig.env.OPENAI_API_KEY };
  }

  // Sinon vérifier .env.local
  const envPath = join(__dirname, "../.env.local");
  if (!existsSync(envPath)) {
    console.error("❌ OPENAI_API_KEY manquante dans vercel.json et .env.local");
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
  const env = loadEnvFile();
  if (!env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY manquante");
    process.exit(1);
  }

  console.log("✅ Configuration vérifiée avec succès");
}

verifyEnv();
