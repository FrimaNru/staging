import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../apiConfig';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);

    const getCachedProducts = () => {
        const cachedData = localStorage.getItem('cachedProducts');
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            if (Date.now() - timestamp < 5 * 60 * 1000) {
                return data;
            }
        }
        return null;
    };

    const cacheProducts = (data) => {
        localStorage.setItem('cachedProducts', JSON.stringify({ data, timestamp: Date.now() }));
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const cachedProducts = getCachedProducts();
                if (cachedProducts) {
                    setProducts(cachedProducts);
                    setLoading(false);
                }

                const response = await axios.get(`${API_BASE_URL}getProducts`);
                setProducts(response.data);
                cacheProducts(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке товаров:", error);
            } finally {
                setLoading(false);
                setInitialLoad(false);
            }
        };

        if (initialLoad) {
            fetchProducts();
        }
    }, [initialLoad]);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}getProducts`);
                setProducts(response.data);
                cacheProducts(response.data);
            } catch (error) {
                console.error("Ошибка при обновлении кэша товаров:", error);
            }
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <ProductsContext.Provider value={{ products, loading }}>
            {children}
        </ProductsContext.Provider>
    );
};

export const useProducts = () => useContext(ProductsContext);