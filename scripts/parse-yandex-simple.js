// ============================================
// УПРОЩЕННЫЙ СКРИПТ ДЛЯ КОНСОЛИ БРАУЗЕРА
// ============================================
// Этот скрипт ищет ВСЕ ссылки, которые могут быть товарами
// Более простой и агрессивный подход

(function() {
    console.log('🔍 Упрощенный поиск товаров...');
    
    const products = [];
    const seenUrls = new Set();
    
    // Получаем ВСЕ ссылки
    const allLinks = Array.from(document.querySelectorAll('a[href]'));
    console.log(`📊 Всего ссылок: ${allLinks.length}`);
    
    allLinks.forEach(link => {
        try {
            // Используем полный href (браузер автоматически преобразует относительные)
            const href = link.href || link.getAttribute('href');
            if (!href || !href.includes('market.yandex.ru')) return;
            
            // Яндекс Маркет использует формат /card/название/ID
            // Ищем ссылки с /card/ и длинным ID товара
            const hasCardPath = href.includes('/card/');
            const hasProductId = href.match(/\/card\/[^\/]+\/(\d{8,})/); // /card/название/ID (8+ цифр)
            
            if (!hasCardPath || !hasProductId) return;
            
            // Исключаем служебные страницы
            if (href.includes('/search') || 
                href.includes('/cart') || 
                href.includes('/my/') ||
                href.includes('#') ||
                href.endsWith('/216411290') ||
                href.match(/\/216411290\/?$/)) {
                return;
            }
            
            // Нормализуем URL (убираем параметры для сравнения)
            const baseUrl = href.split('?')[0].split('#')[0];
            if (seenUrls.has(baseUrl)) return;
            seenUrls.add(baseUrl);
            
            // Ищем название товара
            let title = '';
            
            // Ищем в самом элементе ссылки
            title = link.textContent?.trim() || 
                   link.getAttribute('title') || 
                   link.getAttribute('aria-label') || '';
            
            // Если не нашли, ищем в родителях
            if (!title || title.length < 3) {
                let parent = link.parentElement;
                for (let i = 0; i < 5 && parent; i++) {
                    // Ищем заголовки
                    const h = parent.querySelector('h1, h2, h3, h4');
                    if (h && h.textContent) {
                        title = h.textContent.trim();
                        if (title.length > 3) break;
                    }
                    
                    // Ищем элементы с data-zone-name="title"
                    const titleEl = parent.querySelector('[data-zone-name="title"]');
                    if (titleEl && titleEl.textContent) {
                        title = titleEl.textContent.trim();
                        if (title.length > 3) break;
                    }
                    
                    // Ищем элементы с классом, содержащим "title" или "name"
                    const classTitleEl = parent.querySelector('[class*="title"], [class*="Title"], [class*="name"], [class*="Name"]');
                    if (classTitleEl && classTitleEl.textContent) {
                        const text = classTitleEl.textContent.trim();
                        if (text.length > 3 && text.length < 200) {
                            title = text;
                            break;
                        }
                    }
                    
                    parent = parent.parentElement;
                }
            }
            
            // Извлекаем ID товара из формата /card/название/ID
            const productIdMatch = href.match(/\/card\/[^\/]+\/(\d{8,})/);
            const productId = productIdMatch ? productIdMatch[1] : '';
            
            // Также извлекаем название из URL (slug)
            const slugMatch = href.match(/\/card\/([^\/]+)\/\d+/);
            const slug = slugMatch ? slugMatch[1] : '';
            
            // Формируем базовую ссылку без лишних параметров (оставляем только важные)
            // Берем базовую часть: /card/название/ID
            const baseUrlMatch = href.match(/(https:\/\/market\.yandex\.ru\/card\/[^\/]+\/\d+)/);
            let fullUrl = baseUrlMatch ? baseUrlMatch[1] : href.split('?')[0];
            
            // Добавляем параметры магазина, если их нет
            if (!href.includes('businessId=216411290')) {
                const params = '?businessId=216411290&generalContext=t%3DshopInShop%3Bi%3D1%3Bbi%3D216411290%3B&rs=eJwzUnrByPiJUYaDUWDhIVYJBo179xYpaEx-dVteY9uJZkWN6y1n5AHeTw3k&searchContext=sins_ctx';
                fullUrl = fullUrl + params;
            } else {
                // Если параметры уже есть, используем оригинальную ссылку
                fullUrl = href;
            }
            
            // Очищаем название от лишнего текста
            let cleanTitle = title;
            if (cleanTitle) {
                // Убираем "Mi Alegria" из начала, если есть
                cleanTitle = cleanTitle.replace(/^Mi\s*Alegria\s*/i, '').trim();
                // Убираем текст про цены и Яндекс Пэй
                cleanTitle = cleanTitle.replace(/Цена с картой.*$/i, '').trim();
                // Убираем скрипты и технический текст
                cleanTitle = cleanTitle.replace(/\(window\..*$/i, '').trim();
            }
            
            products.push({
                title: cleanTitle || slug || '(без названия)',
                url: fullUrl,
                productId: productId || ''
            });
            
        } catch (e) {
            // Игнорируем ошибки
        }
    });
    
    // Удаляем дубликаты по URL
    const uniqueProducts = Array.from(new Map(products.map(p => [p.url.split('?')[0], p])).values());
    
    console.log(`\n✅ Найдено ${uniqueProducts.length} уникальных товаров\n`);
    
    // Показываем первые 10 для проверки
    if (uniqueProducts.length > 0) {
        console.log('📋 Первые 10 товаров:');
        uniqueProducts.slice(0, 10).forEach((p, i) => {
            console.log(`${i + 1}. ${p.title}`);
            console.log(`   ${p.url.substring(0, 100)}...`);
        });
    }
    
    // Формируем JSON
    const json = JSON.stringify(uniqueProducts, null, 2);
    
    // Выводим в консоль
    console.log('\n📋 Полный JSON:');
    console.log(json);
    
    // Пытаемся скопировать в буфер обмена
    try {
        navigator.clipboard.writeText(json).then(() => {
            console.log('\n✅ JSON скопирован в буфер обмена!');
        }).catch(() => {
            console.log('\n⚠️  Не удалось скопировать автоматически, скопируйте вручную');
        });
    } catch (e) {
        console.log('\n⚠️  Не удалось скопировать автоматически, скопируйте вручную');
    }
    
    // Статистика
    console.log('\n📊 Статистика:');
    console.log(`   Всего товаров: ${uniqueProducts.length}`);
    console.log(`   С названиями: ${uniqueProducts.filter(p => p.title && p.title !== '(без названия)').length}`);
    console.log(`   Без названий: ${uniqueProducts.filter(p => !p.title || p.title === '(без названия)').length}`);
    
    return uniqueProducts;
})();

