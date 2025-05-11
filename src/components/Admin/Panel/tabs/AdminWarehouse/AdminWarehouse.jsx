import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../apiConfig";
import WarehouseData from "./items/WarehouseData";
import WarehouseHistory from "./items/WarehouseHistory";

export default function AdminWarehouse() {

    const [data, setData] = useState();
    const [products, setProducts] = useState();
    const [history, setHistory] = useState();

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}admin/warehouse`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });
            setProducts(res.data.products);
            setData(res.data.data);
            setHistory(res.data.history);
        } catch (error) {
            console.log(error);
        }
    };

    return <div className={styles.main}>
        <p className={styles.title}>Склад</p>
        <div className={styles.line}>
            {Object.entries({ ring: 'Кольца', earrings: 'Серьги', bracelets: 'Браслеты', necklace: 'Колье' })
                .map(([key, value], index) => <div
                    className={styles.card}
                    key={index}
                >
                    <p className={styles.subtitle}>{value}</p>
                    <p className={styles.title}>{data?.[key]}</p>
                </div>)}
        </div>
        <div className={styles.line}>
            <WarehouseData
                products={products}
                load={load}
            />
            <WarehouseHistory
                history={history}
                products={products}
            />
        </div>
    </div>
};