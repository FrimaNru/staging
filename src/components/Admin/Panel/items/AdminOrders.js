import styles from "@/styles/Admin.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../../../apiConfig";

const stataTitle = {
    'total': 'Общее количество заказов',
    'active': 'Количество активных заказов'
};

export function AdminOrders() {

    const [statistick, setStatistick] = useState({});

    useEffect(() => {
        load();
    }, []);

    function load() {
        axios.get(`${API_BASE_URL}statistickOrders`, { headers: {Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}`} })
        .then((res) => {
            setStatistick(res.data);
        })
        .catch((e) => console.log(e));
    };

    return <div className={styles.dashboard}>
        <p className={styles.title}>Заказы</p>
        <div className={styles.dashboardLine}>
            {['total', 'active'].map((x, i) => <div key={i} className={styles.ordersLineItem}>{stataTitle[x]}: {statistick[x]}</div>)}
        </div>
    </div>
}