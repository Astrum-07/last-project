import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compiler-ni butunlay o'chirib turing
  reactCompiler: false,
  // Turbopack-da ba'zi muammolar bo'lishi mumkin, webpack-ga qaytib ko'rish variant
};

export default nextConfig;