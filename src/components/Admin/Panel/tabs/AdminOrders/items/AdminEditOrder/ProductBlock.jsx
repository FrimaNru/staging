import styles from "@/styles/Admin/Orders/Order.module.css";
import { formatNumber } from "@/lib/Formatting";
import ProductItem from "./ProductItem";

export default function ProductBlock({ order }) {
    const groupedProducts = order.products.reduce((acc, item) => {
        const key = JSON.stringify({ id: item.id, article: item.article, size: item.size, color: item.color });

        if (!acc[key]) {
            acc[key] = { ...item, count: 1 };
        } else {
            acc[key].count += 1;
        }
        return acc;
    }, {});

    const productsWithCount = Object.values(groupedProducts);

    return (
        <div className={`${styles.card} ${styles.card50}`}>
            <div className={styles.productsTotalBlock}>
                <p className={styles.subtitle}>Итого</p>
                <p className={styles.productsTotalCost}>{formatNumber(order.total)} руб.</p>
            </div>
            <div className={styles.productsColumn}>
                {productsWithCount.map((item, index) => (
                    <ProductItem key={index} item={item} />
                ))}
            </div>
        </div >
    );
};
