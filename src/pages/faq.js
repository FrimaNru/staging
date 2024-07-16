
import { Faq, Footer, Header } from "@/components";
import Head from "next/head";

export default function FaqPage() {
    return (
        <>
            <Head>
                <title>Частые вопросы</title>
                <meta name="description" content='' />
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
