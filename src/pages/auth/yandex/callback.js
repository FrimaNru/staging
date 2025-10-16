import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function YandexCallback() {
    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const url = new URL(window.location.href);
            const searchParams = url.searchParams;

            // Token may arrive as "token" or inside hash for some providers
            const tokenFromQuery = searchParams.get('token');
            const tokenFromHash = new URLSearchParams(url.hash.replace(/^#/, '')).get('token');
            const token = tokenFromQuery || tokenFromHash;

            const error = searchParams.get('error') || new URLSearchParams(url.hash.replace(/^#/, '')).get('error');

            if (error) {
                // Clean up any old auth data on error
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Redirect to home with error flag
                router.replace('/?auth_error=yandex');
                return;
            }

            if (token) {
                localStorage.setItem('token', token);
                // Let UserProvider load the user after redirect
                router.replace('/');
            }
        } catch (e) {
            // On any parsing error, fail gracefully
            router.replace('/?auth_error=yandex');
        }
    }, [router]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>Завершаем вход через Яндекс…</p>
        </div>
    );
}

import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiConfig";
import { useUser } from "../../../contexts/UserContext";

export default function YandexCallback() {
    const router = useRouter();
    const { setUser } = useUser();

    useEffect(() => {
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
                        `${API_BASE_URL}auth/yandex/callback?code=${code}`
                    );
                    console.log("Yandex callback response:", response.data);

                    if (response.data.token) {
                        localStorage.setItem("token", response.data.token);
                        setUser(response.data.data);
                        console.log("User set in context:", response.data.data);
                        router.push("/cabinet?page=personaldata");
                    } else {
                        console.error("No token received from Yandex callback");
                        router.push("/");
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
    }, [router]);

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
