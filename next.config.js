/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['localhost'],
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '',
          pathname: '/recipeshare-app-1/assets/images/**',
        },
      ],
    },
  }
  
  module.exports = nextConfig