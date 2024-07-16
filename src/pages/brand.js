
import { Brand, Footer, Header } from "@/components";
import Head from "next/head";

export default function BrandPage() {
    return (
        <>
            <Head>
                <title>О бренде</title>
                <meta name="description" content='' />
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
