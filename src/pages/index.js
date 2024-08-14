
import { Footer, Header, PopularBlock, StartBlock } from "@/components";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>MiAlegria – Ювелирные Изделия и Украшения Купить Онлайн</title>
        <meta name="description" content='Добро пожаловать в MiAlegria! Широкий выбор эксклюзивных ювелирных украшений: кольца, серьги, браслеты и подвески. Бесплатная доставка по России.' />
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
