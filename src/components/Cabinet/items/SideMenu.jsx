import styles from "@/styles/Cabinet.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { useEffect } from "react";
import { API_BASE_URL } from "../../../../apiConfig";
import { useUser } from "@/contexts/UserContext";
import { useFavourite } from "@/contexts/FavouriteContext";

export default function SideMenu() {

    const router = useRouter();
    const { page } = router.query;
    const { clearUser } = useUser();
    const { startSetFavourite } = useFavourite();

    const links = [
        { text: 'Личные данные', link: 'personaldata' },
        { text: 'Мои заказы', link: 'myorders' },
        { text: 'Избранное', link: 'favourites' },
        { text: 'История заказов', link: 'historyorders' }
    ];

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        await axios.get(`${API_BASE_URL}getUser`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .catch((e) => {
                console.log(e);
                if (e?.response?.status === 404 || e?.response?.status === 401) {
                    localStorage.removeItem('token');
                    router.push('/');
                }
            });
    };

    return <div className={styles.sideMenuBox} >
        <div className={styles.sideMenu}>
            <div className={styles.sideMenuColumn}>
                {links.map((x, i) => <Link key={i} href={`/cabinet?page=${x.link}`} style={{ width: 'max-content' }}>
                    <p className={`${styles.sideMenuItem} ${page === x.link && styles.sideMenuItemSelect}`}>{x.text}</p>
                </Link>)}
            </div>
            <div className={styles.logOutButton} onClick={() => {
                clearUser();
                startSetFavourite([]);
                localStorage.removeItem('token');
                router.push('/');
            }}>
                <p className={styles.logOutButtonText}>Выйти</p>
                <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 11.5L6 6.5L1 1.5" stroke="#140702" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
        </div>
    </div>
}