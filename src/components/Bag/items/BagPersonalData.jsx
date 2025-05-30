import styles from "../styles.module.css";
import axios from "axios";
import { useState } from "react";
import InputMask from "react-input-mask";
import { API_BASE_URL } from "../../../../apiConfig";
import { useToast } from "@chakra-ui/react";
import { useUser } from "@/contexts/UserContext";

export default function BagPersonalData({ load, dataUser, setDataUser }) {

    const toast = useToast();
    const [phoneCode, setPhoneCode] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [isPhoneCodeSend, setIsPhoneCodeSend] = useState(false);

    const sendMessage = async () => {
        if (dataUser.isVerifiedPhone === true) return toast({ position: 'bottom-right', render: () => (<div className="toast">Этот номер уже подтвержден</div>), duration: 3000 });
        try {
            setDisabled(true);

            await axios.post(`${API_BASE_URL}verifiedPhone`, { phone: dataUser.phone }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

            setIsPhoneCodeSend(true);
            toast({ position: 'bottom-right', render: () => (<div className="toast">Код успешно отправлен</div>), duration: 3000 });
        } catch (error) {
            console.log(error);
        } finally {
            setDisabled(false);
        }
    };

    const mobilePhoneCheck = async () => {
        try {
            setDisabled(true);

            await axios.post(`${API_BASE_URL}verifiedPhoneCode`, { code: phoneCode }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

            load();
            toast({ position: 'bottom-right', render: () => (<div className="toast">Телефон успешно подтвержден</div>), duration: 3000 });
            setIsPhoneCodeSend(false);
            setPhoneCode('');
        } catch (error) {
            console.log(error);
        } finally {
            setDisabled(false);
        }
    };

    return <div className={styles.orderColumn}>
        <hr className={`${styles.hr} ${styles.hrMobile}`} />
        <p className={styles.orderTitle}>ЛИЧНЫЕ ДАННЫЕ</p>
        <hr className={`${styles.hr} ${styles.hrMobile}`} />
        <div className={styles.orderLine}>
            <div className={styles.orderColumnBig}>
                <div className={styles.orderColumnLil}>
                    <p className={styles.orderInputTitle}>Имя</p>
                    <input className={styles.orderInput} onChange={(e) => setDataUser({ ...dataUser, name: e.target.value })} value={dataUser.name} />
                </div>
                <div className={styles.orderColumnLil}>
                    <p className={styles.orderInputTitle}>Фамилия</p>
                    <input className={styles.orderInput} value={dataUser.personalData?.lastName} onChange={(e) => setDataUser({ ...dataUser, personalData: { ...dataUser.personalData, lastName: e.target.value } })} />
                </div>
            </div>
            <div className={styles.orderColumnBig}>
                <div className={styles.orderColumnLil}>
                    <p className={styles.orderInputTitle}>E-mail ✔</p>
                    <input className={styles.orderInput} disabled={true} value={dataUser.email} />
                </div>
                <div className={styles.orderColumnLil}>
                    <p className={styles.orderInputTitle}>Телефон {dataUser.isVerifiedPhone && '✔'}</p>
                    <InputMask mask="+7 (999) 999-99-99" className={styles.orderInput} value={dataUser.phone} onChange={(e) => setDataUser({ ...dataUser, phone: e.target.value })} disabled={dataUser.isVerifiedPhone} />
                </div>
                {!dataUser.isVerifiedPhone
                    && <div className={styles.inputColumn}>
                        <p className={styles.inputTitle}>Код подтверждения телефона</p>
                        <div className={styles.codeLine}>
                            <input className={styles.lilInputCode} onChange={(e) => setPhoneCode(e.target.value)} value={phoneCode} />
                            <button className={`${styles.buttonCode} ${disabled ? styles.buttonDisabled : ''}`} onClick={() => {
                                if (isPhoneCodeSend) return mobilePhoneCheck()
                                else sendMessage();
                            }}>{isPhoneCodeSend ? 'ПОДТВЕРДИТЬ' : 'ОТПРАВИТЬ SMS'}</button>
                        </div>
                    </div>}
            </div>
        </div>
    </div>
};