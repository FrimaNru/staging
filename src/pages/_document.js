import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" translate="no">
      <Head>
        <meta name="google" content="notranslate" />
        <script src="https://widget.cdek.ru/widget/widjet.js" type="text/javascript"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
