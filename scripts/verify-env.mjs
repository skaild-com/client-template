import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const vercelConfig = JSON.parse(
  readFileSync(join(__dirname, "../vercel.json"), "utf8")
);

function verifyEnv() {
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "OPENAI_API_KEY",
  ];

  const env = vercelConfig.env;

  const missingVars = requiredVars.filter((varName) => !env[varName]);

  if (missingVars.length > 0) {
    console.error("❌ Variables manquantes dans vercel.json:");
    missingVars.forEach((varName) => console.error(`   - ${varName}`));
    process.exit(1);
  }

  console.log("✅ Configuration vérifiée avec succès");
  console.log("Variables trouvées:", {
    NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL ? "✓" : "✗",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? "✓"
      : "✗",
    OPENAI_API_KEY: env.OPENAI_API_KEY ? "✓" : "✗",
  });
}

verifyEnv();
