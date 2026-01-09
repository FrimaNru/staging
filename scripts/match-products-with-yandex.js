const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Конфигурация API
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.mi-alegria.shop/api/v1/';

// Путь к файлу с товарами из Яндекс Маркета
const YANDEX_PRODUCTS_FILE = path.join(__dirname, 'yandex-market-products.json');

// Базовый URL магазина
const YANDEX_MARKET_BASE_URL = 'https://market.yandex.ru/business--mi-alegria/216411290';
const YANDEX_MARKET_PARAMS = '?generalContext=t%3DshopInShop%3Bi%3D1%3Bbi%3D216411290%3B&rs=eJwzUnrByPiJUYaDUWDhIVYJBo179xYpaEx-dVteY9uJZkWN6y1n5AHeTw3k&searchContext=sins_ctx';

function buildFullUrl(url) {
    if (!url || url.trim() === '') return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) {
        return YANDEX_MARKET_BASE_URL + url + (url.includes('?') ? '' : YANDEX_MARKET_PARAMS);
    }
    return YANDEX_MARKET_BASE_URL + '/' + url + (url.includes('?') ? '' : YANDEX_MARKET_PARAMS);
}

// Маппинг транслитерации имен
const nameMapping = {
    'vera': 'вера',
    'mariana': 'мариана',
    'alfreda': 'альфреда',
    'mersedes': 'мерседес',
    'viktori': 'виктори',
    'frantsiska': 'франциска',
    'elena': 'елена',
    'rosaria': 'росариа',
    'khilda': 'хильда',
    'blanka': 'бланка',
    'mariya': 'мария',
    'melissa': 'мелисса',
    'patrisiya': 'патрисия',
    'laura': 'лаура',
    'adel': 'адель',
    'orbita': 'орбита',
    'teresa': 'тереса',
    'liliana': 'лилиана',
    'gloriya': 'глория',
    'rakel': 'ракель',
    'klara': 'клара',
    'katalina': 'каталина',
    'paola': 'паола',
    'alekhandra': 'алехандра',
    'norma': 'норма',
    'aylin': 'айлин',
    'zhozefina': 'жозефина',
    'adalinda': 'адалинда',
    'sara': 'сара',
    'iness': 'инесс',
    'vinitsiya': 'виниция',
    'zhanna': 'жанна',
    'rita': 'рита',
    'zhulia': 'жулиа',
    'eliana': 'элиана',
    'elen': 'элен',
    'karmita': 'кармита',
    'mayra': 'майра',
    'daniela': 'даниэла',
    'teodora': 'теодора',
    'miriam': 'мириам',
    'alba': 'альба',
    'sofiya': 'софия',
    'oliviya': 'оливия',
    'lyusiya': 'люсия',
    'khosefa': 'хосефа',
    'virdzhiniya': 'вирджиния',
    'anna': 'анна',
    'ramona': 'рамона',
    'konsuela': 'консуэла',
    'izabella': 'изабелла',
    'marsela': 'марсела',
    'valeri': 'валери',
    'martina': 'мартина',
    'ester': 'эстер',
    'filomena': 'филомена',
    'paloma': 'палома',
    'roza': 'роза',
    'bella': 'белла',
    'marisa': 'мариса',
    'karmen': 'кармен',
    'izabel': 'изабель',
    'daliya': 'далиа',
    'noeliya': 'ноэлия',
    'francheska': 'франческа',
    'beatris': 'беатрис',
    'veronika': 'вероника',
    'lidiana': 'лидиана',
    'marta': 'марта',
    'alegra': 'алегра'
};

// Функция для преобразования slug в читаемое название
function slugToName(slug) {
    const parts = slug.split('-');
    const mainName = parts[0].toLowerCase();
    const color = parts[1] || '';
    
    // Преобразуем имя через маппинг или первую букву в верхний регистр
    let russianName = nameMapping[mainName] || (mainName.charAt(0).toUpperCase() + mainName.slice(1));
    
    // Преобразуем первую букву в верхний регистр
    russianName = russianName.charAt(0).toUpperCase() + russianName.slice(1);
    
    // Преобразуем цвет
    let russianColor = '';
    if (color === 'zolotaya') {
        russianColor = 'золотая';
    } else if (color === 'serebryanaya') {
        russianColor = 'серебряная';
    } else if (color === 'bronzovaya') {
        russianColor = 'бронзовая';
    }
    
    return russianColor ? `${russianName} ${russianColor}` : russianName;
}

// Функция для нормализации названий для сравнения
function normalizeForMatch(str) {
    return str
        .toLowerCase()
        .replace(/[^\w\sа-яё]/g, '') // Сохраняем кириллицу
        .replace(/\s+/g, ' ')
        .trim();
}

