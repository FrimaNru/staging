import styles from "@/styles/Header.module.css";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiConfig";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";
import DocumentsModal from "@/components/Common/DocumentsModal";

export function SignIn({ setStateAuth, onClose }) {

    const { setUser } = useUser();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [hidePassword, setHidePassword] = useState(true);

    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorUser, setErrorUser] = useState(false);
    const [errorCorrectPassword, setErrorCorrectPassword] = useState(false);

    const [checkBoxes, setCheckBoxes] = useState({ news: false, policy: true });

    const [policy, setPolicy] = useState(false);
    const [personal, setPersonal] = useState(false);
    const [news, setNews] = useState(false);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            signIn(email, password);
        }
    };

    const signIn = (email, password) => {
        if (email.length > 0 && password.length > 0 && checkBoxes.policy) {
            setIsLoading(true);
            axios
                .post(`${API_BASE_URL}login`, { email, password, mailing: checkBoxes.policy ? 'E-mail' : '' })
                .then((res) => {
                    setIsLoading(false);
                    localStorage.setItem('token', res.data.token);
                    setUser(res.data.data);
                    if (window.location.href.includes('product?id=') || window.location.href.includes('catalog')) {
                        onClose();
                    } else router.push('/cabinet?page=personaldata');
                })
                .catch((e) => {
                    console.log(e);
                    setIsLoading(false);
                    if (e?.response?.status === 404) return setErrorUser(true);
                    if (e?.response?.status === 400) return setErrorCorrectPassword(true);
                });
        } else {
            if (email.length === 0) setErrorEmail(true);
            if (password.length === 0) setErrorPassword(true);
        }
    };

    return <div className={styles.modalSignUp}>
        <div className={styles.mainColumn}>
            <div className={styles.headerModal} >
                <div className={styles.headerModalLine}>
                    <p className={styles.headerModalTitle}>ВХОД</p>
                    <img src='/modalCross.svg' className={styles.cross} onClick={() => onClose()} />
                    <img src='/crossMobile.svg' className={styles.crossMobile} onClick={() => onClose()} />
                </div>
                <hr className={styles.modalHr} />
            </div>
            <div className={styles.columnContent}>
                <div className={styles.inputColumn}>
                    {(!errorEmail && !errorUser)
                        ? <p className={styles.inputTitle} style={{ textAlign: 'left' }} >E-mail</p>
                        : errorEmail ? <p className={`${styles.inputTitle} ${styles.errorText}`} style={{ textAlign: 'left' }} >Введите e-mail</p>
                            : errorUser && <p className={`${styles.inputTitle} ${styles.errorText}`} style={{ textAlign: 'left' }} >Неверный логин</p>}
                    <input onKeyDown={handleKeyDown} className={styles.input} onChange={(e) => { setEmail(e.target.value); setErrorEmail(false); setErrorUser(false); }} value={email} />
                </div>
                <div className={styles.inputColumn}>
                    {(!errorPassword && !errorCorrectPassword)
                        ? <p className={styles.inputTitle} style={{ textAlign: 'left' }} >Пароль</p>
                        : errorPassword
                            ? <p className={`${styles.inputTitle} ${styles.errorText}`} style={{ textAlign: 'left' }} >Введите пароль</p>
                            : errorCorrectPassword && <p className={`${styles.inputTitle} ${styles.errorText}`} style={{ textAlign: 'left' }} >Неверный пароль</p>}
                    <div className={styles.inputIconLine} >
                        <input onKeyDown={handleKeyDown} className={styles.input} type={hidePassword ? 'password' : 'text'} onChange={(e) => { setPassword(e.target.value); setErrorPassword(false); setErrorCorrectPassword(false); }} value={password} />
                        <>
                            {hidePassword
                                ? <img src='/showIcon.svg' className={styles.inputIcon} onClick={() => setHidePassword(false)} />
                                : <img src='/hideIcon.svg' className={styles.inputIcon} onClick={() => setHidePassword(true)} />}
                        </>
                    </div>
                </div>
                <div className={styles.lilColumn} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }} >
                    <button
                        className={`${styles.mainButtonBlack} ${isLoading && styles.loading} ${!checkBoxes.policy && styles.noPolicy}`}
                        onClick={() => { if (!checkBoxes.policy) return; signIn(email, password) }}
                    >ВОЙТИ</button>
                    <p className={styles.forgotPassword} style={{ width: 'max-content' }} onClick={() => setStateAuth('refresh')}>Забыли пароль?</p>
                </div>
            </div>
        </div>
        <div className={styles.checkBoxLine}>
            {checkBoxes.news
                ? <img src='/checkbox.svg' style={{ cursor: 'pointer' }} onClick={() => setCheckBoxes({ ...checkBoxes, news: false })} />
                : <img src='/emptyCheckbox.svg' style={{ cursor: 'pointer' }} onClick={() => setCheckBoxes({ ...checkBoxes, news: true })} />}
            <p className={styles.checkBoxText}>Я хочу получать <span className={styles.checkBoxSpan}>сообщения о новостях, акциях и персональные рекомендации</span></p>
        </div>
        <div className={styles.checkBoxLine}>
            {checkBoxes.policy
                ? <img src='/checkbox.svg' style={{ cursor: 'pointer' }} onClick={() => setCheckBoxes({ ...checkBoxes, policy: false })} />
                : <img src='/emptyCheckbox.svg' style={{ cursor: 'pointer' }} onClick={() => setCheckBoxes({ ...checkBoxes, policy: true })} />}
            <p className={styles.checkBoxText}>Я подтверждаю свое согласие с условиями доставки и оплаты, <span className={styles.checkBoxSpan} onClick={() => setPolicy(true)} >политикой конфиденциальности</span> и даю <span className={styles.checkBoxSpan}>согласие на обработку персональных данных</span></p>
        </div>
        <div className={styles.lilColumnSignUp}>
            <p className={styles.inputTitle}>Еще нет аккаунта?</p>
            <button className={styles.mainButton} onClick={() => setStateAuth('signUp')}>ЗАРЕГИСТРИРОВАТЬСЯ</button>
        </div>
        <DocumentsModal policy={policy} setPolicy={setPolicy} personal={personal} setPersonal={setPersonal} news={news} setNews={setNews} />
    </div>
}