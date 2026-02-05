import withNext from "@my-react/react-refresh-tools/withNext";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  reactCompiler: true,
};

const nextConfig = withNext(config, { turbopackKey: 'turbopack' });

// export default config;

export default nextConfig;
