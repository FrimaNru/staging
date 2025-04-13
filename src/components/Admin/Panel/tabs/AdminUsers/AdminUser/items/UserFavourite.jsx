import styles from "../../styles.module.css";
import ProductItem from "./ProductItem";

export default function UserFavourite({ data }) {
    return <div className={styles.card}>
        <p className={styles.subtitle}>Избранное пользователя</p>
        {data.favourite.length === 0
            ? <p className={styles.tableNoItems}>Нет избранных товаров</p>
            : data.favourite.map((item, index) => <ProductItem key={index} id={item.id} />)}
    </div>
};