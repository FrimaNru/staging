import styles from "../../styles.module.css";
import ProductItem from "./ProductItem";

export default function UserBag({ data }) {
    return <div className={styles.card}>
        <p className={styles.subtitle}>Корзина пользователя</p>
        {data.bag.length === 0
            ? <p className={styles.tableNoItems}>Корзина пуста</p>
            : data.bag.map((item, index) => <ProductItem key={index} id={item.id} />)}
    </div>
};