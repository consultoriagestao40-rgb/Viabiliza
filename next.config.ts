import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Force the production URL for NextAuth to match Google Console
    NEXTAUTH_URL: process.env.NODE_ENV === 'production'
      ? 'https://viabilizaincorporadora.com.br'
      : 'http://localhost:3000',
  },
};

export default nextConfig;
