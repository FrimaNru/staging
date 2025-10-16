import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_BASE_URL } from '../../../../apiConfig';

export default function YandexCallback() {
    const router = useRouter();

    useEffect(() => {
        const handleYandexCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');

            if (error) {
                console.error('Yandex Auth error:', error);
                router.push('/');
                return;
            }

            if (code) {
                try {
                    const response = await axios.get(`${API_BASE_URL}auth/yandex/callback?code=${code}`);
                    
                    if (response.data.token) {
                        localStorage.setItem('token', response.data.token);
                        router.push('/cabinet?page=personaldata');
                    } else {
                        console.error('No token received');
                        router.push('/');
                    }
                } catch (error) {
                    console.error('Yandex callback error:', error);
                    router.push('/');
                }
            } else {
                router.push('/');
            }
        };

        handleYandexCallback();
    }, [router]);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontFamily: 'Arial, sans-serif'
        }}>
            <p>Обработка авторизации через Яндекс...</p>
        </div>
    );
}
