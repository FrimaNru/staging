const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.mi-alegria.shop/api/v1/';

// Функция для нормализации названий для сравнения
function normalizeForMatch(str) {
    return str
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// Маппинг транслитерации имен
const nameMapping = {
    'vera': 'вера',
    'mariana': 'мариана',
    'alfreda': 'альфреда',
};

async function debugMatching() {
    const productsResponse = await axios.get(`${API_BASE_URL}getProducts`);
    const products = productsResponse.data;

    // Тестируем несколько примеров
    const testCases = [
        { slug: 'vera', expected: 'Вера' },
        { slug: 'mariana-zolotaya', expected: 'Мариана золотая' },
        { slug: 'alfreda-serebryanaya', expected: 'Альфреда серебряная' }
    ];

    for (const testCase of testCases) {
        const yandexSlug = testCase.slug;
        const parts = yandexSlug.split('-');
        const mainSlugName = parts[0].toLowerCase();
        const slugColor = parts[1] || '';
        
        let yandexColor = '';
        if (slugColor === 'zolotaya') yandexColor = 'золотая';
        else if (slugColor === 'serebryanaya') yandexColor = 'серебряная';
        
        const mappedName = nameMapping[mainSlugName];
        const searchName = mappedName ? mappedName : mainSlugName;
        const searchNameNormalized = normalizeForMatch(searchName);
        
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Тест: ${yandexSlug}`);
        console.log(`Ожидается: ${testCase.expected}`);
        console.log(`Имя из slug: ${mainSlugName} -> ${mappedName || 'не найдено'} -> ${searchNameNormalized}`);
        console.log(`Цвет из slug: ${yandexColor || 'нет'}`);
        
        const matches = products.filter(p => {
            const productName = normalizeForMatch(p.name || '');
            const productWords = productName.split(/\s+/);
            const productMainName = productWords[0];
            
            console.log(`  Проверяем: "${p.name}" -> первое слово: "${productMainName}"`);
            
            if (productMainName === searchNameNormalized) {
                console.log(`    ✓ Имя совпало!`);
                
                if (yandexColor) {
                    const normalizedYandexColor = normalizeForMatch(yandexColor);
                    const hasColorInName = productWords.some(word => 
                        normalizeForMatch(word) === normalizedYandexColor
                    );
                    console.log(`    Проверка цвета в названии: ${hasColorInName ? '✓' : '✗'}`);
                    return hasColorInName;
                } else {
                    if (productWords.length > 1) {
                        const secondWord = normalizeForMatch(productWords[1]);
                        if (secondWord === 'золотая' || secondWord === 'серебряная') {
                            console.log(`    ✗ В названии есть цвет, но в slug его нет`);
                            return false;
                        }
                    }
                    console.log(`    ✓ Нет цвета - подходит`);
                    return true;
                }
            }
            return false;
        });
        
        console.log(`\nНайдено совпадений: ${matches.length}`);
        matches.forEach(m => console.log(`  - ${m.name}`));
    }
}

debugMatching().catch(console.error);

