import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/Header/Header';
import { Footer } from '@/components';
import styles from "@/styles/404.module.css";

export default function NotFoundPage() {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Mi Alegria</title>
                <meta name="description" content='Добро пожаловать в Mi Alegria! Широкий выбор эксклюзивных ювелирных украшений: кольца, серьги, браслеты и подвески. Бесплатная доставка по России.' />
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
                    <div className={styles.main}>
                        <div className={styles.column}>
                            <h1 className={styles.title}>Страница не найдена (404)</h1>
                            <p className={styles.subtitle}>К сожалению, запрашиваемая страница не существует.</p>
                        </div>
                        <button className={styles.infoButton} onClick={() => router.push('/')}>На главную</button>
                    </div>
                    <Footer />
                </main>
            </center>
        </>
    );
}