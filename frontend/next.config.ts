import type { NextConfig } from "next";

const isDockerBuild = process.env.DOCKER_BUILD === "true";

const nextConfig: NextConfig = {
  ...(isDockerBuild ? { output: "standalone" } : {}),
  experimental: {
    useTypeScriptCli: false,
  },
};

export default nextConfig;
