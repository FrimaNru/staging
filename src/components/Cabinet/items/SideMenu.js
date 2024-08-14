import styles from "@/styles/Cabinet.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

export function SideMenu() {

    const router = useRouter();
    const { page } = router.query;

    const links = [
        { text: 'Личные данные', link: 'personaldata' },
        { text: 'Мои заказы', link: 'myorders' },
        { text: 'Избранное', link: 'favourites' },
        { text: 'История заказов', link: 'historyorders' }
    ];

    return <div className={styles.sideMenu}>
        <div className={styles.sideMenuColumn}>
            {links.map((x, i) => <Link key={i} href={`/cabinet?page=${x.link}`} style={{ width: 'max-content' }}>
                <p className={`${styles.sideMenuItem} ${page === x.link && styles.sideMenuItemSelect}`}>{x.text}</p>
            </Link>)}
        </div>
        <div className={styles.logOutButton} onClick={() => {
            localStorage.removeItem('token');
            router.push('/');
        }}>
            <p className={styles.logOutButtonText}>Выйти</p>
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 11.5L6 6.5L1 1.5" stroke="#140702" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </div>
    </div>
}