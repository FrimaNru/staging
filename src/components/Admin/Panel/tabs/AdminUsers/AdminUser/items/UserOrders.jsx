import { formatNumber } from "@/lib/Formatting";
import styles from "../../styles.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../../../apiConfig";
import Button from "@/ui/Button/Button";
import { useRouter } from "next/router";

export default function UserOrders({ data }) {
    return <div className={styles.card}>
        <p className={styles.subtitle}>Заказы</p>
        <div className={styles.accordionPanelColumn}>
            {[...data.orders, ...data.history].length > 0
                ? [...data.orders, ...data.history].map((item, index) => <OrderItem id={item} key={index} />)
                : <p className={styles.accordionPanelText}>Заказов нет</p>}
        </div>
    </div>
};

function OrderItem({ id }) {

    const router = useRouter();
    const [data, setData] = useState(null);

    useEffect(() => { load() }, []);

    const load = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}admin/orders/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    if (!data) return;

    return <div className={styles.accrdionPanelItem}>
        <Button
            variant="download"
            size="small"
            onClick={() => router.push('')}
        >{data._id}</Button>
        <p className={styles.accordionPanelText}>{formatNumber(data.total)} руб.</p>
        <p className={styles.accordionPanelText}>{data.status}</p>
    </div>
};