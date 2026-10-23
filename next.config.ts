import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingIncludes: {
    "/cards": ["./data/kanji/*.json", "./data/kanji/README.md"],
    "/cards/*": ["./data/kanji/*.json", "./data/kanji/README.md"],
  },
};

export default nextConfig;
