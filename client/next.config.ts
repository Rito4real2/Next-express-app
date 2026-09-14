import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Vercel includes the server folder in the deployed serverless bundle
  outputFileTracingIncludes: {
    "/api/**/*": ["../server/**/*"],
  },
  // serverExternalPackages: [
  //   "express",
  //   "mongoose",
  //   "cors",
  //   "cookie-parser",
  //   "bcryptjs",
  //   "jsonwebtoken",
  //   "dotenv",
  // ],
};

export default nextConfig;