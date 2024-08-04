import styles from "@/styles/Header.module.css";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiConfig";
import { useRouter } from "next/router";

export function SignIn({ setStateAuth, onClose }) {

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [hidePassword, setHidePassword] = useState(true);

    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorUser, setErrorUser] = useState(false);
    const [errorCorrectPassword, setErrorCorrectPassword] = useState(false);

    function signIn() {
        if (email.length > 0 && password.length > 0) {
            axios.post(`${API_BASE_URL}login`, { email, password })
                .then((res) => {
                    localStorage.setItem('token', res.data.token);
                    router.push('/cabinet');
                })
                .catch((e) => {
                    console.log(e);
                    if (e?.response?.status === 404) return setErrorUser(true);
                    if (e?.response?.status === 400) return setErrorCorrectPassword(true);
                });
        } else {
            if (email.length === 0) return setErrorEmail(true);
            if (password.length === 0) return setErrorPassword(true);
        }
    };

    return <div className={styles.modalSignUp}>
        <div className={styles.mainColumn}>
            <div className={styles.headerModal} >
                <div className={styles.headerModalLine}>
                    <p className={styles.headerModalTitle}>ВХОД</p>
                    <img src='/modalCross.svg' className={styles.cross} onClick={() => onClose()} />
                </div>
                <hr className={styles.modalHr} />
            </div>
            <div className={styles.columnContent}>
                <div className={styles.inputColumn}>
                    {(!errorEmail && !errorUser)
                        ? <p className={styles.inputTitle} style={{ textAlign: 'left' }} >E-mail</p>
                        : errorEmail ? <p className={`${styles.inputTitle} ${styles.errorText}`} style={{ textAlign: 'left' }} >Введите e-mail</p>
                            : errorUser && <p className={`${styles.inputTitle} ${styles.errorText}`} style={{ textAlign: 'left' }} >Неверный логин</p>}
                    <input className={styles.input} onChange={(e) => { setEmail(e.target.value); setErrorEmail(false); setErrorUser(false); }} value={email} />
                </div>
                <div className={styles.inputColumn}>
                    {(!errorPassword && !errorCorrectPassword)
                        ? <p className={styles.inputTitle} style={{ textAlign: 'left' }} >Пароль</p>
                        : errorPassword
                            ? <p className={`${styles.inputTitle} ${styles.errorText}`} style={{ textAlign: 'left' }} >Введите пароль</p>
                            : errorCorrectPassword && <p className={`${styles.inputTitle} ${styles.errorText}`} style={{ textAlign: 'left' }} >Неверный пароль</p>}
                    <div className={styles.inputIconLine} >
                        <input className={styles.input} type={hidePassword ? 'password' : 'text'} onChange={(e) => { setPassword(e.target.value); setErrorPassword(false); setErrorCorrectPassword(false); }} value={password} />
                        <>
                            {hidePassword
                                ? <img src='/showIcon.svg' className={styles.inputIcon} onClick={() => setHidePassword(false)} />
                                : <img src='/hideIcon.svg' className={styles.inputIcon} onClick={() => setHidePassword(true)} />}
                        </>
                    </div>
                </div>
                <div className={styles.lilColumn} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }} >
                    <div className={styles.mainButtonBlack} onClick={signIn} >ВОЙТИ</div>
                    <p className={styles.forgotPassword} style={{ width: 'max-content' }} onClick={() => setStateAuth('refresh')}>Забыли пароль?</p>
                </div>
            </div>
        </div>
        <div className={styles.lilColumn} >
            <p className={styles.inputTitle}>Уже есть аккаунта?</p>
            <div className={styles.mainButton} onClick={() => setStateAuth('signUp')} >ЗАРЕГИСТРИРОВАТЬСЯ</div>
        </div>
    </div>
}