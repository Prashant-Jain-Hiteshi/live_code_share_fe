// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
  env: {},
  reactStrictMode: false,
  images: {
    domains:
      process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
        ? ["peoprdsta.blob.core.windows.net"]
        : ["peodevsta.blob.core.windows.net"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
