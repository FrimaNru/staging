import { Cabinet, Footer, Header } from "@/components";
import Head from "next/head";

export default function Delivery() {
    return (
        <>
            <Head>
                <title>Личный Кабинет – MiAlegria</title>
                <meta name="description" content='Войдите в личный кабинет MiAlegria, чтобы отслеживать заказы, управлять покупками и получать эксклюзивные предложения. Ваши ювелирные изделия – под контролем!' />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="./favicon.ico" />
            </Head>
            <center>
                <main>
                    <Header />
                    <Cabinet />
                    <Footer />
                </main>
            </center>
        </>
    );
}
