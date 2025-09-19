import styles from "../styles.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../apiConfig";

export default function CategoryCards() {
    const router = useRouter();
    const [data, setData] = useState({});
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { 
        setIsMounted(true);
        load(); 
    }, []);

    const load = async () => {
        await axios.get(`${API_BASE_URL}mainPage/start`)
            .then((res) => { 
                setData(res.data); 
            })
            .catch((e) => console.log(e));
    };

    // Не рендерим компонент до монтирования на клиенте
    if (!isMounted) {
        return null;
    }

    return (
        <div className={styles.categoryCards}>
            <div className={styles.categoryCardsGrid}>
                <div className={styles.categoryCard} onClick={() => router.push('/catalog/kolcza')}>
                    <img className={styles.categoryCardImage} src={data?.first?.cover} />
                    <p className={`${styles.categoryCardText} ${data?.first?.textColor === 'white' ? styles.categoryCardTextLight : styles.categoryCardTextDark}`}>
                        {data?.first?.title}
                    </p>
                </div>
                <div className={styles.categoryCard} onClick={() => router.push('/catalog/kole')}>
                    <img className={styles.categoryCardImage} src={data?.second?.cover} />
                    <p className={`${styles.categoryCardText} ${data?.second?.textColor === 'white' ? styles.categoryCardTextLight : styles.categoryCardTextDark}`}>
                        {data?.second?.title}
                    </p>
                </div>
                <div className={styles.categoryCard} onClick={() => router.push('/catalog/sergi')}>
                    <img className={styles.categoryCardImage} src={data?.third?.cover} />
                    <p className={`${styles.categoryCardText} ${data?.third?.textColor === 'white' ? styles.categoryCardTextLight : styles.categoryCardTextDark}`}>
                        {data?.third?.title}
                    </p>
                </div>
                <div className={styles.categoryCard} onClick={() => router.push('/catalog/braslety')}>
                    <img className={styles.categoryCardImage} src={data?.fourth?.cover} />
                    <p className={`${styles.categoryCardText} ${data?.fourth?.textColor === 'white' ? styles.categoryCardTextLight : styles.categoryCardTextDark}`}>
                        {data?.fourth?.title}
                    </p>
                </div>
            </div>
        </div>
    );
}
