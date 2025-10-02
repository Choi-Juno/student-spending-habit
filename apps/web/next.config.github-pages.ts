/**
 * GitHub Pages 배포용 Next.js 설정
 * 
 * 사용 방법:
 * 1. 이 파일을 next.config.ts로 이름 변경
 * 2. basePath를 저장소 이름으로 변경
 * 3. pnpm build 실행
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // GitHub Pages 저장소 이름으로 변경하세요
  basePath: "/student-spending-habit",
  // Trailing slashes
  trailingSlash: true,
};

export default nextConfig;

