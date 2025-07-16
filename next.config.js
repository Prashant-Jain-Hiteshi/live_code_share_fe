// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
    // TODO: Consider enabling modularizeImports for material when https://github.com/mui/material-ui/issues/36218 is resolved
    // '@mui/material': {
    //   transform: '@mui/material/{{member}}',
    // },
  },
  env: {
    // COOKIE_EXPIRATION_TIME: "86400000",
  },
  reactStrictMode: false,
  images: {
    domains:
      process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
        ? ["peoprdsta.blob.core.windows.net"]
        : ["peodevsta.blob.core.windows.net"],
  },
};

module.exports = nextConfig;
