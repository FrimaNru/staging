import { useRouter } from "next/router";
import styles from "@/styles/Header.module.css";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../apiConfig";
import { capitalizeFirstLetter } from "@/lib/Formatting";

export default function Breadcrumb() {
    const router = useRouter();
    const { id } = router.query;

    const [breadcrumbsArray, setBreadcrumbsArray] = useState([{ text: 'Главная', link: '/' }]);

    useEffect(() => {
        let array = [{ text: 'Главная', link: '/' }];

        switch (router.pathname) {
            case '/catalog':
                array.push({ text: 'Каталог', link: router.pathname });
                setBreadcrumbsArray(array);
                break;
            case '/product':
                array.push({ text: 'Каталог', link: '/catalog' });
                setBreadcrumbsArray(array);

                axios.post(`${API_BASE_URL}getOneProduct`, { id })
                    .then((res) => {
                        array.push({ text: res.data?.name, link: `/product?id=${res.data?._id}` });
                        setBreadcrumbsArray([...array]);
                    })
                    .catch((e) => console.log(e));
                break;
            case '/delivery':
                array.push({ text: 'Доставка', link: '/delivery' });
                setBreadcrumbsArray(array);
                break;
            case '/brand':
                array.push({ text: 'О бренде', link: '/brand' });
                setBreadcrumbsArray(array);
                break;
            case '/faq':
                array.push({ text: 'Частые вопросы', link: '/faq' });
                setBreadcrumbsArray(array);
                break;
            case '/documents/policy':
                array.push({ text: 'Политика конфиденциальности', link: '/documents/policy' });
                setBreadcrumbsArray(array);
                break;
            case '/documents/agreement':
                array.push({ text: 'Пользовательское соглашение', link: '/documents/policy' });
                setBreadcrumbsArray(array);
                break;
        }
    }, [router.pathname, id]);

    return (
        <div className={styles.breadcrumbLine}>
            {breadcrumbsArray.map((x, i) => (
                <Link href={x.link} key={i}>
                    <div className={styles.breadcrumbItem}>
                        <p className={styles.breadcrumbItemText}>{capitalizeFirstLetter(x.text)}</p>
                        {breadcrumbsArray.length - 1 !== i && (
                            <img src='/breadcrumbArrow.svg' className={styles.breadcrumbItemIcon} />
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
}
