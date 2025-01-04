import type { NextConfig } from "next";
import vercelConfig from "./vercel.json" assert { type: "json" };

const nextConfig: NextConfig = {
  env: {
    ...vercelConfig.env,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};

export default nextConfig;
