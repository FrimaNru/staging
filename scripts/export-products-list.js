const axios = require('axios');

// Конфигурация API
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.mi-alegria.shop/api/v1/';

async function exportProductsList() {
    try {
        console.log('🔍 Загрузка всех товаров...');
        
        const response = await axios.get(`${API_BASE_URL}getProducts`);
        const products = response.data;

        if (!Array.isArray(products)) {
            console.error('❌ Ошибка: товары не получены');
            return;
        }

        console.log(`✅ Загружено ${products.length} товаров\n`);

        // Создаем объект для маппинга
        const mapping = {};
        
        console.log('📋 Список товаров для маппинга:\n');
        console.log('Скопируйте этот JSON и заполните ссылки на Яндекс Маркет:\n');
        console.log('{');
        
        products.forEach((product, index) => {
            const key = product.article || product.name;
            const isLast = index === products.length - 1;
            console.log(`  "${key}": "",${isLast ? '' : ' // ' + product.name}`);
            mapping[key] = '';
        });
        
        console.log('}\n');
        
        // Также сохраняем в файл
        const fs = require('fs');
        const path = require('path');
        const outputFile = path.join(__dirname, 'yandex-market-mapping-template.json');
        
        fs.writeFileSync(outputFile, JSON.stringify(mapping, null, 2), 'utf8');
        console.log(`✅ Шаблон сохранен в файл: ${outputFile}`);
        console.log('   Заполните ссылки на Яндекс Маркет и переименуйте файл в yandex-market-mapping.json');

    } catch (error) {
        console.error('❌ Ошибка при загрузке товаров:', error.message);
        if (error.response) {
            console.error('   Детали ошибки:', error.response.data);
        }
        process.exit(1);
    }
}

// Запуск скрипта
exportProductsList();

