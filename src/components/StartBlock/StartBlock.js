import styles from "@/styles/StartBlock.module.css";

export function StartBlock() {
    return <div className={styles.main}>
        <div className={styles.line}>
            <div className={styles.block}>
                <p className={styles.blockTitle}>КОЛЬЦА</p>
                <p className={styles.blockButton}>Смотреть</p>
            </div>
            <div className={styles.block2}>
                <p className={styles.blockTitle}>КОЛЬЕ</p>
                <p className={styles.blockButton}>Смотреть</p>
            </div>
        </div>
        <div className={styles.line}>
            <div className={styles.block3}>
                <p className={styles.blockTitle}>СЕРЬГИ</p>
                <p className={styles.blockButton}>Смотреть</p>
            </div>
            <div className={styles.block4}>
                <p className={styles.blockTitle}>БРАСЛЕТЫ</p>
                <p className={styles.blockButton}>Смотреть</p>
            </div>
            <div className={styles.block5}>
                <p className={styles.blockTitle}>ЦЕПОЧКИ</p>
                <p className={styles.blockButton}>Смотреть</p>
            </div>
        </div>
        <div className={styles.line}>
            <div className={styles.block6}>
                <p className={styles.blockTitle}>ЖЕНЩИНАМ</p>
                <p className={styles.blockButton}>Смотреть</p>
            </div>
            <div className={styles.block7}>
                <p className={styles.blockTitle}>МУЖЧИНАМ</p>
                <p className={styles.blockButton}>Смотреть</p>
            </div>
        </div>
    </div>
}