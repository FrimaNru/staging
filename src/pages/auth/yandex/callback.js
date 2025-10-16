import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "../../../contexts/UserContext";
import { setToken } from "../../../lib/auth";

export default function YandexCallback() {
    const router = useRouter();
    const { setUser } = useUser();

    useEffect(() => {
        const handleYandexCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");
            const userParam = urlParams.get("user");
            const error = urlParams.get("error");

            console.log("Yandex Callback URL params:", {
                token: token ? "present" : "missing",
                user: userParam ? "present" : "missing",
                error,
                fullUrl: window.location.href,
            });

            if (error) {
                console.error("Yandex Auth error:", error);
                router.push("/?auth_error=" + encodeURIComponent(error));
                return;
            }

            if (token && userParam) {
                try {
                    // Сохраняем токен
                    setToken(token);

                    // Парсим данные пользователя
                    const userData = JSON.parse(decodeURIComponent(userParam));
                    setUser(userData);

                    console.log("Yandex Auth successful, user set:", userData);

                    // Редиректим в кабинет
                    router.push("/cabinet?page=personaldata");
                } catch (error) {
                    console.error("Error parsing user data:", error);
                    router.push("/?auth_error=parse_error");
                }
            } else {
                // Если токен в cookie, просто редиректим
                // Бэкенд уже установил cookie, UserContext автоматически загрузит пользователя
                console.log("No token in URL, checking for cookie...");
                router.push("/cabinet?page=personaldata");
            }
        };

        handleYandexCallback();
    }, [router, setUser]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <p>Обработка авторизации через Яндекс...</p>
        </div>
    );
}
