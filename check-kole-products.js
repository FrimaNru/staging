const axios = require('axios');

const API_BASE_URL = 'https://api.mi-alegria.shop/api/v1/';

async function checkKoleProducts() {
    try {
        console.log('🚀 Получаем список всех колье...');
        const response = await axios.get(`${API_BASE_URL}getProducts`);
        const products = response.data;
        
        // Фильтруем только колье
        const koleProducts = products.filter(product => product.type === 'necklace');
        console.log(`📦 Найдено ${koleProducts.length} колье`);
        
        console.log('\n📋 Список всех колье:');
        koleProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
            console.log(`   Slug: ${product.slug || 'НЕТ'}`);
            console.log(`   ID: ${product._id}`);
            console.log('---');
        });
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    }
}

checkKoleProducts();
