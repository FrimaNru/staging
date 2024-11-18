import styles from "@/styles/Product.module.css";
import { AuthModal } from "@/components";
import { useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useFavourite } from "@/contexts/FavouriteContext";

export function FavouriteButton({ idProduct, size, color, article }) {

    const { onClose, isOpen, onOpen } = useDisclosure();
    const [heart, setHeart] = useState(false);
    const router = useRouter();
    const { id } = router.query;
    const toast = useToast();
    const { addToFavourite, removeLastFromFavourite } = useFavourite();

    useEffect(() => {
        if (localStorage.getItem('token')) load();
    }, [idProduct]);

    function load() {
        axios.get(`${API_BASE_URL}getUser`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then((res) => {
                res.data.favourite.forEach(x => {
                    if (x === id) {
                        setHeart(true);
                    }
                });
            })
            .catch((e) => {
                console.log(e);
                if (e?.response?.status === 404 || e?.response?.status === 401) {
                    localStorage.removeItem('token');
                    toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не авторизованы</div>), duration: 3000 });
                };
            });
    };

    function fav() {
        if (localStorage.getItem('token')) {
            axios.post(`${API_BASE_URL}addFavourite`, { id: idProduct, size, article, color }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
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
            ? <img src='/favIconSelect.svg' className={styles.infoFavIcon} onClick={() => fav()} />
            : <img src='/favIcon.svg' className={styles.infoFavIcon} onClick={() => fav()} />}
        <AuthModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
}