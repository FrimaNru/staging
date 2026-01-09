const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Конфигурация API
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.mi-alegria.shop/api/v1/';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

// Путь к JSON файлу с маппингом (опционально)
const MAPPING_FILE = process.env.MAPPING_FILE || path.join(__dirname, 'yandex-market-mapping.json');

// Базовый URL магазина в Яндекс Маркет
const YANDEX_MARKET_BASE_URL = 'https://market.yandex.ru/business--mi-alegria/216411290';

// Базовые параметры для ссылок Яндекс Маркета
const YANDEX_MARKET_PARAMS = '?generalContext=t%3DshopInShop%3Bi%3D1%3Bbi%3D216411290%3B&rs=eJwzknjByPiJUYiDUWDhIVYJBo3Jr27La1xvOSMPAGXtCOA%2C&searchContext=sins_ctx';

// Маппинг товаров и их ссылок на Яндекс Маркет
// Формат: 'артикул товара' или 'название товара': 'ссылка на Яндекс Маркет'
// Если ссылка начинается с '/', она будет добавлена к базовому URL
// Если ссылка - это только ID товара или путь, она будет добавлена к базовому URL
const PRODUCT_URLS_MAP = {
    // Примеры:
    // 'ART-001': 'https://market.yandex.ru/product/123456',
    // 'Кольцо золотое': '/product/123456?generalContext=...',
    // 'ART-002': '123456', // Будет преобразовано в полную ссылку
    // Добавьте здесь маппинг ваших товаров
    // Можно также использовать JSON файл (см. ниже)
};

// Загрузка маппинга из JSON файла, если он существует
function loadMappingFromFile() {
    let mapping = { ...PRODUCT_URLS_MAP };
    
    if (fs.existsSync(MAPPING_FILE)) {
        try {
            const fileContent = fs.readFileSync(MAPPING_FILE, 'utf8');
            const fileData = JSON.parse(fileContent);
            
            // Если в файле есть ключ "маппинг", используем его, иначе весь файл
            const fileMapping = fileData.маппинг || fileData.mapping || fileData;
            
            // Убираем служебные ключи
            const cleanMapping = {};
            Object.keys(fileMapping).forEach(key => {
                if (key !== 'комментарий' && key !== 'инструкция' && key !== 'формат' && key !== 'примеры') {
                    cleanMapping[key] = fileMapping[key];
                }
            });
            
            mapping = { ...mapping, ...cleanMapping };
            console.log(`📄 Загружен маппинг из файла: ${MAPPING_FILE}`);
        } catch (error) {
            console.warn(`⚠️  Не удалось загрузить маппинг из файла ${MAPPING_FILE}:`, error.message);
        }
    }
    
    return mapping;
}

// Формирование полной ссылки на Яндекс Маркет
function buildFullUrl(url) {
    if (!url || url.trim() === '') return null;
    
    // Если уже полная ссылка
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    
    // Если начинается с /, добавляем к базовому URL
    if (url.startsWith('/')) {
        return YANDEX_MARKET_BASE_URL + url + (url.includes('?') ? '' : YANDEX_MARKET_PARAMS);
    }
    
    // Если это просто ID или путь, формируем полную ссылку
    return YANDEX_MARKET_BASE_URL + '/' + url + (url.includes('?') ? '' : YANDEX_MARKET_PARAMS);
}

