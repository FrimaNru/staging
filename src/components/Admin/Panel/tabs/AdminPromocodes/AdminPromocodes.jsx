import { useEffect, useState } from "react";
import PromocodesFilter from "./items/PromocodesFilter";
import styles from "./styles.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../apiConfig";
import Button from "@/ui/Button/Button";
import PromocodesTableItem from "./items/PromocodesTableItem";
import PromocodesCreateModal from "./items/PromocodesCreateModal";

export default function AdminPromocodes() {

    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}admin/promocodes`, { 
                headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } 
            });
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const filteredData = data.filter((item) => {
        const searchFilter =
            search === "" ||
            (item.title && item.title.toLowerCase().includes(search.toLowerCase())) ||
            (item.name && item.name.toLowerCase().includes(search.toLowerCase()));
        return searchFilter;
    });

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Вы уверены, что хотите удалить этот промокод?')) return;
        try {
            await axios.delete(`${API_BASE_URL}admin/promocodes/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` }
            });
            load();
        } catch (error) {
            console.log(error);
        }
    };

    return <div className={styles.main}>
        <p className={styles.title}>Промокоды</p>
        <PromocodesFilter
            search={search}
            setSearch={setSearch}
        />
        <div className={styles.card}>
            <div className={styles.subtitleLine}>
                <p className={styles.subtitle}>Промокоды</p>
                <Button
                    variant="success"
                    size="small"
                    onClick={() => {
                        setEditingItem(null);
                        setIsOpen(true);
                    }}
                >
                    Создать новый промокод
                </Button>
            </div>
            <div className={styles.table}>
                <div className={styles.tableHeader}>
                    <p className={styles.tableHeaderItem}>Промокод</p>
                    <p className={styles.tableHeaderItem}>Тип</p>
                    <p className={styles.tableHeaderItem}>Сумма/Процент</p>
                    <p className={styles.tableHeaderItem}>Мин. сумма</p>
                    <p className={styles.tableHeaderItem}>Действует до</p>
                    <p className={styles.tableHeaderItem}>Использований</p>
                    <p className={styles.tableHeaderItem}>Действия</p>
                </div>
                <div className={styles.tableContent}>
                    {filteredData.length > 0 ? (
                        [...filteredData].reverse().map((item, index) => (
                            <PromocodesTableItem
                                item={item}
                                key={index}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <p className={styles.noItems}>Промокоды не найдены</p>
                    )}
                </div>
            </div>
            <PromocodesCreateModal 
                isOpen={isOpen} 
                setIsOpen={setIsOpen} 
                load={load}
                editingItem={editingItem}
            />
        </div>
    </div>
};

