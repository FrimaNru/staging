const axios = require('axios');

const API_BASE_URL = 'https://api.mi-alegria.shop/api/v1/';

// Данные подкатегорий с артикулами товаров
const subcategoryData = {
    'mnogoslojnye': {
        name: 'Многослойные',
        products: [
            'EN24128506GSLP', // Патрисия
            'EN24129098GPBLW', // Изабелла
            'EN24127544GLP', // Виниция золотая
            'EN24127544SLP', // Виниция серебряная
            'EN24128153GLP', // Франциска золотая
            'EN24128153SLP', // Франциска серебряная
            'EN24128812GLP', // Хильда золотая
            'EN24128812SLP', // Хильда серебряная
            'EN24130246GLP', // Элен золотая
            'EN24130246SLP', // Элен серебряная
            'EN24126932GLP', // Валери золотая
            'EN24126932BRP', // Валери бронзовая
            'EN24126004GLP', // Мартина золотая
            'EN24126004SLP'  // Мартина серебряная
        ]
    },
    'krupnye': {
        name: 'Крупные',
        products: [
            'EN24128506GSLP', // Патрисия
            'EN24129098GPBLW', // Изабелла
            'EN24118086GLP', // Каталина золотая
            'EN24118086SLP', // Каталина серебряная
            'EN24125827GLP', // Клеопатра золотая
            'EN24125827SLP', // Клеопатра серебряная
            'EN24128153GLP', // Франциска золотая
            'EN24128153SLP', // Франциска серебряная
            'EN24130246GLP', // Элен золотая
            'EN24130246SLP', // Элен серебряная
            'EN24130335GLP', // Жозефина золотая
            'EN24130335SLP', // Жозефина серебряная
            'EN24131371GL', // Даниэла золотая
            'EN24131371SL', // Даниэла серебряная
            'EN24131451GLP', // Далия золотая
            'EN24131451SLP', // Далия серебряная
            'EN24126004GLP', // Мартина золотая
            'EN24126004SLP'  // Мартина серебряная
        ]
    },
    'dlinnye': {
        name: 'Длинные',
        products: [
            'EN24128506GSLP', // Патрисия
            'EN24129098GPBLW', // Изабелла
            'EN24130290GSLP', // Вера
            'EN24118086GLP', // Каталина золотая
            'EN24118086SLP', // Каталина серебряная
            'EN24125827GLP', // Птитим золотая
            'EN24125827SLP', // Птитим серебряная
            'EN24127544GLP', // Виниция золотая
            'EN24127544SLP', // Виниция серебряная
            'EN24128153GLP', // Франциска золотая
            'EN24128153SLP', // Франциска серебряная
            'EN24128702GLP', // Адалинда золотая
            'EN24128702SLP', // Адалинда серебряная
            'EN24130292GLP', // Мариана золотая
            'EN24130292SLP', // Мариана серебряная
            'EN24126932GLP', // Валери золотая
            'EN24126932BRP', // Валери бронзовая
            'EN24126933GLP', // Орбита золотая
            'EN24126933SLP', // Орбита серебряная
            'EN24127862GLP', // Хосефа золотая
            'EN24127862SLP'  // Хосефа серебряная
        ]
    },
    'pod-zoloto': {
        name: 'Под золото',
        products: [
            'EN24118086GLP', // Каталина золотая
            'EN24125827GLP', // Птитим золотая
            'EN24125827GLP', // Клеопатра золотая
            'EN24127544GLP', // Виниция золотая
            'EN24128153GLP', // Франциска золотая
            'EN24128702GLP', // Адалинда золотая
            'EN24128812GLP', // Хильда золотая
            'EN24130246GLP', // Элен золотая
            'EN24130292GLP', // Мариана золотая
            'EN24130294GLP', // Клара золотая
            'EN24130335GLP', // Жозефина золотая
            'EN24131371GL', // Даниэла золотая
            'EN24131589GLP', // Оливия золотая
            'EN24131451GLP', // Далия золотая
            'EN24131313GLP', // Теодора золотая
            'EN24126932GLP', // Валери золотая
            'EN24126004GLP', // Мартина золотая
            'EN24126933GLP', // Орбита золотая
            'EN24127862GLP'  // Хосефа золотая
        ]
    },
    'pod-serebro': {
        name: 'Под серебро',
        products: [
            'EN24130290GSLP', // Вера
            'EN24118086SLP', // Каталина серебряная
            'EN24125827SLP', // Птитим серебряная
            'EN24125827SLP', // Клеопатра серебряная
            'EN24127544SLP', // Виниция серебряная
            'EN24128153SLP', // Франциска серебряная
            'EN24128702SLP', // Адалинда серебряная
            'EN24128812SLP', // Хильда серебряная
            'EN24130246SLP', // Элен серебряная
            'EN24130292SLP', // Мариана серебряная
            'EN24130294SLP', // Клара серебряная
            'EN24130335SLP', // Жозефина серебряная
            'EN24131371SL', // Даниэла серебряная
            'EN24131589SLP', // Оливия серебряная
            'EN24131451SLP', // Далия серебряная
            'EN24131313SLP', // Теодора серебряная
            'EN24126004SLP', // Мартина серебряная
            'EN24126933SLP', // Орбита серебряная
            'EN24127862SLP'  // Хосефа серебряная
        ]
    }
};

