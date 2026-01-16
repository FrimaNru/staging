import styles from "../styles.module.css";
import ProductItem from "./ProductItem";
import { useMemo } from "react";

export default function ProductGrid({ filteredData }) {
    // Мемоизируем группировку товаров в ряды для оптимизации
    const rows = useMemo(() => {
        return filteredData.reduce((rows, item, index) => {
            if (index % 3 === 0) rows.push([]);
            rows[rows.length - 1].push(item);
            return rows;
        }, []);
    }, [filteredData]);

    return (
        <div className={styles.lineOrdersContainer}>
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className={styles.rowIndex}>
                    <div className={styles.lineOrders}>
                        {row.map((x) => (
                            <ProductItem key={`${x._id}-${x.article}`} product={x} />
                        ))}
                    </div>
                    {rowIndex < rows.length - 1 && <hr className={styles.orderHr} />}
                </div>
            ))}
        </div>
    );
}