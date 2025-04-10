import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE_URL } from '../../apiConfig';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoading] = useState(true);

    const saveToLocalStorage = (data) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(data));
        }
    };

    const clearLocalStorage = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    };

    const load = async () => {
        if (typeof window === 'undefined') {
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            clearLocalStorage();
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.get(`${API_BASE_URL}getUser`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
            saveToLocalStorage(res.data);
        } catch (error) {
            console.error(error);
            clearLocalStorage();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const refreshUser = async () => {
        await load();
    };

    const clearUser = () => {
        setUser(null);
        clearLocalStorage();
    };

    return (
        <UserContext.Provider value={{ user, setUser, clearUser, refreshUser, isLoadingUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);