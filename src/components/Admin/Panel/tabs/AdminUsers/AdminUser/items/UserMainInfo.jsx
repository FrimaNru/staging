import { formatDateFromTimestamp } from "@/lib/Formatting";
import styles from "../../styles.module.css";

export default function UserMainInfo({ data }) {
    return <div className={styles.card}>
        <p className={styles.subtitle}>Персональные данные</p>
        <div className={styles.cardColumn}>
            <p className={styles.cardTitle}>Имя</p>
            <p className={styles.cardValue}>{data.name}</p>
        </div>
        <div className={styles.cardColumn}>
            <p className={styles.cardTitle}>Фамилия</p>
            <p className={styles.cardValue}>{data.personalData.lastName}</p>
        </div>
        <div className={styles.cardColumn}>
            <p className={styles.cardTitle}>Номер телефона</p>
            <p className={styles.cardValue}>{data.phone} {data.isVerifiedPhone && '✔'}</p>
        </div>
        <div className={styles.cardColumn}>
            <p className={styles.cardTitle}>Почта</p>
            <p className={styles.cardValue}>{data.email}</p>
        </div>
        <div className={styles.cardColumn}>
            <p className={styles.cardTitle}>Общее количество заказов</p>
            <p className={styles.cardValue}>{data.orders.length}</p>
        </div>
        <div className={styles.cardColumn}>
            <p className={styles.cardTitle}>Пол</p>
            <p className={styles.cardValue}>{data.personalData.sex}</p>
        </div>
        <div className={styles.cardColumn}>
            <p className={styles.cardTitle}>Дата рождения</p>
            <p className={styles.cardValue}>{data.personalData.dateBirthday}</p>
        </div>
        <div className={styles.cardColumn}>
            <p className={styles.cardTitle}>Дата регистрации</p>
            <p className={styles.cardValue}>{formatDateFromTimestamp(Number(data.registerDate))}</p>
        </div>
    </div>
};