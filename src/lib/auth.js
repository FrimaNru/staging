// Утилита для работы с авторизацией

export const getToken = () => {
    if (typeof window === "undefined") return null;

    // Сначала проверяем localStorage
    const localToken = localStorage.getItem("token");
    if (localToken) return localToken;

    // Затем проверяем cookie
    const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

    return cookieToken || null;
};

export const setToken = (token) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", token);
};

export const clearToken = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Очищаем cookie (если возможно)
    document.cookie =
        "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.mi-alegria.shop;";
};
