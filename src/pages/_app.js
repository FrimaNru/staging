import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@fontsource/tenor-sans";
import "@fontsource/dela-gothic-one";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { FavouriteProvider } from "@/contexts/FavouriteContext";
import { UserProvider } from "@/contexts/UserContext";
import { ProductsProvider } from "@/contexts/ProductsContext";

export default function App({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url) => {
            sessionStorage.setItem("prevPath", window.location.href);
        };

        router.events.on("routeChangeStart", handleRouteChange);
        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, []);

    return (
        <CartProvider>
            <ProductsProvider>
                <UserProvider>
                    <FavouriteProvider>
                        <ChakraProvider>
                            <Component {...pageProps} />
                        </ChakraProvider>
                    </FavouriteProvider>
                </UserProvider>
            </ProductsProvider>
        </CartProvider>
    );
}
