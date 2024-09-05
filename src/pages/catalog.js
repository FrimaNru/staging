
import { Catalog, Footer, Header } from "@/components";
import Head from "next/head";

export default function Delivery() {
    return (
        <>
            <Head>
                <title>Каталог Ювелирных Изделий – Mi Alegria</title>
                <meta name="description" content='Откройте для себя наш каталог ювелирных изделий: золотые и серебряные кольца, серьги, браслеты и подвески. Найдите идеальное украшение на любой случай!' />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="./favicon.ico" />
            </Head>
            <center>
                <main>
                    <Header />
                    <Catalog />
                    <Footer />
                </main>
            </center>
        </>
    );
}
