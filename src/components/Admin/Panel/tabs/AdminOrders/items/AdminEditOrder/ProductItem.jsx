import styles from "@/styles/Admin/Orders/Order.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../../../../../../apiConfig";
import Link from "next/link";
import { formatNumber } from "@/lib/Formatting";

export default function ProductItem({ item }) {

    const [data, setData] = useState(null);
    const [numberOfProduct, setNumberOfProduct] = useState(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const res = await axios.post(`${API_BASE_URL}getOneProduct`, { id: item.id });
            setData(res.data);
        } catch (error) {
            console.log(error);
        };
    };

    if (!data) return <p>Загрузка...</p>;

    return <Link href={`/product?id=${data._id}`} target="_blank">
        <div className={styles.productItem}>
            <img src={data.cover} className={styles.productItemCover} />
            <div className={styles.productItemColumn}>
                <p className={styles.productItemTitle}>{data.name?.toUpperCase()}</p>
                <p className={styles.productItemText}>Артикул: {item.article}</p>
                <p className={styles.productItemText}>Цвет: {item.color}</p>
                {item.size !== 0 && <p className={styles.productItemText}>Размер: {item.size}</p>}
                <p className={styles.productItemText}>{item.count} шт.</p>
                <p className={styles.productItemCost}>{formatNumber(Number(data.cost))} руб.</p>
            </div>
        </div>
    </Link>
};