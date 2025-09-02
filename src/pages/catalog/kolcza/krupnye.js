import Head from 'next/head';
import Catalog from '../../../components/Catalog/Catalog';

export default function KrupnyeKolcza() {
    return (
        <>
            <Head>
                <title>Крупные кольца – цена, купить большое кольцо в Mi Alegria</title>
                <meta name="description" content="Большие кольца и другая элитная бижутерия в интернет-магазине Mi Alegria в Москве ✔ Высокое качество, эксклюзивный дизайн ✔ Доставка и гарантия на все ювелирные изделия ✔ Купить крупное кольцо можно на нашем сайте" />
                <meta name="keywords" content="крупные кольца, большие кольца, кольца, бижутерия, Mi Alegria" />
                <link rel="canonical" href="https://mi-alegria.shop/catalog/kolcza/krupnye" />
            </Head>
            <Catalog initialPage={1} />
        </>
    );
}
