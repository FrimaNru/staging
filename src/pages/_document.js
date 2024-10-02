import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" translate="no">
      <Head>
        <meta name="google" content="notranslate" />
        <script src="https://api-maps.yandex.ru/2.1/?apikey=a2ab5825-bf63-4a48-b7dc-c03fd2fe6ebf&lang=ru_RU" type="text/javascript">
        </script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
