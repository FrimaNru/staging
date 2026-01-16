import styles from "./styles.module.css";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { useProducts } from "@/contexts/ProductsContext";
import Head from "next/head";
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
import SubcategorySeoText from "./items/SubcategorySeoText";
import CategoryCards from "./items/CategoryCards";
import { mapSlugToProductType, mapProductTypeToSlug, buildProductSlug } from "@/lib/seo";
import { PRODUCT_TYPES } from "@/constants/items";

export default function Catalog({ initialPage = 1, initialProducts, h1Title, categoryCardsData, initialType = '', popularProducts = null }) {
    const { products: contextProducts, loading } = useProducts();
    // Используем начальные продукты с сервера, если они есть, иначе используем из контекста
    const products = initialProducts || contextProducts;
    const router = useRouter();
    const { product, text, filter, PAGEN_1 } = router.query;
    const [stateSales, setStateSales] = useState([]);
    const [stateType, setStateType] = useState(initialType || '');
    const [stateColor, setStateColor] = useState('');
    const [selectedColors, setSelectedColors] = useState([]);
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [search, setSearch] = useState(false);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const itemsPerPage = 15;
    const [isNewPage, setIsNewPage] = useState(false);
    const [isUserInteraction, setIsUserInteraction] = useState(false);
    
    const prevFilters = useRef({ stateSortItems: '', stateType: '', stateSales: [], text: '', stateColor: '', selectedColors: [], priceMin: '', priceMax: '' });

    // Обертка для setStateType, которая устанавливает флаг пользовательского взаимодействия
    const handleStateTypeChange = (newType) => {
        setIsUserInteraction(true);
        setStateType(newType);
    };
    
    // Определяем, является ли страница подкатегорией
    const isSubcategoryPage = useMemo(() => {
        return router.asPath.includes('/sergi/dlinnye') ||
               router.asPath.includes('/sergi/krupnye') ||
               router.asPath.includes('/sergi/pod-zoloto') ||
               router.asPath.includes('/sergi/pod-serebro') ||
               router.asPath.includes('/kolcza/krupnye') ||
               router.asPath.includes('/kolcza/pod-zoloto') ||
               router.asPath.includes('/kolcza/pod-serebro') ||
               router.asPath.includes('/braslety/shirokie') ||
               router.asPath.includes('/braslety/zhestkie') ||
               router.asPath.includes('/braslety/pod-zoloto') ||
               router.asPath.includes('/braslety/pod-serebro') ||
               router.asPath.includes('/kole/mnogoslojnye') ||
               router.asPath.includes('/kole/krupnye') ||
               router.asPath.includes('/kole/dlinnye') ||
               router.asPath.includes('/kole/pod-zoloto') ||
               router.asPath.includes('/kole/pod-serebro') ||
               router.asPath.includes('/bizhuteriya-pod-zoloto') ||
               router.asPath.includes('/bizhuteriya-pod-serebro');
    }, [router.asPath]);

    // Определяем, является ли страница общей страницей каталога
    const isMainCatalogPage = useMemo(() => {
        return router.asPath === '/catalog' || router.asPath === '/catalog/';
    }, [router.asPath]);

    const sales = ['Новинки', 'Популярное', 'Скидки'];
    const types = ['Кольца', 'Серьги', 'Браслеты', 'Колье'];
    const sortItems = ['По популярности', 'По возрастанию цены', 'По убыванию цены'];
    const [stateSortItems, setStateSortItems] = useState('По популярности');

    // Мемоизируем функцию получения цены для оптимизации
    const getEffectivePrice = useCallback((p) => {
        const sale = Number(p?.saleCost || 0);
        const base = Number(p?.cost || 0);
        const price = sale && sale > 0 ? sale : base;
        // Округляем до сотен для фильтрации
        if (price > 0) {
            const lastTwoDigits = price % 100;
            const hundreds = Math.floor(price / 100) * 100;
            return lastTwoDigits < 50 ? hundreds : hundreds + 100;
        }
        return price;
    }, []);

    const availableColors = useMemo(() => {
        const set = new Set();
        (products || []).forEach((p) => {
            const c = (p?.color || '').trim();
            if (c) set.add(c);
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b, 'ru'));
    }, [products]);

    const [absoluteMinPrice, absoluteMaxPrice] = useMemo(() => {
        const prices = (products || []).map(getEffectivePrice).filter((n) => Number.isFinite(n) && n > 0);
        if (prices.length === 0) return [null, null];
        return [Math.min(...prices), Math.max(...prices)];
    }, [products]);

    const hasFilterParamsForIndex = useMemo(() => {
        return router.query?.priceMin != null || router.query?.priceMax != null || router.query?.colors != null;
    }, [router.query]);

    // Маппинг URL-путей к названиям подкатегорий
    const subcategoryMapping = {
        '/sergi/dlinnye': 'Длинные',
        '/sergi/krupnye': 'Крупные',
        '/sergi/pod-zoloto': 'Под золото',
        '/sergi/pod-serebro': 'Под серебро',
        '/kolcza/krupnye': 'Крупные',
        '/kolcza/pod-zoloto': 'Под золото',
        '/kolcza/pod-serebro': 'Под серебро',
        '/braslety/shirokie': 'Широкие',
        '/braslety/zhestkie': 'Жесткие',
        '/braslety/pod-zoloto': 'Под золото',
        '/braslety/pod-serebro': 'Под серебро',
        '/kole/mnogoslojnye': 'Многослойные',
        '/kole/krupnye': 'Крупные',
        '/kole/dlinnye': 'Длинные',
        '/kole/pod-zoloto': 'Под золото',
        '/kole/pod-serebro': 'Под серебро'
    };

    // Функция для получения текущей подкатегории на основе URL (мемоизирована)
    const currentSubcategory = useMemo(() => {
        const currentPath = router.asPath.split('?')[0]; // Убираем query параметры
        for (const [path, subcategory] of Object.entries(subcategoryMapping)) {
            if (currentPath.includes(path)) {
                return subcategory;
            }
        }
        return null;
    }, [router.asPath]);

    // Функция для получения типа изделия из текущего пути
    const getCurrentTypeFromPath = (path) => {
        const pathMatch = path.match(/\/catalog\/(\w+)/);
        const slugFromPath = pathMatch ? pathMatch[1] : undefined;
        if (slugFromPath) {
            return mapSlugToProductType(slugFromPath);
        }
        return null;
    };

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

    // Мемоизируем массивы для сравнения без JSON.stringify
    const stateSalesString = useMemo(() => stateSales.join(','), [stateSales]);
    const selectedColorsString = useMemo(() => selectedColors.join(','), [selectedColors]);

    useEffect(() => {
        const currentFilters = { stateSortItems, stateType, stateSales: stateSalesString, text, selectedColors: selectedColorsString, priceMin, priceMax };
        const prevFiltersValue = prevFilters.current;
        
        const filtersChanged = 
            prevFiltersValue.stateSortItems !== stateSortItems ||
            prevFiltersValue.stateType !== stateType ||
            prevFiltersValue.stateSales !== stateSalesString ||
            prevFiltersValue.text !== text ||
            prevFiltersValue.selectedColors !== selectedColorsString ||
            prevFiltersValue.priceMin !== priceMin ||
            prevFiltersValue.priceMax !== priceMax;
        
        if (filtersChanged) {
            setCurrentPage(1);
            const newQuery = { ...router.query };
            delete newQuery.PAGEN_1;
            delete newQuery.page;
            delete newQuery.slug;
            delete newQuery.product;

            // синхронизация новых фильтров в URL (query)
            const min = String(priceMin || '').replace(/[^\d]/g, '');
            const max = String(priceMax || '').replace(/[^\d]/g, '');
            if (min) newQuery.priceMin = min; else delete newQuery.priceMin;
            if (max) newQuery.priceMax = max; else delete newQuery.priceMax;
            if (Array.isArray(selectedColors) && selectedColors.length > 0) {
                newQuery.colors = selectedColors.join(',');
            } else {
                delete newQuery.colors;
            }

            const currentPathOnly = (router.asPath || '').split('?')[0] || '/catalog';
            router.replace({ pathname: currentPathOnly, query: newQuery }, undefined, { shallow: true });
            
            prevFilters.current = currentFilters;
        }
    }, [stateSortItems, stateType, stateSalesString, selectedColorsString, priceMin, priceMax, text, router]);

    // читаем фильтры из query при прямом входе/обновлении
    useEffect(() => {
        const qMin = router.query?.priceMin;
        const qMax = router.query?.priceMax;
        const qColors = router.query?.colors;

        if (qMin != null) setPriceMin(String(qMin)); else setPriceMin('');
        if (qMax != null) setPriceMax(String(qMax)); else setPriceMax('');

        if (qColors != null) {
            const arr = String(qColors)
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
            // оставляем только цвета, которые реально есть в карточках
            setSelectedColors(arr.filter((c) => availableColors.includes(c)));
        } else {
            setSelectedColors([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.priceMin, router.query.priceMax, router.query.colors, availableColors.join('|')]);

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

        // Проверяем, нужно ли перейти на общую страницу категории
        // Если мы на подкатегории и выбираем тот же тип изделия через фильтр, переходим на общую страницу
        const isOnSubcategory = isSubcategoryPage;
        const currentTypeFromPath = getCurrentTypeFromPath(currentPath);
        const shouldNavigateToMainCategory = isOnSubcategory && currentTypeFromPath === typeCode && isUserInteraction;

        // Переходим на целевую страницу, если:
        // 1. Текущий путь не начинается с целевого пути, ИЛИ
        // 2. Мы на подкатегории и выбираем тот же тип изделия через фильтр (переходим на общую страницу)
        if (!currentPath.startsWith(targetPath) || shouldNavigateToMainCategory) {
            router.replace({ pathname: targetPath, query: newQuery }, undefined, { shallow: true });
        }
        
        // Сбрасываем флаг пользовательского взаимодействия после навигации
        if (isUserInteraction) {
            setIsUserInteraction(false);
        }
    }, [stateType, router, isSubcategoryPage, isUserInteraction]);

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

    // Мемоизируем вычисления для поиска - подготавливаем данные заранее
    const productsWithSearchData = useMemo(() => {
        if (!text || text.length === 0) return null;
        return String(text).toLowerCase().trim();
    }, [text]);

    // Мемоизируем фильтры для оптимизации
    const filterMinPrice = useMemo(() => {
        const min = Number(String(priceMin || '').replace(/[^\d]/g, ''));
        return Number.isFinite(min) && min > 0 ? min : null;
    }, [priceMin]);

    const filterMaxPrice = useMemo(() => {
        const max = Number(String(priceMax || '').replace(/[^\d]/g, ''));
        return Number.isFinite(max) && max > 0 ? max : null;
    }, [priceMax]);

    const typeMap = useMemo(() => ({
        'Кольца': 'ring',
        'Серьги': 'earrings',
        'Браслеты': 'bracelets',
        'Колье': 'necklace'
    }), []);

    const filterType = useMemo(() => {
        return stateType in typeMap ? typeMap[stateType] : null;
    }, [stateType, typeMap]);

    const hasNewSales = useMemo(() => stateSales.includes('Новинки'), [stateSales]);
    const hasPopularSales = useMemo(() => stateSales.includes('Популярное'), [stateSales]);

    const filteredData = useMemo(() => {
        if (!products || products.length === 0) return [];
        
        let d = [...products];

        // Применяем фильтры в оптимальном порядке (сначала самые селективные)
        
        // Фильтр по типу (самый селективный)
        if (filterType) {
            d = d.filter(x => x.type === filterType);
        }

        // Фильтр для подкатегорий
        if (currentSubcategory) {
            d = d.filter(product => {
                return product.subcategories && 
                       Array.isArray(product.subcategories) && 
                       product.subcategories.includes(currentSubcategory);
            });
        }

        // Фильтр для новинок
        if (hasNewSales) {
            d = d.filter(x => x.additionally?.includes('new'));
        }

        // Фильтр для популярного
        if (hasPopularSales) {
            d = d.filter(x => x.additionally?.includes('popular'));
        }

        // Фильтр по цветам
        if (Array.isArray(selectedColors) && selectedColors.length > 0) {
            d = d.filter((p) => selectedColors.includes(String(p?.color || '').trim()));
        }

        // Фильтр по цене (мемоизированные значения)
        if (filterMinPrice !== null || filterMaxPrice !== null) {
            d = d.filter((p) => {
                const price = getEffectivePrice(p);
                if (filterMinPrice !== null && price < filterMinPrice) return false;
                if (filterMaxPrice !== null && price > filterMaxPrice) return false;
                return true;
            });
        }

        // Поиск по тексту (в конце, чтобы меньше данных обрабатывать)
        if (productsWithSearchData) {
            d = d.filter(x => {
                const combined = `${(PRODUCT_TYPES[x?.type] || '').toLowerCase()} ${(x?.name || '').toLowerCase()}`.trim();
                const article = (x?.article || '').toLowerCase();
                return combined.includes(productsWithSearchData) || article.includes(productsWithSearchData);
            });
        }

        // Сортировка в конце (после всех фильтров)
        if (stateSortItems === 'По возрастанию цены') {
            d.sort((a, b) => a.cost - b.cost);
        } else if (stateSortItems === 'По убыванию цены') {
            d.sort((a, b) => b.cost - a.cost);
        }

        return d;
    }, [products, stateSortItems, filterType, currentSubcategory, hasNewSales, hasPopularSales, selectedColors, filterMinPrice, filterMaxPrice, productsWithSearchData, getEffectivePrice]);

    // Мемоизируем текущие товары для пагинации
    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredData.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredData, currentPage, itemsPerPage]);
    
    const totalPages = useMemo(() => {
        return Math.ceil(filteredData.length / itemsPerPage);
    }, [filteredData.length, itemsPerPage]);

    return (
        <>
            {hasFilterParamsForIndex && (
                <Head>
                    <meta name="robots" content="noindex, nofollow" />
                    <meta name="googlebot" content="noindex, nofollow" />
                </Head>
            )}
            <div className={`${styles.main} ${isSubcategoryPage ? styles.subcategoryPage : ''}`}>
            <Banner />
            <div className={styles.mainColumn} data-catalog-content>
                <Breadcrumb />
                <div className={styles.row}>
                    <div className={styles.leftColumn}>
                        <h1 className={styles.title}>
                            {h1Title ? h1Title :
                             isNewPage ? 'НОВИНКИ' : 
                             router.asPath.includes('/bizhuteriya-pod-zoloto') ? 'БИЖУТЕРИЯ ПОД ЗОЛОТО' :
                             router.asPath.includes('/bizhuteriya-pod-serebro') ? 'БИЖУТЕРИЯ ПОД СЕРЕБРО' :
                             router.asPath.includes('/kole/mnogoslojnye') ? 'МНОГОСЛОЙНЫЕ КОЛЬЕ' :
                             router.asPath.includes('/kole/krupnye') ? 'КРУПНЫЕ КОЛЬЕ' :
                             router.asPath.includes('/kole/dlinnye') ? 'ДЛИННЫЕ КОЛЬЕ' :
                             router.asPath.includes('/kole/pod-zoloto') ? 'КОЛЬЕ ПОД ЗОЛОТО' :
                             router.asPath.includes('/kole/pod-serebro') ? 'КОЛЬЕ ПОД СЕРЕБРО' :
                             router.asPath.includes('/sergi/dlinnye') ? 'ДЛИННЫЕ СЕРЬГИ' :
                             router.asPath.includes('/sergi/krupnye') ? 'КРУПНЫЕ СЕРЬГИ' :
                             router.asPath.includes('/sergi/pod-zoloto') ? 'СЕРЬГИ ПОД ЗОЛОТО' :
                             router.asPath.includes('/sergi/pod-serebro') ? 'СЕРЬГИ ПОД СЕРЕБРО' :
                             router.asPath.includes('/kolcza/krupnye') ? 'КРУПНЫЕ КОЛЬЦА' :
                             router.asPath.includes('/kolcza/pod-zoloto') ? 'КОЛЬЦА ПОД ЗОЛОТО' :
                             router.asPath.includes('/kolcza/pod-serebro') ? 'КОЛЬЦА ПОД СЕРЕБРО' :
                             router.asPath.includes('/braslety/shirokie') ? 'ШИРОКИЕ БРАСЛЕТЫ' :
                             router.asPath.includes('/braslety/zhestkie') ? 'ЖЕСТКИЕ БРАСЛЕТЫ' :
                             router.asPath.includes('/braslety/pod-zoloto') ? 'БРАСЛЕТЫ ПОД ЗОЛОТО' :
                             router.asPath.includes('/braslety/pod-serebro') ? 'БРАСЛЕТЫ ПОД СЕРЕБРО' :
                             stateType ? stateType.toUpperCase() : 'КАТАЛОГ'}
                        </h1>
                        <FilterSection
                            sales={sales}
                            types={types}
                            stateSales={stateSales}
                            stateType={stateType}
                            setStateSales={setStateSales}
                            setStateType={handleStateTypeChange}
                            stateColor={stateColor}
                            setStateColor={setStateColor}
                            availableColors={availableColors}
                            selectedColors={selectedColors}
                            setSelectedColors={setSelectedColors}
                            priceMin={priceMin}
                            priceMax={priceMax}
                            setPriceMin={setPriceMin}
                            setPriceMax={setPriceMax}
                            absoluteMinPrice={absoluteMinPrice}
                            absoluteMaxPrice={absoluteMaxPrice}
                        />
                    </div>
                    <div className={styles.rightColumn}>
                        {isMainCatalogPage && <CategoryCards initialData={categoryCardsData} />}
                        <SubcategoryCards productType={stateType} isSubcategoryPage={isSubcategoryPage} />
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
                            
                            <AccordionFilters
                                sales={sales}
                                types={types}
                                stateSales={stateSales}
                                stateType={stateType}
                                setStateSales={setStateSales}
                                setStateType={handleStateTypeChange}
                                stateColor={stateColor}
                                setStateColor={setStateColor}
                                availableColors={availableColors}
                                selectedColors={selectedColors}
                                setSelectedColors={setSelectedColors}
                                priceMin={priceMin}
                                priceMax={priceMax}
                                setPriceMin={setPriceMin}
                                setPriceMax={setPriceMax}
                                absoluteMinPrice={absoluteMinPrice}
                                absoluteMaxPrice={absoluteMaxPrice}
                                sortItems={sortItems}
                                stateSortItems={stateSortItems}
                                setStateSortItems={setStateSortItems}
                            />
                            <ProductGrid filteredData={currentItems} />

                            {filteredData.length > itemsPerPage && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                />
                            )}
                            
                            <SubcategorySeoText currentPage={currentPage} />
                        </div>
                    </div>
                </div>
            </div>
            <PopularBlock initialData={popularProducts} />
            </div>
        </>
    );
}