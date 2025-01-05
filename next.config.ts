import type { NextConfig } from "next";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const vercelConfig = require("./vercel.json");

const nextConfig: NextConfig = {
  env: {
    ...vercelConfig.env,
  },
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
