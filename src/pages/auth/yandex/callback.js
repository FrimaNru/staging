import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
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
                try {
                    console.log(
                        "Sending Yandex callback request with code:",
                        code
                    );
                    const response = await axios.get(
                        `${API_BASE_URL}auth/yandex/callback?code=${code}`,
                        { withCredentials: true }
                    );
                    console.log("Yandex callback response:", response.data);

                    if (response.data.token) {
                        localStorage.setItem("token", response.data.token);
                        setUser(response.data.data);
                        console.log("User set in context:", response.data.data);
                        router.push("/cabinet?page=personaldata");
                    } else {
                        // Фолбэк: если бэкенд установил cookie сессии без выдачи токена
                        try {
                            const me = await axios.get(
                                `${API_BASE_URL}getUser`,
                                { withCredentials: true }
                            );
                            if (me?.data) {
                                setUser(me.data);
                                console.log(
                                    "User set from cookie session:",
                                    me.data
                                );
                                router.push("/cabinet?page=personaldata");
                            } else {
                                console.error(
                                    "No token or cookie session user received after Yandex callback"
                                );
                                router.push("/");
                            }
                        } catch (e) {
                            console.error(
                                "Failed to load user via cookie session after Yandex callback",
                                e
                            );
                            router.push("/");
                        }
                    }
                } catch (error) {
                    console.error("Yandex callback error:", error);
                    router.push("/");
                }
            } else {
                router.push("/");
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
