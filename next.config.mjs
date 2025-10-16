/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false,

    // Настройки для SEO и пагинации
    async redirects() {
        return [];
    },

    // Настройки для генерации статических страниц
    async generateStaticParams() {
        return [];
    },
};

export default nextConfig;
