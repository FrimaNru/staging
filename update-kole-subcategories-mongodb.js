const { MongoClient } = require('mongodb');

// Настройки подключения к MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'mialegria';

async function updateKoleSubcategories() {
    let client;
    
    try {
        console.log('🔌 Подключаемся к MongoDB...');
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        
        const db = client.db(DATABASE_NAME);
        const productsCollection = db.collection('products');
        
        console.log('🚀 Получаем список всех колье...');
        const koleProducts = await productsCollection.find({ type: 'necklace' }).toArray();
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
        let errorCount = 0;
        
        console.log('🔄 Начинаем обновление товаров...\n');
        
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
                try {
                    console.log(`🔄 Обновляем ${product.name} -> подкатегории: ${productSubcategories.join(', ')}`);
                    
                    // Обновляем товар в базе данных
                    const result = await productsCollection.updateOne(
                        { _id: product._id },
                        { $set: { subcategories: productSubcategories } }
                    );
                    
                    if (result.modifiedCount > 0) {
                        console.log(`✅ Обновлен ${product.name}`);
                        updatedCount++;
                    } else {
                        console.log(`⚠️ Товар ${product.name} не был изменен`);
                    }
                    
                } catch (error) {
                    console.error(`❌ Ошибка при обновлении ${product.name}:`, error.message);
                    errorCount++;
                }
            }
        }
        
        console.log('\n📊 Результаты обновления:');
        console.log(`✅ Успешно обновлено: ${updatedCount} товаров`);
        console.log(`❌ Ошибок: ${errorCount} товаров`);
        console.log(`📦 Всего обработано: ${updatedCount + errorCount} товаров`);
        
        console.log('\n📋 Созданные подкатегории:');
        for (const [slug, data] of Object.entries(subcategories)) {
            console.log(`   - ${slug}: ${data.name} (${data.products.length} товаров)`);
        }
        
        console.log('\n🎉 Обновление подкатегорий колье завершено!');
        
    } catch (error) {
        console.error('❌ Ошибка при обновлении подкатегорий:', error);
    } finally {
        if (client) {
            console.log('🔌 Соединение с MongoDB закрыто');
            await client.close();
        }
    }
}

// Запускаем обновление
updateKoleSubcategories();
