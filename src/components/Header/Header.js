import styles from "@/styles/Header.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AuthModal, Authorization } from "@/components";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";

function formatNumber(number) {
    let numStr = number.toString();
    let parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
};

export function Header() {

    const router = useRouter();
    const [data, setData] = useState([]);
    const [products, setProducts] = useState([]);
    const [stateNew, setStateNew] = useState(false);
    const links = [{ text: 'Новинки', link: '/catalog?filter=new' }, { text: 'Каталог', link: '/catalog' }, { text: 'Доставка', link: '/delivery' }, { text: 'О бренде', link: '/brand' }, { text: 'Частые вопросы', link: '/faq' }];
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [search, setSearch] = useState('');

    useEffect(() => {
        setInterval(() => load(), 2000);
        getAllProducts();
        if (typeof window !== undefined && window.location.href.includes('new')) setStateNew(true);
        const handleRouteChange = (url) => {
            if (window.location.href.includes('new')) {
                setStateNew(true);
            } else {
                setStateNew(false);
            }
        };
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, []);

    function favPage() {
        if (localStorage.getItem('token')) {
            router.push('/cabinet?page=favourites')
        } else {
            onOpen();
        }
    };

    function load() {
        if (!localStorage.getItem('tokeb')) return;
        axios.get(`${API_BASE_URL}getUser`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((res) => {
                setData(res.data.bag);
            })
            .catch((e) => {
                console.log(e);
                if (e?.response?.status === 401 || e?.response?.status === 404) {
                    localStorage.removeItem('token');
                }
            });
    };

    function getAllProducts() {
        axios.get(`${API_BASE_URL}getProducts`)
            .then((res) => {
                console.log(res.data);
                setProducts(res.data);
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.main}>
        <div className={styles.firstLine} >
            <Link href='/' style={{ width: 'max-content' }} >
                <img src='/logo.svg' className={styles.logo} />
            </Link>
            <div className={styles.searchBlock}>
                <img src='/searchIcon.svg' className={styles.searchBlockIcon} />
                <input className={styles.searchBlockInput} placeholder="Поиск по каталогу" onChange={(e) => setSearch(e.target.value)} />
                {search.length > 0 && <div className={styles.inputPanel}>
                    <Link href={`/catalog?text=${search}`} onClick={() => setSearch('')} >
                        <div className={styles.inputPanelHeader}>
                            <img src='/searchIcon.svg' className={styles.searchBlockIcon} />
                            <p className={styles.inputPanelText} >Искать “{search}”</p>
                        </div>
                    </Link>
                    <>
                        {products.map((x, i) => x.name.includes(search) && <Link key={i} href={`/product?id=${x._id}`}>
                            <div className={styles.inputPanelLine} >
                                <img src={`https://api.mi-alegria.shop/uploads/${x.cover}`} className={styles.inputPanelCover} />
                                <p className={styles.inputPanelName}>{x.name}</p>
                                <p className={styles.inputPanelCost}>{formatNumber(x.cost)} руб.</p>
                            </div>
                        </Link>)}
                    </>
                </div>}
            </div>
            <div className={styles.iconLine} >
                <img src='/favIcon.svg' className={styles.icon} onClick={() => favPage()} />
                <AuthModal onClose={onClose} onOpen={onOpen} isOpen={isOpen} />
                <Authorization />
                <Link href='/bag' style={{ width: 'max-content' }} >
                    <img src='/shopIcon.svg' className={styles.icon} />
                    {data.length > 0 && <p className={styles.bagCount} >{data.length}</p>}
                </Link>
            </div>
        </div>
        <div className={styles.secondLine}>
            <hr className={styles.hr} />
            <div className={styles.linkLine} >
                {links.map((x, i) => <Link key={i} href={x.link} style={{ width: 'max-content' }} >
                    <p className={`${styles.linkItem} ${(!stateNew ? (router.pathname === x.link && styles.linkItemSelect) : (x.text === 'Новинки' && styles.linkItemSelect))}`} >{x.text}</p>
                </Link>)}
            </div>
            <hr className={styles.hr} />
        </div>
    </div>
}