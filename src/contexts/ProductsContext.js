import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../apiConfig';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true); 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}getProducts`);
                setProducts(response.data); 
                setInitialLoad(false); 
            } catch (error) {
                console.error("Ошибка при загрузке товаров:", error);
            } finally {
                setLoading(false);
            }
        };

        if (initialLoad) {
            fetchProducts();
        }
    }, [initialLoad]);

    return (
        <ProductsContext.Provider value={{ products, loading }}>
            {children}
        </ProductsContext.Provider>
    );
};

export const useProducts = () => useContext(ProductsContext);