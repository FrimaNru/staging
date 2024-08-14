
import { Footer, Header, Product, PopularBlock } from "@/components";
import Head from "next/head";

export default function ProductPage() {
    return (
        <>
            <Head>
                <title>Серьги CARAMEL – Купить в MiAlegria</title>
                <meta name="description" content='Серьги CARAMEL от MiAlegria. Высокое качество, эксклюзивный дизайн и выгодные цены. Бесплатная доставка и гарантия на все ювелирные изделия.' />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="./favicon.ico" />
            </Head>
            <center>
                <main>
                    <Header />
                    <Product />
                    <PopularBlock />
                    <Footer />
                </main>
            </center>
        </>
    );
}
