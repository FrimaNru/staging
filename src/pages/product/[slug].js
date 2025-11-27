import { Footer } from "@/components";
import Head from "next/head";
import PopularBlock from "@/components/PopularBlock/PopularBlock";
import Header from "@/components/Header/Header";
import { PRODUCT_TYPES } from "@/constants/items";
import Product from "@/components/Product/Product";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import { buildProductSlug } from "@/lib/seo";

export default function ProductPageBySlug({ product }) {
    if (!product) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>Товар не найден</h1>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{[PRODUCT_TYPES[product.type] || 'Украшение', product.name || '', '– цена, купить в Mi Alegria'].filter(Boolean).join(' ')}</title>
                <meta
                    name="description"
                    content={`Каталог премиальной бижутерии Mi Alegria. ${[PRODUCT_TYPES[product.type] || 'Украшение', product.name || '', '– цена, купить в Mi Alegria'].filter(Boolean).join(' ')}. ✔ Высокое качество, эксклюзивный дизайн ✔ Бесплатная доставка и гарантия на все ювелирные изделия.`}
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

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
                    <Product product={product} />
                    <PopularBlock />
                    <Footer />
                </main>
            </center>
        </>
    );
}

export async function getServerSideProps({ params, res }) {
    const { slug } = params;

    if (!slug) {
        return { notFound: true };
    }

    try {
        // Загружаем все продукты для поиска по slug
        const response = await axios.get(`${API_BASE_URL}getProducts`);
        const products = response.data;

        if (!Array.isArray(products)) {
            return { notFound: true };
        }

        // Ищем продукт по slug
        const product = products.find((p) => buildProductSlug(p) === slug);

        if (!product || !product._id) {
            return { notFound: true };
        }

        return {
            props: {
                product,
            },
        };
    } catch (error) {
        console.error('Ошибка при загрузке продукта:', error.message);
        return { notFound: true };
    }
}


