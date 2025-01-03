import type { NextConfig } from "next";
import vercelConfig from "./vercel.json" assert { type: "json" };

const nextConfig: NextConfig = {
  env: vercelConfig.env,
};

export default nextConfig;
