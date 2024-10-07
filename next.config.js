/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['localhost', '192.168.0.108'],
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '',
          pathname: '/recipewebv3/assets/images/**',
        },
      ],
    },
  }
  
  module.exports = nextConfig