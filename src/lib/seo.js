// Конфигурация SEO для сайта
export const SEO_CONFIG = {
  // Базовый URL сайта
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://mialegria.ru',
  
  // Настройки для каталога
  CATALOG: {
    BASE_URL: '/catalog',
    ITEMS_PER_PAGE: 15,
    PAGINATION_PARAM: 'PAGEN_1'
  },
  
  // Мета-теги по умолчанию
  DEFAULT_META: {
    title: 'Mi Alegria - Ювелирные изделия',
    description: 'Откройте для себя наш каталог ювелирных изделий: золотые и серебряные кольца, серьги, браслеты и подвески.',
    keywords: 'ювелирные изделия, золото, серебро, кольца, серьги, браслеты, колье',
    viewport: 'width=device-width, initial-scale=1'
  }
};

// Функция для генерации canonical URL
export const getCanonicalUrl = (path = '') => {
  return `${SEO_CONFIG.BASE_URL}${path}`;
};

// Функция для генерации URL пагинации
export const getPaginationUrl = (page, basePath = '/catalog', query = {}) => {
  if (page === 1) {
    return basePath;
  }
  
  const newQuery = { ...query };
  newQuery[SEO_CONFIG.CATALOG.PAGINATION_PARAM] = page.toString();
  
  const queryString = new URLSearchParams(newQuery).toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
};
