/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false,

    // Настройки для SEO и пагинации
    async redirects() {
        return [
            // Редиректы со старых адресов категорий на новые
            {
                source: '/catalog',
                has: [
                    {
                        type: 'query',
                        key: 'product',
                        value: 'ring',
                    },
                ],
                destination: '/catalog/kolcza',
                permanent: true, // 301 редирект
            },
            {
                source: '/catalog',
                has: [
                    {
                        type: 'query',
                        key: 'product',
                        value: 'necklace',
                    },
                ],
                destination: '/catalog/kole',
                permanent: true,
            },
            {
                source: '/catalog',
                has: [
                    {
                        type: 'query',
                        key: 'product',
                        value: 'earrings',
                    },
                ],
                destination: '/catalog/sergi',
                permanent: true,
            },
            {
                source: '/catalog',
                has: [
                    {
                        type: 'query',
                        key: 'product',
                        value: 'bracelets',
                    },
                ],
                destination: '/catalog/braslety',
                permanent: true,
            },
        ];
    },

    // rewrites больше не нужны: используем API-роут /api/map_service/service (same-origin proxy)
};

export default nextConfig;
