import { useEffect, useState } from "react";
import styles from "../styles.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../../apiConfig";
import { useRouter } from "next/router";
import UserMainInfo from "./items/UserMainInfo";
import UserOrders from "./items/UserOrders";

export default function AdminUser() {

    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState(null);

    useEffect(() => { load(); }, [id]);

    const load = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}admin/users/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });            
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    if (!data) return <p>Загрузка...</p>

    return <div className={styles.main}>
        <p className={styles.title}>{data?.name} {data?.personalData.lastName}</p>
        <div className={styles.grid}>
            <UserMainInfo data={data} />
            <UserOrders data={data} />
            <div className={styles.card}></div>
            <div className={styles.card}></div>
        </div>
    </div>
};