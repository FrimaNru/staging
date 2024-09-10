import styles from "@/styles/Catalog.module.css";
import { useEffect, useState, useMemo } from "react";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";

function formatNumber(number) {
    let numStr = number.toString();
    let parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
};

const shuffle = (array) => {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export function Catalog() {

    const router = useRouter();
    const { product, text } = router.query;
    const [stateSales, setStateSales] = useState([]);
    const [stateGenders, setStateGenders] = useState('');
    const [stateType, setStateType] = useState('');
    const [data, setData] = useState([]);
    const [pagging, setPagging] = useState(1);
    const [search, setSearch] = useState(false);

    const sales = ['Новинки', 'Популярное', 'Скидки'];
    const genders = ['Мужчинам', 'Женщинам', 'Унисекс'];
    const types = ['Кольца', 'Серьги', 'Браслеты', 'Колье'];

    const sortItems = ['По популярности', 'По возрастанию цены', 'По убыванию цены'];
    const [stateSortItems, setStateSortItems] = useState('По популярности');

    useEffect(() => {
        load();
        if (text) setSearch(true);
        if (window.location.href.includes('new')) setStateSales(old => [...old, 'Новинки']);
        switch (product) {
            case 'ring':
                return setStateType('Кольца');
            case 'necklace':
                return setStateType('Колье');
            case 'earrings':
                return setStateType('Серьги');
            case 'bracelets':
                return setStateType('Браслеты');
        }
        const handleRouteChange = (url) => {
            if (window.location.href.includes('new')) {
                setStateSales(old => [...old, 'Новинки']);
            } else {
                setStateSales(old => old.filter(item => item !== 'Новинки'))
            }
        };
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router, text])

    function load() {
        axios.get(`${API_BASE_URL}getProducts`)
            .then((res) => {
                setData(res.data);
            })
            .catch((e) => console.log(e));
    };

    const filteredData = useMemo(() => {
        let d = [...data];

        if (stateSortItems === 'По возрастанию цены') {
            d.sort((a, b) => a.cost - b.cost);
        } else if (stateSortItems === 'По убыванию цены') {
            d.sort((a, b) => b.cost - a.cost);
        } else if (stateSortItems === 'По популярности') {
            d = shuffle(d);
        };

        if (stateSales.includes('Популярное')) {
            d = d.filter(x => x.additionally.includes('popular'));
        };

        if (text && text.length > 0) {
            d = d.filter(x => x.name.includes(text));
        };

        const typeMap = { 'Кольца': 'ring', 'Серьги': 'earrings', 'Браслеты': 'bracelets', 'Колье': 'necklace' };

        if (stateType in typeMap) { d = d.filter(x => x.type === typeMap[stateType]); };

        return d;
    }, [data, stateSortItems, stateType, stateSales, text]);

    const totalPages = Math.ceil(filteredData.length / 6);

    const renderPagination = () => {
        const pages = [];

        if (pagging > 2) {
            pages.push(
                <button
                    key={1}
                    className={styles.paggingNumber}
                    onClick={() => setPagging(1)}
                >
                    1
                </button>
            );
        }

        if (pagging > 3) {
            pages.push(
                <span
                    key="dots-start"
                    className={styles.paggingNumber}
                    style={{ userSelect: 'none' }}
                >
                    ...
                </span>
            );
        }

        const startPage = Math.max(1, pagging - 1);
        const endPage = Math.min(totalPages, pagging + 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={`${styles.paggingNumber} ${i === pagging ? styles.paggingNumberSelect : ''}`}
                    onClick={() => setPagging(i)}
                >
                    {i}
                </button>
            );
        }

        if (pagging < totalPages - 2) {
            pages.push(
                <span
                    key="dots-end"
                    className={styles.paggingNumber}
                    style={{ userSelect: 'none' }}
                >
                    ...
                </span>
            );
        }

        if (pagging < totalPages - 1) {
            pages.push(
                <button
                    key={totalPages}
                    className={`${styles.paggingNumber} ${pagging === totalPages ? styles.paggingNumberSelect : ''}`}
                    onClick={() => setPagging(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return <div className={styles.main}>
        <div className={styles.imageBlock} >
            <img className={styles.backImg} src='/backCatalog.png' />
            <p className={styles.logoText}>ДИЗАЙНЕРСКИЕ УКРАШЕНИЯ</p>
        </div>
        <div className={styles.row}>
            <div className={styles.filter}>
                <div className={styles.lilColumn}>
                    {sales.map((x, i) => <div key={i} className={styles.filterLine} onClick={() => setStateSales(old => old.includes(x) ? old.filter(item => item !== x) : [...old, x])}>
                        {stateSales.includes(x) ? <img src='/goldDotSelect.svg' /> : <img src='/goldDot.svg' />}
                        <p className={styles.filterText}>{x}</p>
                    </div>)}
                </div>
                {/* <div className={styles.lilColumn}>
                    <p className={styles.filterTitle}>КОМУ</p>
                    {genders.map((x, i) => <div key={i} className={styles.filterLine} onClick={() => setStateGenders(x)} >
                        {stateGenders === x ? <img src='/goldDotSelect.svg' /> : <img src='/goldDot.svg' />}
                        <p className={styles.filterText}>{x}</p>
                    </div>)}
                </div> */}
                <div className={styles.lilColumn}>
                    <p className={styles.filterTitle}>ВИД ИЗДЕЛИЯ</p>
                    {types.map((x, i) => <div key={i} className={styles.filterLine} onClick={() => {
                        if (stateType !== x) setStateType(x);
                        else setStateType('');
                    }}>
                        {stateType === x ? <img src='/goldDotSelect.svg' /> : <img src='/goldDot.svg' />}
                        <p className={styles.filterText}>{x}</p>
                    </div>)}
                </div>
            </div>
            <div className={styles.catalogColumn}>
                <div className={styles.lineSort} >
                    <p className={styles.lineSortText} >Сортировать</p>
                    <Menu>
                        <MenuButton pos='relative' zIndex={1}>
                            <div className={styles.menuButton} zIndex={5} pos='relative' >
                                <p className={styles.menuButtonText} >{stateSortItems}</p>
                                <svg style={{ marginTop: '3px' }} width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.496094 0.5L5.49609 5.5L10.4961 0.5" stroke="#140702" strokeLinecap="round" />
                                </svg>
                            </div>
                        </MenuButton>
                        <MenuList boxShadow='none' p={0} border='none' bg='none' pos='relative' zIndex={0}>
                            <div className={styles.menuList} >
                                {sortItems.filter(x => x !== stateSortItems).map((x, i) => <MenuItem bg='none' p={0} key={i} onClick={() => setStateSortItems(x)}>
                                    <div className={styles.menuItemColumn} >
                                        <p className={styles.menuItem} >{x}</p>
                                        {sortItems.filter(x => x !== stateSortItems).length - 1 > i && <hr className={styles.menuItemHr} />}
                                    </div>
                                </MenuItem>)}
                            </div>
                        </MenuList>
                    </Menu>
                </div>
                <div className={styles.columnOrders}>
                    {search && filteredData.length === 0 && <div className={styles.noFindProductsColumnBig} >
                        <div className={styles.noFindProductsColumn}>
                            <p className={styles.noFindProductsTitle} >По запросу "{text}" ничего не найдено</p>
                            <p className={styles.noFindProductsText}>По вашему запросу ничего не найдено. Проверьте, правильно ли введен запрос.</p>
                        </div>
                        <button className={styles.noFindProductsButton} onClick={() => router.push('/catalog')}>В КАТАЛОГ</button>
                    </div>}
                    <div className={styles.lineOrders}>
                        {filteredData.map((x, i) => (
                            i >= (pagging - 1) * 6 && i < (pagging - 1) * 6 + 3 && (
                                <Link key={i} href={`/product?id=${x._id}`} style={{ width: 'max-content' }}>
                                    <div className={styles.sliderItem}>
                                        <div className={styles.sliderItemContent}>
                                            <img src={`https://api.mi-alegria.shop/uploads/${x.cover}`} className={styles.sliderItemImage} />
                                            <p className={styles.sliderItemTitle}>{x.name}</p>
                                            <p className={styles.sliderItemCost}>{formatNumber(x.cost)} руб.</p>
                                        </div>
                                    </div>
                                </Link>
                            )
                        ))}
                    </div>
                    {filteredData.length > 0 && <hr className={styles.orderHr} />}
                    <div className={styles.lineOrders}>
                        {filteredData.map((x, i) => (
                            i >= (pagging - 1) * 6 + 3 && i < pagging * 6 && (
                                <Link key={i} href={`/product?id=${x._id}`} style={{ width: 'max-content' }}>
                                    <div className={styles.sliderItem}>
                                        <div className={styles.sliderItemContent}>
                                            <img src={`https://api.mi-alegria.shop/uploads/${x.cover}`} className={styles.sliderItemImage} />
                                            <p className={styles.sliderItemTitle}>{x.name}</p>
                                            <p className={styles.sliderItemCost}>{formatNumber(x.cost)} руб.</p>
                                        </div>
                                    </div>
                                </Link>
                            )
                        ))}
                    </div>
                    {filteredData.length > 0 && <div className={styles.paggingLine} >
                        <button className={styles.paggingArrow} onClick={() => pagging > 1 && setPagging(pagging - 1)} >
                            <img src='/leftArrow.svg' />
                        </button>
                        <div className={styles.paggingLineLil}>
                            {renderPagination()}
                        </div>
                        <button className={styles.paggingArrow} onClick={() => (pagging < (filteredData.length / 6)) && setPagging(pagging + 1)} >
                            <img src='/rightArrow.svg' />
                        </button>
                    </div>}
                </div>
            </div>
        </div>
    </div >
}