// Функция для поиска совпадений по названию (более строгая)
function findMatch(productName, yandexSlug, productColor) {
    const normalizedProduct = normalizeForMatch(productName);
    
    // Преобразуем slug в читаемое название
    const yandexReadable = slugToName(yandexSlug);
    const normalizedYandex = normalizeForMatch(yandexReadable);
    
    // Извлекаем имя и цвет из slug
    const slugParts = yandexSlug.split('-');
    const slugMainName = slugParts[0].toLowerCase();
    const slugColor = slugParts[1] || '';
    
    // Определяем цвет из slug
    let yandexColor = '';
    if (slugColor === 'zolotaya') yandexColor = 'золотая';
    else if (slugColor === 'serebryanaya') yandexColor = 'серебряная';
    else if (slugColor === 'bronzovaya') yandexColor = 'бронзовая';
    
    // Извлекаем имя и цвет из названия товара
    const productWords = normalizedProduct.split(/\s+/);
    const productMainName = productWords[0];
    const productColorNormalized = normalizeForMatch(productColor || '');
    
    // Проверяем совпадение имени через маппинг
    const mappedName = nameMapping[slugMainName];
    if (mappedName) {
        const normalizedMappedName = normalizeForMatch(mappedName);
        if (productMainName === normalizedMappedName) {
            // Если есть цвет в slug, проверяем его тоже
            if (yandexColor) {
                const normalizedYandexColor = normalizeForMatch(yandexColor);
                return normalizedProduct.includes(normalizedYandexColor) || 
                       productColorNormalized.includes(normalizedYandexColor);
            }
            return true; // Если цвета нет, считаем совпадением
        }
    }
    
    // Проверяем точное совпадение преобразованного названия
    if (normalizedProduct === normalizedYandex) {
        return true;
    }
    
    // Проверяем совпадение имени и цвета отдельно
    if (productMainName === normalizeForMatch(yandexReadable.split(/\s+/)[0])) {
        if (yandexColor) {
            const normalizedYandexColor = normalizeForMatch(yandexColor);
            return normalizedProduct.includes(normalizedYandexColor) || 
                   productColorNormalized.includes(normalizedYandexColor);
        }
        return true;
    }
    
    return false; // Более строгая проверка - только точные совпадения
}

