import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

    // Загружаем корзину только после монтирования (на клиенте)
    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Сохраняем корзину при изменениях
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isMounted]);

    const addToCart = (item) => {
        setCart((prevCart) => [...prevCart, item]);
    };

    const startSetCart = (item) => {
        setCart(item);
    };

    const removeLastFromCart = () => {
        setCart((prevCart) => prevCart.slice(0, -1));
    };

    const removeFromCart = (id, variant, size = null, color = null, article = null) => {
        if (variant === 'all') {
            let newCart = cart.filter(product => {
                // Если указаны size, color, article, проверяем все параметры
                if (size !== null && color !== null && article !== null) {
                    return !(product.id === id && 
                            product.size === size && 
                            product.color === color && 
                            product.article === article);
                }
                // Иначе удаляем все товары с таким id
                return product.id !== id;
            });
            setCart(newCart);
        } else if (variant === 'one') {
            let lastIndex = -1;
            
            // Если указаны size, color, article, ищем точное совпадение
            if (size !== null && color !== null && article !== null) {
                lastIndex = cart.reduce((lastIndex, product, index) => {
                    if (product.id === id && 
                        product.size === size && 
                        product.color === color && 
                        product.article === article && 
                        index > lastIndex) {
                        return index;
                    }
                    return lastIndex;
                }, -1);
            } else {
                // Иначе ищем последний товар с таким id
                lastIndex = cart.reduce((lastIndex, product, index) => {
                    return product.id === id && index > lastIndex ? index : lastIndex;
                }, -1);
            }

            if (lastIndex !== -1) {
                let newCart = cart.filter((_, index) => index !== lastIndex);
                setCart(newCart);
            }
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, startSetCart, removeLastFromCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);