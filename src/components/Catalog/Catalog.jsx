import styles from "./styles.module.css";
import { useEffect, useState, useMemo, useRef } from "react";
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
import Pagination from "./items/Pagination";
import SubcategoryCards from "./items/SubcategoryCards";
import { mapSlugToProductType, mapProductTypeToSlug, buildProductSlug } from "@/lib/seo";

export default function Catalog({ initialPage = 1 }) {
    const { products, loading } = useProducts();
    const router = useRouter();
    const { product, text, filter, PAGEN_1 } = router.query;
    const [stateSales, setStateSales] = useState([]);
    const [stateType, setStateType] = useState('');
    const [search, setSearch] = useState(false);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const itemsPerPage = 15;
    const [isNewPage, setIsNewPage] = useState(false);
    
    const prevFilters = useRef({ stateSortItems: '', stateType: '', stateSales: [], text: '' });

    const sales = ['Новинки', 'Популярное', 'Скидки'];
    const types = ['Кольца', 'Серьги', 'Браслеты', 'Колье'];
    const sortItems = ['По популярности', 'По возрастанию цены', 'По убыванию цены'];
    const [stateSortItems, setStateSortItems] = useState('По популярности');

    useEffect(() => {
        if (PAGEN_1) {
            const page = parseInt(PAGEN_1);
            if (page > 0) {
                setCurrentPage(page);
                
                setTimeout(() => {
                    const breadcrumbsElement = document.querySelector('[data-breadcrumbs]');
                    if (breadcrumbsElement) {
                        const rect = breadcrumbsElement.getBoundingClientRect();
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        const targetPosition = scrollTop + rect.top - 200;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        } else if (router.asPath.includes('/catalog/') && router.query.page) {
            const page = parseInt(router.query.page);
            if (page > 0) {
                setCurrentPage(page);
                setTimeout(() => {
                    const breadcrumbsElement = document.querySelector('[data-breadcrumbs]');
                    if (breadcrumbsElement) {
                        const rect = breadcrumbsElement.getBoundingClientRect();
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        const targetPosition = scrollTop + rect.top - 200;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        } else {
            setCurrentPage(1);
        }
    }, [PAGEN_1, router.query.page, router.asPath]);

    useEffect(() => {
        const currentFilters = { stateSortItems, stateType, stateSales, text };
        const prevFiltersValue = prevFilters.current;
        
        const filtersChanged = 
            prevFiltersValue.stateSortItems !== stateSortItems ||
            prevFiltersValue.stateType !== stateType ||
            JSON.stringify(prevFiltersValue.stateSales) !== JSON.stringify(stateSales) ||
            prevFiltersValue.text !== text;
        
        if (filtersChanged) {
            setCurrentPage(1);
            const newQuery = { ...router.query };
            delete newQuery.PAGEN_1;
            delete newQuery.page;
            delete newQuery.slug;
            delete newQuery.product;
            const currentPathOnly = (router.asPath || '').split('?')[0] || '/catalog';
            router.replace({ pathname: currentPathOnly, query: newQuery }, undefined, { shallow: true });
            
            prevFilters.current = currentFilters;
        }
    }, [stateSortItems, stateType, stateSales, text, router]);

    // Отказ от query-параметров для типа: используем только путь /catalog/<slug>

    // Обновляем URL при изменении фильтра типа изделия
    useEffect(() => {
        const typeMap = { 'Кольца': 'ring', 'Серьги': 'earrings', 'Браслеты': 'bracelets', 'Колье': 'necklace' };
        const currentPath = router.asPath;
        const slugInPath = /\/catalog\/\w+/.test(currentPath);

        const cleanupQuery = (query) => {
            const newQuery = { ...query };
            delete newQuery.PAGEN_1;
            delete newQuery.page;
            delete newQuery.slug;
            delete newQuery.product;
            return newQuery;
        };

        const newQuery = cleanupQuery(router.query);

        if (!stateType) {
            // сброс типа -> /catalog
            // только если в пути нет слуга раздела, иначе оставляем как есть
            if (!slugInPath && !currentPath.startsWith('/catalog?') && currentPath !== '/catalog') {
                router.replace({ pathname: '/catalog', query: newQuery }, undefined, { shallow: true });
            }
            return;
        }

        const typeCode = typeMap[stateType];
        if (!typeCode) return;
        const slug = mapProductTypeToSlug(typeCode);
        const targetPath = `/catalog/${slug}`;

        // только если путь реально меняется
        if (!currentPath.startsWith(targetPath)) {
            router.replace({ pathname: targetPath, query: newQuery }, undefined, { shallow: true });
        }
    }, [stateType, router]);

    useEffect(() => {
        if (filter === 'new') {
            setIsNewPage(true);
        } else {
            setIsNewPage(false);
        }
    }, [filter]); 

    useEffect(() => {
        if (text) setSearch(true);
        if (window.location.href.includes('new')) setStateSales(old => [...old, 'Новинки']);
        // поддержка ЧПУ: /catalog/[slug] и /catalog?product=
        const pathMatch = router.asPath.match(/\/catalog\/(\w+)/);
        const slugFromPath = pathMatch ? pathMatch[1] : undefined;
        const slug = slugFromPath || product;
        if (slug) {
            const normalizedType = mapSlugToProductType(slug);
            switch (normalizedType) {
                case 'ring':
                    setStateType('Кольца');
                    break;
                case 'necklace':
                    setStateType('Колье');
                    break;
                case 'earrings':
                    setStateType('Серьги');
                    break;
                case 'bracelets':
                    setStateType('Браслеты');
                    break;
                default:
                    break;
            }
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
    }, [router, text, product]);

    const filteredData = useMemo(() => {
        let d = [...products];

        if (stateSortItems === 'По возрастанию цены') {
            d.sort((a, b) => a.cost - b.cost);
        } else if (stateSortItems === 'По убыванию цены') {
            d.sort((a, b) => b.cost - a.cost);
        }

        // Фильтр для новинок (работает на всех страницах каталога)
        if (stateSales.includes('Новинки')) {
            d = d.filter(x => x.additionally.includes('new'));
        }

        if (stateSales.includes('Популярное')) {
            d = d.filter(x => x.additionally.includes('popular'));
        };

        if (text && text.length > 0) {
            d = d.filter(x => x.name.includes(text));
        };

        const typeMap = { 'Кольца': 'ring', 'Серьги': 'earrings', 'Браслеты': 'bracelets', 'Колье': 'necklace' };

        if (stateType in typeMap) { d = d.filter(x => x.type === typeMap[stateType]); };

        // Фильтр для подкатегорий серег
        if (router.asPath.includes('/sergi/dlinnye')) {
            const longEarringsSlugs = [
                'sergi-zhanna-zolotaya',
                'sergi-zhanna-serebryanaya',
                'sergi-beatris-zolotaya',
                'sergi-beatris-serebryanaya',
                'sergi-blanka-zolotaya',
                'sergi-blanka-serebryanaya',
                'sergi-veronika-zolotaya',
                'sergi-veronika-serebryanaya',
                'sergi-marisa-zolotaya',
                'sergi-marisa-serebryanaya',
                'sergi-eliana-zolotaya',
                'sergi-eliana-serebryanaya',
                'sergi-gloriya-zolotaya',
                'sergi-gloriya-serebryanaya',
                'sergi-laura-zolotaya',
                'sergi-laura-serebryanaya'
            ];
            d = d.filter(product => {
                const productSlug = buildProductSlug(product);
                return longEarringsSlugs.includes(productSlug);
            });
        } else if (router.asPath.includes('/sergi/krupnye')) {
            const largeEarringsSlugs = [
                'sergi-roza-zolotaya',
                'sergi-roza-serebryanaya',
                'sergi-karmen-zolotaya',
                'sergi-karmen-serebryanaya',
                'sergi-izabel-zolotaya',
                'sergi-izabel-serebryanaya',
                'sergi-ester-zolotaya',
                'sergi-ester-serebryanaya'
            ];
            d = d.filter(product => {
                const productSlug = buildProductSlug(product);
                return largeEarringsSlugs.includes(productSlug);
            });
        } else if (router.asPath.includes('/sergi/pod-zoloto')) {
            const goldEarringsSlugs = [
                'sergi-roza-zolotaya',
                'sergi-zhanna-zolotaya',
                'sergi-karmen-zolotaya',
                'sergi-izabel-zolotaya',
                'sergi-ester-zolotaya',
                'sergi-marta-zolotaya',
                'sergi-anna-zolotaya',
                'sergi-sofiya-zolotaya',
                'sergi-beatris-zolotaya',
                'sergi-blanka-zolotaya',
                'sergi-francheska-zolotaya',
                'sergi-alegra-zolotaya',
                'sergi-lidiana-zolotaya',
                'sergi-ramona-zolotaya',
                'sergi-veronika-zolotaya',
                'sergi-karmita-zolotaya',
                'sergi-marisa-zolotaya',
                'sergi-eliana-zolotaya',
                'sergi-gloriya-zolotaya',
                'sergi-laura-zolotaya',
                'sergi-viktori-zolotaya'
            ];
            d = d.filter(product => {
                const productSlug = buildProductSlug(product);
                return goldEarringsSlugs.includes(productSlug);
            });
        } else if (router.asPath.includes('/sergi/pod-serebro')) {
            const silverEarringsSlugs = [
                'sergi-roza-serebryanaya',
                'sergi-zhanna-serebryanaya',
                'sergi-karmen-serebryanaya',
                'sergi-izabel-serebryanaya',
                'sergi-ester-serebryanaya',
                'sergi-marta-serebryanaya',
                'sergi-anna-serebryanaya',
                'sergi-beatris-serebryanaya',
                'sergi-blanka-serebryanaya',
                'sergi-francheska-serebryanaya',
                'sergi-alegra-serebryanaya',
                'sergi-lidiana-serebryanaya',
                'sergi-ramona-serebryanaya',
                'sergi-veronika-serebryanaya',
                'sergi-karmita-serebryanaya',
                'sergi-marisa-serebryanaya',
                'sergi-eliana-serebryanaya',
                'sergi-gloriya-serebryanaya',
                'sergi-laura-serebryanaya',
                'sergi-viktori-serebryanaya'
            ];
            d = d.filter(product => {
                const productSlug = buildProductSlug(product);
                return silverEarringsSlugs.includes(productSlug);
            });
        }
        
        // Фильтр для подкатегорий колец
        if (router.asPath.includes('/kolcza/krupnye')) {
            const largeRingsIds = [
                '67b0bc9acf861107a9eb6c42',
                '67b0bc9acf861107a9eb6c44',
                '67b0bc9acf861107a9eb6c49',
                '67b0bc9acf861107a9eb6c4b',
                '67b0bc9bcf861107a9eb6c65',
                '67b0bc9bcf861107a9eb6c67',
                '67b0bc9bcf861107a9eb6c6c',
                '67b0bc9bcf861107a9eb6c6e',
                '67b0bc9bcf861107a9eb6c73',
                '67b0bc9bcf861107a9eb6c75',
                '67b0bc9ccf861107a9eb6c7a',
                '67b0bc9ccf861107a9eb6c7c',
                '67b0bc9ccf861107a9eb6c8f',
                '67b0bc9ccf861107a9eb6c91',
                '67b0bc9dcf861107a9eb6c96',
                '67b0bc9dcf861107a9eb6c98',
                '67b0bc9dcf861107a9eb6c9d',
                '67b0bc9dcf861107a9eb6c9f',
                '67b0bc9dcf861107a9eb6ca4',
                '67b0bc9dcf861107a9eb6ca6'
            ];
            d = d.filter(product => largeRingsIds.includes(product._id));
        } else if (router.asPath.includes('/kolcza/pod-zoloto')) {
            const goldRingsIds = [
                '67b0bc9acf861107a9eb6c42',
                '67b0bc9acf861107a9eb6c49',
                '67b0bc9acf861107a9eb6c50',
                '67b0bc9acf861107a9eb6c57',
                '67b0bc9bcf861107a9eb6c5e',
                '67b0bc9bcf861107a9eb6c65',
                '67b0bc9bcf861107a9eb6c6c',
                '67b0bc9bcf861107a9eb6c73',
                '67b0bc9ccf861107a9eb6c7a',
                '67b0bc9ccf861107a9eb6c81',
                '67b0bc9ccf861107a9eb6c88',
                '67b0bc9ccf861107a9eb6c8f',
                '67b0bc9dcf861107a9eb6c96',
                '67b0bc9dcf861107a9eb6c9d',
                '67b0bc9dcf861107a9eb6ca4'
            ];
            d = d.filter(product => goldRingsIds.includes(product._id));
        } else if (router.asPath.includes('/kolcza/pod-serebro')) {
            const silverRingsIds = [
                '67b0bc9acf861107a9eb6c44',
                '67b0bc9acf861107a9eb6c4b',
                '67b0bc9acf861107a9eb6c52',
                '67b0bc9acf861107a9eb6c59',
                '67b0bc9bcf861107a9eb6c60',
                '67b0bc9bcf861107a9eb6c67',
                '67b0bc9bcf861107a9eb6c6e',
                '67b0bc9bcf861107a9eb6c75',
                '67b0bc9ccf861107a9eb6c7c',
                '67b0bc9ccf861107a9eb6c83',
                '67b0bc9ccf861107a9eb6c8a',
                '67b0bc9ccf861107a9eb6c91',
                '67b0bc9dcf861107a9eb6c98',
                '67b0bc9dcf861107a9eb6c9f',
                '67b0bc9dcf861107a9eb6ca6'
            ];
            d = d.filter(product => silverRingsIds.includes(product._id));
        }

        return d;
    }, [products, stateSortItems, stateType, stateSales, text]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        
        const newQuery = { ...router.query };
        if (page === 1) {
            delete newQuery.PAGEN_1;
            delete newQuery.page;
        } else {
            newQuery.PAGEN_1 = page.toString();
        }
        delete newQuery.slug;
        delete newQuery.product;
        
        // Use the actual current path (e.g., '/catalog/kolcza') rather than the route pattern '/catalog/[slug]'
        const currentPathOnly = (router.asPath || '').split('?')[0] || '/catalog';
        router.replace({
            pathname: currentPathOnly,
            query: newQuery
        }, undefined, { shallow: true });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className={styles.main}>
            <Banner />
            <div className={styles.mainColumn} data-catalog-content>
                <Breadcrumb />
                <h1 className={styles.title}>
                    {isNewPage ? 'НОВИНКИ' : 
                     router.asPath.includes('/dlinnye') ? 'ДЛИННЫЕ СЕРЬГИ' :
                     router.asPath.includes('/krupnye') && router.asPath.includes('/sergi') ? 'КРУПНЫЕ СЕРЬГИ' :
                     router.asPath.includes('/pod-zoloto') && router.asPath.includes('/sergi') ? 'СЕРЬГИ ПОД ЗОЛОТО' :
                     router.asPath.includes('/pod-serebro') && router.asPath.includes('/sergi') ? 'СЕРЬГИ ПОД СЕРЕБРО' :
                     router.asPath.includes('/kolcza/krupnye') ? 'КРУПНЫЕ КОЛЬЦА' :
                     router.asPath.includes('/kolcza/pod-zoloto') ? 'КОЛЬЦА ПОД ЗОЛОТО' :
                     router.asPath.includes('/kolcza/pod-serebro') ? 'КОЛЬЦА ПОД СЕРЕБРО' :
                     stateType ? stateType.toUpperCase() : 'КАТАЛОГ'}
                </h1>
                <div className={styles.row}>
                    <FilterSection sales={sales} types={types} stateSales={stateSales} stateType={stateType} setStateSales={setStateSales} setStateType={setStateType} />
                    <div className={styles.catalogColumn}>
                        <SubcategoryCards productType={stateType} />
                        <SortSection stateSortItems={stateSortItems} setStateSortItems={setStateSortItems} sortItems={sortItems} />
                        <div className={styles.columnOrders}>
                            {search && filteredData.length === 0 && <NoResults text={text} />}
                            {stateSales.includes('Новинки') && stateType && filteredData.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                    <p style={{ fontSize: '18px', color: '#666' }}>
                                        К сожалению, в разделе "{stateType}" пока нет новинок
                                    </p>
                                </div>
                            )}
                            <AccordionFilters sales={sales} types={types} stateSales={stateSales} stateType={stateType} setStateSales={setStateSales} setStateType={setStateType} sortItems={sortItems} stateSortItems={stateSortItems} setStateSortItems={setStateSortItems} />
                            <ProductGrid filteredData={currentItems} />

                            {filteredData.length > itemsPerPage && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <PopularBlock />
        </div>
    );
}