async function matchProducts() {
    try {
        // Загружаем товары из Яндекс Маркета
        if (!fs.existsSync(YANDEX_PRODUCTS_FILE)) {
            console.error(`❌ Файл ${YANDEX_PRODUCTS_FILE} не найден`);
            console.error('   Сначала получите список товаров из Яндекс Маркета');
            console.error('   Используйте скрипт: node scripts/parse-yandex-market-products.js');
            return;
        }

        const yandexData = JSON.parse(fs.readFileSync(YANDEX_PRODUCTS_FILE, 'utf8'));
        const yandexProducts = Array.isArray(yandexData) ? yandexData : (yandexData.товары || yandexData.products || []);

        if (yandexProducts.length === 0) {
            console.error('❌ Не найдено товаров в файле');
            return;
        }

        console.log(`✅ Загружено ${yandexProducts.length} товаров из Яндекс Маркета\n`);

        // Загружаем товары из БД
        console.log('🔍 Загрузка товаров из БД...');
        const productsResponse = await axios.get(`${API_BASE_URL}getProducts`);
        const products = productsResponse.data;

        if (!Array.isArray(products)) {
            console.error('❌ Ошибка: товары не получены из БД');
            return;
        }

        console.log(`✅ Загружено ${products.length} товаров из БД\n`);

        // Создаем маппинг
        const mapping = {};
        let matchedCount = 0;
        let unmatchedYandex = [];

        console.log('🔍 Сопоставление товаров...\n');

        // Создаем список уже сопоставленных товаров, чтобы избежать дубликатов
        const usedProducts = new Set();
        
        for (const yandexProduct of yandexProducts) {
            let yandexSlug = yandexProduct.title || yandexProduct.name || yandexProduct.slug || '';
            const yandexUrl = yandexProduct.url || yandexProduct.href || '';
            
            // Если title содержит JSON (ошибка парсинга), извлекаем slug из URL
            if (yandexSlug.startsWith('{') || yandexSlug.includes('widgets')) {
                // Извлекаем slug из URL: /card/NAME-COLOR/ID
                const urlMatch = yandexUrl.match(/\/card\/([^\/]+)\//);
                if (urlMatch) {
                    yandexSlug = urlMatch[1];
                } else {
                    continue; // Пропускаем, если не можем извлечь slug
                }
            }
            
            if (!yandexSlug && !yandexUrl) continue;

            // Ищем совпадение по названию
            let matchedProduct = null;
            
            // Преобразуем slug в читаемое название для сравнения
            const yandexReadable = slugToName(yandexSlug);
            
            // Извлекаем основное имя из slug (первое слово до дефиса)
            const mainSlugName = yandexSlug.split('-')[0].toLowerCase();
            const slugColor = yandexSlug.split('-')[1] || '';
            
            // Определяем цвет из slug
            let yandexColor = '';
            if (slugColor === 'zolotaya') yandexColor = 'золотая';
            else if (slugColor === 'serebryanaya') yandexColor = 'серебряная';
            else if (slugColor === 'bronzovaya') yandexColor = 'бронзовая';
            
            // Преобразуем имя через маппинг
            const mappedName = nameMapping[mainSlugName];
            const searchName = mappedName ? mappedName : mainSlugName;
            
            // Сначала ищем точное совпадение по имени и цвету
            // В БД названия могут быть: "Вера" или "Роза золотая" или "Мариана золотая"
            matchedProduct = products.find(p => {
                if (usedProducts.has(p._id)) return false;
                
                const productName = normalizeForMatch(p.name || '');
                const productColor = normalizeForMatch(p.color || '');
                const productWords = productName.split(/\s+/);
                const productMainName = productWords[0]; // Первое слово - имя
                const searchNameNormalized = normalizeForMatch(searchName);
                
                // Проверяем совпадение основного имени (первое слово)
                if (productMainName === searchNameNormalized) {
                    // Если есть цвет в slug, проверяем его
                    if (yandexColor) {
                        const normalizedYandexColor = normalizeForMatch(yandexColor);
                        // Цвет может быть в названии ("Мариана золотая") или в поле color
                        const hasColorInName = productWords.some(word => 
                            normalizeForMatch(word) === normalizedYandexColor
                        );
                        const hasColorInField = productColor.includes(normalizedYandexColor);
                        
                        if (hasColorInName || hasColorInField) {
                            return true; // Имя и цвет совпали
                        }
                        return false; // Имя совпало, но цвет нет - не подходит
                    }
                    // Если цвета нет в slug, ищем товары БЕЗ цвета в названии
                    // (например, "vera" должно сопоставляться только с "Вера", а не с "Роза золотая")
                    if (productWords.length > 1) {
                        // Проверяем, не является ли второе слово цветом
                        const secondWord = normalizeForMatch(productWords[1]);
                        if (secondWord === 'золотая' || secondWord === 'серебряная' || secondWord === 'бронзовая') {
                            return false; // В названии есть цвет, но в slug его нет - не подходит
                        }
                    }
                    return true; // Имя совпало, цвета нет нигде - подходит
                }
                
                return false;
            });
            
            // Если нашли совпадение, помечаем товар как использованный
            if (matchedProduct) {
                usedProducts.add(matchedProduct._id);
            }

            if (matchedProduct) {
                const key = matchedProduct.article || matchedProduct.name;
                const fullUrl = buildFullUrl(yandexUrl);
                if (fullUrl) {
                    mapping[key] = fullUrl;
                    matchedCount++;
                    console.log(`✓ Сопоставлено: "${matchedProduct.name}" → ${fullUrl.substring(0, 60)}...`);
                }
            } else {
                unmatchedYandex.push({
                    title: yandexSlug,
                    url: yandexUrl
                });
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('📊 Результаты сопоставления:');
        console.log(`   ✅ Сопоставлено: ${matchedCount}`);
        console.log(`   ⚠️  Не найдено совпадений: ${unmatchedYandex.length}`);
        console.log('='.repeat(50));

        // Сохраняем маппинг
        const mappingFile = path.join(__dirname, 'yandex-market-mapping.json');
        fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2), 'utf8');
        console.log(`\n✅ Маппинг сохранен в: ${mappingFile}`);

        // Сохраняем несовпавшие товары для ручной проверки
        if (unmatchedYandex.length > 0) {
            const unmatchedFile = path.join(__dirname, 'yandex-market-unmatched.json');
            fs.writeFileSync(unmatchedFile, JSON.stringify(unmatchedYandex, null, 2), 'utf8');
            console.log(`⚠️  Несовпавшие товары сохранены в: ${unmatchedFile}`);
            console.log('   Проверьте их вручную и добавьте в маппинг');
        }

        console.log('\n📝 Следующий шаг:');
        console.log('   Запустите скрипт обновления:');
        console.log('   $env:ADMIN_TOKEN="ваш_токен"');
        console.log('   node scripts/add-yandex-market-urls.js');

    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        if (error.response) {
            console.error('   Детали ошибки:', error.response.data);
        }
    }
}

// Запуск скрипта
matchProducts();

