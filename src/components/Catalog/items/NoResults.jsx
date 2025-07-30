import styles from "../styles.module.css";
import { useRouter } from "next/router";

export default function NoResults({ text }) {
    const router = useRouter();

    return (
        <div className={styles.noFindProductsColumnBig}>
            <div className={styles.noFindProductsColumn}>
                <p className={styles.noFindProductsTitle}>По запросу "{text}" ничего не найдено</p>
                <p className={styles.noFindProductsText}>По вашему запросу ничего не найдено. Проверьте, правильно ли введен запрос.</p>
            </div>
            <button className={styles.noFindProductsButton} onClick={() => router.push('/catalog')}>В КАТАЛОГ</button>
        </div>
    );
}