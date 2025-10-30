/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Si votre repo s'appelle 'droles-de-droits', décommentez la ligne suivante:
  // basePath: '/droles-de-droits',
}

module.exports = nextConfig
