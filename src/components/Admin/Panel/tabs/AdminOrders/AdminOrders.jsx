import styles from "@/styles/Admin/Orders/Order.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../../../../apiConfig";
import OrderCard from "./items/OrderCard";
import CustomMenu from "@/components/Common/Menu/Menu";
import { ORDER_STATUSES_ADMIN } from "@/constants/constants.text";

export default function AdminOrders() {
    const [data, setData] = useState(null);
    const [type, setType] = useState("active");
    const [sortType, setSortType] = useState("Статус");
    const [search, setSearch] = useState("");

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

        if (type === "active") {
            return searchFilter && statusFilter && item.status !== "complete" && item.status !== "canceled";
        } else if (type === "complete") {
            return searchFilter && statusFilter && (item.status === "complete" || item.status === "canceled");
        }

        return false;
    });

    const dropdownItems =
        type === "active"
            ? Object.keys(ORDER_STATUSES_ADMIN)
                  .filter((key) => key !== "complete" && key !== "canceled")
                  .map((key) => ORDER_STATUSES_ADMIN[key])
            : Object.keys(ORDER_STATUSES_ADMIN)
                  .filter((key) => key === "complete" || key === "canceled")
                  .map((key) => ORDER_STATUSES_ADMIN[key]);

    return (
        <div className={styles.main}>
            <p className={styles.title}>Заказы</p>
            <div className={styles.mainLine}>
                <button
                    className={`${styles.mainButton} ${type === "active" ? styles.mainButtonSelect : ""}`}
                    onClick={() => setType("active")}
                >
                    Активные заказы
                </button>
                <button
                    className={`${styles.mainButton} ${type === "complete" ? styles.mainButtonSelect : ""}`}
                    onClick={() => setType("complete")}
                >
                    Выполненные заказы и возврат
                </button>
            </div>
            <div className={styles.filterLine}>
                <input
                    className={styles.mainInput}
                    placeholder="Введите номер заказа или ИМ номер"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className={styles.filterBox}>
                    <CustomMenu title={sortType} items={dropdownItems} setState={setSortType} />
                </div>
            </div>
            <div className={styles.table}>
                {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                        <OrderCard
                            item={item}
                            key={index}
                            load={load}
                            complete={type === "complete"}
                        />
                    ))
                ) : (
                    <p className={styles.noOrders}>По заданным фильтрам не найдены заказы</p>
                )}
            </div>
        </div>
    );
}