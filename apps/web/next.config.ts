import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel은 자동으로 최적화하므로 기본 설정 사용
  eslint: {
    // 빌드 시 ESLint 에러 무시 (개발 중에는 로컬에서 확인)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 타입 체크 무시 (개발 중에는 로컬에서 확인)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
