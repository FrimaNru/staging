// Конфигурация SEO для сайта
export const SEO_CONFIG = {
  // Базовый URL сайта
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://mi-alegria.shop',
  
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

// Преобразование типа продукта к SEO-части ссылки
const TYPE_TO_SLUG_MAP = {
  ring: 'kolcza',
  necklace: 'kole',
  earrings: 'sergi',
  bracelets: 'braslety',
};

export const mapProductTypeToSlug = (type) => {
  return TYPE_TO_SLUG_MAP[type] || type;
};

const SLUG_TO_TYPE_MAP = Object.entries(TYPE_TO_SLUG_MAP).reduce((acc, [type, slug]) => {
  acc[slug] = type;
  return acc;
}, {});

export const mapSlugToProductType = (slug) => {
  return SLUG_TO_TYPE_MAP[slug] || slug;
};

// Транслитерация русских названий в латиницу для URL
const RU_TO_LATIN = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
};

export const slugifyRussian = (text) => {
  if (!text) return '';
  const lower = text.toString().toLowerCase();
  let result = '';
  for (const ch of lower) {
    if (RU_TO_LATIN[ch] !== undefined) {
      result += RU_TO_LATIN[ch];
    } else if (/^[a-z0-9]$/i.test(ch)) {
      result += ch;
    } else if (/\s|_|\+/.test(ch)) {
      result += '-';
    } else {
      result += '-';
    }
  }
  result = result.replace(/-+/g, '-').replace(/^-|-$/g, '');
  return result;
};

// Построение слага для товара вида: /product/<type>-<name>
export const buildProductSlug = (product) => {
  const typeSlug = mapProductTypeToSlug(product?.type || '');
  const nameSlug = slugifyRussian(product?.name || '');
  return `${typeSlug}-${nameSlug}`;
};
