// ============================================
// СКРИПТ ДЛЯ ВЫПОЛНЕНИЯ В КОНСОЛИ БРАУЗЕРА
// ============================================
// Инструкция:
// 1. Откройте страницу: https://market.yandex.ru/business--mi-alegria/216411290?generalContext=t%3DshopInShop%3Bi%3D1%3Bbi%3D216411290%3B&rs=eJwzUnrByPiJUYaDUWDhIVYJBo179xYpaEx-dVteY9uJZkWN6y1n5AHeTw3k&searchContext=sins_ctx
// 2. Прокрутите страницу вниз, чтобы загрузить все товары (или подождите автоматической загрузки)
// 3. Откройте консоль разработчика (F12)
// 4. Скопируйте и вставьте весь этот код в консоль
// 5. Нажмите Enter
// 6. JSON будет скопирован в буфер обмена и выведен в консоль

(function() {
    console.log('🔍 Начинаю поиск товаров...');
    
    const products = [];
    const seenUrls = new Set();
    
    // Функция для прокрутки страницы
    function scrollPage() {
        return new Promise((resolve) => {
            let lastHeight = document.body.scrollHeight;
            let scrollCount = 0;
            const maxScrolls = 20;
            
            const scroll = () => {
                window.scrollTo(0, document.body.scrollHeight);
                scrollCount++;
                
                setTimeout(() => {
                    const newHeight = document.body.scrollHeight;
                    if (newHeight === lastHeight || scrollCount >= maxScrolls) {
                        resolve();
                    } else {
                        lastHeight = newHeight;
                        scroll();
                    }
                }, 1500);
            };
            
            scroll();
        });
    }
    
    // Функция для извлечения товаров
    function extractProducts() {
        console.log('🔍 Поиск товаров различными способами...');
        
        // Способ 1: Ищем все ссылки на странице
        console.log('   Способ 1: Поиск всех ссылок...');
        const allLinks = document.querySelectorAll('a[href]');
        console.log(`   Найдено ссылок: ${allLinks.length}`);
        
        allLinks.forEach(link => {
            try {
                // Используем href напрямую (браузер автоматически преобразует относительные ссылки)
                let href = link.href || link.getAttribute('href');
                if (!href) return;
                
                // Нормализуем ссылку
                try {
                    // Если ссылка относительная, создаем полную
                    if (href.startsWith('/')) {
                        href = 'https://market.yandex.ru' + href;
                    } else if (!href.startsWith('http')) {
                        href = 'https://market.yandex.ru/' + href;
                    }
                } catch (e) {
                    // Игнорируем ошибки парсинга URL
                }
                
                // Проверяем, является ли это ссылкой на товар
                // Яндекс Маркет использует формат /card/название/ID
                const isProductLink = 
                    href.includes('/card/') && // Формат карточки товара
                    href.match(/\/card\/[^\/]+\/\d{8,}/) && // Должен быть ID товара (8+ цифр)
                    !href.includes('/search') && // Исключаем поиск
                    !href.includes('/cart') && // Исключаем корзину
                    !href.includes('/my/') && // Исключаем личный кабинет
                    !href.includes('#') && // Исключаем якоря
                    href !== 'https://market.yandex.ru/business--mi-alegria/216411290'; // Исключаем главную страницу магазина
                
                if (!isProductLink) return;
                
                // Пропускаем дубликаты (нормализуем URL для сравнения)
                const normalizedUrl = href.split('?')[0]; // Убираем параметры для сравнения
                if (seenUrls.has(normalizedUrl)) return;
                seenUrls.add(normalizedUrl);
                
                // Ищем название товара - ищем в родительских элементах
                let title = '';
                let currentElement = link;
                
                // Поднимаемся по DOM дереву и ищем название
                for (let i = 0; i < 5 && currentElement; i++) {
                    const titleSelectors = [
                        'h3', 'h2', 'h4',
                        '[data-zone-name="title"]',
                        '.product-title',
                        '[class*="title"]',
                        '[class*="Title"]',
                        '[class*="name"]',
                        '[class*="Name"]',
                        'span[title]',
                        'div[title]'
                    ];
                    
                    for (const sel of titleSelectors) {
                        const titleEl = currentElement.querySelector(sel);
                        if (titleEl && titleEl.textContent) {
                            const text = titleEl.textContent.trim();
                            if (text.length > 3 && text.length < 200) {
                                title = text;
                                break;
                            }
                        }
                    }
                    
                    if (title) break;
                    currentElement = currentElement.parentElement;
                }
                
                // Если не нашли, берем из атрибутов или текста
                if (!title || title.length < 3) {
                    title = link.getAttribute('title') || 
                            link.getAttribute('aria-label') ||
                            link.textContent?.trim() || 
                            '';
                }
                
                // Извлекаем ID товара из формата /card/название/ID
                const productIdMatch = href.match(/\/card\/[^\/]+\/(\d{8,})/);
                const productId = productIdMatch ? productIdMatch[1] : '';
                
                // Извлекаем slug (название из URL)
                const slugMatch = href.match(/\/card\/([^\/]+)\/\d+/);
                const slug = slugMatch ? slugMatch[1] : '';
                
                // Формируем базовую ссылку
                const baseUrlMatch = href.match(/(https:\/\/market\.yandex\.ru\/card\/[^\/]+\/\d+)/);
                let fullUrl = baseUrlMatch ? baseUrlMatch[1] : href.split('?')[0];
                
                // Добавляем параметры магазина, если их нет
                if (!href.includes('businessId=216411290')) {
                    const params = '?businessId=216411290&generalContext=t%3DshopInShop%3Bi%3D1%3Bbi%3D216411290%3B&rs=eJwzUnrByPiJUYaDUWDhIVYJBo179xYpaEx-dVteY9uJZkWN6y1n5AHeTw3k&searchContext=sins_ctx';
                    fullUrl = fullUrl + params;
                } else {
                    fullUrl = href; // Используем оригинальную ссылку с параметрами
                }
                
                // Очищаем название
                let cleanTitle = title;
                if (cleanTitle) {
                    cleanTitle = cleanTitle.replace(/^Mi\s*Alegria\s*/i, '').trim();
                    cleanTitle = cleanTitle.replace(/Цена с картой.*$/i, '').trim();
                    cleanTitle = cleanTitle.replace(/\(window\..*$/i, '').trim();
                }
                
                if (fullUrl && productId) {
                    products.push({
                        title: cleanTitle || slug || '(без названия)',
                        url: fullUrl,
                        productId: productId
                    });
                }
            } catch (e) {
                // Игнорируем ошибки
            }
        });
        
        // Способ 2: Ищем по data-атрибутам Яндекс Маркета
        console.log('   Способ 2: Поиск по data-атрибутам...');
        const dataElements = document.querySelectorAll('[data-zone-name], [data-product-id], [data-offer-id]');
        console.log(`   Найдено элементов с data-атрибутами: ${dataElements.length}`);
        
        dataElements.forEach(el => {
            try {
                const productId = el.getAttribute('data-product-id') || 
                                 el.getAttribute('data-offer-id') || '';
                
                if (!productId) return;
                
                // Ищем ссылку в элементе или родителях
                let linkEl = el.querySelector('a[href*="product"]') || 
                            el.closest('a[href*="product"]') ||
                            el.querySelector('a[href]');
                
                if (!linkEl) {
                    // Создаем ссылку на основе ID
                    const fullUrl = `https://market.yandex.ru/product/${productId}`;
                    
                    if (seenUrls.has(fullUrl)) return;
                    seenUrls.add(fullUrl);
                    
                    const title = el.textContent?.trim() || 
                                 el.getAttribute('title') || 
                                 el.querySelector('h3, h2, [data-zone-name="title"]')?.textContent?.trim() ||
                                 '(без названия)';
                    
                    products.push({
                        title: title,
                        url: fullUrl,
                        productId: productId
                    });
                    return;
                }
                
                const href = linkEl.getAttribute('href');
                if (!href) return;
                
                let fullUrl;
                if (href.startsWith('http')) {
                    fullUrl = href;
                } else {
                    fullUrl = 'https://market.yandex.ru' + (href.startsWith('/') ? href : '/' + href);
                }
                
                if (seenUrls.has(fullUrl)) return;
                seenUrls.add(fullUrl);
                
                const title = el.textContent?.trim() || 
                             el.querySelector('[data-zone-name="title"]')?.textContent?.trim() ||
                             linkEl.textContent?.trim() ||
                             '(без названия)';
                
                products.push({
                    title: title,
                    url: fullUrl,
                    productId: productId || href.match(/\/product\/([^\/\?]+)/)?.[1] || ''
                });
            } catch (e) {
                // Игнорируем ошибки
            }
        });
        
        // Способ 3: Ищем в window.__INITIAL_STATE__ или других глобальных объектах
        console.log('   Способ 3: Поиск в глобальных объектах...');
        try {
            // Яндекс Маркет может хранить данные в window
            const windowKeys = Object.keys(window).filter(k => 
                k.includes('state') || k.includes('data') || k.includes('store') || k.includes('products')
            );
            
            if (windowKeys.length > 0) {
                console.log(`   Найдено потенциальных объектов: ${windowKeys.length}`);
                // Можно попробовать извлечь данные, но это сложнее
            }
        } catch (e) {
            // Игнорируем
        }
        
        console.log(`   Всего найдено товаров после всех способов: ${products.length}`);
    }
    
        // Основная функция
        async function main() {
            console.log('📜 Прокручиваю страницу для загрузки всех товаров...');
            await scrollPage();
            
            // Даем время на загрузку после прокрутки
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('🔍 Извлекаю данные о товарах...');
            extractProducts();
            
            // Пробуем еще раз после небольшой задержки (на случай ленивой загрузки)
            if (products.length === 0) {
                console.log('⏳ Товары не найдены, жду еще немного...');
                await new Promise(resolve => setTimeout(resolve, 3000));
                extractProducts();
            }
        
        // Удаляем дубликаты
        const uniqueProducts = Array.from(new Map(products.map(p => [p.url, p])).values());
        
        console.log(`✅ Найдено ${uniqueProducts.length} уникальных товаров\n`);
        
        // Формируем JSON
        const json = JSON.stringify(uniqueProducts, null, 2);
        
        // Выводим в консоль
        console.log('📋 Список товаров:');
        console.log(json);
        
        // Копируем в буфер обмена
        try {
            await navigator.clipboard.writeText(json);
            console.log('\n✅ JSON скопирован в буфер обмена!');
            console.log('📝 Теперь вставьте его в файл scripts/yandex-market-products.json');
        } catch (e) {
            console.log('\n⚠️  Не удалось скопировать в буфер обмена автоматически');
            console.log('   Скопируйте JSON вручную из консоли');
        }
        
        // Показываем статистику
        console.log('\n📊 Статистика:');
        console.log(`   Всего товаров: ${uniqueProducts.length}`);
        console.log(`   С названиями: ${uniqueProducts.filter(p => p.title).length}`);
        console.log(`   Без названий: ${uniqueProducts.filter(p => !p.title).length}`);
        
        return uniqueProducts;
    }
    
    // Запускаем
    return main();
})();

