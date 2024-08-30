
import { Bag, Footer, Header } from "@/components";
import Head from "next/head";

export default function BrandPage() {
    return (
        <>
            <Head>
                <title>Корзина MiAlegria - ваш путь к уникальным ювелирным изделиям с историей и ценностями.</title>
                <meta name="description" content='Добро пожаловать в нашу корзину MiAlegria, где каждая покупка становится шагом к уникальному украшению, созданному с любовью и мастерством. Узнайте, как мы отбираем только лучшие ювелирные изделия, отражающие нашу миссию создавать красоту и стиль. Присоединяйтесь к нашей истории и откройте для себя ценности, которые стоят за каждой моделью.' />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="./favicon.ico" />
            </Head>
            <center>
                <main>
                    <Header />
                    <Bag />
                    <Footer />
                </main>
            </center>
        </>
    );
}
