import { Footer } from "@/components";
import Catalog from "@/components/Catalog/Catalog";
import Header from "@/components/Header/Header";
import Head from "next/head";
import { useRouter } from "next/router";
import { getCanonicalUrl } from "@/lib/seo";

export default function CatalogPage() {
    const router = useRouter();
    const { page } = router.query;
    const currentPage = parseInt(page) || 1;

    
    const canonicalUrl = getCanonicalUrl('/catalog');

    return (
        <>
            <Head>
                <title>Каталог Ювелирных Изделий – Mi Alegria</title>
                <meta name="description" content='Откройте для себя наш каталог ювелирных изделий: золотые и серебряные кольца, серьги, браслеты и подвески. Найдите идеальное украшение на любой случай!' />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                
                    
                <link rel="canonical" href={canonicalUrl} />
                
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
            </Head>
            <center>
                <main>
                    <Header />
                    <Catalog initialPage={currentPage} />
                    <Footer />
                </main>
            </center>
        </>
    );
}


export async function getStaticPaths() {
    
    const paths = [];
    
    for (let i = 2; i <= 10; i++) {
        paths.push({
            params: { page: i.toString() }
        });
    }
    
    return {
        paths,
        fallback: 'blocking' 
    };
}

export async function getStaticProps({ params }) {
    return {
        props: {
            page: params.page
        },
        revalidate: 60 
    };
}
