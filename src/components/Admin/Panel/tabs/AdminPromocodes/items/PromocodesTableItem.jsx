import { formatDate } from "@/lib/Formatting";
import styles from "../styles.module.css";
import Button from "@/ui/Button/Button";

export default function PromocodesTableItem({ item, onEdit, onDelete }) {
    const formatValue = () => {
        if (item.type === 'fix') {
            return `${item.value || 0} руб.`;
        } else {
            return `${item.value || 0}%`;
        }
    };

    return <div className={styles.tableItem}>
        <div className={styles.tableItemValue}>{item.title || '-'}</div>
        <div className={styles.tableItemValue}>{item.type === 'fix' ? 'Фиксированная' : 'Процент'}</div>
        <div className={styles.tableItemValue}>{formatValue()}</div>
        <div className={styles.tableItemValue}>{item.available ? `${item.available} руб.` : 'Любая'}</div>
        <div className={styles.tableItemValue}>{formatDate(item.date_off)}</div>
        <div className={styles.tableItemValue}>{item.count_of_use || 0}</div>
        <div className={styles.tableItemValue}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                    variant="secondary"
                    size="small"
                    onClick={() => onEdit(item)}
                >
                    Редактировать
                </Button>
                <Button
                    variant="delete"
                    size="small"
                    onClick={() => onDelete(item._id)}
                >
                    Удалить
                </Button>
            </div>
        </div>
    </div>
};

