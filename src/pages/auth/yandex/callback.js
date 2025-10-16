import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_BASE_URL } from '../../../../apiConfig';
import { useUser } from '../../../contexts/UserContext';

export default function YandexCallback() {
    const router = useRouter();
    const { setUser } = useUser();

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
                    console.log('Sending Yandex callback request with code:', code);
                    const response = await axios.get(`${API_BASE_URL}auth/yandex/callback?code=${code}`);
                    console.log('Yandex callback response:', response.data);
                    
                    if (response.data.token) {
                        localStorage.setItem('token', response.data.token);
                        setUser(response.data.data);
                        console.log('User set in context:', response.data.data);
                        router.push('/cabinet?page=personaldata');
                    } else {
                        console.error('No token received from Yandex callback');
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
