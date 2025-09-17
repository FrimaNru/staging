import styles from "@/styles/Header.module.css";
import Link from "next/link";
import { buildProductSlug } from "@/lib/seo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AuthModal, Authorization } from "@/components";
import { useDisclosure, Drawer, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import { formatNumber } from "@/lib/Formatting";
import { useCart } from "@/contexts/CartContext";
import { useFavourite } from "@/contexts/FavouriteContext";
import { useUser } from "@/contexts/UserContext";
import { HEADER_LINKS } from "@/constants/items";

export default function Header() {

    const router = useRouter();
    const { startSetCart, cart } = useCart();
    const { startSetFavourite, favourite } = useFavourite();
    const { setUser, clearUser } = useUser();
    const [products, setProducts] = useState([]);
    const [stateNew, setStateNew] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [search, setSearch] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        load();
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

    const load = async () => {
        if (!localStorage.getItem('token')) return clearUser();
        await axios.get(`${API_BASE_URL}getUser`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then((res) => {
                setUser(res.data);
                startSetCart(res.data.bag);
                startSetFavourite(res.data.favourite);
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
                setProducts(res.data);
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.main}>
        <div className={styles.firstLine}>
            <div className={styles.mobileIconsLine}>
                <img src='/burgerMenu.svg' className={styles.icon} style={{ height: '12px' }} onClick={() => setIsOpenDrawer(!isOpenDrawer)} />
                <img src='/searchIconMobile.svg' className={styles.icon} onClick={() => setIsSearchOpen(true)} />
                <div className={styles.emptyIcon} />
            </div>
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
                        {products.filter(item => item.name.toLowerCase().includes(search.toLowerCase())).map((x, i) => {
                            return (
                                <Link key={i} href={`/product/${buildProductSlug(x)}`}>
                                    <div className={styles.inputPanelLine}>
                                        <img
                                            src={x.cover}
                                            className={styles.inputPanelCover}
                                        />
                                        <p className={styles.inputPanelName}>{x.name}</p>
                                        <p className={styles.inputPanelCost}>{formatNumber(x.cost)} руб.</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </>
                </div>}
            </div>
            <div className={styles.iconLine} >
                <>
                    <img src='/favIcon.svg' className={styles.icon} onClick={() => favPage()} />
                    {favourite.length > 0 && <div className={styles.favCount}>
                        <p className={styles.favCountText}>{favourite.length}</p>
                    </div>}
                </>
                <AuthModal onClose={onClose} onOpen={onOpen} isOpen={isOpen} />
                <Authorization />
                <Link href='/bag' style={{ width: 'max-content' }} >
                    <img src='/shopIcon.svg' className={styles.icon} />
                    {cart.length > 0 && <div className={styles.bagCount}>
                        <p className={styles.bagCountText}>{cart.length}</p>
                    </div>}
                </Link>
            </div>
        </div>
        <div className={styles.secondLine}>
            <hr className={styles.hr} />
            <div className={styles.linkLine} >
                {HEADER_LINKS.map((x, i) => <Link key={i} href={x.link} style={{ width: 'max-content' }} >
                    <p className={`${styles.linkItem} ${(!stateNew ? (router.pathname === x.link && styles.linkItemSelect) : (x.text === 'Новинки' && styles.linkItemSelect))}`} >{x.text}</p>
                </Link>)}
            </div>
            <hr className={styles.hr} />
        </div>
        <DrawerBlock isOpenDrawer={isOpenDrawer} setIsOpenDrawer={setIsOpenDrawer} pathname={router.pathname} />
        <SearchDrawerBlock isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} products={products} />
    </div>
}

function DrawerBlock({ isOpenDrawer, setIsOpenDrawer, pathname }) {

    const [state, setState] = useState(false);
    const typeCatalog = [{ text: 'Все изделия', link: '/catalog' }, { text: 'Кольца', link: '/catalog/kolcza' }, { text: 'Серьги', link: '/catalog/sergi' }, { text: 'Браслеты', link: '/catalog/braslety' }, { text: 'Колье', link: '/catalog/kole' }];

    return <Drawer isOpen={isOpenDrawer} placement='right' autoFocus={false} onClose={() => setIsOpenDrawer(false)} size='full' >
        <DrawerContent bg='white' h='calc(100% - 63px)' mt='63px' w='100%'>
            <div className={styles.drawerColumn}>
                {!state
                    ? <>
                        <hr className={styles.drawerHr} />
                        {HEADER_LINKS.map((x, i) => x.text !== 'Каталог'
                            ? <Link
                                key={i}
                                href={x.link}
                                style={{ width: '100%' }}
                                onClick={() => setIsOpenDrawer(false)}
                            >
                                <div className={`${styles.drawerItem} ${pathname === x.link && styles.drawerItemSelect}`}>{x.text}</div>
                            </Link>
                            : <div key={i} className={styles.drawerItem} onClick={() => setState(true)}>{x.text}</div>)}
                    </>
                    : <>
                        <div className={styles.drawerCatalogHeader}>
                            <img src='/drawerIcon.svg' className={styles.drawerCatalogHeaderIcon} onClick={() => setState(false)} />
                            <p className={styles.drawerCatalogHeaderText}>Каталог</p>
                        </div>
                        <div className={styles.drawerCatalogColumn}>
                            {typeCatalog.map((x, i) => <Link
                                key={i}
                                href={x.link}
                                style={{ width: 'max-content' }}
                                onClick={() => setIsOpenDrawer(false)}
                            >
                                <p className={styles.drawerCatalogColumnText}>{x.text}</p>
                            </Link>)}
                        </div>
                    </>}
            </div>
        </DrawerContent>
    </Drawer>
};

function SearchDrawerBlock({ isSearchOpen, setIsSearchOpen, products }) {

    const [search, setSearch] = useState('');

    return <Drawer isOpen={isSearchOpen} placement='top' autoFocus={false} onClose={() => setIsSearchOpen(false)} >
        <DrawerOverlay />
        <DrawerContent bg='white'>
            <div className={styles.searchBlockDrawer}>
                <div className={styles.searchBlockDrawerHeader} >
                    <input className={styles.searchBlockInput} placeholder="Поиск по каталогу" onChange={(e) => setSearch(e.target.value)} />
                    <img src='/searchIcon.svg' className={styles.searchBlockIcon} />
                </div>
                {search.length > 0 && <div className={styles.inputPanel}>
                    <Link href={`/catalog?text=${search}`} onClick={() => setIsSearchOpen(false)} >
                        <div className={styles.inputPanelHeader}>
                            <img src='/searchIcon.svg' className={styles.searchBlockIcon} />
                            <p className={styles.inputPanelText} >Искать “{search}”</p>
                        </div>
                    </Link>
                    <>
                        {products.map((x, i) => x.name.includes(search) && <Link key={i} href={`/product/${buildProductSlug(x)}`} onClick={() => setIsSearchOpen(false)} >
                            <div className={styles.inputPanelLine} >
                                <img src={x.cover} className={styles.inputPanelCover} />
                                <p className={styles.inputPanelName}>{x.name}</p>
                                <p className={styles.inputPanelCost}>{formatNumber(x.cost)} руб.</p>
                            </div>
                        </Link>)}
                    </>
                </div>}
            </div>
        </DrawerContent>
    </Drawer>
};