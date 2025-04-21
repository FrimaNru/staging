import axios from "axios";
import { API_BASE_URL } from "../../../../../../../../apiConfig";
import styles from "@/styles/Admin/Orders/Order.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/Formatting";
import { ORDER_STATUSES_ADMIN } from "@/constants/constants.text";
import UserBlock from "./UserBlock";
import ProductBlock from "./ProductBlock";
import Button from "@/ui/Button/Button";
import OrderInfo from "./OrderInfo";

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

    if (!data) return <p>Загрузка...</p>;

    return <div className={styles.main}>
        <div className={styles.titleLine}>
            <p className={styles.title}>Заказ №{data.number}</p>
            <Button
                onClick={deleteOrder}
                size="small"
                variant="delete"
            >Удалить заказ</Button>
        </div>
        <div className={styles.lineCard}>
            <OrderInfo data={data} setData={setData} complete={complete} />
            <ProductBlock order={data} />
        </div>
        <UserBlock id={data.userId} />
    </div>
};