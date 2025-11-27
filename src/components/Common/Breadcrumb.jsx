import { useRouter } from "next/router";
import styles from "@/styles/Header.module.css";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../apiConfig";
import { capitalizeFirstLetter } from "@/lib/Formatting";
import { mapSlugToProductType, buildProductSlug } from "@/lib/seo";

export default function Breadcrumb() {
    const router = useRouter();
    const { id } = router.query;

    const [breadcrumbsArray, setBreadcrumbsArray] = useState([{ text: 'Главная', link: '/' }]);

    useEffect(() => {
        let array = [{ text: 'Главная', link: '/' }];

        const asPath = router.asPath.split('?')[0] || router.pathname;
        switch (asPath) {
            case '/catalog':
                array.push({ text: 'Каталог', link: '/catalog' });
                setBreadcrumbsArray(array);
                break;
            default:
                // Каталог по слугу: /catalog/<slug>
                if (asPath.startsWith('/catalog/')) {
                    array.push({ text: 'Каталог', link: '/catalog' });
                    
                    // Проверяем на подкатегории серег
                    if (asPath.includes('/sergi/dlinnye')) {
                        array.push({ text: 'Серьги', link: '/catalog/sergi' });
                        array.push({ text: 'Длинные', link: asPath });
                    } else if (asPath.includes('/sergi/krupnye')) {
                        array.push({ text: 'Серьги', link: '/catalog/sergi' });
                        array.push({ text: 'Крупные', link: asPath });
                    } else if (asPath.includes('/sergi/pod-zoloto')) {
                        array.push({ text: 'Серьги', link: '/catalog/sergi' });
                        array.push({ text: 'Под золото', link: asPath });
                    } else if (asPath.includes('/sergi/pod-serebro')) {
                        array.push({ text: 'Серьги', link: '/catalog/sergi' });
                        array.push({ text: 'Под серебро', link: asPath });
                    } else if (asPath.includes('/kolcza/krupnye')) {
                        array.push({ text: 'Кольца', link: '/catalog/kolcza' });
                        array.push({ text: 'Крупные', link: asPath });
                    } else if (asPath.includes('/kolcza/pod-zoloto')) {
                        array.push({ text: 'Кольца', link: '/catalog/kolcza' });
                        array.push({ text: 'Под золото', link: asPath });
                    } else if (asPath.includes('/kolcza/pod-serebro')) {
                        array.push({ text: 'Кольца', link: '/catalog/kolcza' });
                        array.push({ text: 'Под серебро', link: asPath });
                    } else if (asPath.includes('/braslety/shirokie')) {
                        array.push({ text: 'Браслеты', link: '/catalog/braslety' });
                        array.push({ text: 'Широкие', link: asPath });
                    } else if (asPath.includes('/braslety/zhestkie')) {
                        array.push({ text: 'Браслеты', link: '/catalog/braslety' });
                        array.push({ text: 'Жесткие', link: asPath });
                    } else if (asPath.includes('/braslety/pod-zoloto')) {
                        array.push({ text: 'Браслеты', link: '/catalog/braslety' });
                        array.push({ text: 'Под золото', link: asPath });
                    } else if (asPath.includes('/braslety/pod-serebro')) {
                        array.push({ text: 'Браслеты', link: '/catalog/braslety' });
                        array.push({ text: 'Под серебро', link: asPath });
                    } else if (asPath.includes('/kole/mnogoslojnye')) {
                        array.push({ text: 'Колье', link: '/catalog/kole' });
                        array.push({ text: 'Многослойные', link: asPath });
                    } else if (asPath.includes('/kole/krupnye')) {
                        array.push({ text: 'Колье', link: '/catalog/kole' });
                        array.push({ text: 'Крупные', link: asPath });
                    } else if (asPath.includes('/kole/dlinnye')) {
                        array.push({ text: 'Колье', link: '/catalog/kole' });
                        array.push({ text: 'Длинные', link: asPath });
                    } else if (asPath.includes('/kole/pod-zoloto')) {
                        array.push({ text: 'Колье', link: '/catalog/kole' });
                        array.push({ text: 'Под золото', link: asPath });
                    } else if (asPath.includes('/kole/pod-serebro')) {
                        array.push({ text: 'Колье', link: '/catalog/kole' });
                        array.push({ text: 'Под серебро', link: asPath });
                    } else if (asPath.includes('/bizhuteriya-pod-zoloto')) {
                        array.push({ text: 'Бижутерия под золото', link: asPath });
                    } else if (asPath.includes('/bizhuteriya-pod-serebro')) {
                        array.push({ text: 'Бижутерия под серебро', link: asPath });
                    } else {
                        // Обычная категория
                        const slug = asPath.replace('/catalog/', '');
                        const type = mapSlugToProductType(slug);
                        if (type) {
                            const typeText = type === 'ring' ? 'Кольца' : type === 'necklace' ? 'Колье' : type === 'earrings' ? 'Серьги' : type === 'bracelets' ? 'Браслеты' : '';
                            if (typeText) {
                               
                                const categoryLink = type === 'ring' ? '/catalog/kolcza' : 
                                                   type === 'necklace' ? '/catalog/kole' : 
                                                   type === 'earrings' ? '/catalog/sergi' : 
                                                   type === 'bracelets' ? '/catalog/braslety' : asPath;
                                array.push({ text: typeText, link: categoryLink });
                            }
                        }
                    }
                    
                    setBreadcrumbsArray(array);
                    break;
                }
                // Товар по слугу: /product/<slug>
                if (asPath.startsWith('/product/')) {
                    array.push({ text: 'Каталог', link: '/catalog' });
                    setBreadcrumbsArray(array);
                    break;
                }
                break;
            case '/product':
                array.push({ text: 'Каталог', link: '/catalog' });
                setBreadcrumbsArray(array);

                axios.post(`${API_BASE_URL}getOneProduct`, { id })
                    .then((res) => {
                        array.push({ text: res.data?.name, link: `/product/${buildProductSlug(res.data)}` });
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
            case '/kontakty':
                array.push({ text: 'Контакты', link: '/kontakty' });
                setBreadcrumbsArray(array);
                break;
        }
    }, [router.asPath, id]);

    return (
        <div className={styles.breadcrumbLine} data-breadcrumbs>
            {breadcrumbsArray.map((x, i) => (
                <Link href={x.link} key={i} style={{ width: 'max-content' }}>
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
