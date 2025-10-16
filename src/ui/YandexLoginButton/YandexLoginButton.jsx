export default function YandexLoginButton() {
    const clientId = '77ef00edff0146c0ac96f62fa9dba952';
    const redirectUri = encodeURIComponent('https://mi-alegria.shop/auth/yandex/callback');
    const authUrl = `https://oauth.yandex.ru/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;

    return (
        <a href={authUrl} className="yandex-login-button">
            Войти через Яндекс
        </a>
    );
}