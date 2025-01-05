import type { NextConfig } from "next";
import { createRequire } from "module";
import { config } from "dotenv";
import { resolve } from "path";

// Charger .env.local
config({ path: resolve(__dirname, ".env.local") });

const require = createRequire(import.meta.url);
const vercelConfig = require("./vercel.json");

// Filtrer les variables d'environnement autorisées
const allowedEnvVars = {
  OPENAI_API_KEY:
    process.env.OPENAI_API_KEY || vercelConfig.env?.OPENAI_API_KEY,
  FAL_KEY: process.env.FAL_KEY || vercelConfig.env?.FAL_KEY,
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
