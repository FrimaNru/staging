import axios from "axios";
import { API_BASE_URL } from "../../apiConfig";
import { PRODUCT_TYPES } from "@/constants/items";

/**
 * Загружает и фильтрует продукты для страниц каталога на сервере
 * @param {Object} options - Параметры фильтрации
 * @param {string} options.subcategoryPath - Путь подкатегории (например, '/sergi/dlinnye')
 * @param {string} options.productType - Тип продукта ('ring', 'earrings', 'bracelets', 'necklace')
 * @param {string} options.text - Поисковый запрос
 * @param {string} options.filter - Фильтр ('new' для новинок)
 * @returns {Promise<Array>} Массив отфильтрованных продуктов
 */
export async function getFilteredProducts({ subcategoryPath, productType, text, filter }) {
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

