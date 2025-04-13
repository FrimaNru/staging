import styles from "./styles.module.css";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../../../../../apiConfig";
import { useToast } from '@chakra-ui/react';
import Button from "@/ui/Button/Button";
import Input from "@/ui/Inputs/Input/Input";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const router = useRouter();

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}allUsers`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });
            setUsers(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const filteredProducts = useMemo(() => {
        return users.filter(item => {
            const searchFilter =
                search === '' ||
                (item.name && item.name.toLowerCase().includes(search.toLowerCase().trim())) ||
                (item.email && item.email.toLowerCase().includes(search.toLowerCase().trim())) ||
                (item.phone && item.phone.replace(/\D/g, '').toLowerCase().includes(search.toLowerCase().trim()));

            return searchFilter;
        });
    }, [users, search]);

    return <div className={styles.main}>
        <p className={styles.title}>Пользователи</p>
        <div className={styles.card}>
            <div className={styles.subtitleLine}>
                <p className={styles.subtitle}>Фильтры</p>
                <Button
                    size="small"
                    variant="delete"
                    onClick={() => {
                        setSearch('');
                    }}
                >Сбросить</Button>
            </div>
            <Input
                placeholder="Введите имя, почту или телефон пользователя"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        <div className={styles.card}>
            <p className={styles.subtitle}>Пользователи</p>
            <div>
                <div className={styles.tableHeader}>
                    <p className={styles.tableHeaderItem}>Имя</p>
                    <p className={styles.tableHeaderItem}>Телефон</p>
                    <p className={styles.tableHeaderItem}>Почта</p>
                    <p className={styles.tableHeaderItem}>Заказов</p>
                    <p className={styles.tableHeaderItem}>Пол</p>
                    <p className={`${styles.tableHeaderItem} ${styles.alignTextRight}`}>Действие</p>
                </div>
                <div className={styles.tableContent}>
                    {filteredProducts.length > 0
                        ? filteredProducts.map((item, index) => (
                            <div key={index} className={styles.tableItem}>
                                <div className={styles.tableItemValue}>{item.name}</div>
                                <div className={styles.tableItemValue}>{item.phone || '-'} {item.isVerifiedPhone && '✔'}</div>
                                <p className={styles.tableItemValue}>{item.email}</p>
                                <div className={styles.tableItemValue}>{item.orders.length}</div>
                                <div className={styles.tableItemValue}>{item.personalData?.sex || '-'}</div>
                                <div className={`${styles.tableItemValue} ${styles.alignRight}`}>
                                    <Button
                                        variant="download"
                                        size="small"
                                        onClick={() => router.push(`/adminpanel?page=user&id=${item._id}`)}
                                    >
                                        Подробнее
                                    </Button>
                                </div>
                            </div>
                        ))
                        : <p className={styles.tableNoItems}>Нет пользователей</p>
                    }
                </div>
            </div>
        </div>
    </div>
};