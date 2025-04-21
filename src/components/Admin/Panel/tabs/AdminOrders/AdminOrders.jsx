import styles from "@/styles/Admin/Orders/Order.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../../../../apiConfig";
import OrderCard from "./items/OrderCard";
import { ORDER_STATUSES_ADMIN } from "@/constants/constants.text";
import OrderFilter from "./items/OrderFilter";
import OrderLine from "./items/OrderLine";

export default function AdminOrders() {
    const [data, setData] = useState(null);
    const [sortType, setSortType] = useState("Статус");
    const [search, setSearch] = useState("");
    const [productsView, setProductsView] = useState('blocks');
    const [onlyActive, setOnlyActive] = useState(false);
    const [onlyNotActive, setOnlyNotActive] = useState(false);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}admin/orders`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("tokenAdmin")}` },
            });
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    if (!data) return <p>Загрузка...</p>;

    const filteredData = data.filter((item) => {
        const searchFilter =
            search === "" ||
            (item.number && String(item.number).toLowerCase().includes(search.toLowerCase())) ||
            (item.cdekId && item.cdekId.toLowerCase().includes(search.toLowerCase()));

        const statusFilter =
            sortType === "Статус" || item.status === Object.keys(ORDER_STATUSES_ADMIN).find((key) => ORDER_STATUSES_ADMIN[key] === sortType);

        if (!onlyActive && !onlyNotActive) {
            return searchFilter && statusFilter
        } else if (onlyActive) {
            return searchFilter && statusFilter && item.status !== "complete" && item.status !== "canceled";
        } else if (onlyNotActive) {
            return searchFilter && statusFilter && (item.status === "complete" || item.status === "canceled");
        }

        return false;
    });

    return (
        <div className={styles.main}>
            <p className={styles.title}>Заказы</p>
            <OrderFilter
                search={search}
                setSearch={setSearch}
                sortType={sortType}
                setSortType={setSortType}
                productsView={productsView}
                setProductsView={setProductsView}
                onlyActive={onlyActive}
                setOnlyActive={setOnlyActive}
                setOnlyNotActive={setOnlyNotActive}
                onlyNotActive={onlyNotActive}
            />
            <div className={styles.card}>
                <p className={styles.subtitle}>Заказы</p>
                {productsView === 'blocks'
                    ? <div className={styles.grid}>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <OrderCard
                                    item={item}
                                    key={index}
                                    load={load}
                                    complete={item.status === 'complete' || item.status === 'canceled'}
                                />
                            ))
                        ) : (
                            <p className={styles.noOrders}>Заказы не найдены</p>
                        )}
                    </div>
                    : <div className={styles.table}>
                        <div className={styles.tableHeader}>
                            <p className={styles.tableHeaderItem}>Номер</p>
                            <p className={styles.tableHeaderItem}>Дата создания</p>
                            <p className={styles.tableHeaderItem}>Цена</p>
                            <p className={styles.tableHeaderItem}>Статус</p>
                            <p className={`${styles.tableHeaderItem} ${styles.alignTextRight}`}>Действие</p>
                        </div>
                        <div className={styles.tableContent}>
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                    <OrderLine
                                        item={item}
                                        key={index}
                                        complete={item.status === 'complete' || item.status === 'canceled'}
                                    />
                                ))
                            ) : (
                                <p className={styles.noOrders}>Заказы не найдены</p>
                            )}
                        </div>
                    </div>}
            </div>
        </div>
    );
}