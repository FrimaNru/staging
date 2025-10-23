const axios = require('axios');

const API_BASE_URL = 'https://api.mi-alegria.shop/api/v1/';

async function updateKoleSubcategories() {
    try {
        console.log('🚀 Получаем список всех колье...');
        const response = await axios.get(`${API_BASE_URL}getProducts`);
        const products = response.data;
        
        // Фильтруем только колье
        const koleProducts = products.filter(product => product.type === 'necklace');
        console.log(`📦 Найдено ${koleProducts.length} колье`);
        
        // Определяем подкатегории и товары для каждой (по именам товаров)
        const subcategories = {
            'mnogoslojnye': {
                name: 'Многослойные',
                products: [
                    'патрисия', 'изабелла', 'виниция золотая', 'виниция серебряная',
                    'франциска золотая', 'франциска серебряная', 'хильда золотая', 'хильда серебряная',
                    'элен золотая', 'элен серебряная', 'валери золотая', 'валери бронзовая',
                    'мартина золотая', 'мартина серебряная'
                ]
            },
            'krupnye': {
                name: 'Крупные',
                products: [
                    'патрисия', 'изабелла', 'каталина золотая', 'каталина серебряная',
                    'клеопатра золотая', 'клеопатра серебряная', 'франциска золотая', 'франциска серебряная',
                    'элен золотая', 'элен серебряная', 'жозефина золотая', 'жозефина серебряная',
                    'даниэла золотая', 'даниэла серебряная', 'далиа золотая', 'далиа серебряная',
                    'мартина золотая', 'мартина серебряная'
                ]
            },
            'dlinnye': {
                name: 'Длинные',
                products: [
                    'патрисия', 'изабелла', 'вера', 'каталина золотая', 'каталина серебряная',
                    'птитим золотая', 'птитим серебряная', 'виниция золотая', 'виниция серебряная',
                    'франциска золотая', 'франциска серебряная', 'адалинда золотая', 'адалинда серебряная',
                    'мариана золотая', 'мариана серебряная', 'валери золотая', 'валери бронзовая',
                    'орбита золотая', 'орбита серебряная', 'хосефа золотая', 'хосефа серебряная'
                ]
            },
            'pod-zoloto': {
                name: 'Под золото',
                products: [
                    'каталина золотая', 'птитим золотая', 'клеопатра золотая', 'виниция золотая',
                    'франциска золотая', 'адалинда золотая', 'хильда золотая', 'элен золотая',
                    'мариана золотая', 'клара золотая', 'жозефина золотая', 'даниэла золотая',
                    'оливиа золотая', 'далиа золотая', 'теодора золотая', 'валери золотая',
                    'мартина золотая', 'орбита золотая', 'хосефа золотая'
                ]
            },
            'pod-serebro': {
                name: 'Под серебро',
                products: [
                    'вера', 'каталина серебряная', 'птитим серебряная', 'клеопатра серебряная',
                    'виниция серебряная', 'франциска серебряная', 'адалинда серебряная', 'хильда серебряная',
                    'элен серебряная', 'мариана серебряная', 'клара серебряная', 'жозефина серебряная',
                    'даниэла серебряная', 'оливиа серебряная', 'далиа серебряная', 'теодора серебряная',
                    'мартина серебряная', 'орбита серебряная', 'хосефа серебряная'
                ]
            }
        };
        
        let updatedCount = 0;
        
        // Обновляем каждый товар
        for (const product of koleProducts) {
            const productName = product.name?.toLowerCase();
            
            // Проверяем, в какие подкатегории должен попасть товар
            const productSubcategories = [];
            
            for (const [subcategorySlug, subcategoryData] of Object.entries(subcategories)) {
                // Проверяем по имени товара
                const foundProduct = subcategoryData.products.find(name => {
                    return productName && productName.includes(name.toLowerCase());
                });
                
                if (foundProduct) {
                    productSubcategories.push(subcategoryData.name);
                }
            }
            
            if (productSubcategories.length > 0) {
                console.log(`🔄 Обновляем ${product.name} -> подкатегории: ${productSubcategories.join(', ')}`);
                
                // Обновляем товар через API
                const updateData = {
                    ...product,
                    subcategories: productSubcategories
                };
                
                // Создаем FormData для отправки
                const formData = new FormData();
                formData.append('data', JSON.stringify(updateData));
                
                try {
                    // Отправляем запрос на обновление
                    await axios.post(`${API_BASE_URL}editProduct`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${process.env.ADMIN_TOKEN || 'your-admin-token'}`
                        }
                    });
                    
                    console.log(`✅ Обновлен ${product.name}`);
                    updatedCount++;
                } catch (error) {
                    console.error(`❌ Ошибка при обновлении ${product.name}:`, error.message);
                }
            }
        }
        
        console.log(`✅ Обновлено ${updatedCount} товаров`);
        console.log('📋 Созданные подкатегории:');
        for (const [slug, data] of Object.entries(subcategories)) {
            console.log(`   - ${slug}: ${data.name} (${data.products.length} товаров)`);
        }
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    }
}

updateKoleSubcategories();
