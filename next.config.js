/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    typedRoutes: true,
    swcMinify: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "auth.typeflo.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  env: {
    NEXT_SUPABASE_URL: 'https://auth.typeflo.io',
    NEXT_SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICAgInJvbGUiOiAiYW5vbiIsCiAgICAiaXNzIjogInN1cGFiYXNlIiwKICAgICJpYXQiOiAxNjg5NzA1MDAwLAogICAgImV4cCI6IDE4NDc1NTc4MDAKfQ.MnniBE3xXQzPcOmT0QjU2HuIq6qQIanY_kV_T7UoW7E',
    NEXT_SITE: 'typeflo.io',
    NEXT_SITE_NAME: 'typeflo',
    NEXT_URL: 'typeflo',
  },
};

module.exports = nextConfig;