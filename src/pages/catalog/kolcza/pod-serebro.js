import Head from 'next/head';
import Catalog from '../../../components/Catalog/Catalog';

export default function PodSerebroKolcza() {
    return (
        <>
            <Head>
                <title>Кольца под серебро – купить бижутерию в интернет-магазине Mi Alegria</title>
                <meta name="description" content="Купить кольцо под серебро - премиальная бижутерия в Москве в интернет-магазине Mi Alegria ✔ Уникальный дизайн для неповторимого образа ✔ Заказать кольцо под серебро и другие украшения можно на нашем сайте" />
                <meta name="keywords" content="кольца под серебро, серебряные кольца, кольца, бижутерия, Mi Alegria" />
                <link rel="canonical" href="https://mi-alegria.shop/catalog/kolcza/pod-serebro" />
            </Head>
            <Catalog initialPage={1} />
        </>
    );
}
