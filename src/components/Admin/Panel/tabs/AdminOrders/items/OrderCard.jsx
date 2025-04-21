import { ORDER_STATUSES_ADMIN } from "@/constants/constants.text";
import { formatDate, formatNumber } from "@/lib/Formatting";
import styles from "@/styles/Admin/Orders/Order.module.css";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { API_BASE_URL } from "../../../../../../../apiConfig";
import Link from "next/link";
import Button from "@/ui/Button/Button";

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

    return <div className={styles.orderCard}>
        <div className={styles.orderCardTitleLine}>
            <p className={styles.orderCardTitle}>Заказ №{item.number}</p>
            <Link href={`/adminpanel?page=editOrder&id=${item._id}${complete ? '&complete=true' : ''}`} className="link">
                <Button
                    variant="download"
                    size="small"
                >Подробнее</Button>
            </Link>
        </div>
        <div className={styles.orderCardColumn}>
            <p className={styles.orderCardText}><span className={styles.cardValue}>Дата создания:</span> {formatDate(item.createDate)}</p>
            <p className={styles.orderCardText}><span className={styles.cardValue}>Номер ИМ в СДЭК:</span> {item.cdekId}</p>
            <p className={styles.orderCardText}><span className={styles.cardValue}>Адрес:</span> {item.delivery.street}</p>
        </div>
        <p className={styles.orderCardCost}>{formatNumber(item.total)} руб.</p>
        {complete
            ? <div className={styles.orderCardCompleteLine}>
                {Object.entries(ORDER_STATUSES_ADMIN)
                    .filter(([key, value], index) => key === 'complete' || key === 'canceled')
                    .map(([key, value], index) => <button
                        key={index}
                        className={`${styles.orderCardButton} ${item.status === key ? styles.orderCardButtonSelect : ''}`}
                        onClick={() => { if (key === item.status) return; changeStatus(key) }}
                    >{value}</button>)}
            </div>
            : <div className={styles.orderCardButtonLine}>
                {Object.entries(ORDER_STATUSES_ADMIN).map(([key, value], index) => <button
                    key={index}
                    className={`${styles.orderCardButton} ${item.status === key ? styles.orderCardButtonSelect : ''}`}
                    onClick={() => changeStatus(key)}
                >{value}</button>)}
            </div>}
    </div>
};