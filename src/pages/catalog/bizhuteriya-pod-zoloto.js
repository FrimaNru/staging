import { Footer } from "@/components";
import Catalog from "@/components/Catalog/Catalog";
import Header from "@/components/Header/Header";
import Head from "next/head";
import { getFilteredProducts } from "@/lib/catalogServerUtils";

export default function GoldJewelryPage({ products }) {
    return (
        <>
            <Head>
                <title>Бижутерия под золото – купить, цена в интернет-магазине в Mi Alegria</title>
                <meta name="description" content="Купить элитную бижутерию под золото в Москве в интернет-магазине Mi Alegria ✔ Украшения премиум-класса для твоего неповторимого образа ✔ Кольца, колье, серьги и браслеты актуального дизайна в высоком качестве исполнения." />
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
                    <Catalog initialPage={1} initialProducts={products} h1Title="БИЖУТЕРИЯ ПОД ЗОЛОТО" />
                    <Footer />
                </main>
            </center>
        </>
    );
}

export async function getServerSideProps({ query }) {
    const { text, filter } = query;
    const products = await getFilteredProducts({
        subcategoryPath: '/bizhuteriya-pod-zoloto',
        productType: null,
        color: 'gold',
        text,
        filter
    });

    return {
        props: {
            products
        }
    };
}

