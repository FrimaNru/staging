import { useEffect, useState } from "react";
import styles from "../styles.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../../apiConfig";
import { useRouter } from "next/router";
import UserMainInfo from "./items/UserMainInfo";
import UserOrders from "./items/UserOrders";
import UserBag from "./items/UserBag";
import UserFavourite from "./items/UserFavourite";
import Button from "@/ui/Button/Button";

export default function AdminUser() {

    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState(null);

    useEffect(() => { load(); }, [id]);

    const load = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}admin/users/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    if (!data) return <p>Загрузка...</p>;

    const deleteUser = async () => {
        try {
            await axios.delete(`${API_BASE_URL}admin/users/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });
            router.push('/adminpanel?page=users');
        } catch (error) {
            console.log(error);
        }
    };

    return <div className={styles.main}>
        <div className={styles.subtitleLine}>
            <p className={styles.title}>{data?.name} {data?.personalData.lastName}</p>
            <Button
                variant="delete"
                size="small"
                onClick={deleteUser}
            >Удалить пользователя</Button>
        </div>
        <div className={styles.grid}>
            <UserMainInfo data={data} />
            <UserOrders data={data} />
            <UserBag data={data} />
            <UserFavourite data={data} />
        </div>
    </div>
};