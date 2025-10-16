import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_BASE_URL } from '../../../../apiConfig';
import { useUser } from '../../../contexts/UserContext';

export default function VKCallback() {
    const router = useRouter();
    const { setUser } = useUser();

    useEffect(() => {
        const handleVKCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const access_token = urlParams.get('access_token');
            const error = urlParams.get('error');
            const error_description = urlParams.get('error_description');

            console.log('VK Callback URL params:', {
                code,
                access_token,
                error,
                error_description,
                fullUrl: window.location.href
            });

            if (error) {
                console.error('VK Auth error:', error, error_description);
                router.push('/');
                return;
            }

            if (code) {
                try {
                    console.log('Sending VK callback request with code:', code);
                    const response = await axios.get(`${API_BASE_URL}auth/vk/callback?code=${code}`);
                    console.log('VK callback response:', response.data);
                    
                    if (response.data.token) {
                        localStorage.setItem('token', response.data.token);
                        setUser(response.data.data);
                        console.log('User set in context:', response.data.data);
                        router.push('/cabinet?page=personaldata');
                    } else {
                        console.error('No token received from VK callback');
                        router.push('/');
                    }
                } catch (error) {
                    console.error('VK callback error:', error);
                    router.push('/');
                }
            } else if (access_token) {
                // Если VK вернул access_token напрямую
                try {
                    console.log('VK returned access_token directly:', access_token);
                    const response = await axios.get(`${API_BASE_URL}auth/vk/callback?access_token=${access_token}`);
                    console.log('VK callback response with access_token:', response.data);
                    
                    if (response.data.token) {
                        localStorage.setItem('token', response.data.token);
                        setUser(response.data.data);
                        console.log('User set in context:', response.data.data);
                        router.push('/cabinet?page=personaldata');
                    } else {
                        console.error('No token received from VK callback with access_token');
                        router.push('/');
                    }
                } catch (error) {
                    console.error('VK callback error with access_token:', error);
                    router.push('/');
                }
            } else {
                console.error('No code or access_token received from VK');
                router.push('/');
            }
        };

        handleVKCallback();
    }, [router]);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontFamily: 'Arial, sans-serif'
        }}>
            <p>Обработка авторизации через ВКонтакте...</p>
        </div>
    );
}
