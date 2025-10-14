# Инструкция по настройке подкатегорий браслетов в базе данных

## Что нужно сделать на бэкенде

Фронтенд готов и ожидает, что у товаров будет поле `subcategories` (массив строк). Для корректной работы новых подкатегорий браслетов необходимо обновить базу данных.

## Структура данных

Каждый товар должен иметь поле:
```javascript
{
  type: "bracelets",
  subcategories: ["Широкие", "Под золото"], // массив подкатегорий (может быть несколько)
  // ... остальные поля
}
```

## Список товаров для обновления

### 1. Подкатегория "Широкие" (10 товаров)

Добавить в `subcategories` значение **"Широкие"** для следующих товаров (по артикулам):

- `braslety-noeliya-zolotaya`
- `braslety-noeliya-serebryanaya`
- `braslety-bella-zolotaya`
- `braslety-bella-serebryanaya`
- `braslety-rakel-zolotaya`
- `braslety-rakel-serebryanaya`
- `braslety-paola-zolotaya`
- `braslety-paola-serebryanaya`
- `braslety-rosaria-zolotaya`
- `braslety-rosaria-serebryanaya`

### 2. Подкатегория "Жесткие" (6 товаров)

Добавить в `subcategories` значение **"Жесткие"** для следующих товаров:

- `braslety-filomena-zolotaya`
- `braslety-filomena-serebryanaya`
- `braslety-sara-zolotaya`
- `braslety-sara-serebryanaya`
- `braslety-rosaria-zolotaya`
- `braslety-rosaria-serebryanaya`

### 3. Подкатегория "Под золото" (16 товаров)

Добавить в `subcategories` значение **"Под золото"** для следующих товаров:

- `braslety-noeliya-zolotaya`
- `braslety-marsela-zolotaya`
- `braslety-bella-zolotaya`
- `braslety-rita-zolotaya`
- `braslety-ramona-zolotaya`
- `braslety-melissa-zolotaya`
- `braslety-filomena-zolotaya`
- `braslety-norma-zolotaya`
- `braslety-mayra-zolotaya`
- `braslety-rakel-zolotaya`
- `braslety-paola-zolotaya`
- `braslety-mersedes-zolotaya`
- `braslety-sara-zolotaya`
- `braslety-miriam-zolotaya`
- `braslety-rosaria-zolotaya`
- `braslety-teresa-zolotaya`

### 4. Подкатегория "Под серебро" (16 товаров)

Добавить в `subcategories` значение **"Под серебро"** для следующих товаров:

- `braslety-noeliya-serebryanaya`
- `braslety-marsela-serebryanaya`
- `braslety-bella-serebryanaya`
- `braslety-rita-serebryanaya`
- `braslety-ramona-serebryanaya`
- `braslety-melissa-serebryanaya`
- `braslety-filomena-serebryanaya`
- `braslety-norma-serebryanaya`
- `braslety-mayra-serebryanaya`
- `braslety-rakel-serebryanaya`
- `braslety-paola-serebryanaya`
- `braslety-mersedes-serebryanaya`
- `braslety-sara-serebryanaya`
- `braslety-miriam-serebryanaya`
- `braslety-rosaria-serebryanaya`
- `braslety-teresa-serebryanaya`

## Важно!

1. **Один товар может быть в НЕСКОЛЬКИХ подкатегориях**. Например:
   - `braslety-noeliya-zolotaya` должен быть в подкатегориях: `["Широкие", "Под золото"]`
   - `braslety-rosaria-zolotaya` должен быть в подкатегориях: `["Широкие", "Жесткие", "Под золото"]`

2. Поле `subcategories` должно быть **массивом** (array), не строкой.

3. Названия подкатегорий должны быть **точно такими**:
   - `"Широкие"` (с заглавной буквы)
   - `"Жесткие"` (с заглавной буквы)
   - `"Под золото"` (с заглавной "П")
   - `"Под серебро"` (с заглавной "П")

## Пример MongoDB запроса для обновления

