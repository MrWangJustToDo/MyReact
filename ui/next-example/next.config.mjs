import withNext from "@my-react/react-refresh-tools/withNext";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    reactCompiler: {
      target: "18",
    }, // or React Compiler options
  },
};

const nextConfig = withNext(config);

// export default config;

export default nextConfig;
