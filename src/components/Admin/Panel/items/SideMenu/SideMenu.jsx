import styles from "./styles.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

export function SideMenu() {

    const router = useRouter();

    const links = [
        { text: 'Пользователи', link: 'users', icon: '/assets/icons/users.svg' },
        { text: 'Заказы', link: 'orders', icon: '/assets/icons/orders.svg' },
        { text: 'Товары', link: 'products', icon: '/assets/icons/basket.svg' },
        { text: 'Склад', link: 'warehouse', icon: '/assets/icons/warehouse.svg' },
        { text: 'Баннеры', link: 'banners', icon: '/assets/icons/banners.svg' },
        { text: 'Рассылка', link: 'messages', icon: '/assets/icons/messages.svg' },
        { text: 'Промокоды', link: 'promocodes', icon: '/assets/icons/promo1.svg' }
    ];

    return <div className={styles.sideMenu}>
        <div className={styles.sideMenuContent}>
            <Link href='/'>
                <img src='/logo.svg' className={styles.sideMenuLogo} />
            </Link>
            <div className={styles.sideMenuColumn}>
                {links.map((item, i) => <Link key={i} href={`/adminpanel?page=${item.link}`}>
                    <div className={`${styles.sideMenuItemBox} ${router.query.page === item.link && styles.sideMenuItemBoxSelect}`}>
                        <img src={item.icon} className={styles.itemIcon} />
                        <p className={styles.sideMenuItem}>{item.text}</p>
                    </div>
                </Link>)}
            </div>
        </div>
        <div className={styles.logOutButton} onClick={() => {
            localStorage.removeItem('tokenAdmin');
            router.push('/admin');
        }}>
            <img src="/assets/icons/lilArrow.svg" className={styles.logOutButtonIcon} />
            <p className={styles.logOutButtonText}>Выйти</p>
        </div>
    </div>
}