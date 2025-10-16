import styles from "@/styles/Header.module.css";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/router";
import { useCart } from "@/contexts/CartContext";
import { API_BASE_URL } from "../../../../apiConfig";

export function SocialAuth({ onClose, data }) {
    const { setUser } = useUser();
    const router = useRouter();
    const { addToCart } = useCart();

    const handleVKAuth = () => {
        // Редирект на сервер для VK авторизации
        window.location.href = `${API_BASE_URL}auth/vk`;
    };

    const handleYandexAuth = () => {
        // Редирект на сервер для Yandex авторизации
        window.location.href = `${API_BASE_URL}auth/yandex`;
    };

    return (
        <div className={styles.socialAuthContainer}>
            <div className={styles.socialAuthButtons}>
                <button 
                    className={`${styles.mainButton} ${styles.socialButton}`}
                    onClick={handleVKAuth}
                >
                    <img src="/ВКонтакте.svg" alt="ВКонтакте" className={styles.socialIcon} />
                    Войти через ВКонтакте
                </button>
                
                <button 
                    className={`${styles.mainButtonBlack} ${styles.socialButton}`}
                    onClick={handleYandexAuth}
                >
                    <img src="/yandex.svg" alt="Яндекс" className={styles.socialIcon} />
                    Войти через Яндекс
                </button>
            </div>
        </div>
    );
}
