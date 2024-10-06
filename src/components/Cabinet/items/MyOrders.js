import styles from "@/styles/MyOrders.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiConfig";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import React from "react";

function formatNumber(number) {
    let numStr = number.toString();
    let parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
};

function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
};

export function MyOrders() {

    const router = useRouter();
    const [data, setData] = useState({});
    const [dataUser, setDataUser] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        load();
    }, []);

    function load() {
        axios.get(`${API_BASE_URL}getUser`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((res) => {
                setData(res.data.orders.reverse());
                setDataUser(res.data);
            })
            .catch((e) => console.log(e));
    };

    function selectStatus(status, paymentStatus) {
        if (paymentStatus !== 'CONFIRMED') {
            switch (paymentStatus) {
                case 'REFUNDED':
                    return 'Вам были возвращены средства'
                case 'REJECTED':
                    return 'Заказ не оплачен'
                case 'FORM_SHOWED':
                    return 'Заказ не оплачен'
            };
        };

        switch (status) {
            case 'processed':
                return 'Ваш заказ обрабатывается'
            case 'delivery':
                return 'Ваш заказ передан в доставку'
            case 'canceled':
                return 'Ваш заказ отменен'
        }
    };

    function checkOrder(x) {
        axios.post(`${API_BASE_URL}checkOrder`, { OrderId: x.id }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                setIsLoading(false);
                load();
            })
            .catch((e) => console.log(e));
    };

    function pay(total, OrderId) {
        setIsLoading(true);

        axios.post(`${API_BASE_URL}payOrder`, { dataUser, total, OrderId }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then((res) => {
                setIsLoading(false);
                router.push(res.data.PaymentURL);
            })
            .catch((e) => { console.log(e); setIsLoading(false); });
    };

    return <div className={styles.main}>
        <hr className={`${styles.hr} ${styles.hrMobile}`} />
        <p className={styles.titleMobile}>МОИ ЗАКАЗЫ</p>
        <hr className={`${styles.hr} ${styles.hrMobile}`} />
        {data.length === 0
            ? <>
                <p className={styles.noOrderTitle} >К сожалению, у вас нет текущих заказов</p>
                <button className={styles.noOrderButton} onClick={() => router.push('/catalog')}>В КАТАЛОГ</button>
                <hr className={styles.hr} />
            </>
            : <div className={styles.bigColumn}>
                {data.length > 0 && data.map((x, i) => {
                    const itemCounts = x.products && typeof x.products === 'string'
                        ? x.products.split(',').reduce((acc, product) => {
                            const trimmedProduct = product.trim();
                            acc[trimmedProduct] = (acc[trimmedProduct] || 0) + 1;
                            return acc;
                        }, {})
                        : Array.isArray(x.products)
                            ? x.products.reduce((acc, product) => {
                                const trimmedProduct = product.trim();
                                acc[trimmedProduct] = (acc[trimmedProduct] || 0) + 1;
                                return acc;
                            }, {})
                            : {};

                    return (
                        <React.Fragment key={i}>
                            <div className={styles.columnOrder}>
                                <div className={styles.titleColumn}>
                                    <p className={styles.title}>ЗАКАЗ № {x.id}</p>
                                    <p className={styles.text}>{formatDate(x.createDate)}</p>
                                </div>
                                <div className={styles.statusBlock} >
                                    <img src='/infoIcon.svg' className={styles.statusBlockIcon} />
                                    <p className={styles.statusBlockText}>{selectStatus(x.status, x.paymentStatus)}</p>
                                </div>
                                <div className={styles.lilColumnOrder}>
                                    {Object.entries(itemCounts).map(([item, count], i) => (
                                        <div key={i} className={styles.itemColumn}>
                                            <ProductItemOrder item={item} count={count} />
                                            <hr className={styles.hr} />
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.deliveryColumn}>
                                    <p className={styles.title}>Доставка</p>
                                    <div className={styles.lilColumnOrder}>
                                        <div className={styles.modalSuccessLine}>
                                            <img src='/iconMap.svg' className={`${styles.modalSuccessLineIcon} ${styles.modalSuccessLineIconMap}`} />
                                            <p className={styles.modalSuccessText}>{x?.delivery?.street}</p>
                                        </div>
                                        <div className={styles.modalSuccessLine}>
                                            <img src='/clock.svg' className={styles.modalSuccessLineIcon} />
                                            <p className={styles.modalSuccessText}>{x?.delivery?.date}</p>
                                        </div>
                                        <div className={styles.modalSuccessLine}>
                                            <img src='/phone.svg' className={styles.modalSuccessLineIcon} />
                                            <p className={styles.modalSuccessText}>{dataUser.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                <p className={styles.costGold}>{(x.paymentStatus === 'REJECTED' || x.paymentStatus === 'FORM_SHOWED') ? 'К оплате' : 'Оплачено'}: {formatNumber(x.total)} руб.</p>
                                {(x.paymentStatus === 'REJECTED' || x.paymentStatus === 'FORM_SHOWED') && <div className={styles.deliveryColumn}>
                                    <p className={styles.title}>Оплата</p>
                                    <button onClick={() => !isLoading && pay(x.total, x.id)} className={`${styles.buttonPay} ${isLoading && styles.loading}`}>ОПЛАТИТЬ СЕЙЧАС</button>
                                </div>}
                            </div>
                            {data.length !== i + 1 && <hr className={styles.hr} />}
                        </React.Fragment>
                    );
                })}
            </div>}
    </div>
};

function ProductItemOrder({ item, count }) {

    const [data, setData] = useState({});
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        loadNow();
    }, []);

    function loadNow() {
        axios.post(`${API_BASE_URL}getOneProduct`, { id: item })
            .then((res) => {
                setData(res.data);
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.item} onClick={() => router.push(`/product?id=${data._id}`)} >
        <div className={styles.itemRow}>
            <img src={`https://api.mi-alegria.shop/uploads/${data?.cover}`} className={styles.itemCover} />
            <div className={styles.itemTextColumn}>
                <p className={styles.itemName}>{data?.name}</p>
                <div className={styles.itemCountNumber}>{count} шт</div>
                <p className={styles.itemCostMobile} >{formatNumber(Number(data?.cost))} руб.</p>
            </div>
        </div>
        <p className={styles.itemCost} >{formatNumber(Number(data?.cost))} руб.</p>
    </div>
};