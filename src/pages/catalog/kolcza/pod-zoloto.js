import Head from 'next/head';
import Catalog from '../../../components/Catalog/Catalog';

export default function PodZolotoKolcza() {
    return (
        <>
            <Head>
                <title>Кольца под золото – купить бижутерию в интернет-магазине Mi Alegria</title>
                <meta name="description" content="Купить кольцо под золото - элитная бижутерия в Москве в интернет-магазине Mi Alegria ✔ Актуальный дизайн для любого возраста, стиля и случая ✔ Заказать кольцо под золото и другие украшения можно на нашем сайте" />
                <meta name="keywords" content="кольца под золото, золотые кольца, кольца, бижутерия, Mi Alegria" />
                <link rel="canonical" href="https://mi-alegria.shop/catalog/kolcza/pod-zoloto" />
            </Head>
            <Catalog initialPage={1} />
        </>
    );
}
