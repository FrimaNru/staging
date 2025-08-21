import styles from "@/styles/MyOrders.module.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../../../apiConfig";
import { formatDate, formatNumber } from "@/lib/Formatting";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";
import { selectOrderStatus } from "@/constants/constants.text";
import { buildProductSlug } from "@/lib/seo";

export default function OrderItem({ item, index }) {

    const [data, setData] = useState(null);
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const res = await axios.post(`${API_BASE_URL}order`, { id: item }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            console.log(res.data);
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    if (!data) return <p>Загрузка...</p>;

    const itemCounts = Array.isArray(data.products)
        ? data.products.reduce((acc, product) => {
            const key = JSON.stringify(product);
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {})
        : {};

    

    function pay(total, OrderId) {
        setIsLoading(true);

        // axios.post(`${API_BASE_URL}payOrder`, { dataUser, total, OrderId }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        //     .then((res) => {
        //         setIsLoading(false);
        //         router.push(res.data.PaymentURL);
        //     })
        //     .catch((e) => { console.log(e); setIsLoading(false); });
    };

    return <React.Fragment>
        <div className={styles.columnOrder}>
            <div className={styles.titleColumn}>
                <p className={styles.title}>ЗАКАЗ № {data.number}</p>
                <p className={styles.text}>{formatDate(data.createDate)}</p>
            </div>
            <div className={styles.statusBlock} >
                <img src='/infoIcon.svg' className={styles.statusBlockIcon} />
                <p className={styles.statusBlockText}>{selectOrderStatus(data.status)}</p>
            </div>
            <div className={styles.lilColumnOrder}>
                {Object.entries(itemCounts).map(([key, count], i) => {
                    const item = JSON.parse(key);
                    return (
                        <div key={i} className={styles.itemColumn}>
                            <ProductItemOrder item={item} count={count} />
                            <hr className={styles.hr} />
                        </div>
                    );
                })}
            </div>
            <div className={styles.deliveryColumn}>
                <p className={styles.title}>Доставка</p>
                <div className={styles.lilColumnOrder}>
                    <div className={styles.modalSuccessLine}>
                        <img src='/iconMap.svg' className={`${styles.modalSuccessLineIcon} ${styles.modalSuccessLineIconMap}`} />
                        <p className={styles.modalSuccessText}>{data?.delivery?.street}</p>
                    </div>
                    <div className={styles.modalSuccessLine}>
                        <img src='/clock.svg' className={styles.modalSuccessLineIcon} />
                        <p className={styles.modalSuccessText}>{data?.delivery?.date}</p>
                    </div>
                    <div className={styles.modalSuccessLine}>
                        <img src='/phone.svg' className={styles.modalSuccessLineIcon} />
                        <p className={styles.modalSuccessText}>{user.phone}</p>
                    </div>
                </div>
            </div>
            <p className={styles.costGold}>{(data.paymentStatus === 'REJECTED' || data.paymentStatus === 'FORM_SHOWED') ? 'К оплате' : 'Оплачено'}: {formatNumber(data.total)} руб.</p>
            {(data.paymentStatus === 'REJECTED' || data.paymentStatus === 'FORM_SHOWED') && <div className={styles.deliveryColumn}>
                <p className={styles.title}>Оплата</p>
                <button onClick={() => !isLoading && pay(data.total, data.id)} className={`${styles.buttonPay} ${isLoading && styles.loading}`}>ОПЛАТИТЬ СЕЙЧАС</button>
            </div>}
        </div>
        {data.length !== index + 1 && <hr className={styles.hr} />}
    </React.Fragment>
};

function ProductItemOrder({ item, count }) {

    const [data, setData] = useState({});
    const router = useRouter();

    useEffect(() => {
        loadNow();
    }, []);

    function loadNow() {
        axios.post(`${API_BASE_URL}getOneProduct`, { id: item.id })
            .then((res) => {
                setData(res.data);
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.item} onClick={() => router.push(`/product/${buildProductSlug(data)}`)} >
        <div className={styles.itemRow}>
            <img src={data?.cover} className={styles.itemCover} />
            <div className={styles.itemTextColumn}>
                <p className={styles.itemName}>{data?.name?.length > 0 && data?.name}</p>
                <div className={styles.itemNameColumn}>
                    <p className={styles.itemNameStat}>Артикул: {item.article}</p>
                    <p className={styles.itemNameStat}>Цвет: {item.color}</p>
                    {data.type !== "earrings" && <p className={styles.itemNameStat}>Размер: {item.size}</p>}
                </div>
                <div className={styles.itemCountNumber}>{count} шт</div>
                <p className={styles.itemCostMobile}>{formatNumber(Number(data?.cost?.length > 0 && data?.cost))} руб.</p>
            </div>
        </div>
        <p className={styles.itemCost}>{formatNumber(Number(data?.cost))} руб.</p>
    </div>
};