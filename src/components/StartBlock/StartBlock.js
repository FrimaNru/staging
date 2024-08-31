import styles from "@/styles/StartBlock.module.css";
import Link from "next/link";

export function StartBlock() {
    return <div className={styles.main}>
        <div className={styles.line}>
            <div className={styles.block}>
                <p className={styles.blockTitle}>КОЛЬЦА</p>
                <Link href='/catalog?product=ring' style={{ width: 'max-content' }}>
                    <p className={styles.blockButton}>Смотреть</p>
                </Link>
            </div>
            <div className={styles.block2}>
                <p className={styles.blockTitle}>КОЛЬЕ</p>
                <Link href='/catalog?product=necklace' style={{ width: 'max-content' }}>
                    <p className={styles.blockButton}>Смотреть</p>
                </Link>
            </div>
        </div>
        <div className={styles.line}>
            <div className={styles.block6}>
                <p className={styles.blockTitle}>СЕРЬГИ</p>
                <Link href='/catalog?product=earrings' style={{ width: 'max-content' }}>
                    <p className={styles.blockButton}>Смотреть</p>
                </Link>
            </div>
            <div className={styles.block7}>
                <p className={styles.blockTitle}>БРАСЛЕТЫ</p>
                <Link href='/catalog?product=bracelets' style={{ width: 'max-content' }}>
                    <p className={styles.blockButton}>Смотреть</p>
                </Link>
            </div>
        </div>
    </div>
}