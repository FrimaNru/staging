import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../apiConfig';
import { PRODUCT_TYPES } from '@/constants/items';

/**
 * Оптимизированный хук для поиска с debounce и поддержкой Elasticsearch
 * @param {Array} allProducts - Все продукты для fallback поиска
 * @param {number} debounceMs - Задержка debounce в миллисекундах (по умолчанию 300ms)
 * @param {number} maxResults - Максимальное количество результатов (по умолчанию 10)
 * @param {string} externalQuery - Внешний searchQuery (опционально, для синхронизации)
 * @param {Function} externalSetQuery - Функция для установки внешнего searchQuery (опционально)
 * @returns {Object} { searchResults, isLoading, searchQuery, setSearchQuery }
 */
export function useSearch(allProducts = [], debounceMs = 300, maxResults = 10, externalQuery = null, externalSetQuery = null) {
    const [internalQuery, setInternalQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const debounceTimerRef = useRef(null);
    const abortControllerRef = useRef(null);
    
    // Используем внешний query, если он передан, иначе внутренний
    const searchQuery = externalQuery !== null ? externalQuery : internalQuery;
    const setSearchQuery = externalSetQuery || setInternalQuery;

    // Функция поиска через Elasticsearch API (если доступен)
    const searchWithElasticsearch = useCallback(async (query) => {
        try {
            // Отменяем предыдущий запрос, если он еще выполняется
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Создаем новый AbortController для текущего запроса
            abortControllerRef.current = new AbortController();

            // Пробуем использовать Elasticsearch endpoint
            const response = await axios.get(`${API_BASE_URL}searchProducts`, {
                params: { q: query, limit: maxResults },
                signal: abortControllerRef.current.signal,
                timeout: 5000, // 5 секунд таймаут
            });

            if (response.data && Array.isArray(response.data)) {
                return response.data;
            }
        } catch (error) {
            // Если endpoint не существует или произошла ошибка, используем fallback
            if (error.code !== 'ERR_CANCELED' && !error.message.includes('404')) {
                console.warn('Elasticsearch endpoint недоступен, используется fallback поиск:', error.message);
            }
        }
        return null;
    }, [maxResults]);

    // Fallback: клиентский поиск
    const searchClientSide = useCallback((query, products) => {
        if (!query || !products || products.length === 0) {
            return [];
        }

        const q = query.toLowerCase().trim();
        if (q.length === 0) {
            return [];
        }

        // Оптимизированный поиск с приоритетом точных совпадений
        const results = products
            .map((item) => {
                if (!item) return null;

                const name = (item.name || '').toLowerCase();
                const article = (item.article || '').toLowerCase();
                const type = (item.type || '').toLowerCase();
                const typeName = (PRODUCT_TYPES[item.type] || '').toLowerCase();

                // Вычисляем релевантность
                let score = 0;
                let matched = false;

                // Точное совпадение названия (высший приоритет)
                if (name === q) {
                    score = 1000;
                    matched = true;
                } else if (name.startsWith(q)) {
                    score = 500;
                    matched = true;
                } else if (name.includes(q)) {
                    score = 100;
                    matched = true;
                }

                // Совпадение артикула
                if (article.includes(q)) {
                    score += 200;
                    matched = true;
                }

                // Совпадение типа
                if (typeName.includes(q) || type.includes(q)) {
                    score += 50;
                    matched = true;
                }

                return matched ? { item, score } : null;
            })
            .filter(Boolean)
            .sort((a, b) => b.score - a.score) // Сортируем по релевантности
            .slice(0, maxResults)
            .map(({ item }) => item);

        return results;
    }, [maxResults]);

    // Основная функция поиска
    const performSearch = useCallback(async (query) => {
        if (!query || query.trim().length === 0) {
            setSearchResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            // Сначала пробуем Elasticsearch
            let results = await searchWithElasticsearch(query);

            // Если Elasticsearch недоступен, используем клиентский поиск
            if (!results) {
                results = searchClientSide(query, allProducts);
            }

            setSearchResults(results || []);
        } catch (error) {
            if (error.code !== 'ERR_CANCELED') {
                console.error('Ошибка поиска:', error);
                // В случае ошибки используем клиентский поиск
                const fallbackResults = searchClientSide(query, allProducts);
                setSearchResults(fallbackResults);
            }
        } finally {
            setIsLoading(false);
        }
    }, [allProducts, searchWithElasticsearch, searchClientSide]);

    // Debounce для поиска
    useEffect(() => {
        // Очищаем предыдущий таймер
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Если запрос пустой, сразу очищаем результаты
        if (!searchQuery || searchQuery.trim().length === 0) {
            setSearchResults([]);
            setIsLoading(false);
            return;
        }

        // Устанавливаем новый таймер
        debounceTimerRef.current = setTimeout(() => {
            performSearch(searchQuery);
        }, debounceMs);

        // Очистка при размонтировании
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [searchQuery, debounceMs, performSearch]);

    return {
        searchResults,
        isLoading,
        searchQuery,
        setSearchQuery,
    };
}

