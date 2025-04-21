import { ORDER_STATUSES_ADMIN } from "@/constants/constants.text";
import { formatDate } from "@/lib/Formatting";
import styles from "@/styles/Admin/Orders/Order.module.css";
import Button from "@/ui/Button/Button";
import axios from "axios";
import { useRouter } from "next/router";
import { API_BASE_URL } from "../../../../../../../../apiConfig";
import Input from "@/ui/Inputs/Input/Input";

export default function OrderInfo({ data, setData, complete }) {

    const router = useRouter();

    const save = async () => {
        try {
            await axios.post(`${API_BASE_URL}admin/order/upd`, { id, data }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });
        } catch (error) {
            console.log(error);
        } finally {
            router.push('/adminpanel?page=orders');
        };
    };

    return <div className={`${styles.card} ${styles.card50}`}>
        <div className={styles.contentColumn}>
            <p className={styles.subtitle}>Дата создания</p>
            <p className={styles.cardValue}>{formatDate(data.createDate)}</p>
        </div>
        <div className={styles.contentColumn}>
            <p className={styles.subtitle}>Номер ИМ из СДЭК</p>
            <p className={styles.cardValue}>{data.cdekId}</p>
        </div>
        <div className={styles.contentColumn}>
            <p className={styles.subtitle}>Адрес</p>
            <Input
                value={data.delivery.street}
                disabled={complete && true}
                fullWidth={true}
                onChange={(e) => { setData({ ...data, delivery: { ...data.delivery, street: e.target.value } }) }}
            />
        </div>
        <div className={styles.contentColumn}>
            <p className={styles.subtitle}>Доставка</p>
            <div className={styles.contentLine}>
                <button
                    className={`${styles.orderCardButton} ${data.deliveryType === 'free' ? styles.orderCardButtonSelect : ''}`}
                    onClick={() => { if (complete) return; setData({ ...data, deliveryType: 'free' }) }}
                >Бесплатно</button>
                <button
                    className={`${styles.orderCardButton} ${data.deliveryType === 'paid' ? styles.orderCardButtonSelect : ''}`}
                    onClick={() => { if (complete) return; setData({ ...data, deliveryType: 'paid' }) }}
                >Платно</button>
                {data.deliveryType === 'paid' && <p className={styles.cardValue}>Стоимость доставки: {data.deliveryCost}</p>}
            </div>
        </div>
        <div className={styles.contentColumn}>
            <p className={styles.subtitle}>Статус заказа</p>
            <div className={styles.orderCardButtonLine}>
                {Object.entries(ORDER_STATUSES_ADMIN).map(([key, value], index) => <button
                    key={index}
                    className={`${styles.orderCardButton} ${data.status === key ? styles.orderCardButtonSelect : ''}`}
                    onClick={() => { if (complete) return; setData({ ...data, status: key }) }}
                >{value}</button>)}
            </div>
        </div>
        <div className={styles.contentColumn}>
            <p className={styles.subtitle}>Примечание</p>
            <textarea
                className={styles.textarea}
                disabled={complete && true}
                value={data.comment}
                onChange={(e) => setData({ ...data, comment: e.target.value })}
            />
        </div>
        <Button onClick={save}>Сохранить</Button>
    </div>
};