import styles from "@/styles/Bag.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

function formatNumber(num) {
    return num?.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, '.');
};

export function Bag() {

    const router = useRouter();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const toast = useToast();

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
                setData(res.data.bag);
                let d = 0
                if (res.data.bag.length === 0) return setTotal(0);
                res.data.bag.map(x => {
                    axios.post(`${API_BASE_URL}getOneProduct`, { id: x })
                        .then((r) => {
                            d = d + r.data.cost;
                            setTotal(d);
                        })
                        .catch((e) => console.log(e));
                })
            })
            .catch((e) => console.log(e));
    };

    const itemCounts = data.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
    }, {});

    function clearBag() {
        axios.post(`${API_BASE_URL}clearBag`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                toast({ position: 'bottom-right', render: () => (<div className="toast">Корзина успешно очищена</div>), duration: 3000 });
                load();
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.main}>
        <div className={styles.columnProducts}>
            <div className={styles.rowHeader} >
                <p className={styles.rowHeaderTitle}>КОРЗИНА</p>
                <button className={styles.rowHeaderClear} onClick={clearBag} >Очистить корзину</button>
            </div>
            {data.length > 0 && Object.entries(itemCounts)
                .filter(([item, count], index, self) => self.findIndex(([x]) => x === item) === index)
                .map(([item, count], i) => (
                    <div key={i} className={styles.itemColumn}>
                        <ProductItem item={item} count={count} setTotal={setTotal} total={total} load={load} />
                        <hr className={styles.hr} />
                    </div>
                ))
            }
            {data.length === 0 && <div className={styles.emptyBag} >
                <p className={styles.emptyBagTitle}>К сожалению, ваша корзина пуста</p>
                <button className={styles.emptyBagButton} onClick={() => router.push('/catalog')}>В КАТАЛОГ</button>
                <hr className={styles.hr} />
            </div>}
        </div>
        <div className={styles.totalColumn}>
            <div className={styles.total}>
                <p className={styles.totalTitle}>ИТОГО</p>
                <div className={styles.totalContent}>
                    <div className={styles.totalRow}>
                        <p className={styles.totalSubtitle}>Товаров на сумму</p>
                        <p className={styles.totalGold}>{formatNumber(total)} руб.</p>
                    </div>
                    <div className={styles.totalColumnLil}>
                        <div className={styles.totalRow}>
                            <p className={styles.totalSubtitle}>Доставка</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="5" viewBox="0 0 11 5" fill="none">
                                <path d="M10.2008 4.53996H0.800781V0.459961H10.2008V4.53996Z" fill="#C49748" />
                            </svg>
                        </div>
                        <p className={styles.totalText}>Стоимость доставки будет рассчитана позднее на основании выбранного способа доставки</p>
                    </div>
                </div>
                <hr className={styles.hr} />
                <div className={styles.totalRow} >
                    <p className={styles.totalSubtitle}>Итого</p>
                    <p className={styles.totalGold}>{formatNumber(total)} руб.</p>
                </div>
            </div>
            {data.length > 0 && <button className={styles.totalButton}>ОФОРМИТЬ ЗАКАЗ</button>}
        </div>
    </div>
};


function ProductItem({ item, count, load }) {

    const [data, setData] = useState({});
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

    function deleteProduct() {
        axios.post(`${API_BASE_URL}deleteProductFromBag`, { id: item }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                toast({ position: 'bottom-right', render: () => (<div className="toast">Товар успешно удален</div>), duration: 3000 });
                load();
            })
            .catch((e) => console.log(e));
    };

    function plusProduct() {
        axios.post(`${API_BASE_URL}plusProductToBag`, { id: item }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                load();
            })
            .catch((e) => console.log(e));
    };

    function minusProduct() {
        axios.post(`${API_BASE_URL}minusProductFromBag`, { id: item }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                load();
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.item}>
        <div className={styles.itemRow}>
            <img src={`/${data.img}`} className={styles.itemCover} />
            <div className={styles.itemTextColumn}>
                <div className={styles.itemTextColumnLil} >
                    <p className={styles.itemName}>{data.name}</p>
                    <p className={styles.itemText}>{data.text}</p>
                </div>
                <p className={styles.itemCost} >{formatNumber(data.cost)} руб.</p>
            </div>
        </div>
        <div className={styles.itemRowLil}>
            <div className={styles.itemCountLine}>
                <button className={styles.itemCountSymbolBox} onClick={minusProduct}>
                    <img src='/minus.svg' />
                </button>
                <div className={styles.itemCountNumber}>{count}</div>
                <button className={styles.itemCountSymbolBox} onClick={plusProduct}>
                    <img src='/plus.svg' />
                </button>
            </div>
            <img src='/cross.svg' className={styles.itemCross} onClick={deleteProduct} />
        </div>
    </div>
};