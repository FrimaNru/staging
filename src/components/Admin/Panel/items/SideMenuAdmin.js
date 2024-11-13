import styles from "@/styles/Admin.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

export function SideMenuAdmin() {

    const router = useRouter();
    const links = [{ text: 'Дашборд', link: 'dashboard' }, { text: 'Заказы', link: 'orders' }, { text: 'Товары', link: 'products' }, { text: 'Склад', link: 'warehouse' }];

    return <div className={styles.sideMenu}>
        <div className={styles.sideMenuContent}>
            <Link href='/' className="link" >
                <img src='/logo.svg' className={styles.sideMenuLogo} />
            </Link>
            <div className={styles.sideMenuColumn}>
                {links.map((x, i) => <Link key={i} href={`/adminpanel?page=${x.link}`}>
                    <p className={`${styles.sideMenuItem} ${router.query.page === x.link && styles.sideMenuItemSelect}`}>{x.text}</p>
                </Link>)}
            </div>
        </div>
        <div className={styles.logOutButton} onClick={() => {
            localStorage.removeItem('tokenAdmin');
            router.push('/');
        }}>
            <p className={styles.sideMenuItem}>Выйти</p>
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 11.5L6 6.5L1 1.5" stroke="#140702" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </div>
    </div>
}