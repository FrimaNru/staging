import { Footer } from "@/components";
import Catalog from "@/components/Catalog/Catalog";
import Header from "@/components/Header/Header";
import Head from "next/head";
import { useRouter } from "next/router";
import { getCanonicalUrl, mapSlugToProductType } from "@/lib/seo";

export default function CatalogBySlug() {
    const router = useRouter();
    const { slug } = router.query;

    const canonicalUrl = getCanonicalUrl(`/catalog/${slug || ''}`);
    const pageFromSlug = Number.isFinite(Number(slug)) ? parseInt(slug) : undefined;

    // Определяем тип изделия по слугу для SEO
    const getSeoData = (slug) => {
        if (!slug) return { title: 'Каталог Ювелирных Изделий – Mi Alegria', description: 'Откройте для себя наш каталог ювелирных изделий: золотые и серебряные кольца, серьги, браслеты и подвески. Найдите идеальное украшение на любой случай!' };
        
        const type = mapSlugToProductType(slug);
        
        switch (type) {
            case 'ring':
                return {
                    title: 'Дизайнерские кольца – купить в интернет-магазине элитной бижутерии Mi Alegria в Москве',
                    description: 'Купить дизайнерские кольца и другую элитную бижутерию класса люкс в Москве в интернет-магазине Mi Alegria ✔ Актуальный дизайн для любого возраста, стиля и случая ✔Закажите необычное кольцо премиального качества на нашем сайте'
                };
            case 'earrings':
                return {
                    title: 'Брендовые серьги – купить элитную бижутерию в Москве, цена в Mi Alegria',
                    description: 'Купить дизайнерские серьги и другую элитную бижутерию класса люкс в Москве в интернет-магазине Mi Alegria ✔ Уникальный дизайн для неповторимого образа ✔Закажите оригинальные серьги и другие премиальные украшения на нашем сайте'
                };
            case 'bracelets':
                return {
                    title: 'Дизайнерские браслеты для женщин – элитная бижутерия Mi Alegria в Москве',
                    description: 'Купить дизайнерский женский браслет – цена в Москве в интернет-магазине Mi Alegria ✔ Доставка и гарантия на все ювелирные изделия ✔Стильные браслеты для женщин и другая элитная бижутерия на нашем сайте'
                };
            case 'necklace':
                return {
                    title: 'Дизайнерские колье – купить элитную бижутерию на шею в Москве в Mi Alegria',
                    description: 'Купить колье и другую премиальную бижутерию в Москве в интернет-магазине Mi Alegria ✔ Уникальные дизайнерские украшения на шею для неповторимого образа ✔Стильные колье с доставкой на нашем сайте'
                };
            default:
                return {
                    title: 'Каталог Ювелирных Изделий – Mi Alegria',
                    description: 'Откройте для себя наш каталог ювелирных изделий: золотые и серебряные кольца, серьги, браслеты и подвески. Найдите идеальное украшение на любой случай!'
                };
        }
    };

    const seoData = getSeoData(slug);

    return (
        <>
            <Head>
                <title>{seoData.title}</title>
                <meta name="description" content={seoData.description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="canonical" href={canonicalUrl} />
                <link rel="apple-touch-icon" sizes="57x57" href="/faviconsWithBg.ico/apple-icon-57x57.png" />
                <link rel="apple-touch-icon" sizes="60x60" href="/faviconsWithBg.ico/apple-icon-60x60.png" />
                <link rel="apple-touch-icon" sizes="72x72" href="/faviconsWithBg.ico/apple-icon-72x72.png" />
                <link rel="apple-touch-icon" sizes="76x76" href="/faviconsWithBg.ico/apple-icon-76x76.png" />
                <link rel="apple-touch-icon" sizes="114x114" href="/faviconsWithBg.ico/apple-icon-114x114.png" />
                <link rel="apple-touch-icon" sizes="120x120" href="/faviconsWithBg.ico/apple-icon-120x120.png" />
                <link rel="apple-touch-icon" sizes="144x144" href="/faviconsWithBg.ico/apple-icon-144x144.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/faviconsWithBg.ico/apple-icon-152x152.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/faviconsWithBg.ico/apple-icon-180x180.png" />
                <link rel="icon" type="image/png" sizes="192x192" href="/faviconsNoBg/android-icon-192x192.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/faviconsNoBg/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="96x96" href="/faviconsNoBg/favicon-96x96.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/faviconsNoBg/favicon-16x16.png" />
                <link rel="manifest" href="/faviconsNoBg/manifest.json" />
                <meta name="msapplication-TileColor" content="#EEEEEE" />
                <meta name="msapplication-TileImage" content="/faviconsNoBg/ms-icon-144x144.png" />
                <meta name="theme-color" content="#EEEEEE" />
            </Head>
            <center>
                <main>
                    <Header />
                    <Catalog initialPage={pageFromSlug || 1} />
                    <Footer />
                </main>
            </center>
        </>
    );
}


