import { ORDER_STATUSES_ADMIN } from "@/constants/constants.text";
import { formatDate, formatNumber } from "@/lib/Formatting";
import styles from "@/styles/Admin/Orders/Order.module.css";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { API_BASE_URL } from "../../../../../../../apiConfig";
import Link from "next/link";

export default function OrderCard({ item, complete = false, load }) {

    const toast = useToast();

    const changeStatus = async (status) => {
        await axios.post(`${API_BASE_URL}admin/order/status/change`, { status, id: item._id }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then(() => {
                load();
                toast({ position: 'bottom-right', render: () => (<div className="toast">Успешно обновлено</div>), duration: 3000 });
            })
            .catch((e) => console.log(e));
    };

    return <div className={`${styles.orderCard} ${complete ? styles.orderCardComplete : ''}`}>
        <div className={styles.orderCardTitleLine}>
            <p className={styles.orderCardTitle}>Заказ №{item.number}</p>
            <Link href={`/adminpanel?page=editOrder&id=${item._id}${complete ? '&complete=true' : ''}`} className="link">
                <button className={`${styles.orderCardMoreDetailButton} ${complete ? styles.detailButtonComplete : ''}`}>Подробнее</button>
            </Link>
        </div>
        <div className={styles.orderCardColumn}>
            <p className={styles.orderCardText}>Дата создания: {formatDate(item.createDate)}</p>
            <p className={styles.orderCardText}>Номер ИМ в СДЭК: {item.cdekId}</p>
            <p className={styles.orderCardText}>Адрес: {item.delivery.street}</p>
        </div>
        <p className={styles.orderCardCost}>{formatNumber(item.total)} руб.</p>
        <div className={styles.orderCardButtonLineBox}>
            {complete
                ? <div className={styles.orderCardCompleteLine}>
                    <p className={styles.orderCardCompleteBox}>{ORDER_STATUSES_ADMIN[item.status]}</p>
                    <button className={styles.orderCardCompleteButton} onClick={() => changeStatus(item.status === 'complete' ? 'canceled' : 'complete')} >{ORDER_STATUSES_ADMIN[item.status === 'complete' ? 'canceled' : 'complete']}</button>
                </div>
                : <div className={styles.orderCardButtonLine}>
                    {Object.entries(ORDER_STATUSES_ADMIN).map(([key, value], index) => <button key={index} className={`${styles.orderCardButton} ${item.status === key ? styles.orderCardButtonSelect : ''}`} onClick={() => changeStatus(key)} >{value}</button>)}
                </div>}
        </div>
    </div>
};