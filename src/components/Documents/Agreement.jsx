import styles from "@/styles/Documents.module.css";
import Link from "next/link";
import { agreementText } from "@/constans/agreementText";
import Breadcrumb from "@/components/Common/Breadcrumb";

export default function Agreement() {
    return <div className={styles.main}>
        <Breadcrumb />
        <div className={styles.mainRow}>
            <div className={styles.columnNavigation}>
                <Link href='/delivery'>
                    <p className={`${styles.navigationLink}`}>Доставка и оплата</p>
                </Link>
                <Link href='/documents/policy'>
                    <p className={`${styles.navigationLink}`}>Политика конфиденциальности</p>
                </Link>
                <div className={styles.columnNavigationLil}>
                    <p className={`${styles.navigationLink} ${styles.navigationLinkSelect}`}>Пользовательское соглашение</p>
                    <hr className={styles.hrLink} style={{ width: '186px' }} />
                </div>
            </div>
            <div className={styles.contentColumn}>
                <p className={styles.textTitle}>Пользовательское соглашение</p>
                {agreementText.map((item, index) => <div key={index} className={styles.textColumn}>
                    <p className={styles.textTitle}>{index + 1}. {item.title}</p>
                    <div className={styles.textParagraphsColumn}>
                        {item.paragraphs.map((par, y) => <div key={y} dangerouslySetInnerHTML={{ __html: par }} className={styles.textText} />)}
                    </div>
                </div>)}
            </div>
        </div>
    </div>
};