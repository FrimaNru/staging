import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@fontsource/tenor-sans';
import '@fontsource/dela-gothic-one';

export default function App({ Component, pageProps }) {
  return <ChakraProvider>
    <Component {...pageProps} />
  </ChakraProvider>
}
