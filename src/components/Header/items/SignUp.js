import styles from "@/styles/Header.module.css";
import axios from "axios";
import { useState } from "react";
import InputMask from 'react-input-mask';
import { API_BASE_URL } from "../../../../apiConfig";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";
import DocumentsModal from "@/components/Common/DocumentsModal";

export function SignUp({ setStateAuth, onClose }) {

    const router = useRouter();
    const { setUser } = useUser();

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [isCodeSend, setIsCodeSend] = useState(false);
    const [time, setTime] = useState(59);
    const [isLoading, setIsLoading] = useState(false);

    const [hidePassword, setHidePassword] = useState(true);

    const [errorEmail, setErrorEmail] = useState(false);
    const [errorCode, setErrorCode] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorUser, setErrorUser] = useState(false);
    const [errorCodeCorrect, setErrorCodeCorrect] = useState(false);

    const [checkBoxes, setCheckBoxes] = useState({ news: true, policy: false });

    const [policy, setPolicy] = useState(false);
    const [personal, setPersonal] = useState(false);
    const [news, setNews] = useState(false);

    function sendCode() {
        if (email.length > 0) {
            axios.post(`${API_BASE_URL}sendCode`, { email })
                .then(() => {
                    setIsCodeSend(true);
                    let nowtime = 59;
                    setTime(nowtime);

                    const timer = setInterval(() => {
                        if (nowtime > 1) {
                            nowtime -= 1;
                            setTime(nowtime);
                        } else {
                            setIsCodeSend(false);
                            clearInterval(timer);
                        }
                    }, 1000);
                })
                .catch(e => console.log(e));
        } else {
            if (email.length === 0) return setErrorEmail(true);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            signUp(email, password, phone);
        }
    };

    function signUp(email, password, phone) {
        if (code.length === 6 && password.length > 0 && phone.length > 0 && checkBoxes.policy) {
            setIsLoading(true);
            axios.post(`${API_BASE_URL}signUp`, { email, code, phone, password, mailing: checkBoxes.policy ? 'E-mail' : '' })
                .then((res) => {
                    setIsLoading(false);
                    localStorage.setItem('token', res.data.token);
                    setUser(res.data.data);
                    if (window.location.href.includes('product?id=') || window.location.href.includes('catalog')) {
                        onClose();
                    } else router.push('/cabinet?page=personaldata');
                })
                .catch((e) => {
                    setIsLoading(false);
                    console.log(e);
                    if (e?.response?.status === 400) return setErrorUser(true);
                    if (e?.response?.status === 401) return setErrorCodeCorrect(true);
                });
        } else {
            if (code.length !== 6) return setErrorCode(true);
            if (phone.length === 0) return setErrorPhone(true);
            if (password.length === 0) return setErrorPassword(true);
        }
    };

    return <div className={styles.modalSignUp}>
        <div className={styles.mainColumn}>
            <div className={styles.headerModal} >
                <div className={styles.headerModalLine}>
                    <p className={styles.headerModalTitle}>РЕГИСТРАЦИЯ</p>
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
                            : errorUser && <p className={`${styles.inputTitle} ${styles.errorText}`} style={{ textAlign: 'left' }} >Этот e-mail уже привязан к аккаунту</p>}
                    <input onKeyDown={handleKeyDown} className={styles.input} onChange={(e) => { setEmail(e.target.value); setErrorEmail(false); setErrorUser(false); }} value={email} />
                </div>
                <div className={styles.inputColumn}>
                    {(!errorCode && !errorCodeCorrect)
                        ? <p className={styles.inputTitle} style={{ textAlign: 'left' }} >Код подтверждения</p>
                        : errorCode
                            ? <p className={`${styles.inputTitle} ${styles.errorText}`} style={{ textAlign: 'left' }} >Введите код из письма</p>
                            : errorCodeCorrect && <p className={`${styles.inputTitle} ${styles.errorText}`} style={{ textAlign: 'left' }} >Неверный код</p>}
                    <div className={styles.inputLine}>
                        <input className={styles.inputLil} type="number" onChange={(e) => { setCode(e.target.value); setErrorCode(false); setErrorCodeCorrect(false); }} value={code} />
                        {!isCodeSend
                            ? <div className={styles.buttonCode} onClick={sendCode}>ОТПРАВИТЬ ПИСЬМО</div>
                            : <div className={styles.buttonTimer}>0:{time}</div>}
                    </div>
                </div>
                <div className={styles.inputColumn}>
                    {!errorPhone
                        ? <p className={styles.inputTitle} style={{ textAlign: 'left' }} >Телефон</p>
                        : <p className={`${styles.inputTitle} ${styles.errorText}`} style={{ textAlign: 'left' }} >Введите телефон</p>}
                    <InputMask onKeyDown={handleKeyDown} mask="+7 (999) 999-99-99" className={styles.input} onChange={(e) => { setPhone(e.target.value); setErrorPhone(false); }} value={phone} />
                </div>
                <div className={styles.inputColumn}>
                    {!errorPassword
                        ? <p className={styles.inputTitle} style={{ textAlign: 'left' }}>Пароль</p>
                        : <p className={`${styles.inputTitle} ${styles.errorText}`} style={{ textAlign: 'left' }}>Придумайте и введите пароль</p>}
                    <div className={styles.inputIconLine}>
                        <input onKeyDown={handleKeyDown} className={styles.input} type={hidePassword ? 'password' : 'text'} onChange={(e) => { setPassword(e.target.value); setErrorPassword(false); }} value={password} />
                        <>
                            {hidePassword
                                ? <img src='/showIcon.svg' className={styles.inputIcon} onClick={() => setHidePassword(false)} />
                                : <img src='/hideIcon.svg' className={styles.inputIcon} onClick={() => setHidePassword(true)} />}
                        </>
                    </div>
                </div>
                <div className={styles.lilColumn}>
                    <div
                        className={`${styles.mainButtonBlack} ${isLoading && styles.loading} ${!checkBoxes.policy && styles.noPolicy}`}
                        onClick={() => { if (!checkBoxes.policy) return; signUp(email, password, phone) }} >ЗАРЕГИСТРИРОВАТЬСЯ</div>
                    <p className={styles.agreementText}>Регистрируясь, я подтверждаю свое согласие на обработку персональных данных в соответствии с Политикой конфиденциальности.</p>
                </div>
            </div>
        </div>
        <div className={styles.checkBoxLine}>
            {checkBoxes.news
                ? <img src='/checkbox.svg' style={{ cursor: 'pointer' }} onClick={() => setCheckBoxes({ ...checkBoxes, news: false })} />
                : <img src='/emptyCheckbox.svg' style={{ cursor: 'pointer' }} onClick={() => setCheckBoxes({ ...checkBoxes, news: true })} />}
            <p className={styles.checkBoxText}>Я хочу получать <span className={styles.checkBoxSpan} onClick={() => setNews(true)}>сообщения о новостях, акциях и персональные рекомендации</span></p>
        </div>
        <div className={styles.checkBoxLine}>
            {checkBoxes.policy
                ? <img src='/checkbox.svg' style={{ cursor: 'pointer' }} onClick={() => setCheckBoxes({ ...checkBoxes, policy: false })} />
                : <img src='/emptyCheckbox.svg' style={{ cursor: 'pointer' }} onClick={() => setCheckBoxes({ ...checkBoxes, policy: true })} />}
            <p className={styles.checkBoxText}>Я подтверждаю свое согласие с условиями доставки и оплаты, <span className={styles.checkBoxSpan} onClick={() => setPolicy(true)} >политикой конфиденциальности</span> и даю <span className={styles.checkBoxSpan} onClick={() => setPersonal(true)} >согласие на обработку персональных данных</span></p>
        </div>
        <div className={styles.lilColumnSignUp} >
            <p className={styles.inputTitle}>Уже есть аккаунта?</p>
            <div className={styles.mainButton} onClick={() => setStateAuth('signIn')} >ВОЙТИ</div>
        </div>
        <DocumentsModal policy={policy} setPolicy={setPolicy} personal={personal} setPersonal={setPersonal} news={news} setNews={setNews} />
    </div>
}