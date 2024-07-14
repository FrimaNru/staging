import styles from "@/styles/Header.module.css";
import Link from "next/link";

export function Header() {

    const links = [{ text: 'Новинки', link: '/' }, { text: 'Каталог', link: '/' }, { text: 'Доставка', link: '/' }, { text: 'О бренде', link: '/' }, { text: 'Частые вопросы', link: '/' }];

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
                {links.map((x, i) => <p key={i} className={styles.linkItem} >{x.text}</p>)}
            </div>
            <hr className={styles.hr} />
        </div>
    </div>
}