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

    const removeFromCart = (id, variant) => {
        if (variant === 'all') {
            let newCart = cart.filter(product => product.id !== id);
            setCart(newCart);
        } else if (variant === 'one') {
            let lastIndex = cart.reduce((lastIndex, product, index) => {
                return product.id === id ? index : lastIndex;
            }, -1);

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