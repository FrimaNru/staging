import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE_URL } from '../../apiConfig';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : {};
        }
        return {};
    });
    const [isLoadingUser, setIsLoading] = useState(
        typeof window === 'undefined' || !localStorage.getItem('user')
    );

    const saveToLocalStorage = (data) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(data));
        }
    };

    const load = async () => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('token');
        if (!token) {
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
        setUser({});
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, clearUser, refreshUser, isLoadingUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
