import styles from "@/styles/Catalog.module.css";
import ProductItem from "./ProductItem";

export default function ProductGrid({ filteredData }) {
    return (
        <div className={styles.lineOrdersContainer}>
            {filteredData.reduce((rows, item, index) => {
                if (index % 3 === 0) rows.push([]);
                rows[rows.length - 1].push(item);
                return rows;
            }, []).map((row, rowIndex, arr) => (
                <div key={rowIndex} className={styles.rowIndex}>
                    <div className={styles.lineOrders}>
                        {row.map((x, i) => (
                            <ProductItem key={i} product={x} />
                        ))}
                    </div>
                    {rowIndex < arr.length - 1 && <hr className={styles.orderHr} />}
                </div>
            ))}
        </div>
    );
}