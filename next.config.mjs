/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  
  // Настройки для SEO и пагинации
  async redirects() {
    return [
      // Редирект со старых URL пагинации на новые
      {
        source: '/catalog/:page',
        destination: '/catalog?PAGEN_1=:page',
        permanent: true,
      },
    ];
  },
  
  // Настройки для генерации статических страниц
  async generateStaticParams() {
    return [];
  },
};

export default nextConfig;
