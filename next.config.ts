/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // opcional, só ativa no build
});

const nextConfig = {
  // seu config aqui
};

module.exports = withPWA(nextConfig);
