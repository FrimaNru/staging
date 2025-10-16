import { useEffect } from 'react';

export default function YandexTokenPage() {
    useEffect(() => {
        // Подключаем скрипт для обработки токена от Yandex
        if (typeof window !== 'undefined' && !window.YaSendSuggestToken) {
            const script = document.createElement('script');
            script.src = 'https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js';
            script.async = true;
            document.head.appendChild(script);
        }

        // Обработка токена после загрузки скрипта
        const handleToken = () => {
            if (window.YaSendSuggestToken) {
                window.YaSendSuggestToken(
                    'https://mi-alegria.shop',
                    {
                        flag: true
                    }
                );
            }
        };

        // Ждем загрузки скрипта
        const checkScript = setInterval(() => {
            if (window.YaSendSuggestToken) {
                clearInterval(checkScript);
                handleToken();
            }
        }, 100);

        // Очистка интервала через 5 секунд
        setTimeout(() => {
            clearInterval(checkScript);
        }, 5000);
    }, []);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontFamily: 'Arial, sans-serif'
        }}>
            <p>Обработка токена от Яндекс...</p>
        </div>
    );
}
