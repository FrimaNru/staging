import styles from "@/styles/StartBlock.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../apiConfig";

export function StartBlock() {

    const router = useRouter();
    const [data, setData] = useState({});

    useEffect(() => { load(); }, []);

    const load = async () => {
        await axios.get(`${API_BASE_URL}mainPage/start`)
            .then((res) => {
                console.log(res.data);
                setData(res.data);
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.main}>
        <div className={styles.line}>
            <div className={styles.block} onClick={() => router.push('/catalog?product=ring')}>
                <div className={styles.blockImage} style={{ backgroundImage: `url(${data?.first?.cover})` }} />
                <p className={styles.blockText}>{data?.first?.title}</p>
            </div>
            <div className={styles.block2} onClick={() => router.push('/catalog?product=necklace')}>
                <div className={styles.blockImage2} style={{ backgroundImage: `url(${data?.second?.cover})` }} />
                <p className={styles.blockText}>{data?.second?.title}</p>
            </div>
        </div>
        <div className={styles.line}>
            <div className={styles.block6} onClick={() => router.push('/catalog?product=earrings')}>
                <div className={styles.blockImage6} style={{ backgroundImage: `url(${data?.third?.cover})` }} />
                <p className={styles.blockText}>{data?.third?.title}</p>
            </div>
            <div className={styles.block7} onClick={() => router.push('/catalog?product=bracelets')}>
                <div className={styles.blockImage7} style={{ backgroundImage: `url(${data?.fourth?.cover})` }} />
                <p className={styles.blockText}>{data?.fourth?.title}</p>
            </div>
        </div>
    </div>
}