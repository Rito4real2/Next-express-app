import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevents Next.js Webpack from bundling Express server dependencies
  serverExternalPackages: [
    "express",
    "mongoose",
    "cors",
    "cookie-parser",
    "bcryptjs",
    "jsonwebtoken",
    "dotenv"
  ],
};

export default nextConfig;