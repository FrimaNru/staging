
import { Footer, Header, PopularBlock, StartBlock } from "@/components";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Главная</title>
        <meta name="description" content='' />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <center>
        <main>
          <Header />
          <StartBlock />
          <PopularBlock />
          <Footer />
        </main>
      </center>
    </>
  );
}
