import styles from "@/styles/Header.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

export function Header() {

    const router = useRouter();

    const links = [{ text: 'Новинки', link: '/catalog?filter=new' }, { text: 'Каталог', link: '/catalog' }, { text: 'Доставка', link: '/delivery' }, { text: 'О бренде', link: '/brand' }, { text: 'Частые вопросы', link: '/faq' }];

    return <div className={styles.main}>
        <div className={styles.firstLine} >
            <Link href='/' style={{ width: 'max-content' }} >
                <img src='/logo.svg' className={styles.logo} />
            </Link>
            <div className={styles.searchBlock} >
                <img src='/searchIcon.svg' className={styles.searchBlockIcon} />
                <input className={styles.searchBlockInput} placeholder="Поиск по каталогу" />
            </div>
            <div className={styles.iconLine} >
                <img src='/favIcon.svg' className={styles.icon} />
                <img src='/userIcon.svg' className={styles.icon} />
                <img src='/shopIcon.svg' className={styles.icon} />
            </div>
        </div>
        <div className={styles.secondLine}>
            <hr className={styles.hr} />
            <div className={styles.linkLine} >
                {links.map((x, i) => <Link key={i} href={x.link} style={{ width: 'max-content' }} >
                    <p className={`${styles.linkItem} ${router.pathname === x.link && styles.linkItemSelect}`} >{x.text}</p>
                </Link>)}
            </div>
            <hr className={styles.hr} />
        </div>
    </div>
}