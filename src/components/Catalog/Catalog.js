import styles from "@/styles/Catalog.module.css";
import { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Link from "next/link";

export function Catalog() {

    const router = useRouter();
    const [stateSales, setStateSales] = useState([]);
    const [stateGenders, setStateGenders] = useState('');
    const [stateType, setStateType] = useState('');

    const sales = ['Новинки', 'Популярное', 'Скидки'];
    const genders = ['Мужчинам', 'Женщинам', 'Унисекс'];
    const types = ['Кольца', 'Серьги', 'Браслеты', 'Цепочки', 'Колье'];

    const sortItems = ['По популярности', 'По возрастанию цены', 'По убыванию цены'];
    const [stateSortItems, setStateSortItems] = useState('По популярности');

    useEffect(() => {
        if (window.location.href.includes('new')) setStateSales(old => [...old, 'Новинки']);
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
    }, [])

    const data = [
        { name: 'СЕРЬГИ CARAMEL', text: 'ЛАТУНЬ С ПОКРЫТИЕМ ИЗ 18 КТ ЗОЛОТА', cost: '12.500 руб.', img: 'tovar2.png' },
        { name: 'СЕРЬГИ CARAMEL', text: 'ЛАТУНЬ С ПОКРЫТИЕМ ИЗ 18 КТ ЗОЛОТА', cost: '12.500 руб.', img: 'tovar2.png' },
        { name: 'СЕРЬГИ CARAMEL', text: 'ЛАТУНЬ С ПОКРЫТИЕМ ИЗ 18 КТ ЗОЛОТА', cost: '12.500 руб.', img: 'tovar2.png' },
        { name: 'СЕРЬГИ CARAMEL', text: 'ЛАТУНЬ С ПОКРЫТИЕМ ИЗ 18 КТ ЗОЛОТА', cost: '12.500 руб.', img: 'tovar2.png' },
        { name: 'СЕРЬГИ CARAMEL', text: 'ЛАТУНЬ С ПОКРЫТИЕМ ИЗ 18 КТ ЗОЛОТА', cost: '12.500 руб.', img: 'tovar2.png' },
        { name: 'СЕРЬГИ CARAMEL', text: 'ЛАТУНЬ С ПОКРЫТИЕМ ИЗ 18 КТ ЗОЛОТА', cost: '12.500 руб.', img: 'tovar2.png' },
        { name: 'СЕРЬГИ CARAMEL', text: 'ЛАТУНЬ С ПОКРЫТИЕМ ИЗ 18 КТ ЗОЛОТА', cost: '12.500 руб.', img: 'tovar2.png' },
        { name: 'СЕРЬГИ CARAMEL', text: 'ЛАТУНЬ С ПОКРЫТИЕМ ИЗ 18 КТ ЗОЛОТА', cost: '12.500 руб.', img: 'tovar2.png' }
    ];

    return <div className={styles.main}>
        <div className={styles.imageBlock} >
            <img className={styles.backImg} src='/backCatalog.png' />
            <p className={styles.logoText}>ЮВЕЛИРНЫЕ ДИЗАЙНЕРСКИЕ УКРАШЕНИЯ</p>
        </div>
        <div className={styles.row}>
            <div className={styles.filter}>
                <div className={styles.lilColumn}>
                    {sales.map((x, i) => <div key={i} className={styles.filterLine} onClick={() => setStateSales(old => old.includes(x) ? old.filter(item => item !== x) : [...old, x])}>
                        {stateSales.includes(x) ? <img src='/goldDotSelect.svg' /> : <img src='/goldDot.svg' />}
                        <p className={styles.filterText}>{x}</p>
                    </div>)}
                </div>
                <div className={styles.lilColumn}>
                    <p className={styles.filterTitle}>КОМУ</p>
                    {genders.map((x, i) => <div key={i} className={styles.filterLine} onClick={() => setStateGenders(x)} >
                        {stateGenders === x ? <img src='/goldDotSelect.svg' /> : <img src='/goldDot.svg' />}
                        <p className={styles.filterText}>{x}</p>
                    </div>)}
                </div>
                <div className={styles.lilColumn}>
                    <p className={styles.filterTitle}>ВИД ИЗДЕЛИЯ</p>
                    {types.map((x, i) => <div key={i} className={styles.filterLine} onClick={() => setStateType(x)}>
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
                                    <path d="M0.496094 0.5L5.49609 5.5L10.4961 0.5" stroke="#140702" stroke-linecap="round" />
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
                <div className={styles.lineOrders}>
                    {data.map((x, i) => i < 3 && <Link key={i} href='/product' style={{ width: 'max-content' }}>
                        <div className={styles.sliderItem} >
                            <div className={styles.sliderItemContent} >
                                <img src={x.img} className={styles.sliderItemImage} />
                                <div className={styles.sliderItemColumn} >
                                    <p className={styles.sliderItemTitle} >{x.name}</p>
                                    <p className={styles.sliderItemText} >{x.text}</p>
                                </div>
                                <p className={styles.sliderItemCost} >{x.cost}</p>
                            </div>
                        </div>
                    </Link>)}
                </div>
                <hr className={styles.mainHr} />
                <div className={styles.lineOrders}>
                    {data.map((x, i) => i < 3 && <Link key={i} href='/product' style={{ width: 'max-content' }}>
                        <div key={i} className={styles.sliderItem} >
                            <div className={styles.sliderItemContent} >
                                <img src={x.img} className={styles.sliderItemImage} />
                                <div className={styles.sliderItemColumn} >
                                    <p className={styles.sliderItemTitle} >{x.name}</p>
                                    <p className={styles.sliderItemText} >{x.text}</p>
                                </div>
                                <p className={styles.sliderItemCost} >{x.cost}</p>
                            </div>
                        </div>
                    </Link>)}
                </div>
            </div>
        </div>
    </div>
}