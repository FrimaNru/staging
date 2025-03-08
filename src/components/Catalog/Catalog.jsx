import styles from "@/styles/Catalog.module.css";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useProducts } from "@/contexts/ProductsContext";
import Banner from "../Common/Banner/Banner";
import Breadcrumb from "../Common/Breadcrumb";
import PopularBlock from "../PopularBlock/PopularBlock";
import FilterSection from "./items/FilterSection";
import SortSection from "./items/SortSection";
import ProductGrid from "./items/ProductGrid";
import NoResults from "./items/NoResults";
import AccordionFilters from "./items/AccordionFilters";

const shuffle = (array) => {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export default function Catalog() {
    const { products, loading } = useProducts();
    const router = useRouter();
    const { product, text } = router.query;
    const [stateSales, setStateSales] = useState([]);
    const [stateType, setStateType] = useState('');
    const [search, setSearch] = useState(false);

    const sales = ['Новинки', 'Популярное', 'Скидки'];
    const types = ['Кольца', 'Серьги', 'Браслеты', 'Колье'];
    const sortItems = ['По популярности', 'По возрастанию цены', 'По убыванию цены'];
    const [stateSortItems, setStateSortItems] = useState('По популярности');

    useEffect(() => {
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
    }, [router, text]);

    const filteredData = useMemo(() => {
        let d = [...products];

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
    }, [products, stateSortItems, stateType, stateSales, text]);

    return (
        <div className={styles.main}>
            <Banner />
            <div className={styles.mainColumn}>
                <Breadcrumb />
                <div className={styles.row}>
                    <FilterSection sales={sales} types={types} stateSales={stateSales} stateType={stateType} setStateSales={setStateSales} setStateType={setStateType} />
                    <div className={styles.catalogColumn}>
                        <SortSection stateSortItems={stateSortItems} setStateSortItems={setStateSortItems} sortItems={sortItems} />
                        <div className={styles.columnOrders}>
                            {search && filteredData.length === 0 && <NoResults text={text} />}
                            <AccordionFilters sales={sales} types={types} stateSales={stateSales} stateType={stateType} setStateSales={setStateSales} setStateType={setStateType} sortItems={sortItems} stateSortItems={stateSortItems} setStateSortItems={setStateSortItems} />
                            <ProductGrid filteredData={filteredData} />
                        </div>
                    </div>
                </div>
            </div>
            <PopularBlock />
        </div>
    );
}