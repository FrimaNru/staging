import { ORDER_STATUSES_ADMIN } from "@/constants/constants.text";
import { formatDate, formatNumber } from "@/lib/Formatting";
import styles from "@/styles/Admin/Orders/Order.module.css";
import Button from "@/ui/Button/Button";
import Link from "next/link";

export default function OrderLine({ item, complete }) {
    return <div className={`${styles.tableItem} ${!item.isVisible ? styles.productsGridItemHide : ''}`}>
        <div className={styles.tableItemValue}>№ {item.number}</div>
        <div className={styles.tableItemValue}>{formatDate(item.createDate)}</div>
        <div className={styles.tableItemValue}>{formatNumber(item.total)}</div>
        <div className={styles.tableItemValue}>{ORDER_STATUSES_ADMIN[item.status]}</div>
        <div className={`${styles.tableItemValue} ${styles.alignRight}`}>
            <Link href={`/adminpanel?page=editOrder&id=${item._id}${complete ? '&complete=true' : ''}`} className="link">
                <Button
                    size="small"
                    variant="download"
                >Подробнее</Button>
            </Link>
        </div>
    </div>
};