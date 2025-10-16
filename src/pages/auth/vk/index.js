import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { API_BASE_URL } from '../../../apiConfig';

export default function VKAuth() {
    const router = useRouter();

    useEffect(() => {
        // Редирект на сервер для инициации VK авторизации
        window.location.href = `${API_BASE_URL}auth/vk`;
    }, []);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontFamily: 'Arial, sans-serif'
        }}>
            <p>Перенаправление на ВКонтакте...</p>
        </div>
    );
}
