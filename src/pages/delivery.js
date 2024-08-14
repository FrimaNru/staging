
import { DeliveryPage, Footer, Header } from "@/components";
import Head from "next/head";

export default function Delivery() {
    return (
        <>
            <Head>
                <title>Доставка Ювелирных Изделий – MiAlegria</title>
                <meta name="description" content='Узнайте о наших условиях доставки. MiAlegria предлагает быструю и бесплатную доставку ювелирных изделий по всей России.' />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="./favicon.ico" />
            </Head>
            <center>
                <main>
                    <Header />
                    <DeliveryPage />
                    <Footer />
                </main>
            </center>
        </>
    );
}
