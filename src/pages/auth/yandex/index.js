import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { API_BASE_URL } from '../../../apiConfig';

export default function YandexAuth() {
    const router = useRouter();

    useEffect(() => {
        // Редирект на сервер для инициации Yandex авторизации
        window.location.href = `${API_BASE_URL}auth/yandex`;
    }, []);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontFamily: 'Arial, sans-serif'
        }}>
            <p>Перенаправление на Яндекс...</p>
        </div>
    );
}
