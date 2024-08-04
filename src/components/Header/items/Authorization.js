import styles from "@/styles/Header.module.css";
import { useDisclosure } from "@chakra-ui/react";
import { AuthModal } from "@/components";
import { useRouter } from "next/router";

export function Authorization() {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();


    function auth() {
        if (localStorage.getItem('token')) {
            router.push('/cabinet');
        } else {
            onOpen();
        }
    };

    return <>
        <img src='/userIcon.svg' className={styles.icon} onClick={auth} />
        <AuthModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
}