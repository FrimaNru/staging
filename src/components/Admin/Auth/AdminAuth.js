import styles from "@/styles/Admin.module.css";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiConfig";
import { useRouter } from "next/router";

export function AdminAuth() {

    const toast = useToast();
    const router = useRouter();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    function auth() {
        if (login.length > 0 && password.length > 0) {
            axios.post(`${API_BASE_URL}loginAdmin`, { login, password })
                .then((res) => {
                    localStorage.setItem('tokenAdmin', res.data.token);
                    router.push('/adminpanel?page=dashboard');
                })
                .catch((e) => {
                    console.log(e);
                    if (e?.response?.status === 400) toast({ position: 'bottom-right', render: () => (<div className="toast">Неверный пароль</div>), duration: 3000 });
                    if (e?.response?.status === 404) toast({ position: 'bottom-right', render: () => (<div className="toast">Такого пользователя не существует</div>), duration: 3000 });
                });
        } else {
            toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не ввели данные</div>), duration: 3000 });
        }
    };

    return <div className={styles.authBox}>
        <div className={styles.authBlock}>
            <input className={styles.authInput} placeholder="Логин" onChange={(e) => setLogin(e.target.value)} />
            <input className={styles.authInput} placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
            <button className={styles.authButton} onClick={auth}>Войти</button>
        </div>
    </div>
};