/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tecdn.b-cdn.net",
        port: "",
        pathname: "/img/Photos/Avatars/**",
      },
    ],
  },
};

module.exports = nextConfig;
