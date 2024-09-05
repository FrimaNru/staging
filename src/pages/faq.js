
import { Faq, Footer, Header } from "@/components";
import Head from "next/head";

export default function FaqPage() {
    return (
        <>
            <Head>
                <title>Часто Задаваемые Вопросы – Mi Alegria</title>
                <meta name="description" content='Найдите ответы на часто задаваемые вопросы о ювелирных изделиях, заказах и доставке. Мы всегда готовы помочь вам в Mi Alegria!' />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="./favicon.ico" />
            </Head>
            <center>
                <main>
                    <Header />
                    <Faq />
                    <Footer />
                </main>
            </center>
        </>
    );
}
