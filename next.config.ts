import type { NextConfig } from "next";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const vercelConfig = require("./vercel.json");

const nextConfig: NextConfig = {
  env: {
    ...vercelConfig.env,
  },
};

export default nextConfig;
