// ============================================
// ДИАГНОСТИЧЕСКИЙ СКРИПТ ДЛЯ КОНСОЛИ БРАУЗЕРА
// ============================================
// Этот скрипт покажет, какие ссылки и элементы есть на странице
// Скопируйте весь код и выполните в консоли браузера

(function() {
    console.log('🔍 Диагностика страницы Яндекс Маркета...\n');
    
    // 1. Все ссылки
    const allLinks = Array.from(document.querySelectorAll('a[href]'));
    console.log(`📊 Всего ссылок на странице: ${allLinks.length}`);
    
    // 2. Ссылки с "product"
    const productLinks = allLinks.filter(link => 
        link.href && (
            link.href.includes('/product/') || 
            link.href.includes('product') ||
            link.href.match(/\d{6,}/) // ID товара (6+ цифр)
        )
    );
    console.log(`📦 Ссылки с "product" или ID: ${productLinks.length}`);
    
    // Показываем первые 10 примеров
    if (productLinks.length > 0) {
        console.log('\n📋 Примеры ссылок:');
        productLinks.slice(0, 10).forEach((link, i) => {
            const href = link.href || link.getAttribute('href');
            const text = link.textContent?.trim()?.substring(0, 50) || '(нет текста)';
            console.log(`${i + 1}. ${href}`);
            console.log(`   Текст: ${text}`);
        });
    }
    
    // 3. Элементы с data-атрибутами
    const dataElements = Array.from(document.querySelectorAll('[data-zone-name], [data-product-id], [data-offer-id]'));
    console.log(`\n📊 Элементов с data-атрибутами: ${dataElements.length}`);
    
    if (dataElements.length > 0) {
        console.log('\n📋 Примеры data-атрибутов:');
        const samples = dataElements.slice(0, 5);
        samples.forEach((el, i) => {
            const zoneName = el.getAttribute('data-zone-name');
            const productId = el.getAttribute('data-product-id');
            const offerId = el.getAttribute('data-offer-id');
            console.log(`${i + 1}. data-zone-name: ${zoneName || 'нет'}, data-product-id: ${productId || 'нет'}, data-offer-id: ${offerId || 'нет'}`);
        });
    }
    
    // 4. Ищем карточки товаров по классам
    const possibleProductCards = Array.from(document.querySelectorAll('[class*="product"], [class*="Product"], [class*="card"], [class*="Card"]'));
    console.log(`\n📊 Элементов с классами product/card: ${possibleProductCards.length}`);
    
    // 5. Ищем в структуре страницы
    console.log('\n🔍 Анализ структуры страницы...');
    
    // Ищем контейнеры с товарами
    const containers = Array.from(document.querySelectorAll('div, article, section')).filter(el => {
        const links = el.querySelectorAll('a[href]');
        return links.length > 0;
    });
    
    console.log(`📊 Контейнеров с ссылками: ${containers.length}`);
    
    // 6. Пробуем найти товары по паттерну URL
    console.log('\n🔍 Поиск по паттернам URL...');
    
    const urlPatterns = {
        '/product/': allLinks.filter(l => l.href && l.href.includes('/product/')).length,
        '/catalog--': allLinks.filter(l => l.href && l.href.includes('/catalog--')).length,
        'business--mi-alegria': allLinks.filter(l => l.href && l.href.includes('business--mi-alegria')).length,
        '216411290': allLinks.filter(l => l.href && l.href.includes('216411290')).length,
        'ID товара (6+ цифр)': allLinks.filter(l => {
            const match = l.href?.match(/\/(\d{6,})\//);
            return match && match[1];
        }).length
    };
    
    Object.entries(urlPatterns).forEach(([pattern, count]) => {
        console.log(`   ${pattern}: ${count} ссылок`);
    });
    
    // 7. Показываем реальные ссылки на товары
    console.log('\n📋 Реальные ссылки, которые могут быть товарами:');
    const realProductLinks = allLinks.filter(link => {
        const href = link.href || link.getAttribute('href');
        if (!href) return false;
        
        // Проверяем различные паттерны
        return href.includes('/product/') ||
               href.includes('/catalog--') ||
               (href.includes('216411290') && href.match(/\d{6,}/)) ||
               href.match(/\/\d{6,}\//);
    });
    
    console.log(`Найдено потенциальных ссылок на товары: ${realProductLinks.length}`);
    
    if (realProductLinks.length > 0) {
        console.log('\n📋 Первые 15 примеров:');
        realProductLinks.slice(0, 15).forEach((link, i) => {
            const href = link.href || link.getAttribute('href');
            const text = link.textContent?.trim()?.substring(0, 60) || 
                        link.getAttribute('title') || 
                        link.getAttribute('aria-label') ||
                        '(нет названия)';
            console.log(`${i + 1}. ${href}`);
            console.log(`   Название: ${text}`);
            
            // Ищем название в родительских элементах
            let parent = link.parentElement;
            for (let j = 0; j < 3 && parent; j++) {
                const titleEl = parent.querySelector('h3, h2, [data-zone-name="title"]');
                if (titleEl && titleEl.textContent) {
                    console.log(`   Название из родителя: ${titleEl.textContent.trim().substring(0, 60)}`);
                    break;
                }
                parent = parent.parentElement;
            }
            console.log('');
        });
    }
    
    // 8. Возвращаем данные для дальнейшего использования
    return {
        allLinks: allLinks.length,
        productLinks: realProductLinks.map(link => ({
            href: link.href || link.getAttribute('href'),
            text: link.textContent?.trim() || link.getAttribute('title') || ''
        }))
    };
})();

