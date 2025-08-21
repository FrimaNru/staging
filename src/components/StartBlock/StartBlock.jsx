import styles from "./styles.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../apiConfig";

export default function StartBlock() {

    const router = useRouter();
    const [data, setData] = useState({});

    useEffect(() => { load(); }, []);

    const load = async () => {
        await axios.get(`${API_BASE_URL}mainPage/start`)
            .then((res) => { setData(res.data); })
            .catch((e) => console.log(e));
    };

    return <div className={styles.main}>
        <h1 className={styles.title}>Интернет-магазин ювелирных украшений Mi Alegria</h1>
        <div className={styles.line}>
            <div className={styles.block} onClick={() => router.push('/catalog/kolcza')}>
                <img className={styles.blockImage} src={data?.first?.cover} />
                <p className={`${styles.blockText} ${data?.first?.textColor === 'white' ? styles.blockTextLight : styles.blockTextDark}`}>{data?.first?.title}</p>
            </div>
            <div className={styles.block2} onClick={() => router.push('/catalog/kole')}>
                <img className={styles.blockImage2} src={data?.second?.cover} />
                <p className={`${styles.blockText} ${data?.second?.textColor === 'white' ? styles.blockTextLight : styles.blockTextDark}`}>{data?.second?.title}</p>
            </div>
        </div>
        <div className={styles.line}>
            <div className={styles.block6} onClick={() => router.push('/catalog/sergi')}>
                <img className={styles.blockImage3} src={data?.third?.cover} />
                <p className={`${styles.blockText} ${data?.third?.textColor === 'white' ? styles.blockTextLight : styles.blockTextDark}`}>{data?.third?.title}</p>
            </div>
            <div className={styles.block7} onClick={() => router.push('/catalog/braslety')}>
                <img className={styles.blockImage4} src={data?.fourth?.cover} />
                <p className={`${styles.blockText} ${data?.fourth?.textColor === 'white' ? styles.blockTextLight : styles.blockTextDark}`}>{data?.fourth?.title}</p>
            </div>
        </div>
    </div >
}