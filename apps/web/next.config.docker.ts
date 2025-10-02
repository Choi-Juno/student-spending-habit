/**
 * Docker 배포용 Next.js 설정
 * 
 * Docker로 빌드할 때 사용:
 * 1. 이 파일을 next.config.ts로 이름 변경
 * 2. docker build 실행
 */

import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;

