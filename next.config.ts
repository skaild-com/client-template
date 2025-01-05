import type { NextConfig } from "next";
import { createRequire } from "module";
import { config } from "dotenv";
import { resolve } from "path";

// Charger .env.local en développement
if (process.env.NODE_ENV !== "production") {
  config({ path: resolve(__dirname, ".env.local") });
}

const require = createRequire(import.meta.url);
const vercelConfig = require("./vercel.json");

// Filtrer les variables d'environnement autorisées
const allowedEnvVars = {
  // OPENAI_API_KEY vient uniquement de process.env
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  // Les autres variables viennent du vercel.json
  FAL_KEY: vercelConfig.env?.FAL_KEY,
  NEXT_PUBLIC_SUPABASE_URL: vercelConfig.env?.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    vercelConfig.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

const nextConfig: NextConfig = {
  env: allowedEnvVars,
  images: {
    domains: ["fal.media", "placehold.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fal.media",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
