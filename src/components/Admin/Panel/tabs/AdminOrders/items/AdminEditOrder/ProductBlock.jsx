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
        <div className={styles.productContent}>
            <div className={styles.productsColumn}>
                {productsWithCount.map((item, index) => (
                    <ProductItem key={index} item={item} />
                ))}
            </div>
            <div className={styles.productsTotalBlock}>
                <p className={styles.productsTotalTitle}>Итого</p>
                <div className={styles.productsTotalColumn}>
                    <p className={styles.productsTotalSubtitle}>Товаров на сумму</p>
                    <p className={styles.productsTotalCost}>{formatNumber(order.total)} руб.</p>
                </div>
            </div>
        </div>
    );
};
