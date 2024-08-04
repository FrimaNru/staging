import { Button } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Delivery() {

    const router = useRouter();

    return (
        <>
            <Head>
                <title>Личный кабинет</title>
                <meta name="description" content='' />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="./favicon.ico" />
            </Head>
            <center>
                <main>
                    <p>Личный кабинет</p>
                    <Button onClick={() => {
                        localStorage.removeItem('token');
                        router.push('/');
                    }} >Выйти</Button>
                </main>
            </center>
        </>
    );
}
