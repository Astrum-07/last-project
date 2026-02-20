import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Agar bor bo'lsa, buni false qilib turing
  experimental: {
    // reactCompiler: true bo'lsa, o'chirib turing (hozircha)
  },
  // Server-side xatolarni kamaytirish uchun
  serverExternalPackages: [], 
};

export default nextConfig;