
import { Brand, Footer, Header } from "@/components";
import Head from "next/head";

export default function BrandPage() {
    return (
        <>
            <Head>
                <title>О Бренде MiAlegria – История и Ценности</title>
                <meta name="description" content='Узнайте больше о бренде MiAlegria: наша история, миссия и ценности. Мы предлагаем только лучшие ювелирные изделия, созданные с любовью и мастерством.' />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="./favicon.ico" />
            </Head>
            <center>
                <main>
                    <Header />
                    <Brand />
                    <Footer />
                </main>
            </center>
        </>
    );
}
