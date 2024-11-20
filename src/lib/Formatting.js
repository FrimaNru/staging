export function capitalizeFirstLetter(text) {
    return text?.charAt(0).toUpperCase() + text?.slice(1);
};

export function formatNumber(number) {
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

    // Получаем день, месяц и год
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = date.getFullYear();

    // Форматируем дату
    return `${day}.${month}.${year}`;
}
