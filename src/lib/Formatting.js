export function capitalizeFirstLetter(text) {
    return text?.toString()?.charAt(0).toUpperCase() + text?.slice(1);
};

// Округление до сотен: до 5 (0-4) - вниз, 5 и выше (5-9) - вверх
export function roundToHundreds(number) {
    number = Number(number);
    if (!Number.isFinite(number) || number <= 0) return number;
    
    const lastTwoDigits = number % 100;
    const hundreds = Math.floor(number / 100) * 100;
    
    if (lastTwoDigits < 50) {
        return hundreds; // Округляем вниз
    } else {
        return hundreds + 100; // Округляем вверх
    }
}

export function formatNumber(number) {
    number = Number(number);
    // Сначала округляем до сотен
    number = roundToHundreds(number);
    let numStr = number?.toString();
    let parts = numStr?.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
};

export function formatDateFromTimestamp(timestamp) {
    const dateObj = new Date(timestamp);

    // Формируем дату в формате ДД.ММ.ГГГГ
    const day = String(dateObj.getDate()).padStart(2, '0'); // День с ведущим нулем
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Месяц с ведущим нулем (январь = 0)
    const year = dateObj.getFullYear();

    const date = `${day}.${month}.${year}`;

    return date;
}

export function formatDate(isoDateString) {
    const date = new Date(isoDateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}