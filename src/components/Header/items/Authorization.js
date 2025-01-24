import styles from "@/styles/Header.module.css";
import { useDisclosure } from "@chakra-ui/react";
import { AuthModal } from "@/components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";

export function Authorization() {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const { user } = useUser();

    function auth() {
        if (localStorage.getItem('token')) {
            router.push('/cabinet?page=personaldata');
        } else {
            onOpen();
        }
    };

    return <>
        <img src={user ? '/userIconFill.svg' : '/userIcon.svg'} className={styles.icon} onClick={auth} />
        <AuthModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
}