import axios from "axios";
import { API_BASE_URL } from "../../apiConfig";
import { PRODUCT_TYPES } from "@/constants/items";

import { buildProductSlug } from "@/lib/seo";

/**
 * Загружает и фильтрует продукты для страниц каталога на сервере
 * @param {Object} options - Параметры фильтрации
 * @param {string} options.subcategoryPath - Путь подкатегории (например, '/sergi/dlinnye')
 * @param {string} options.productType - Тип продукта ('ring', 'earrings', 'bracelets', 'necklace')
 * @param {string} options.color - Цвет ('gold' или 'silver')
 * @param {string} options.text - Поисковый запрос
 * @param {string} options.filter - Фильтр ('new' для новинок)
 * @returns {Promise<Array>} Массив отфильтрованных продуктов
 */
export async function getFilteredProducts({ subcategoryPath, productType, color, text, filter }) {
    try {
        // Загружаем все продукты
        const response = await axios.get(`${API_BASE_URL}getProducts`);
        let products = response.data;

        if (!Array.isArray(products)) {
            products = [];
        }

        // Фильтруем по типу продукта
        if (productType) {
            products = products.filter(p => p.type === productType);
        }

        // Определяем подкатегорию из пути
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

        // Списки товаров для новых категорий в нужном порядке
        const goldProductsOrder = [
            'kolcza-zhulia-zolotaya', 'kole-katalina-zolotaya', 'sergi-roza-zolotaya', 'braslety-noeliya-zolotaya',
            'kolcza-paloma-zolotaya', 'sergi-zhanna-zolotaya', 'kole-ptitim-zolotaya', 'braslety-bella-zolotaya',
            'kolcza-mariya-zolotaya', 'sergi-karmen-zolotaya', 'kole-kleopatra-zolotaya', 'braslety-rita-zolotaya',
            'kolcza-alehandra-zolotaya', 'sergi-izabel-zolotaya', 'kole-viniciya-zolotaya', 'braslety-ramona-zolotaya',
            'kolcza-klara-zolotaya', 'sergi-ester-zolotaya', 'kole-franciska-zolotaya', 'braslety-melissa-zolotaya',
            'kolcza-adel-zolotaya', 'sergi-marta-zolotaya', 'kole-adalinda-zolotaya', 'braslety-filomena-zolotaya',
            'kolcza-alba-zolotaya', 'sergi-anna-zolotaya', 'kole-hilda-zolotaya', 'braslety-norma-zolotaya',
            'kolcza-konsuela-zolotaya', 'sergi-sofiya-zolotaya', 'kole-elen-zolotaya', 'braslety-mayra-zolotaya',
            'kolcza-alfreda-zolotaya', 'sergi-beatris-zolotaya', 'kole-mariana-zolotaya', 'braslety-rakel-zolotaya',
            'kolcza-lyusiya-zolotaya', 'sergi-blanka-zolotaya', 'kole-klara-zolotaya', 'braslety-paola-zolotaya',
            'kolcza-aylin-zolotaya', 'sergi-francheska-zolotaya', 'kole-zhozefina-zolotaya', 'braslety-mersedes-zolotaya',
            'kolcza-iness-zolotaya', 'sergi-alegra-zolotaya', 'kole-daniela-zolotaya', 'braslety-sara-zolotaya',
            'kolcza-elena-zolotaya', 'sergi-lidiana-zolotaya', 'kole-oliviya-zolotaya', 'braslety-miriam-zolotaya',
            'kolcza-liliana-zolotaya', 'sergi-ramona-zolotaya', 'kole-daliya-zolotaya', 'braslety-rosaria-zolotaya',
            'kolcza-virdzhiniya-zolotaya', 'sergi-veronika-zolotaya', 'kole-teodora-zolotaya', 'braslety-teresa-zolotaya',
            'sergi-karmita-zolotaya', 'kole-valeri-zolotaya', 'sergi-marisa-zolotaya', 'kole-martina-zolotaya',
            'sergi-eliana-zolotaya', 'kole-orbita-zolotaya', 'sergi-gloriya-zolotaya', 'kole-hosefa-zolotaya',
            'sergi-laura-zolotaya', 'braslety-marsela-zolotaya', 'sergi-viktori-zolotaya'
        ];

        const silverProductsOrder = [
            'kolcza-zhulia-serebryanaya', 'kole-katalina-serebryanaya', 'sergi-roza-serebryanaya', 'braslety-noeliya-serebryanaya',
            'kolcza-paloma-serebryanaya', 'sergi-zhanna-serebryanaya', 'kole-ptitim-serebryanaya', 'braslety-marsela-serebryanaya',
            'kolcza-mariya-serebryanaya', 'sergi-karmen-serebryanaya', 'kole-kleopatra-serebryanaya', 'braslety-rita-serebryanaya',
            'kolcza-alehandra-serebryanaya', 'sergi-izabel-serebryanaya', 'kole-viniciya-serebryanaya', 'braslety-ramona-serebryanaya',
            'kolcza-klara-serebryanaya', 'sergi-ester-serebryanaya', 'kole-franciska-serebryanaya', 'braslety-melissa-serebryanaya',
            'kolcza-adel-serebryanaya', 'sergi-marta-serebryanaya', 'kole-adalinda-serebryanaya', 'braslety-filomena-serebryanaya',
            'kolcza-alba-serebryanaya', 'sergi-anna-serebryanaya', 'kole-hilda-serebryanaya', 'braslety-norma-serebryanaya',
            'kolcza-konsuela-serebryanaya', 'sergi-sofiya-serebryanaya', 'braslety-paola-serebryanaya', 'kole-elen-serebryanaya',
            'braslety-mayra-serebryanaya', 'kolcza-alfreda-serebryanaya', 'sergi-beatris-serebryanaya', 'kole-mariana-serebryanaya',
            'braslety-rakel-serebryanaya', 'kolcza-lyusiya-serebryanaya', 'sergi-blanka-serebryanaya', 'kole-klara-serebryanaya',
            'braslety-mersedes-serebryanaya', 'kolcza-aylin-serebryanaya', 'sergi-francheska-serebryanaya', 'kole-zhozefina-serebryanaya',
            'braslety-sara-serebryanaya', 'kolcza-iness-serebryanaya', 'sergi-alegra-serebryanaya', 'kole-daniela-serebryanaya',
            'braslety-miriam-serebryanaya', 'kolcza-elena-serebryanaya', 'sergi-lidiana-serebryanaya', 'kole-oliviya-serebryanaya',
            'braslety-rosaria-serebryanaya', 'kolcza-liliana-serebryanaya', 'sergi-ramona-serebryanaya', 'kole-daliya-serebryanaya',
            'braslety-teresa-serebryanaya', 'kolcza-virdzhiniya-serebryanaya', 'sergi-veronika-serebryanaya', 'kole-teodora-serebryanaya',
            'sergi-karmita-serebryanaya', 'kole-valeri-bronzovaya', 'sergi-marisa-serebryanaya', 'kole-martina-serebryanaya',
            'sergi-eliana-serebryanaya', 'kole-orbita-serebryanaya', 'sergi-gloriya-serebryanaya', 'kole-hosefa-serebryanaya',
            'sergi-laura-serebryanaya', 'braslety-bella-serebryanaya', 'sergi-viktori-serebryanaya'
        ];

        // Определяем текущую подкатегорию
        let currentSubcategory = null;
        if (subcategoryPath) {
            for (const [subPath, subcategory] of Object.entries(subcategoryMapping)) {
                if (subcategoryPath.includes(subPath)) {
                    currentSubcategory = subcategory;
                    break;
                }
            }
        }

        // Фильтруем по подкатегории
        if (currentSubcategory) {
            products = products.filter(product => {
                return product.subcategories && 
                       Array.isArray(product.subcategories) && 
                       product.subcategories.includes(currentSubcategory);
            });
        }

        // Фильтруем по новым категориям "Бижутерия под золото" и "Бижутерия под серебро"
        if (subcategoryPath === '/bizhuteriya-pod-zoloto') {
            // Сначала пытаемся фильтровать по подкатегориям
            let filteredBySubcategory = products.filter(product => {
                return product.subcategories && 
                       Array.isArray(product.subcategories) && 
                       product.subcategories.includes('Бижутерия под золото');
            });
            
            // Если товары с подкатегориями найдены, используем их, иначе fallback на slug
            if (filteredBySubcategory.length > 0) {
                products = filteredBySubcategory;
            } else {
                // Fallback: фильтруем по slug
                products = products.filter(product => {
                    const slug = buildProductSlug(product);
                    return goldProductsOrder.includes(slug);
                });
            }
            
            // Сортируем по порядку из списка
            const orderMap = new Map(goldProductsOrder.map((slug, index) => [slug, index]));
            products.sort((a, b) => {
                const slugA = buildProductSlug(a);
                const slugB = buildProductSlug(b);
                const indexA = orderMap.get(slugA) ?? Infinity;
                const indexB = orderMap.get(slugB) ?? Infinity;
                return indexA - indexB;
            });
        } else if (subcategoryPath === '/bizhuteriya-pod-serebro') {
            // Сначала пытаемся фильтровать по подкатегориям
            let filteredBySubcategory = products.filter(product => {
                return product.subcategories && 
                       Array.isArray(product.subcategories) && 
                       product.subcategories.includes('Бижутерия под серебро');
            });
            
            // Если товары с подкатегориями найдены, используем их, иначе fallback на slug
            if (filteredBySubcategory.length > 0) {
                products = filteredBySubcategory;
            } else {
                // Fallback: фильтруем по slug
                products = products.filter(product => {
                    const slug = buildProductSlug(product);
                    return silverProductsOrder.includes(slug);
                });
            }
            
            // Сортируем по порядку из списка
            const orderMap = new Map(silverProductsOrder.map((slug, index) => [slug, index]));
            products.sort((a, b) => {
                const slugA = buildProductSlug(a);
                const slugB = buildProductSlug(b);
                const indexA = orderMap.get(slugA) ?? Infinity;
                const indexB = orderMap.get(slugB) ?? Infinity;
                return indexA - indexB;
            });
        }

        // Фильтр для новинок
        if (filter === 'new') {
            products = products.filter(x => x.additionally && x.additionally.includes('new'));
        }

        // Фильтр по поисковому запросу
        if (text && text.length > 0) {
            const normalizedQuery = String(text).toLowerCase().trim();
            products = products.filter(x => {
                const combined = `${(PRODUCT_TYPES[x?.type] || '').toLowerCase()} ${(x?.name || '').toLowerCase()}`.trim();
                const article = (x?.article || '').toLowerCase();
                return combined.includes(normalizedQuery) || article.includes(normalizedQuery);
            });
        }

        return products;
    } catch (error) {
        console.error('Ошибка при загрузке продуктов:', error.message);
        return [];
    }
}

