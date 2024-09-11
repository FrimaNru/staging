import styles from "@/styles/StartBlock.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

export function StartBlock() {

    const router = useRouter();

    return <div className={styles.main}>
        <div className={styles.line}>
            <div className={styles.block} onClick={() => router.push('/catalog?product=ring')}>КОЛЬЦА</div>
            <div className={styles.block2} onClick={() => router.push('/catalog?product=necklace')}>КОЛЬЕ</div>
        </div>
        <div className={styles.line}>
            <div className={styles.block6} onClick={() => router.push('/catalog?product=earrings')}>СЕРЬГИ</div>
            <div className={styles.block7} onClick={() => router.push('/catalog?product=bracelets')}>
                <p className={styles.blockText}>БРАСЛЕТЫ</p>
            </div>
        </div>
    </div>
}