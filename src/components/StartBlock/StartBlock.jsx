import styles from "./styles.module.css";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../apiConfig";

export default function StartBlock({ initialData }) {
    const [data, setData] = useState(initialData || {});

    useEffect(() => {
        if (!initialData) {
            load();
        }
    }, []);

    const load = async () => {
        await axios.get(`${API_BASE_URL}mainPage/start`)
            .then((res) => { setData(res.data); })
            .catch((e) => console.log(e));
    };

    return <div className={styles.main}>
        <h1 className={styles.title}>Интернет-магазин ювелирных украшений Mi Alegria</h1>
        <div className={styles.line}>
            <Link href="/catalog/kolcza" className={styles.block}>
                <img className={styles.blockImage} src={data?.first?.cover} alt={data?.first?.title || 'Кольца'} />
                <p className={`${styles.blockText} ${data?.first?.textColor === 'white' ? styles.blockTextLight : styles.blockTextDark}`}>{data?.first?.title || 'Кольца'}</p>
            </Link>
            <Link href="/catalog/kole" className={styles.block2}>
                <img className={styles.blockImage2} src={data?.second?.cover} alt={data?.second?.title || 'Колье'} />
                <p className={`${styles.blockText} ${data?.second?.textColor === 'white' ? styles.blockTextLight : styles.blockTextDark}`}>{data?.second?.title || 'Колье'}</p>
            </Link>
        </div>
        <div className={styles.line}>
            <Link href="/catalog/sergi" className={styles.block6}>
                <img className={styles.blockImage3} src={data?.third?.cover} alt={data?.third?.title || 'Серьги'} />
                <p className={`${styles.blockText} ${data?.third?.textColor === 'white' ? styles.blockTextLight : styles.blockTextDark}`}>{data?.third?.title || 'Серьги'}</p>
            </Link>
            <Link href="/catalog/braslety" className={styles.block7}>
                <img className={styles.blockImage4} src={data?.fourth?.cover} alt={data?.fourth?.title || 'Браслеты'} />
                <p className={`${styles.blockText} ${data?.fourth?.textColor === 'white' ? styles.blockTextLight : styles.blockTextDark}`}>{data?.fourth?.title || 'Браслеты'}</p>
            </Link>
        </div>
    </div >
}