async function updateKoleSubcategoriesByArticle() {
    try {
        console.log('🚀 Получаем список всех колье...');
        const response = await axios.get(`${API_BASE_URL}getProducts`);
        const products = response.data;
        
        // Фильтруем только колье
        const koleProducts = products.filter(product => product.type === 'necklace');
        console.log(`📦 Найдено ${koleProducts.length} колье\n`);
        
        console.log('🔄 Начинаем обновление товаров...');
        
        let successCount = 0;
        let errorCount = 0;
        
        // Проходим по каждому товару
        for (const product of koleProducts) {
            const productSubcategories = [];
            
            // Проверяем, в какие подкатегории входит товар
            for (const [subcategoryKey, subcategoryInfo] of Object.entries(subcategoryData)) {
                if (subcategoryInfo.products.includes(product.article)) {
                    productSubcategories.push(subcategoryInfo.name);
                }
            }
            
            if (productSubcategories.length > 0) {
                console.log(`🔄 Обновляем ${product.name} (${product.article}) -> подкатегории: ${productSubcategories.join(', ')}`);
                
                try {
                    // Обновляем товар через API
                    const updateData = {
                        ...product,
                        subcategories: productSubcategories
                    };
                    
                    // Создаем FormData для отправки
                    const formData = new FormData();
                    formData.append('data', JSON.stringify(updateData));
                    
                    // Отправляем запрос на обновление
                    await axios.post(`${API_BASE_URL}editProduct`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${process.env.ADMIN_TOKEN || 'your-admin-token'}`
                        }
                    });
                    
                    console.log(`✅ Успешно обновлен ${product.name}`);
                    successCount++;
                    
                } catch (error) {
                    console.log(`❌ Ошибка при обновлении ${product.name}: ${error.message}`);
                    errorCount++;
                }
            } else {
                console.log(`⚠️  Товар ${product.name} (${product.article}) не найден в подкатегориях`);
            }
        }
        
        console.log('\n📊 Результаты обновления:');
        console.log(`✅ Успешно обновлено: ${successCount} товаров`);
        console.log(`❌ Ошибок: ${errorCount} товаров`);
        console.log(`📦 Всего обработано: ${koleProducts.length} товаров`);
        
        console.log('\n📋 Созданные подкатегории:');
        for (const [key, info] of Object.entries(subcategoryData)) {
            console.log(`- ${key}: ${info.name} (${info.products.length} товаров)`);
        }
        
        console.log('\n🎉 Обновление подкатегорий колье завершено!');
        
    } catch (error) {
        console.error('❌ Ошибка при получении товаров:', error.message);
    }
}

// Запускаем обновление
updateKoleSubcategoriesByArticle();
