// ============================================
// СКРИПТ ДЛЯ СОХРАНЕНИЯ РЕЗУЛЬТАТОВ ИЗ КОНСОЛИ
// ============================================
// Выполните этот код в консоли браузера ПОСЛЕ выполнения parse-yandex-simple.js
// Он сохранит результат в переменную и скопирует JSON

(function() {
    // Если вы уже выполнили parse-yandex-simple.js, результат должен быть в консоли
    // Найдите переменную с результатом или выполните скрипт еще раз
    
    console.log('📝 Инструкция по сохранению:');
    console.log('');
    console.log('1. Если вы уже выполнили parse-yandex-simple.js, найдите в консоли массив товаров');
    console.log('2. Кликните правой кнопкой на массив → "Copy object"');
    console.log('3. Или выполните следующий код:');
    console.log('');
    console.log('   // Выполните parse-yandex-simple.js еще раз и сохраните результат:');
    console.log('   const result = (function() {');
    console.log('       // ... вставьте весь код из parse-yandex-simple.js ...');
    console.log('   })();');
    console.log('');
    console.log('   // Затем скопируйте JSON:');
    console.log('   const json = JSON.stringify(result, null, 2);');
    console.log('   copy(json);');
    console.log('   console.log("✅ JSON скопирован! Вставьте его в файл scripts/yandex-market-products.json");');
    console.log('');
    
    // Альтернативный способ - если результат уже есть в консоли
    console.log('АЛЬТЕРНАТИВНЫЙ СПОСОБ:');
    console.log('Если в консоли виден массив (137) [{…}, {…}, ...], выполните:');
    console.log('');
    console.log('1. Кликните на массив в консоли');
    console.log('2. Он развернется, показывая все товары');
    console.log('3. Кликните правой кнопкой на развернутый массив');
    console.log('4. Выберите "Copy object" или "Store as global variable"');
    console.log('5. Затем выполните: copy(JSON.stringify(скопированная_переменная, null, 2));');
})();

