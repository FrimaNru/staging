import { Footer } from "@/components";
import Catalog from "@/components/Catalog/Catalog";
import Header from "@/components/Header/Header";
import Head from "next/head";

export default function PodSerebroKolcza() {
    return (
        <>
            <Head>
                <title>Кольца под серебро – купить бижутерию в интернет-магазине Mi Alegria</title>
                <meta name="description" content="Купить кольцо под серебро - премиальная бижутерия в Москве в интернет-магазине Mi Alegria ✔ Уникальный дизайн для неповторимого образа ✔ Заказать кольцо под серебро и другие украшения можно на нашем сайте" />
                <meta name="keywords" content="кольца под серебро, серебряные кольца, кольца, бижутерия, Mi Alegria" />
                <link rel="canonical" href="https://mi-alegria.shop/catalog/kolcza/pod-serebro" />
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
                    <Catalog initialPage={1} />
                    <Footer />
                </main>
            </center>
        </>
    );
}
