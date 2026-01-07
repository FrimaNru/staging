const axios = require('axios');
const FormData = require('form-data');

// Конфигурация API
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.mi-alegria.shop/api/v1/';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

async function addSaleCostToAllProducts() {
    if (!ADMIN_TOKEN) {
        console.error('❌ Ошибка: ADMIN_TOKEN не установлен. Установите его через переменную окружения:');
        console.error('   $env:ADMIN_TOKEN="ваш_токен" (PowerShell)');
        console.error('   или export ADMIN_TOKEN="ваш_токен" (Bash)');
        process.exit(1);
    }

    try {
        console.log('🔍 Загрузка всех товаров...');
        
        const response = await axios.get(`${API_BASE_URL}getProducts`);
        const products = response.data;

        if (!Array.isArray(products)) {
            console.error('❌ Ошибка: товары не получены');
            return;
        }

        console.log(`✅ Загружено ${products.length} товаров`);

        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const product of products) {
            // Пропускаем товары без цены
            if (!product.cost || product.cost === 0) {
                console.log(`⚠️  Товар "${product.name}" (ID: ${product._id}) не имеет цены, пропускаем`);
                skippedCount++;
                continue;
            }

            // Рассчитываем скидочную цену (скидка 20%)
            const saleCost = Math.round(product.cost * 0.8);

            // Проверяем, нужно ли обновление
            if (product.saleCost === saleCost) {
                console.log(`✓ Товар "${product.name}" уже имеет актуальную скидочную цену (${saleCost} руб.), пропускаем`);
                skippedCount++;
                continue;
            }

            console.log(`\n🔄 Обновление товара: ${product.name}`);
            console.log(`   Обычная цена: ${product.cost} руб.`);
            console.log(`   Скидочная цена: ${saleCost} руб. (скидка 20%)`);

            try {
                // Получаем полные данные товара
                const fullProductResponse = await axios.post(`${API_BASE_URL}getOneProduct`, { id: product._id });
                const fullProductData = fullProductResponse.data;

                // Обновляем saleCost
                const updatedProductPayload = {
                    ...fullProductData,
                    saleCost: saleCost
                };

                // Создаем FormData для обновления
                const formData = new FormData();
                formData.append('data', JSON.stringify(updatedProductPayload));

                // Добавляем существующие изображения
                if (fullProductData.cover) {
                    formData.append('coverNames', fullProductData.cover);
                }
                if (Array.isArray(fullProductData.images)) {
                    fullProductData.images.forEach((img, index) => {
                        if (typeof img === 'string') {
                            formData.append(`imageNames[${index}]`, img);
                        }
                    });
                }

                // Отправляем обновление
                await axios.post(`${API_BASE_URL}editProduct`, formData, {
                    headers: {
                        Authorization: `Bearer ${ADMIN_TOKEN}`,
                        ...formData.getHeaders()
                    }
                });

                console.log(`✅ Скидочная цена успешно добавлена для "${product.name}"`);
                updatedCount++;

                // Небольшая задержка между запросами, чтобы не перегружать сервер
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                console.error(`❌ Ошибка при обновлении товара "${product.name}" (ID: ${product._id}):`, error.message);
                if (error.response) {
                    console.error('   Детали ошибки:', error.response.data);
                }
                errorCount++;
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('📊 Итоги:');
        console.log(`   ✅ Обновлено товаров: ${updatedCount}`);
        console.log(`   ⏭️  Пропущено товаров: ${skippedCount}`);
        console.log(`   ❌ Ошибок: ${errorCount}`);
        console.log('='.repeat(50));

    } catch (error) {
        console.error('❌ Ошибка при загрузке товаров:', error.message);
        if (error.response) {
            console.error('   Детали ошибки:', error.response.data);
        }
        process.exit(1);
    }
}

// Запуск скрипта
addSaleCostToAllProducts();



