import styles from "@/styles/Product.module.css";
import { AuthModal } from "@/components";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function FavouriteButton({ idProduct }) {

    const { onClose, isOpen, onOpen } = useDisclosure();
    const [heart, setHeart] = useState(false);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (localStorage.getItem('token')) load();
    }, []);

    function load() {
        axios.get(`${API_BASE_URL}getUser`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then((res) => {
                res.data.favourite.forEach(x => {
                    if (x === id) {
                        setHeart(true);
                    }
                })
            })
            .catch((e) => console.log(e));
    };

    function fav() {
        if (localStorage.getItem('token')) {
            axios.post(`${API_BASE_URL}addFavourite`, { id: idProduct }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
                .then((res) => {
                    if (res.data.heart === false) {
                        setHeart(false);
                    } else {
                        setHeart(true)
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