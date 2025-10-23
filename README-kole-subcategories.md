# Инструкция по обновлению подкатегорий колье

## Что было сделано:

1. ✅ Созданы страницы подкатегорий колье:
   - `/catalog/kole/mnogoslojnye` - Многослойные колье
   - `/catalog/kole/krupnye` - Крупные колье  
   - `/catalog/kole/dlinnye` - Длинные колье
   - `/catalog/kole/pod-zoloto` - Колье под золото
   - `/catalog/kole/pod-serebro` - Колье под серебро

2. ✅ Обновлены компоненты:
   - `Catalog.jsx` - добавлена поддержка подкатегорий колье
   - `SubcategoryCards.jsx` - добавлены карточки подкатегорий колье
   - `SubcategorySeoText.jsx` - добавлены SEO тексты для подкатегорий
   - `AdminEditProduct.jsx` - добавлена поддержка подкатегорий колье в админке

3. ✅ Созданы скрипты для обновления базы данных:
   - `update-kole-subcategories-by-article.js` - **РЕКОМЕНДУЕТСЯ** - с использованием артикулов
   - `update-kole-subcategories-by-article-mongodb.js` - MongoDB версия с артикулами
   - `update-kole-subcategories-final.js` - старый скрипт (может не работать)
   - `update-kole-subcategories-mongodb.js` - старый MongoDB скрипт

## Как запустить обновление:

### Вариант 1: Через API с артикулами (РЕКОМЕНДУЕТСЯ)
```bash
# На бэкенде запустите:
ADMIN_TOKEN=your-admin-token node update-kole-subcategories-by-article.js
```

### Вариант 2: Прямое подключение к MongoDB с артикулами
```bash
# На бэкенде запустите:
node update-kole-subcategories-by-article-mongodb.js
```

### Вариант 3: Старые скрипты (могут не работать)
```bash
# MongoDB скрипт
node update-kole-subcategories-mongodb.js

# Прямые MongoDB команды
mongo your-database-name < update-kole-subcategories-mongodb-commands.js

# Через API (требует токен авторизации)
ADMIN_TOKEN=your-admin-token node update-kole-subcategories-final.js
```

## Преимущества новых скриптов:
- Используют точные артикулы товаров (например, `EN24128506GSLP`)
- Более надежная идентификация товаров
- Меньше ошибок при сопоставлении

## Результат:
После выполнения скрипта все колье будут распределены по подкатегориям:
- **Многослойные**: 14 товаров
- **Крупные**: 18 товаров  
- **Длинные**: 21 товар
- **Под золото**: 19 товаров
- **Под серебро**: 19 товаров

## Проверка:
После обновления проверьте:
1. Страницы подкатегорий работают: https://mi-alegria.shop/catalog/kole/mnogoslojnye
2. Товары отображаются в правильных подкатегориях
3. SEO тексты отображаются корректно
4. Карточки подкатегорий показываются на главной странице колье
