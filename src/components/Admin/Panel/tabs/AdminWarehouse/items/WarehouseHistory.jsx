import styles from "../styles.module.css";

export default function WarehouseHistory({ history, products }) {

    const variants = {
        'supply': 'Поставка',
        'write-downs': 'Списание',
        'sale': 'Продажа'
    }

    return <div className={styles.card}>
        <p className={styles.subtitle}>История изменений</p>
        <div className={styles.column}>
            <div className={styles.tableHeader}>
                <p className={styles.tableHeaderItemMiddle}>Название</p>
                <p className={`${styles.tableHeaderItemMiddle} ${styles.alignTextCenter}`}>Тип операции</p>
                <p className={`${styles.tableHeaderItemMiddle} ${styles.alignTextRight}`}>Количество</p>
            </div>
            {history && history.length > 0
                ? history.map((item, index) => (
                    <div className={styles.tableItem} key={index}>
                        <p className={styles.tableItemValueMiddle}>{products.find(product => product._id === item.product).name}</p>
                        <p className={`${styles.tableItemValueMiddle} ${styles.alignTextCenter}`}>{variants[item.variant]}</p>
                        <p className={`${styles.tableItemValueMiddle} ${styles.alignTextRight}`}>{item.count}</p>
                    </div>
                ))
                : <p className={styles.tableNoItems}>История изменений на найдена</p>}
        </div>
    </div>
};