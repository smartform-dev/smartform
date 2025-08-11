
/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false, // Prevents automatic trailing slash redirects
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '*',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/ads.txt',
  //       destination: 'https://srv.adstxtmanager.com/19390/ndisfinder.com',
  //       permanent: true,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;