```javascript
// Пример для товара, который должен быть в нескольких подкатегориях
db.products.updateOne(
  { article: "braslety-noeliya-zolotaya" },
  { $set: { subcategories: ["Широкие", "Под золото"] } }
);

// Пример для товара в одной подкатегории
db.products.updateOne(
  { article: "braslety-marsela-zolotaya" },
  { $set: { subcategories: ["Под золото"] } }
);
```

## Скрипт для массового обновления

Можно создать Node.js скрипт для автоматического обновления всех товаров:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

// Маппинг артикулов к подкатегориям
const subcategoryMapping = {
  // Широкие
  'braslety-noeliya-zolotaya': ['Широкие', 'Под золото'],
  'braslety-noeliya-serebryanaya': ['Широкие', 'Под серебро'],
  'braslety-bella-zolotaya': ['Широкие', 'Под золото'],
  'braslety-bella-serebryanaya': ['Широкие', 'Под серебро'],
  'braslety-rakel-zolotaya': ['Широкие', 'Под золото'],
  'braslety-rakel-serebryanaya': ['Широкие', 'Под серебро'],
  'braslety-paola-zolotaya': ['Широкие', 'Под золото'],
  'braslety-paola-serebryanaya': ['Широкие', 'Под серебро'],
  'braslety-rosaria-zolotaya': ['Широкие', 'Жесткие', 'Под золото'],
  'braslety-rosaria-serebryanaya': ['Широкие', 'Жесткие', 'Под серебро'],
  
  // Жесткие (которых нет выше)
  'braslety-filomena-zolotaya': ['Жесткие', 'Под золото'],
  'braslety-filomena-serebryanaya': ['Жесткие', 'Под серебро'],
  'braslety-sara-zolotaya': ['Жесткие', 'Под золото'],
  'braslety-sara-serebryanaya': ['Жесткие', 'Под серебро'],
  
  // Только под золото
  'braslety-marsela-zolotaya': ['Под золото'],
  'braslety-rita-zolotaya': ['Под золото'],
  'braslety-ramona-zolotaya': ['Под золото'],
  'braslety-melissa-zolotaya': ['Под золото'],
  'braslety-norma-zolotaya': ['Под золото'],
  'braslety-mayra-zolotaya': ['Под золото'],
  'braslety-mersedes-zolotaya': ['Под золото'],
  'braslety-miriam-zolotaya': ['Под золото'],
  'braslety-teresa-zolotaya': ['Под золото'],
  
  // Только под серебро
  'braslety-marsela-serebryanaya': ['Под серебро'],
  'braslety-rita-serebryanaya': ['Под серебро'],
  'braslety-ramona-serebryanaya': ['Под серебро'],
  'braslety-melissa-serebryanaya': ['Под серебро'],
  'braslety-norma-serebryanaya': ['Под серебро'],
  'braslety-mayra-serebryanaya': ['Под серебро'],
  'braslety-mersedes-serebryanaya': ['Под серебро'],
  'braslety-miriam-serebryanaya': ['Под серебро'],
  'braslety-teresa-serebryanaya': ['Под серебро'],
};

async function updateBraceletSubcategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    for (const [article, subcategories] of Object.entries(subcategoryMapping)) {
      const result = await Product.updateOne(
        { article: article },
        { $set: { subcategories: subcategories } }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✓ Updated ${article} with subcategories: ${subcategories.join(', ')}`);
      } else {
        console.log(`✗ Product not found: ${article}`);
      }
    }

    console.log('\nAll products updated successfully!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateBraceletSubcategories();
```

## Проверка

После обновления базы данных убедитесь, что:

1. Все указанные товары имеют поле `subcategories` как массив
2. Значения в массиве точно соответствуют указанным названиям
3. Товары, которые должны быть в нескольких подкатегориях, содержат все нужные значения

Можно проверить запросом:
```javascript
db.products.find({ 
  type: "bracelets", 
  subcategories: { $exists: true } 
}).forEach(doc => {
  print(`${doc.article}: ${JSON.stringify(doc.subcategories)}`);
});
```

