const fs = require('fs');
const path = require('path');

// Проверяем наличие Puppeteer
let puppeteer;
try {
    puppeteer = require('puppeteer');
} catch (e) {
    console.log('⚠️  Puppeteer не установлен. Устанавливаю...');
    console.log('   Запустите: npm install puppeteer');
    console.log('   Или используйте ручной способ (см. parse-yandex-market-products.js)\n');
    process.exit(1);
}

// URL магазина в Яндекс Маркете
const YANDEX_MARKET_URL = 'https://market.yandex.ru/business--mi-alegria/216411290?generalContext=t%3DshopInShop%3Bi%3D1%3Bbi%3D216411290%3B&rs=eJwzUnrByPiJUYaDUWDhIVYJBo179xYpaEx-dVteY9uJZkWN6y1n5AHeTw3k&searchContext=sins_ctx';

async function parseYandexMarketAuto() {
    let browser;
    
    try {
        console.log('🚀 Запуск браузера...');
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        
        console.log('📡 Загрузка страницы Яндекс Маркета...');
        await page.goto(YANDEX_MARKET_URL, { 
            waitUntil: 'networkidle2',
            timeout: 60000 
        });

        console.log('⏳ Ожидание загрузки товаров...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Прокручиваем страницу для загрузки всех товаров
        console.log('📜 Прокрутка страницы для загрузки всех товаров...');
        let previousHeight = 0;
        let scrollAttempts = 0;
        const maxScrollAttempts = 10;

        while (scrollAttempts < maxScrollAttempts) {
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const newHeight = await page.evaluate('document.body.scrollHeight');
            if (newHeight === previousHeight) {
                break;
            }
            scrollAttempts++;
        }

        console.log('🔍 Извлечение данных о товарах...');

        // Извлекаем товары со страницы
        const products = await page.evaluate(() => {
            const items = [];
            const seenUrls = new Set();

            // Ищем все ссылки на товары - расширенный список селекторов
            const selectors = [
                'a[href*="/product/"]',
                'a[href*="product"]',
                'a[data-zone-name="title"]',
                '.product-card a',
                '[data-zone-name="productCard"] a',
                '[class*="product"] a',
                '[class*="Product"] a',
                'article a',
                '[role="article"] a'
            ];

            // Также ищем по тексту ссылок
            const allLinks = document.querySelectorAll('a');
            
            allLinks.forEach(link => {
                try {
                    const href = link.getAttribute('href');
                    if (!href) return;
                    
                    // Проверяем, является ли это ссылкой на товар
                    const isProductLink = href.includes('/product/') || 
                                         href.includes('product') ||
                                         href.match(/\/\d+\//); // ID товара в URL
                    
                    if (!isProductLink) return;
                    
                    // Формируем полную ссылку
                    let fullUrl;
                    if (href.startsWith('http://') || href.startsWith('https://')) {
                        fullUrl = href;
                    } else if (href.startsWith('/')) {
                        fullUrl = 'https://market.yandex.ru' + href;
                    } else {
                        fullUrl = 'https://market.yandex.ru/' + href;
                    }
                    
                    // Пропускаем дубликаты
                    if (seenUrls.has(fullUrl)) return;
                    seenUrls.add(fullUrl);

                    // Пытаемся найти название товара
                    let title = '';
                    
                    // Ищем в различных элементах
                    const titleSelectors = [
                        'h3', 'h2', 'h4',
                        '.product-title',
                        '[data-zone-name="title"]',
                        '.title',
                        '[class*="title"]',
                        '[class*="Title"]',
                        'span[title]',
                        'div[title]'
                    ];
                    
                    for (const sel of titleSelectors) {
                        const titleEl = link.querySelector(sel) || link.closest(sel)?.querySelector(sel);
                        if (titleEl && titleEl.textContent) {
                            title = titleEl.textContent.trim();
                            if (title.length > 3) break;
                        }
                    }
                    
                    // Если не нашли, берем из атрибутов
                    if (!title || title.length < 3) {
                        title = link.getAttribute('title') || 
                                link.getAttribute('aria-label') ||
                                link.textContent?.trim() || 
                                '';
                    }

                    // Извлекаем ID товара
                    const productIdMatch = href.match(/\/product\/([^\/\?]+)/) || 
                                          href.match(/\/(\d+)\//) ||
                                          href.match(/product[\/\-]?(\d+)/);
                    const productId = productIdMatch ? productIdMatch[1] : '';

                    if (fullUrl && (productId || title)) {
                        items.push({
                            title: title,
                            url: fullUrl,
                            productId: productId
                        });
                    }
                } catch (e) {
                    // Игнорируем ошибки при обработке отдельных ссылок
                }
            });

            // Удаляем дубликаты
            const unique = Array.from(new Map(items.map(p => [p.url, p])).values());
            return unique;
        });

        console.log(`✅ Найдено ${products.length} товаров\n`);

        // Сохраняем результаты
        const outputFile = path.join(__dirname, 'yandex-market-products.json');
        fs.writeFileSync(outputFile, JSON.stringify(products, null, 2), 'utf8');
        console.log(`✅ Данные сохранены в: ${outputFile}`);

        // Показываем первые несколько товаров
        console.log('\n📋 Примеры найденных товаров:');
        products.slice(0, 5).forEach((p, i) => {
            console.log(`   ${i + 1}. ${p.title || '(без названия)'}`);
            console.log(`      ${p.url}`);
        });

        if (products.length > 5) {
            console.log(`   ... и еще ${products.length - 5} товаров`);
        }

        console.log('\n📝 Следующий шаг:');
        console.log('   Запустите скрипт сопоставления:');
        console.log('   node scripts/match-products-with-yandex.js');

        await browser.close();

    } catch (error) {
        console.error('❌ Ошибка при парсинге:', error.message);
        if (browser) {
            await browser.close();
        }
        process.exit(1);
    }
}

// Запуск скрипта
parseYandexMarketAuto();

