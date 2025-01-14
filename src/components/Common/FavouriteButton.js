import styles from "@/styles/Product/Product.module.css";
import { AuthModal } from "@/components";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useFavourite } from "@/contexts/FavouriteContext";

export function FavouriteButton({ idProduct, size, color, article, type }) {

    const { onClose, isOpen, onOpen } = useDisclosure();
    const [heart, setHeart] = useState(false);
    const router = useRouter();
    const { id } = router.query;
    const { favourite } = useFavourite();
    const { addToFavourite, removeLastFromFavourite } = useFavourite();

    useEffect(() => {
        load();
    }, []);

    function load() {
        const isFavourite = favourite.find(x => x.id === id || x.id === idProduct);
        setHeart(isFavourite);
    };

    function fav() {
        if (localStorage.getItem('token')) {
            axios.post(`${API_BASE_URL}addFavourite`, { id: idProduct, size, article, color }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
                .then((res) => {
                    if (res.data.heart === false) {
                        setHeart(false);
                        removeLastFromFavourite();
                    } else {
                        setHeart(true);
                        addToFavourite({ id: idProduct, size, article, color });
                    }
                })
                .catch((e) => console.log(e));
        } else {
            onOpen();
        }
    };

    return <>
        {heart
            ? <img src='/favIconSelect.svg' className={`${styles.infoFavIcon} ${type === 'small' ? styles.infoFavIconSmall : ''}`} onClick={() => fav()} />
            : <img src='/favIcon.svg' className={`${styles.infoFavIcon} ${type === 'small' ? styles.infoFavIconSmall : ''}`} onClick={() => fav()} />}
        <AuthModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
}