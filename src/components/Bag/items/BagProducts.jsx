import { useCart } from "@/contexts/CartContext";
import styles from "../styles.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiConfig";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { formatNumber } from "@/lib/Formatting";

export default function BagProducts({ setData, load, total, setTotal }) {

    const { cart } = useCart();

    const itemCounts = cart.reduce((acc, item) => {
        const key = JSON.stringify({ id: item.id, size: item.size, color: item.color, article: item.article });
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    return cart.length > 0 && Object.entries(itemCounts)
        .filter(([key, count], index, self) => ([x]) => x === key)
        .map(([key, count], i) => {
            const item = JSON.parse(key);
            return (
                <div key={i} className={styles.itemColumn}>
                    <ProductItem item={item} count={count} setTotal={setTotal} total={total} load={load} setData={setData} />
                    <hr className={styles.hr} />
                </div>
            );
        })
};

function ProductItem({ item, count, load, setData }) {

    const [data, setDataProduct] = useState({});
    const toast = useToast();
    const { removeLastFromCart, addToCart } = useCart();

    useEffect(() => {
        loadNow();
    }, []);

    const makePostRequest = async (url, data, headers = {}) => {
        try {
            const response = await axios.post(url, data, {
                headers,
                timeout: 5000
            });
            return response.data;
        } catch (error) {
            console.error(`Ошибка при запросе к ${url}:`, error.message || error);
            throw error;
        }
    };

    const loadNow = async () => {
        try {
            const url = `${API_BASE_URL}getOneProduct`;
            const response = await makePostRequest(url, { id: item.id });
            setDataProduct(response);
        } catch (error) {
            console.error("Ошибка при загрузке данных о продукте:", error.message || error);
        }
    };

    const deleteProduct = async () => {
        try {
            const url = `${API_BASE_URL}deleteProductFromBag`;
            const token = localStorage.getItem('token');
            await makePostRequest(url, { id: item.id, size: item.size, color: item.color, article: item.article }, {
                Authorization: `Bearer ${token}`
            });

            setData([]);
            toast({
                position: 'bottom-right',
                render: () => (<div className="toast">Товар успешно удален</div>),
                duration: 3000
            });
            load();
        } catch (error) {
            console.error("Ошибка при удалении продукта:", error.message || error);
        }
    };

    const plusProduct = async () => {
        try {
            const url = `${API_BASE_URL}plusProductToBag`;
            const token = localStorage.getItem('token');
            await makePostRequest(url, { id: item.id, size: item.size, color: item.color, article: item.article }, {
                Authorization: `Bearer ${token}`
            });

            addToCart({ id: item.id, size: item.size, color: item.color, article: item.article });
            load();
        } catch (error) {
            console.error("Ошибка при увеличении количества продукта:", error.message || error);
        }
    };

    const minusProduct = async () => {
        try {
            const url = `${API_BASE_URL}minusProductFromBag`;
            const token = localStorage.getItem('token');
            await makePostRequest(url, { id: item.id, size: item.size, color: item.color, article: item.article }, {
                Authorization: `Bearer ${token}`
            });

            removeLastFromCart();
            load();
        } catch (error) {
            console.error("Ошибка при уменьшении количества продукта:", error.message || error);
        }
    };

    return <div className={styles.item}>
        <div className={styles.itemRow}>
            <img src={data?.cover?.length > 0 && data?.cover} className={styles.itemCover} />
            <div className={styles.itemTextColumn}>
                <div className={styles.itemNameLine}>
                    <div className={styles.itemNameColumn}>
                        <p className={styles.itemName}>{data?.name?.length > 0 && data?.name}</p>
                        <p className={styles.itemNameStat}>Артикул: {item.article}</p>
                        <p className={styles.itemNameStat}>Цвет: {item.color}</p>
                        {data.type !== "earrings" && <p className={styles.itemNameStat}>Размер: {item.size}</p>}
                    </div>
                    <img src='/cross.svg' className={styles.itemCrossMobile} onClick={deleteProduct} />
                </div>
                <div className={styles.itemCountLineMobile}>
                    <button className={styles.itemCountSymbolBox} onClick={minusProduct}>
                        <img src='/minus.svg' />
                    </button>
                    <div className={styles.itemCountNumber}>{count}</div>
                    <button className={styles.itemCountSymbolBox} onClick={plusProduct}>
                        <img src='/plus.svg' />
                    </button>
                </div>

                <p className={styles.itemCost} >{formatNumber(Number(data?.cost))} руб.</p>
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