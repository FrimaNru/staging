import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" translate="no">
      <Head>
        <meta name="google" content="notranslate" />
        <script src="https://api-maps.yandex.ru/2.1/?apikey=612fd896-95e5-4772-87af-2f37b484fde1&lang=ru_RU" type="text/javascript">
        </script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
