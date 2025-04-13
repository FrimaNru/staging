
import { useEffect, useState } from "react";
import styles from "../../styles.module.css";
import Link from "next/link";
import { formatNumber } from "@/lib/Formatting";

export default function ProductItem({ id, type }) {

    const [data, setData] = useState({});

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const res = await axios.post(`${API_BASE_URL}getOneProduct`, { id });
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (type === 'img'
        ? (data._id && <Link href={`https://mi-alegria.shop/product?id=${data._id}`} className="link" target="_blank" >
            <img src={data.cover} className={styles.productImg} />
        </Link>)
        : (data.name && <Link href={`https://mi-alegria.shop/product?id=${data._id}`} target="_blank">
            <div className={styles.accrdionPanelItem}>
                <p className={styles.accordionPanelText}><span style={{ fontWeight: 800 }}>{data.name.toUpperCase()}</span></p>
                <img src={data.cover} className={styles.productImg} />
                <p className={styles.accordionPanelText}><span style={{ fontWeight: 800 }}>{formatNumber(data.cost)} руб.</span></p>
            </div>
        </Link>))
};