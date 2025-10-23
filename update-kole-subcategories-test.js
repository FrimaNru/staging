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
        
        // Определяем подкатегории и товары для каждой
        const subcategories = {
            'mnogoslojnye': {
                name: 'Многослойные',
                products: [
                    'kole-patrisiya', 'kole-izabella', 'kole-viniciya-zolotaya', 'kole-viniciya-serebryanaya',
                    'kole-franciska-zolotaya', 'kole-franciska-serebryanaya', 'kole-hilda-zolotaya', 'kole-hilda-serebryanaya',
                    'kole-elen-zolotaya', 'kole-elen-serebryanaya', 'kole-valeri-zolotaya', 'kole-valeri-bronzovaya',
                    'kole-martina-zolotaya', 'kole-martina-serebryanaya'
                ]
            },
            'krupnye': {
                name: 'Крупные',
                products: [
                    'kole-patrisiya', 'kole-izabella', 'kole-katalina-zolotaya', 'kole-katalina-serebryanaya',
                    'kole-kleopatra-zolotaya', 'kole-kleopatra-serebryanaya', 'kole-franciska-zolotaya', 'kole-franciska-serebryanaya',
                    'kole-elen-zolotaya', 'kole-elen-serebryanaya', 'kole-zhozefina-zolotaya', 'kole-zhozefina-serebryanaya',
                    'kole-daniela-zolotaya', 'kole-daniela-serebryanaya', 'kole-daliya-zolotaya', 'kole-daliya-serebryanaya',
                    'kole-martina-zolotaya', 'kole-martina-serebryanaya'
                ]
            },
            'dlinnye': {
                name: 'Длинные',
                products: [
                    'kole-patrisiya', 'kole-izabella', 'kole-vera', 'kole-katalina-zolotaya', 'kole-katalina-serebryanaya',
                    'kole-ptitim-zolotaya', 'kole-ptitim-serebryanaya', 'kole-viniciya-zolotaya', 'kole-viniciya-serebryanaya',
                    'kole-franciska-zolotaya', 'kole-franciska-serebryanaya', 'kole-adalinda-zolotaya', 'kole-adalinda-serebryanaya',
                    'kole-mariana-zolotaya', 'kole-mariana-serebryanaya', 'kole-valeri-zolotaya', 'kole-valeri-bronzovaya',
                    'kole-orbita-zolotaya', 'kole-orbita-serebryanaya', 'kole-hosefa-zolotaya', 'kole-hosefa-serebryanaya'
                ]
            },
            'pod-zoloto': {
                name: 'Под золото',
                products: [
                    'kole-katalina-zolotaya', 'kole-ptitim-zolotaya', 'kole-kleopatra-zolotaya', 'kole-viniciya-zolotaya',
                    'kole-franciska-zolotaya', 'kole-adalinda-zolotaya', 'kole-hilda-zolotaya', 'kole-elen-zolotaya',
                    'kole-mariana-zolotaya', 'kole-klara-zolotaya', 'kole-zhozefina-zolotaya', 'kole-daniela-zolotaya',
                    'kole-oliviya-zolotaya', 'kole-daliya-zolotaya', 'kole-teodora-zolotaya', 'kole-valeri-zolotaya',
                    'kole-martina-zolotaya', 'kole-orbita-zolotaya', 'kole-hosefa-zolotaya'
                ]
            },
            'pod-serebro': {
                name: 'Под серебро',
                products: [
                    'kole-vera', 'kole-katalina-serebryanaya', 'kole-ptitim-serebryanaya', 'kole-kleopatra-serebryanaya',
                    'kole-viniciya-serebryanaya', 'kole-franciska-serebryanaya', 'kole-adalinda-serebryanaya', 'kole-hilda-serebryanaya',
                    'kole-elen-serebryanaya', 'kole-mariana-serebryanaya', 'kole-klara-serebryanaya', 'kole-zhozefina-serebryanaya',
                    'kole-daniela-serebryanaya', 'kole-oliviya-serebryanaya', 'kole-daliya-serebryanaya', 'kole-teodora-serebryanaya',
                    'kole-martina-serebryanaya', 'kole-orbita-serebryanaya', 'kole-hosefa-serebryanaya'
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
                const foundProduct = subcategoryData.products.find(slug => {
                    // Преобразуем slug в имя для сравнения
                    const slugToName = slug.replace('kole-', '').replace('-zolotaya', ' золотая').replace('-serebryanaya', ' серебряная').replace('-bronzovaya', ' бронзовая');
                    return productName && productName.includes(slugToName.toLowerCase());
                });
                
                if (foundProduct) {
                    productSubcategories.push(subcategoryData.name);
                }
            }
            
            if (productSubcategories.length > 0) {
                console.log(`🔄 Товар: ${product.name}`);
                console.log(`   Подкатегории: ${productSubcategories.join(', ')}`);
                console.log('---');
                updatedCount++;
            }
        }
        
        console.log(`✅ Найдено ${updatedCount} товаров для обновления`);
        console.log('📋 Созданные подкатегории:');
        for (const [slug, data] of Object.entries(subcategories)) {
            console.log(`   - ${slug}: ${data.name} (${data.products.length} товаров)`);
        }
        
        console.log('\n🔧 Для обновления товаров в базе данных:');
        console.log('1. Добавьте API endpoint для обновления подкатегорий на бэкенд');
        console.log('2. Запустите полную версию скрипта с API вызовами');
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    }
}

updateKoleSubcategories();
