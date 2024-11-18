import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        setCart((prevCart) => [...prevCart, item]);
    };

    const startSetCart = (item) => {
        setCart(item);
    };

    const removeLastFromCart = () => {
        setCart((prevCart) => prevCart.slice(0, -1));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, startSetCart, removeLastFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
