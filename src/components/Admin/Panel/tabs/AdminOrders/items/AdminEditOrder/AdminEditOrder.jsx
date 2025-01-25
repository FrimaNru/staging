import axios from "axios";
import { API_BASE_URL } from "../../../../../../../../apiConfig";
import styles from "@/styles/Admin/Orders/Order.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/Formatting";
import { ORDER_STATUSES_ADMIN } from "@/constants/constants.text";
import UserBlock from "./UserBlock";
import ProductBlock from "./ProductBlock";

export default function AdminEditOrder() {

    const router = useRouter();
    const [data, setData] = useState(null);
    const { id, complete } = router.query;

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const res = await axios.post(`${API_BASE_URL}order`, { id }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });
            console.log(res.data);
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteOrder = async () => {
        try {
            await axios.post(`${API_BASE_URL}admin/order/delete`, { id }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });
        } catch (error) {
            console.log(error);
        } finally {
            router.push('/adminpanel?page=orders');
        }
    };

    const save = async () => {
        try {
            await axios.post(`${API_BASE_URL}admin/order/upd`, { id, data }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });
        } catch (error) {
            console.log(error);
        } finally {
            router.push('/adminpanel?page=orders');
        };
    };

    if (!data) return <p>Загрузка...</p>;

    return <div className={styles.main}>
        <div className={styles.titleLine}>
            <p className={styles.title}>Заказ №{data.number}</p>
            <button onClick={deleteOrder} className={styles.deleteButton}>Удалить заказ</button>
        </div>
        <div className={styles.contentColumn}>
            <p className={styles.subtitle}>Дата создания</p>
            <div className={styles.boxContent}>{formatDate(data.createDate)}</div>
        </div>
        <div className={styles.contentColumn}>
            <p className={styles.subtitle}>Номер ИМ из СДЭК</p>
            <div className={styles.boxContent}>{data.cdekId}</div>
        </div>
        <div className={styles.contentColumn}>
            <p className={styles.subtitle}>Адрес</p>
            <input className={`${styles.mainInput} ${styles.fullWidth}`} value={data.delivery.street} disabled={complete && true} onChange={(e) => { setData({ ...data, delivery: { ...data.delivery, street: e.target.value } }) }} />
        </div>
        <div className={styles.contentColumn}>
            <p className={styles.subtitle}>Доставка</p>
            <div className={styles.contentLine}>
                <button className={`${styles.contentButton} ${data.deliveryType === 'free' ? styles.contentButtonSelect : ''}`} onClick={() => { if (complete) return; setData({ ...data, deliveryType: 'free' }) }}>Бесплатно</button>
                <button className={`${styles.contentButton} ${data.deliveryType === 'paid' ? styles.contentButtonSelect : ''}`} onClick={() => { if (complete) return; setData({ ...data, deliveryType: 'paid' }) }}>Платно</button>
                {data.deliveryType === 'paid' && <input className={styles.mainInput} disabled={complete && true} value={data.deliveryCost} onChange={(e) => setData({ ...data, deliveryCost: e.target.value })} />}
            </div>
        </div>
        <div className={styles.contentColumn}>
            <p className={styles.subtitle}>Статус заказа</p>
            <div className={styles.contentLine}>
                {Object.entries(ORDER_STATUSES_ADMIN).map(([key, value], index) => <button key={index} className={`${styles.contentButton} ${data.status === key ? styles.contentButtonSelect : ''} ${styles.smallButton}`} onClick={() => { if (complete) return; setData({ ...data, status: key }) }}>{value}</button>)}
            </div>
        </div>
        <UserBlock id={data.userId} />
        <ProductBlock order={data} />
        <div className={styles.contentColumn}>
            <p className={styles.subtitle}>Примечание</p>
            <textarea className={styles.textarea} disabled={complete && true} value={data.comment} onChange={(e) => setData({ ...data, comment: e.target.value })} />
        </div>
        <button className={styles.mainButtonSave} onClick={save}>Сохранить</button>
    </div>
};