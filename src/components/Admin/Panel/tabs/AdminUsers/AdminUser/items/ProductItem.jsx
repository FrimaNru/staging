
import { useEffect, useState } from "react";
import styles from "../../styles.module.css";
import Link from "next/link";
import { formatNumber } from "@/lib/Formatting";
import { buildProductSlug } from "@/lib/seo";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../../../apiConfig";

export default function ProductItem({ id }) {

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

    return <Link href={`https://mi-alegria.shop/product/${buildProductSlug(data)}`} target="_blank">
        <div className={styles.productItem}>
            <img src={data?.cover} className={styles.productImg} />
            <p className={styles.subtitle}>{data?.name?.toUpperCase()}</p>
            <p className={styles.subtitle}>{formatNumber(data?.cost)} руб.</p>
        </div>
    </Link>
};