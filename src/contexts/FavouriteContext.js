import { createContext, useContext, useState } from 'react';

const FavouriteContext = createContext();

export const FavouriteProvider = ({ children }) => {
    const [favourite, setFavourite] = useState([]);

    const addToFavourite = (item) => {
        setFavourite((prevCart) => [...prevCart, item]);
    };

    const startSetFavourite = (item) => {
        setFavourite(item);
    };

    const removeLastFromFavourite = () => {
        setFavourite((prevCart) => prevCart.slice(0, -1));
    };

    return (
        <FavouriteContext.Provider value={{ favourite, addToFavourite, startSetFavourite, removeLastFromFavourite }}>
            {children}
        </FavouriteContext.Provider>
    );
};

export const useFavourite = () => useContext(FavouriteContext);
