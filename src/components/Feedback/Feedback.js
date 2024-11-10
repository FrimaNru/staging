import styles from "@/styles/Feedback.module.css";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";

export function Feedback() {

    const toast = useToast();
    const [data, setData] = useState({
        text: '',
        email: '',
        code: '',
    });
    const [time, setTime] = useState(0);
    const [isCodeSend, setIsCodeSend] = useState(false);
    const [isFormSend, setIsFormSend] = useState(false);

    const regexMail = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;

    const checkEmail = async () => {
        if (regexMail.test(data.email)) {
            axios.post(`${API_BASE_URL}checkEmail`, { email: data.email })
                .then(() => {
                    toast({ position: 'bottom-right', render: () => (<div className="toast">Код успешно отправлен</div>), duration: 3000 });

                    setIsCodeSend(true);

                    let nowtime = 59;
                    setTime(nowtime);

                    const timer = setInterval(() => {
                        if (nowtime > 1) {
                            nowtime -= 1;
                            setTime(nowtime);
                        } else {
                            clearInterval(timer);
                        }
                    }, 1000);
                })
                .catch((e) => {
                    console.log(e);
                    if (e?.response?.status === 404) return toast({ position: 'bottom-right', render: () => (<div className="toast">Такого пользователя не сущетсвует</div>), duration: 3000 });
                })
        } else {
            toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не корректно ввели почту</div>), duration: 3000 });
        }
    };

    const sendFeedback = async () => {
        if (regexMail.test(data.email) && isCodeSend && data.text.length > 0 && data.code.length === 6) {
            axios.post(`${API_BASE_URL}sendFeedback`, { email: data.email, code: data.code, text: data.text })
                .then(() => {
                    setIsFormSend(true);
                })
                .catch((e) => {
                    console.log(e);
                    if (e?.response?.status === 404) return toast({ position: 'bottom-right', render: () => (<div className="toast">Такого пользователя не сущетсвует</div>), duration: 3000 });
                    if (e?.response?.status === 400) return toast({ position: 'bottom-right', render: () => (<div className="toast">Код подтверждения не верный</div>), duration: 3000 });
                })
        } else {
            if (data.text.length === 0) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не описали проблему</div>), duration: 3000 });
            if (!regexMail.test(data.email)) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не корректно ввели почту</div>), duration: 3000 });
            if (!isCodeSend) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не получили код</div>), duration: 3000 });
            if (data.code.length !== 6) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не корректно ввели код</div>), duration: 3000 });
        }
    };

    return <div className={styles.main}>
        <p className={styles.title}>ФОРМА ОБРАТНОЙ СВЯЗИ</p>
        {!isFormSend
            ? <>
                <textarea className={styles.textarea} onChange={(e) => setData({ ...data, text: e.target.value })} placeholder="Опишите проблему, с которой вы столкнулись или задайте вопрос" value={data.text} />
                <div className={styles.column}>
                    <div className={styles.lilColumn}>
                        <p className={styles.subtitle}>Укажите E-mail для обратной свяи</p>
                        <input className={styles.input} placeholder="Mail@gmail.com" onChange={(e) => setData({ ...data, email: e.target.value })} value={data.email} />
                    </div>
                    <div className={styles.lilColumn}>
                        <p className={styles.subtitle}>Код подтверждения E-mail</p>
                        <div className={styles.lilLine}>
                            <input className={styles.inputLil} value={data.code} onChange={(e) => setData({ ...data, code: e.target.value })} />
                            {time > 1
                                ? <div className={styles.lilTimer}>0:{time}</div>
                                : <button className={styles.buttonLil} onClick={checkEmail} >ПОЛУЧИТЬ КОД</button>}
                        </div>
                    </div>
                </div>
                <div className={styles.blockInfo}>Мы ответим вам в течении ______ на указаный E-mail</div>
                <button className={styles.button} onClick={sendFeedback} >ОТПРАВИТЬ</button>
                <hr className={styles.hr} />
            </>
            : <>
                <p className={styles.sendText}>Ваше письмо отправлено, Мы ответим вам в течении ______ на указаный E-mail </p>
                <button className={styles.button} onClick={() => { setIsFormSend(false); setData({ text: '', email: '', code: '' }) }} >ЗАДАТЬ ЕЩЕ ВОПРОС</button>
            </>}
    </div>
};