const axios = require('axios');
const fs = require('fs');
const path = require('path');

// URL магазина в Яндекс Маркете
const YANDEX_MARKET_URL = 'https://market.yandex.ru/business--mi-alegria/216411290?generalContext=t%3DshopInShop%3Bi%3D1%3Bbi%3D216411290%3B&rs=eJwzUnrByPiJUYaDUWDhIVYJBo179xYpaEx-dVteY9uJZkWN6y1n5AHeTw3k&searchContext=sins_ctx';

// Конфигурация API
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.mi-alegria.shop/api/v1/';

async function parseYandexMarketProducts() {
    try {
        console.log('🔍 Загрузка товаров из вашей БД для сопоставления...');
        
        // Загружаем товары из БД
        const productsResponse = await axios.get(`${API_BASE_URL}getProducts`);
        const products = productsResponse.data;

        if (!Array.isArray(products)) {
            console.error('❌ Ошибка: товары не получены');
            return;
        }

        console.log(`✅ Загружено ${products.length} товаров из БД\n`);

        console.log('⚠️  ВНИМАНИЕ: Для парсинга Яндекс Маркета нужен Puppeteer или Playwright');
        console.log('   Страница Яндекс Маркета загружается динамически через JavaScript');
        console.log('   Простой HTTP-запрос не получит список товаров\n');

        console.log('📋 Рекомендуемый способ:');
        console.log('   1. Откройте страницу магазина в браузере:');
        console.log(`      ${YANDEX_MARKET_URL}`);
        console.log('   2. Прокрутите страницу вниз, чтобы загрузить все товары');
        console.log('   3. Откройте консоль разработчика (F12)');
        console.log('   4. Выполните следующий JavaScript код:\n');

        const browserScript = `
// Скрипт для выполнения в консоли браузера на странице Яндекс Маркета
(function() {
    const products = [];
    const productLinks = document.querySelectorAll('a[href*="/product/"]');
    
    productLinks.forEach(link => {
        const href = link.getAttribute('href');
        const fullUrl = href.startsWith('http') ? href : 'https://market.yandex.ru' + href;
        const title = link.querySelector('h3, .product-title, [data-zone-name="title"]')?.textContent?.trim() || '';
        
        if (href && href.includes('/product/')) {
            products.push({
                title: title,
                url: fullUrl,
                productId: href.match(/\\/product\\/([^\\/?]+)/)?.[1] || ''
            });
        }
    });
    
    // Удаляем дубликаты
    const uniqueProducts = Array.from(new Map(products.map(p => [p.url, p])).values());
    
    console.log('Найдено товаров:', uniqueProducts.length);
    console.log(JSON.stringify(uniqueProducts, null, 2));
    
    // Копируем в буфер обмена
    const json = JSON.stringify(uniqueProducts, null, 2);
    navigator.clipboard.writeText(json).then(() => {
        console.log('✅ Данные скопированы в буфер обмена!');
    });
    
    return uniqueProducts;
})();
`;

        console.log(browserScript);
        console.log('\n   5. Скопируйте полученный JSON');
        console.log('   6. Вставьте его в файл yandex-market-products.json\n');

        // Создаем пример структуры
        const exampleStructure = {
            "инструкция": "Это пример структуры данных, которые нужно получить",
            "товары": [
                {
                    "title": "Название товара",
                    "url": "https://market.yandex.ru/product/123456",
                    "productId": "123456"
                }
            ]
        };

        const outputFile = path.join(__dirname, 'yandex-market-products-example.json');
        fs.writeFileSync(outputFile, JSON.stringify(exampleStructure, null, 2), 'utf8');
        console.log(`✅ Пример структуры сохранен в: ${outputFile}`);

        // Также создаем скрипт для сопоставления
        console.log('\n📝 После получения списка товаров из Яндекс Маркета:');
        console.log('   Запустите скрипт сопоставления:');
        console.log('   node scripts/match-products-with-yandex.js');

    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        if (error.response) {
            console.error('   Детали ошибки:', error.response.data);
        }
    }
}

// Запуск скрипта
parseYandexMarketProducts();

