import { formatDate } from "@/lib/Formatting";
import styles from "../styles.module.css";

export default function MessagesTableItem({ item }) {
    return <div className={styles.tableItem}>
        <div className={styles.tableItemValue}>{item.localName}</div>
        <div className={styles.tableItemValue}>{item.type}</div>
        <div className={styles.tableItemValue}>{item.recipients.length}</div>
        <div className={styles.tableItemValue}>{formatDate(item.createdDate)}</div>
    </div>
};