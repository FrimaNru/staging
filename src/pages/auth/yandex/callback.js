import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { API_BASE_URL } from "../../../../apiConfig";
import { useUser } from "../../../contexts/UserContext";

export default function YandexCallback() {
    const router = useRouter();
    const { setUser } = useUser();
    const handledRef = useRef(false);

    useEffect(() => {
        if (handledRef.current) return;
        handledRef.current = true;
        const handleYandexCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");
            const error = urlParams.get("error");
            const error_description = urlParams.get("error_description");

            console.log("Yandex Callback URL params:", {
                code,
                error,
                error_description,
                fullUrl: window.location.href,
            });

            if (error) {
                console.error("Yandex Auth error:", error, error_description);
                router.push("/");
                return;
            }

            if (code) {
                // Топ-уровневая навигация на API-колбэк без CORS
                window.location.replace(
                    `${API_BASE_URL}auth/yandex/callback?code=${encodeURIComponent(
                        code
                    )}`
                );
                return;
            }
            router.push("/");
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
