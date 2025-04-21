import styles from "@/styles/Admin/Orders/Order.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../../../../../../apiConfig";

export default function UserBlock({ id }) {

    const [data, setData] = useState(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const res = await axios.post(`${API_BASE_URL}getOneUser`, { id }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });
            setData(res.data);
        } catch (error) {
            console.log(error);
        };
    };

    if (!data) return <p>Загрузка...</p>;

    return <div className={styles.card}>
        <p className={styles.userTitle}>Личные данные пользователи</p>
        <div className={styles.contentLine}>
            <div className={`${styles.contentColumn} ${styles.halfWidth}`}>
                <p className={styles.subtitle}>Имя</p>
                <div className={styles.cardValue}>{data?.name}</div>
            </div>
            <div className={`${styles.contentColumn} ${styles.halfWidth}`}>
                <p className={styles.subtitle}>Телефон</p>
                <div className={styles.cardValue}>{data?.phone}</div>
            </div>
        </div>
        <div className={styles.contentLine}>
            <div className={`${styles.contentColumn} ${styles.halfWidth}`}>
                <p className={styles.subtitle}>Фамилия</p>
                <div className={styles.cardValue}>{data?.lastName}</div>
            </div>
            <div className={`${styles.contentColumn} ${styles.halfWidth}`}>
                <p className={styles.subtitle}>Почта</p>
                <div className={styles.cardValue}>{data?.email}</div>
            </div>
        </div>
    </div>
};