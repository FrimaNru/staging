
import { Footer } from "@/components";
import Banner from "@/components/Common/Banner/Banner";
import Header from "@/components/Header/Header";
import PopularBlock from "@/components/PopularBlock/PopularBlock";
import HomeIntro from "@/components/Home/HomeIntro";
import HomeDetails from "@/components/Home/HomeDetails";
import StartBlock from "@/components/StartBlock/StartBlock";
import Head from "next/head";
import axios from "axios";
import { API_BASE_URL } from "../../apiConfig";

export default function Home({ startBlockData, popularProducts }) {
  return (
    <>
      <Head>
        <title>Элитная бижутерия класса люкс – купить в Москве в интернет-магазине Mi Alegria</title>
        <meta name="description" content='Купить брендовую бижутерию в Москве – цены в интернет-магазине Mi Alegria ✔ Доставка и гарантия на все ювелирные изделия ✔Элитная бижутерия класса люкс для создания неповторимого образа' />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="57x57" href="/faviconsWithBg.ico/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/faviconsWithBg.ico/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/faviconsWithBg.ico/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/faviconsWithBg.ico/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/faviconsWithBg.ico/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/faviconsWithBg.ico/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/faviconsWithBg.ico/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/faviconsWithBg.ico/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/faviconsWithBg.ico/apple-icon-180x180.png" />

        <link rel="icon" type="image/png" sizes="192x192" href="/faviconsNoBg/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/faviconsNoBg/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/faviconsNoBg/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/faviconsNoBg/favicon-16x16.png" />
        <link rel="manifest" href="/faviconsNoBg/manifest.json" />

        <meta name="msapplication-TileColor" content="#EEEEEE" />
        <meta name="msapplication-TileImage" content="/faviconsNoBg/ms-icon-144x144.png" />
        <meta name="theme-color" content="#EEEEEE" />
        <meta name="yandex-verification" content="4dbde89ff58f9bab" />
      </Head>
      <center>
        <main className="mainPage">
          <Header />
          <Banner />
          <StartBlock initialData={startBlockData} />
          <HomeIntro />
          <PopularBlock initialData={popularProducts} />
          <HomeDetails />
          <Footer />
        </main>
      </center>
    </> 
  );
}

export async function getServerSideProps() {
  try {
    const [startRes, popularRes] = await Promise.allSettled([
      axios.get(`${API_BASE_URL}mainPage/start`),
      axios.get(`${API_BASE_URL}getPopularProducts`),
    ]);
    return {
      props: {
        startBlockData: startRes.status === 'fulfilled' ? (startRes.value.data || {}) : {},
        popularProducts: popularRes.status === 'fulfilled' ? (popularRes.value.data || []) : [],
      },
    };
  } catch (error) {
    console.error('Ошибка при загрузке данных главной страницы:', error.message);
    return {
      props: {
        startBlockData: {},
        popularProducts: [],
      },
    };
  }
}
