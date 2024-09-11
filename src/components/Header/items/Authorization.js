import styles from "@/styles/Header.module.css";
import { useDisclosure } from "@chakra-ui/react";
import { AuthModal } from "@/components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function Authorization() {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('token')) setIsAuth(true);
    }, []);

    function auth() {
        if (localStorage.getItem('token')) {
            router.push('/cabinet?page=personaldata');
        } else {
            onOpen();
        }
    };

    return <>
        <img src={isAuth ? '/userIconFill.svg' : '/userIcon.svg'} className={styles.icon} onClick={auth} />
        <AuthModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
}