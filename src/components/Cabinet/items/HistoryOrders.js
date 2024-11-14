import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiConfig";
import styles from "@/styles/HistoryOrders.module.css";
import { useToast } from "@chakra-ui/react";
import Link from "next/link";
import { formatNumber } from "@/lib/Formatting";

function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
};

export function HistoryOrders() {

    const router = useRouter();
    const [data, setData] = useState({});
    const [dataUser, setDataUser] = useState({});

    const [moreOrder, setMoreOrder] = useState('');

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
                setData(res.data.history.reverse());
                setDataUser(res.data);
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.main}>
        <hr className={`${styles.hr} ${styles.hrMobile}`} />
        <p className={styles.noOrderTitle}>ИСТОРИЯ ЗАКАЗОВ</p>
        <hr className={`${styles.hr} ${styles.hrMobile}`} />
        {data.length === 0
            ? <>
                <p className={styles.noOrderTitle} >К сожалению, у вас нет прошедших заказов</p>
                <button className={styles.noOrderButton} onClick={() => router.push('/catalog')}>В КАТАЛОГ</button>
                <hr className={styles.hr} />
            </>
            : <div className={styles.mainColumn}>
                {moreOrder !== '' && <div className={styles.mainColumn}>
                    {data.length > 0 && data.map((x, i) => {
                        if (x.id === moreOrder) {
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

                            return (<div key={i} className={styles.columnOrder}>
                                <div className={styles.titleColumn}>
                                    <p className={styles.itemTitle}>ЗАКАЗ № {x.id}</p>
                                    <p className={styles.itemDate}>{formatDate(x.createDate)}</p>
                                </div>
                                <div className={styles.statusBlock} >
                                    <img src='/infoIcon.svg' className={styles.statusBlockIcon} />
                                    <p className={styles.statusBlockText}>Ваш заказ доставлен</p>
                                </div>
                                <div className={styles.lilColumnOrder}>
                                    {Object.entries(itemCounts).map(([item, count], i) => (
                                        <div key={i} className={styles.itemColumn}>
                                            <ProductItemOrderHistory item={item} count={count} />
                                            <hr className={styles.hr} />
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.deliveryColumn}>
                                    <p className={styles.itemTitle}>Доставка</p>
                                    <div className={styles.lilColumnOrder}>
                                        <div className={styles.itemDeliveryLine}>
                                            <img src='/iconMap.svg' className={`${styles.modalSuccessLineIcon} ${styles.modalSuccessLineIconMap}`} />
                                            <p className={styles.itemDate}>{x?.delivery?.street}</p>
                                        </div>
                                        <div className={styles.itemDeliveryLine}>
                                            <img src='/clock.svg' className={styles.modalSuccessLineIcon} />
                                            <p className={styles.itemDate}>{x?.delivery?.date}</p>
                                        </div>
                                        <div className={styles.itemDeliveryLine}>
                                            <img src='/phone.svg' className={styles.modalSuccessLineIcon} />
                                            <p className={styles.itemDate}>{dataUser.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                <p className={styles.costGold}>Оплачено: {formatNumber(x.total)} руб.</p>
                            </div>)
                        }
                    })}
                    <hr className={styles.hr} />
                </div>}
                <div className={styles.column}>
                    <div className={styles.columnItem}>
                        {data.length > 0 && data.map((x, i) => <div key={i} className={styles.itemBox} >
                            <div className={styles.item}>
                                <div className={styles.itemColumn}>
                                    <p className={styles.itemTitle} >ЗАКАЗ № {x.id}</p>
                                    <p className={styles.itemDate}>{formatDate(x.createDate)}</p>
                                </div>
                                <div className={styles.itemLineProductsBox} >
                                    <div className={styles.itemLineProducts}>
                                        {x.products
                                            .filter((item, index, self) => self.findIndex(x => x === item) === index)
                                            .map((y, n) => <ProductItemHistory item={y} key={n} />)}
                                    </div>
                                </div>
                                <div className={styles.itemColumn}>
                                    <p className={styles.itemTotal}>{formatNumber(x.total)} руб.</p>
                                    <button className={styles.itemButton} onClick={() => setMoreOrder(x.id)} >ПОДРОБНЕЕ</button>
                                </div>
                            </div>
                            <hr className={styles.hr} />
                        </div>)}
                    </div>
                </div>
            </div>}
    </div>
};

function ProductItemHistory({ item }) {

    const [data, setData] = useState({});

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

    return <Link href={`/product?id=${data?._id}`}><img src={`https://api.mi-alegria.shop/uploads/${data?.cover}`} className={styles.itemCover} /></Link>
};

function ProductItemOrderHistory({ item, count }) {

    const [data, setData] = useState({});
    const router = useRouter();
    const toast = useToast();

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

    if (!data) return;

    return <div className={styles.itemHistory} onClick={() => router.push(`/product?id=${data._id}`)} >
        <div className={styles.itemRowHistory}>
            <img src={`https://api.mi-alegria.shop/uploads/${data.cover}`} className={styles.itemCoverHistory} />
            <div className={styles.itemTextColumnHistory}>
                <p className={styles.itemNameHistory}>{data.name?.toUpperCase()}</p>
                <div className={styles.itemCountNumberHistory}>{count} шт</div>
                {data.cost && <p className={styles.itemCostHistoryMobile} >{formatNumber(data?.cost)} руб.</p>}
            </div>
        </div>
        {data.cost && <p className={styles.itemCostHistory} >{formatNumber(data?.cost)} руб.</p>}
    </div>
};