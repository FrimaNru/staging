import styles from "@/styles/Header.module.css";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiConfig";
import { useToast } from "@chakra-ui/react";

export function RefreshPassword({ setStateAuth, onClose }) {

    const toast = useToast();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [state, setState] = useState('');

    const [hidePassword, setHidePassword] = useState(true);
    const [hidePassword2, setHidePassword2] = useState(true);

    const [errorCodeLength, setErrorCodeLength] = useState(false);
    const [errorCode, setErrorCode] = useState(false);

    function checkEmail() {
        axios.post(`${API_BASE_URL}sendCode`, { email })
            .then(() => {
                setState('code');
            })
            .catch((e) => console.log(e));
    };

    function checkCode() {
        if (code.length === 6) {
            axios.post(`${API_BASE_URL}checkCode`, { email, code })
                .then(() => {
                    setState('password');
                })
                .catch((e) => {
                    console.log(e);
                    if (e?.response?.status === 401) return setErrorCode(true);
                });
        } else {
            return setErrorCodeLength(true);
        }
    };

    function refreshPassword() {
        if (password === repeatPassword) {
            axios.post(`${API_BASE_URL}refreshPassword`, { email, password })
                .then(() => {
                    toast({ position: 'bottom-right', render: () => (<div className="toast">Пароль успешно восстановлен</div>), duration: 3000 });
                    setStateAuth('signIn');
                })
                .catch((e) => console.log(e));
        } else {
            toast({ position: 'bottom-right', render: () => (<div className="toast">Пароли не совпадают</div>), duration: 3000 });
        }
    };

    return <div className={styles.modalSignUp}>
        <div className={styles.mainColumn}>
            <div className={styles.headerModal} >
                <div className={styles.headerModalLine} >
                    <p className={styles.headerModalTitle} >ВОССТАНОВИТЬ ПАРОЛЬ</p>
                    <img src='/modalCross.svg' className={styles.cross} onClick={() => onClose()} />
                </div>
                <hr className={styles.modalHr} />
            </div>
            {state === '' ? <>
                <div className={styles.columnContent}>
                    <div className={styles.inputColumn}>
                        <p className={styles.inputTitle} style={{ textAlign: 'left' }} >E-mail</p>
                        <input className={styles.input} onChange={(e) => setEmail(e.target.value)} value={email} />
                    </div>
                    <div className={styles.lilColumn}>
                        <div className={styles.mainButtonBlack} onClick={checkEmail} >ВОССТАНОВИТЬ ПАРОЛЬ</div>
                    </div>
                    <p className={styles.refreshText}>Укажите адрес электронной почты или телефон, который вы использовали при регистрации личного кабинета. Мы отправим вам код для восстановления пароля.</p>
                </div>
            </>
                : state === 'code'
                    ? <div className={styles.columnContent}>
                        <div className={styles.inputColumn}>
                            {(!errorCodeLength && !errorCode)
                                ? <p className={styles.inputTitle} style={{ textAlign: 'left' }} >Введите код из письма</p>
                                : errorCodeLength
                                    ? <p className={`${styles.inputTitle} ${styles.errorText}`} style={{ textAlign: 'left' }} >Введите код из письма</p>
                                    : errorCode && <p className={`${styles.inputTitle} ${styles.errorText}`} style={{ textAlign: 'left' }} >Неверный код</p>
                            }
                            <input className={styles.input} onChange={(e) => { setCode(e.target.value); setErrorCode(false); setErrorCodeLength(false); }} value={code} />
                        </div>
                        <div className={styles.lilColumn}>
                            <div className={styles.mainButtonBlackRefresh} onClick={checkCode} >ДАЛЕЕ</div>
                        </div>
                    </div>
                    : <div className={styles.columnContent}>
                        <div className={styles.inputColumn}>
                            <p className={styles.inputTitle} style={{ textAlign: 'left' }} >Новый пароль</p>
                            <div className={styles.inputIconLine} >
                                <input className={styles.input} type={hidePassword ? 'password' : 'text'} onChange={(e) => setPassword(e.target.value)} value={password} />
                                <>
                                    {hidePassword
                                        ? <img src='/showIcon.svg' className={styles.inputIcon} onClick={() => setHidePassword(false)} />
                                        : <img src='/hideIcon.svg' className={styles.inputIcon} onClick={() => setHidePassword(true)} />}
                                </>
                            </div>
                        </div>
                        <div className={styles.inputColumn}>
                            <p className={styles.inputTitle} style={{ textAlign: 'left' }} >Повторите пароль</p>
                            <div className={styles.inputIconLine} >
                                <input className={styles.input} type={hidePassword2 ? 'password' : 'text'} onChange={(e) => setRepeatPassword(e.target.value)} value={repeatPassword} />
                                <>
                                    {hidePassword2
                                        ? <img src='/showIcon.svg' className={styles.inputIcon} onClick={() => setHidePassword2(false)} />
                                        : <img src='/hideIcon.svg' className={styles.inputIcon} onClick={() => setHidePassword2(true)} />}
                                </>
                            </div>
                        </div>
                        <div className={styles.lilColumn}>
                            <div className={styles.mainButtonBlackRefresh} onClick={refreshPassword} >УСТАНОВИТЬ ПАРОЛЬ</div>
                        </div>
                    </div>}
        </div>
    </div>
}