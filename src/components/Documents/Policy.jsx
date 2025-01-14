import styles from "@/styles/Documents.module.css";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import { policyText } from "@/constants/policyText";

export default function Policy() {
    return <div className={styles.main}>
        <Breadcrumb />
        <div className={styles.mainRow}>
            <div className={styles.columnNavigation}>
                <Link href='/delivery'>
                    <p className={`${styles.navigationLink}`}>Доставка и оплата</p>
                </Link>
                <div className={styles.columnNavigationLil}>
                    <p className={`${styles.navigationLink} ${styles.navigationLinkSelect}`}>Политика конфиденциальности</p>
                    <hr className={styles.hrLink} />
                </div>
                <Link href='/documents/agreement'>
                    <p className={`${styles.navigationLink}`}>Пользовательское соглашение</p>
                </Link>
            </div>
            <div className={styles.contentColumn}>
                <p className={styles.textTitle}>Политика конфиденциальности</p>
                {policyText.map((item, index) => <div key={index} className={styles.textColumn}>
                    <p className={styles.textTitle}>{index + 1}. {item.title}</p>
                    <div className={styles.textParagraphsColumn}>
                        {item.paragraphs.map((par, y) => <div key={y} dangerouslySetInnerHTML={{ __html: par }} className={styles.textText} />)}
                    </div>
                </div>)}
            </div>
        </div>
    </div>
};