async function addYandexMarketUrls() {
    if (!ADMIN_TOKEN) {
        console.error('❌ Ошибка: ADMIN_TOKEN не установлен. Установите его через переменную окружения:');
        console.error('   $env:ADMIN_TOKEN="ваш_токен" (PowerShell)');
        console.error('   или export ADMIN_TOKEN="ваш_токен" (Bash)');
        process.exit(1);
    }

    // Загружаем маппинг (из кода или файла)
    const productUrlsMap = loadMappingFromFile();

    if (Object.keys(productUrlsMap).length === 0) {
        console.error('❌ Ошибка: маппинг товаров пуст.');
        console.error('   Добавьте маппинг в PRODUCT_URLS_MAP в скрипте или создайте файл:');
        console.error(`   ${MAPPING_FILE}`);
        console.error('   Формат JSON: {"артикул или название": "ссылка или ID товара"}');
        process.exit(1);
    }

    try {
        console.log('🔍 Загрузка всех товаров...');
        
        const response = await axios.get(`${API_BASE_URL}getProducts`);
        const products = response.data;

        if (!Array.isArray(products)) {
            console.error('❌ Ошибка: товары не получены');
            return;
        }

        console.log(`✅ Загружено ${products.length} товаров`);
        console.log(`📋 Найдено ${Object.keys(productUrlsMap).length} ссылок для обновления\n`);

        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        let notFoundCount = 0;

        for (const [productKey, yandexUrl] of Object.entries(productUrlsMap)) {
            // Ищем товар по артикулу или названию
            const product = products.find(p => 
                p.article === productKey || 
                p.name === productKey ||
                (p.article && p.article.toLowerCase() === productKey.toLowerCase()) ||
                (p.name && p.name.toLowerCase() === productKey.toLowerCase())
            );

            if (!product) {
                console.warn(`⚠️  Товар "${productKey}" не найден`);
                notFoundCount++;
                continue;
            }

            // Формируем полную ссылку
            const fullUrl = buildFullUrl(yandexUrl);
            if (!fullUrl) {
                console.warn(`⚠️  Пустая ссылка для товара "${productKey}", пропускаем`);
                skippedCount++;
                continue;
            }

            // Проверяем, нужно ли обновление
            if (product.yandexMarketUrl === fullUrl) {
                console.log(`✓ Товар "${product.name}" уже имеет эту ссылку, пропускаем`);
                skippedCount++;
                continue;
            }

            console.log(`\n🔄 Обновление товара: ${product.name} (${product.article || 'без артикула'})`);
            console.log(`   Старая ссылка: ${product.yandexMarketUrl || '(нет)'}`);
            console.log(`   Новая ссылка: ${fullUrl}`);

            try {
                // Получаем полные данные товара
                const fullProductResponse = await axios.post(`${API_BASE_URL}getOneProduct`, { id: product._id });
                const fullProductData = fullProductResponse.data;

                // Обновляем yandexMarketUrl
                const updatedProductPayload = {
                    ...fullProductData,
                    yandexMarketUrl: fullUrl
                };

                // Создаем FormData для обновления
                const formData = new FormData();
                formData.append('data', JSON.stringify(updatedProductPayload));

                // Добавляем существующие изображения
                if (fullProductData.cover) {
                    formData.append('coverNames', fullProductData.cover);
                }
                if (Array.isArray(fullProductData.images)) {
                    fullProductData.images.forEach((img, index) => {
                        if (typeof img === 'string') {
                            formData.append(`imageNames[${index}]`, img);
                        }
                    });
                }

                // Отправляем обновление
                await axios.post(`${API_BASE_URL}editProduct`, formData, {
                    headers: {
                        Authorization: `Bearer ${ADMIN_TOKEN}`,
                        ...formData.getHeaders()
                    }
                });

                console.log(`✅ Ссылка успешно добавлена для "${product.name}"`);
                updatedCount++;

                // Небольшая задержка между запросами, чтобы не перегружать сервер
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                console.error(`❌ Ошибка при обновлении товара "${product.name}":`, error.message);
                if (error.response) {
                    console.error('   Детали ошибки:', error.response.data);
                }
                errorCount++;
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('📊 Итоги:');
        console.log(`   ✅ Обновлено товаров: ${updatedCount}`);
        console.log(`   ⏭️  Пропущено (уже обновлено): ${skippedCount}`);
        console.log(`   ⚠️  Не найдено товаров: ${notFoundCount}`);
        console.log(`   ❌ Ошибок: ${errorCount}`);
        console.log('='.repeat(50));

    } catch (error) {
        console.error('❌ Ошибка при обновлении ссылок:', error.message);
        if (error.response) {
            console.error('   Детали ошибки:', error.response.data);
        }
        process.exit(1);
    }
}

// Запуск скрипта
addYandexMarketUrls();

