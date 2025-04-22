import { useEffect, useState } from "react";
import MessagesFilter from "./items/MessagesFilter";
import styles from "./styles.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../apiConfig";
import Button from "@/ui/Button/Button";
import MessagesTableItem from "./items/MessagesTableItem";
import MessagesCreateModal from "./items/MessagesCreateModal";

export default function AdminMessages() {

    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}admin/messages`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const filteredData = data.filter((item) => {
        const searchFilter =
            search === "" ||
            (item.localName && item.localName.toLowerCase().includes(search.toLowerCase()));

        return searchFilter;
    });

    return <div className={styles.main}>
        <p className={styles.title}>Рассылка</p>
        <MessagesFilter
            search={search}
            setSearch={setSearch}
        />
        <div className={styles.card}>
            <div className={styles.subtitleLine}>
                <p className={styles.subtitle}>Рассылки</p>
                <Button
                    variant="success"
                    size="small"
                    onClick={() => setIsOpen(true)}
                >
                    Создать новую рассылку
                </Button>
            </div>
            <div className={styles.table}>
                <div className={styles.tableHeader}>
                    <p className={styles.tableHeaderItem}>Локальное имя</p>
                    <p className={styles.tableHeaderItem}>Тип рассылки</p>
                    <p className={styles.tableHeaderItem}>Получателей</p>
                    <p className={styles.tableHeaderItem}>Дата создания</p>
                </div>
                <div className={styles.tableContent}>
                    {filteredData.length > 0 ? (
                        [...filteredData].reverse().map((item, index) => (
                            <MessagesTableItem
                                item={item}
                                key={index}
                            />
                        ))
                    ) : (
                        <p className={styles.noItems}>Рассылки не найдены</p>
                    )}
                </div>
            </div>
            <MessagesCreateModal isOpen={isOpen} setIsOpen={setIsOpen} load={load} />
        </div>
    </div>
};