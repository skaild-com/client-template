import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const vercelConfig = require("../vercel.json");
const __dirname = fileURLToPath(new URL(".", import.meta.url));

function loadEnvFile() {
  let env = {};

  // Vérifier d'abord vercel.json
  if (vercelConfig.env) {
    env = { ...vercelConfig.env };
  }

  // Vérifier ensuite .env.local
  const envPath = join(__dirname, "../.env.local");
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, "utf8");
    const localEnv = Object.fromEntries(
      envContent
        .split("\n")
        .filter((line) => line && !line.startsWith("#"))
        .map((line) => line.split("="))
    );

    // Fusionner avec priorité pour .env.local
    env = { ...env, ...localEnv };
  }

  return env;
}

function verifyEnv() {
  const env = loadEnvFile();
  const missingKeys = [];

  if (!env.OPENAI_API_KEY) {
    missingKeys.push("OPENAI_API_KEY");
  }
  if (!env.FAL_KEY) {
    missingKeys.push("FAL_KEY");
  }

  if (missingKeys.length > 0) {
    console.error(
      `❌ Missing environment variables: ${missingKeys.join(", ")}`
    );
    console.error("Please check both vercel.json and .env.local files");
    process.exit(1);
  }

  console.log("✅ Environment variables verified successfully");
}

verifyEnv();
