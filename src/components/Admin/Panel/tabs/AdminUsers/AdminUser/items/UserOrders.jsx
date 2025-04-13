import { formatDateFromTimestamp, formatNumber } from "@/lib/Formatting";
import styles from "../../styles.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../../../apiConfig";
import Button from "@/ui/Button/Button";
import { useRouter } from "next/router";
import { ORDER_STATUSES_ADMIN } from "@/constants/constants.text";

export default function UserOrders({ data }) {
    return <div className={styles.card}>
        <p className={styles.subtitle}>Заказы</p>
        <div className={styles.orderColumn}>
            <div className={styles.tableHeader}>
                <p className={`${styles.tableHeaderItem} ${styles.tableHeaderItemOrder}`}>Дата</p>
                <p className={`${styles.tableHeaderItem} ${styles.tableHeaderItemOrder}`}>Сумма</p>
                <p className={`${styles.tableHeaderItem} ${styles.tableHeaderItemOrder}`}>Статус</p>
                <p className={`${styles.tableHeaderItem} ${styles.tableHeaderItemOrder} ${styles.alignTextRight}`}>Действие</p>
            </div>
            {[...data.orders, ...data.history].length > 0
                ? [...data.orders, ...data.history].map((item, index) => <OrderItem id={item} key={index} />)
                : <p className={styles.tableNoItems}>Заказов нет</p>}
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

    return <div className={styles.orderLine}>
        <p className={styles.tableItemValueOrder}>{formatDateFromTimestamp(data.createDate)}</p>
        <p className={styles.tableItemValueOrder}>{formatNumber(data.total)} руб.</p>
        <p className={styles.tableItemValueOrder}>{ORDER_STATUSES_ADMIN[data.status]}</p>
        <div className={`${styles.tableItemValueOrder} ${styles.alignRight}`}>
            <Button
                variant="download"
                size="small"
                onClick={() => router.push(`/adminpanel?page=editOrder&id=${data._id}${data.status === 'complete' ? '&complete=true' : ''}`)}
            >Подробнее</Button>
        </div>
    </div>
};