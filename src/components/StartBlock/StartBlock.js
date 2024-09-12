import styles from "@/styles/StartBlock.module.css";
import { useRouter } from "next/router";

export function StartBlock() {

    const router = useRouter();

    return <div className={styles.main}>
        <div className={styles.line}>
            <div className={styles.block} onClick={() => router.push('/catalog?product=ring')}>
                <div className={styles.blockImage} />
                <p className={styles.blockText}>КОЛЬЦА</p>
            </div>
            <div className={styles.block2} onClick={() => router.push('/catalog?product=necklace')}>
                <div className={styles.blockImage2} />
                <p className={styles.blockText}>КОЛЬЕ</p>
            </div>
        </div>
        <div className={styles.line}>
            <div className={styles.block6} onClick={() => router.push('/catalog?product=earrings')}>
                <div className={styles.blockImage6} />
                <p className={styles.blockText}>СЕРЬГИ</p>
            </div>
            <div className={styles.block7} onClick={() => router.push('/catalog?product=bracelets')}>
                <div className={styles.blockImage7} />
                <p className={styles.blockText}>БРАСЛЕТЫ</p>
            </div>
        </div>
    </div>
}