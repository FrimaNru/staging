const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.mi-alegria.shop/api/v1/';

async function getProductsExamples() {
    try {
        console.log('🔍 Загрузка товаров из БД...');
        const response = await axios.get(`${API_BASE_URL}getProducts`);
        const products = response.data;

        if (!Array.isArray(products)) {
            console.error('❌ Ошибка: товары не получены');
            return;
        }

        console.log(`✅ Загружено ${products.length} товаров\n`);

        // Выводим примеры товаров
        console.log('📋 Примеры товаров из БД (первые 30):\n');
        const examples = products.slice(0, 30).map(p => ({
            name: p.name,
            article: p.article,
            color: p.color,
            type: p.type
        }));

        console.log(JSON.stringify(examples, null, 2));

        // Сохраняем в файл
        const outputFile = path.join(__dirname, 'products-examples.json');
        fs.writeFileSync(outputFile, JSON.stringify(examples, null, 2), 'utf8');
        console.log(`\n✅ Примеры сохранены в: ${outputFile}`);

        // Выводим статистику по цветам
        const colors = {};
        products.forEach(p => {
            const color = p.color || 'нет цвета';
            colors[color] = (colors[color] || 0) + 1;
        });
        console.log('\n📊 Статистика по цветам:');
        Object.entries(colors).forEach(([color, count]) => {
            console.log(`   ${color}: ${count} товаров`);
        });

        // Выводим уникальные имена товаров
        const uniqueNames = [...new Set(products.map(p => p.name).filter(Boolean))];
        console.log(`\n📊 Уникальных названий товаров: ${uniqueNames.length}`);
        console.log('\n📋 Примеры названий (первые 50):');
        uniqueNames.slice(0, 50).forEach((name, i) => {
            console.log(`   ${i + 1}. ${name}`);
        });

    } catch (error) {
        console.error('❌ Ошибка при загрузке товаров:', error.message);
        if (error.response) {
            console.error('   Детали ошибки:', error.response.data);
        }
        process.exit(1);
    }
}

getProductsExamples();

