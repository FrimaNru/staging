import styles from "../styles.module.css";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../apiConfig";

export default function CategoryCards({ initialData }) {
    const [data, setData] = useState(initialData || {});

    useEffect(() => {
        if (!initialData) {
            load();
        }
    }, []);

    const load = async () => {
        await axios.get(`${API_BASE_URL}mainPage/start`)
            .then((res) => { 
                setData(res.data); 
            })
            .catch((e) => console.log(e));
    };

    return (
        <div className={styles.categoryCards}>
            <div className={styles.categoryCardsGrid}>
                <Link href="/catalog/kolcza" className={styles.categoryCard}>
                    <img className={styles.categoryCardImage} src={data?.first?.cover} alt={data?.first?.title || 'Кольца'} />
                    <p className={`${styles.categoryCardText} ${data?.first?.textColor === 'white' ? styles.categoryCardTextLight : styles.categoryCardTextDark}`}>
                        {data?.first?.title || 'Кольца'}
                    </p>
                </Link>
                <Link href="/catalog/kole" className={styles.categoryCard}>
                    <img className={styles.categoryCardImage} src={data?.second?.cover} alt={data?.second?.title || 'Колье'} />
                    <p className={`${styles.categoryCardText} ${data?.second?.textColor === 'white' ? styles.categoryCardTextLight : styles.categoryCardTextDark}`}>
                        {data?.second?.title || 'Колье'}
                    </p>
                </Link>
                <Link href="/catalog/sergi" className={styles.categoryCard}>
                    <img className={styles.categoryCardImage} src={data?.third?.cover} alt={data?.third?.title || 'Серьги'} />
                    <p className={`${styles.categoryCardText} ${data?.third?.textColor === 'white' ? styles.categoryCardTextLight : styles.categoryCardTextDark}`}>
                        {data?.third?.title || 'Серьги'}
                    </p>
                </Link>
                <Link href="/catalog/braslety" className={styles.categoryCard}>
                    <img className={styles.categoryCardImage} src={data?.fourth?.cover} alt={data?.fourth?.title || 'Браслеты'} />
                    <p className={`${styles.categoryCardText} ${data?.fourth?.textColor === 'white' ? styles.categoryCardTextLight : styles.categoryCardTextDark}`}>
                        {data?.fourth?.title || 'Браслеты'}
                    </p>
                </Link>
                <Link href="/catalog/bizhuteriya-pod-zoloto" className={styles.categoryCard}>
                    <img className={styles.categoryCardImage} src="https://mialegria.storage.yandexcloud.net/1742404970040-eaa970a6-e157-498c-aa50-37cc07138a4b-IMG_1543.webp" alt="Бижутерия под золото" />
                    <p className={`${styles.categoryCardText} ${styles.categoryCardTextDark}`}>Бижутерия под золото</p>
                </Link>
                <Link href="/catalog/bizhuteriya-pod-serebro" className={styles.categoryCard}>
                    <img className={styles.categoryCardImage} src="https://mialegria.storage.yandexcloud.net/1742403430451-e60c61a1-1169-4e10-8d9c-ded52cf84696-IMG_1859.webp" alt="Бижутерия под серебро" />
                    <p className={`${styles.categoryCardText} ${styles.categoryCardTextDark}`}>Бижутерия под серебро</p>
                </Link>
            </div>
        </div>
    );
}
