import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  serverExternalPackages: ["pino", "pino-pretty"],
  output: "standalone",
};

export default nextConfig;
