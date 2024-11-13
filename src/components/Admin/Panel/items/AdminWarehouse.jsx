import axios from "axios";
import styles from "@/styles/Admin.module.css";
import { useEffect, useState } from "react"
import { API_BASE_URL } from "../../../../../apiConfig";

export default function AdminWarehouse() {

    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        axios.get(`${API_BASE_URL}getAllProducts`, { headers: {Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}`} })
            .then((res) => {
                setData(res.data);
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.dashboard}>
        <p className={styles.title}>Склад</p>
        <input placeholder="Введите артикул товара или название" className={styles.warehouseInput} onChange={(e) => setSearch(e.target.value)} />
        <div className={styles.warehouseColumn}>
            {data.length > 0
                ? (data.filter(x => (x.articles.some(y => y.includes(search)) || x.name.includes(search))).length > 0
                    ? data.filter(x => (x.articles.some(y => y.includes(search)) || x.name.includes(search))).map((x, i) => <div key={i} className={styles.warehouseItem}>
                        <img src={`https://api.mi-alegria.shop/uploads/${x.cover}`} className={styles.warehouseItemCover} />
                        <p className={styles.warehouseItemName}>{x.name}</p>
                        <p className={styles.warehouseItemTotalCount}>Всего: {x.totalCount}</p>
                        <div className={styles.warehouseItemCountsColumn} >
                            {x.articles.map((y, n) => <p key={n} className={styles.warehouseItemTotalCountItem}>{y} ({x.colors[n]}) - <span style={{ fontFamily: 'Dela Gothic One' }} >{x.counts[n]}</span> шт.</p>)}
                        </div>
                    </div>)
                    : <p>Товаров по поиску не найденно</p>
                )
                : <p>Товаров нет или они ещё не загрузились</p>}
        </div>
    </div>
};