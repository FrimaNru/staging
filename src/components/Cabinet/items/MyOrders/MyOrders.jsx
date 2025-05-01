import styles from "@/styles/MyOrders.module.css";
import { useRouter } from "next/router";
import React from "react";
import { useUser } from "@/contexts/UserContext";
import OrderItem from "./items/OrderItem";

export default function MyOrders() {

    const router = useRouter();
    const { user, isLoadingUser } = useUser();

    if (isLoadingUser) return <p>Загрузка...</p>;

    return <div className={styles.main}>
        <hr className={`${styles.hr} ${styles.hrMobile}`} />
        <p className={styles.titleMobile}>МОИ ЗАКАЗЫ</p>
        <hr className={`${styles.hr} ${styles.hrMobile}`} />
        {user.orders.length === 0
            ? <>
                <p className={styles.noOrderTitle} >К сожалению, у вас нет текущих заказов</p>
                <button className={styles.noOrderButton} onClick={() => router.push('/catalog')}>В КАТАЛОГ</button>
                <hr className={styles.hr} />
            </>
            : <div className={styles.bigColumn}>
                {user.orders.length > 0 && [...user.orders].reverse().map((item, index) => <OrderItem item={item} key={index} index={index} />)}
            </div>}
    </div>
};