export function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export function formatNumber(number) {
    let numStr = number?.toString();
    let parts = numStr?.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
};