/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['crests.football-data.org', 'media.api-sports.io'],
  },
  env: {
    FOOTBALL_DATA_API_KEY: process.env.FOOTBALL_DATA_API_KEY,
  },
}

module.exports = nextConfig
