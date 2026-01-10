const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Конфигурация API
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.mi-alegria.shop/api/v1/';

async function analyzeProducts() {
    try {
        console.log('🔍 Загрузка товаров из БД...');
        const response = await axios.get(`${API_BASE_URL}getProducts`);
        const products = response.data;

        if (!Array.isArray(products)) {
            console.error('❌ Ошибка: товары не получены');
            return;
        }

        console.log(`✅ Загружено ${products.length} товаров\n`);

        // Группируем по названиям
        const byName = {};
        products.forEach(p => {
            const name = p.name || 'Без названия';
            if (!byName[name]) {
                byName[name] = [];
            }
            byName[name].push({
                article: p.article,
                name: p.name,
                color: p.color,
                type: p.type
            });
        });

        console.log('📋 Примеры товаров из БД (первые 50):\n');
        console.log('='.repeat(80));
        
        let count = 0;
        for (const name in byName) {
            if (count >= 50) break;
            const items = byName[name];
            console.log(`\n${name}:`);
            items.forEach(item => {
                console.log(`  - Артикул: ${item.article || 'нет'}`);
                console.log(`    Цвет: ${item.color || 'нет'}`);
                console.log(`    Тип: ${item.type || 'нет'}`);
            });
            count++;
        }

        console.log('\n' + '='.repeat(80));
        console.log(`\n📊 Статистика:`);
        console.log(`   Всего уникальных названий: ${Object.keys(byName).length}`);
        console.log(`   Всего товаров: ${products.length}`);

        // Сохраняем полный список в файл
        const outputFile = path.join(__dirname, 'products-analysis.json');
        fs.writeFileSync(outputFile, JSON.stringify({
            totalProducts: products.length,
            uniqueNames: Object.keys(byName).length,
            products: products.map(p => ({
                article: p.article,
                name: p.name,
                color: p.color,
                type: p.type
            }))
        }, null, 2), 'utf8');
        
        console.log(`\n✅ Полный анализ сохранен в: ${outputFile}`);

    } catch (error) {
        console.error('❌ Ошибка при анализе товаров:', error.message);
        if (error.response) {
            console.error('   Детали ошибки:', error.response.data);
        }
        process.exit(1);
    }
}

analyzeProducts();

