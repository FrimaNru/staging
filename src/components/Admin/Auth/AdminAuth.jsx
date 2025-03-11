import styles from "@/styles/Admin/Admin.module.css";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiConfig";
import { useRouter } from "next/router";
import Input from "@/ui/Inputs/Input/Input";
import Button from "@/ui/Button/Button";
import Link from "next/link";

export default function AdminAuth() {

    const toast = useToast();
    const router = useRouter();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [disabled, setDisabled] = useState(false);

    const auth = async () => {
        if (login.length > 0 && password.length > 0) {
            setDisabled(true);
            try {
                const res = await axios.post(`${API_BASE_URL}loginAdmin`, { login, password });
                localStorage.setItem('tokenAdmin', res.data.token);
                router.push('/adminpanel?page=users');
            } catch (error) {
                console.log(error);
                if (error?.response?.status === 400) toast({ position: 'bottom-right', render: () => (<div className="toast">Неверный пароль</div>), duration: 3000 });
                if (error?.response?.status === 404) toast({ position: 'bottom-right', render: () => (<div className="toast">Такого пользователя не существует</div>), duration: 3000 });
            } finally {
                setDisabled(false);
            }
        } else {
            toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не ввели данные</div>), duration: 3000 });
        };
    };

    return <div className={styles.authBox}>
        <Link href='/' className={styles.authLogoLink} >
            <img src='/logo.svg' className={styles.authLogo} />
        </Link>
        <div className={styles.authBlock}>
            <p className={styles.authTitle}>Вход</p>
            <div className={styles.authInputColumn}>
                <Input
                    placeholder="Логин"
                    onChange={(e) => setLogin(e.target.value)}
                    value={login}
                    size="big"
                />
                <Input
                    placeholder="Пароль"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type='password'
                    size="big"
                />
            </div>
            <Button onClick={auth} disabled={disabled}>Войти</Button>
        </div>
        <p className={styles.authUserDisclaimer}>Уважаемый пользователь, данная страница предусмотрена только администрации сайта, просим <span className={styles.authUserDisclaimerSpan}><Link href='/'>вернуться</Link></span> вас на главную страницу</p>
    </div>
};