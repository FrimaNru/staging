import { API_BASE_URL } from "../../../apiConfig";

export default function YandexLoginButton() {
    const handleYandexAuth = () => {
        // Редирект на сервер для Yandex авторизации
        window.location.href = `${API_BASE_URL}auth/yandex`;
    };

    return (
        <button onClick={handleYandexAuth} className="yandex-login-button">
            Войти через Яндекс
        </button>
    );
}
