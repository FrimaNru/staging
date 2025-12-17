import { Footer } from "@/components";
import Catalog from "@/components/Catalog/Catalog";
import Header from "@/components/Header/Header";
import Head from "next/head";
import { getFilteredProducts } from "@/lib/catalogServerUtils";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiConfig";

export default function PodSerebroKole({ products, popularProducts }) {
    return (
        <>
            <Head>
                <title>Колье под серебро – купить украшения бренда Mi Alegria по выгодной цене</title>
                <meta name="description" content="Оригинальные украшения бренда Mi Alegria для вашего неповторимого образа ✔ Колье под серебро дополнит любой стиль и подарит ему особый шик ✔ Оформите заказ на сайте с доставкой в любой город." />
                <meta name="keywords" content="колье под серебро, серебряные колье, колье, бижутерия, Mi Alegria" />
                <link rel="canonical" href="https://mi-alegria.shop/catalog/kole/pod-serebro" />
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
                    <Catalog initialPage={1} initialProducts={products} initialType="Колье" popularProducts={popularProducts} />
                    <Footer />
                </main>
            </center>
        </>
    );
}

export async function getServerSideProps({ query }) {
    const { text, filter } = query;
    const products = await getFilteredProducts({
        subcategoryPath: '/kole/pod-serebro',
        productType: 'necklace',
        text,
        filter
    });

    let popularProducts = [];
    try {
        const popularRes = await axios.get(`${API_BASE_URL}getPopularProducts`);
        popularProducts = popularRes.data || [];
    } catch (e) {
        console.error('Ошибка при загрузке популярных товаров:', e.message);
    }

    return {
        props: {
            products,
            popularProducts,
        }
    };
}
