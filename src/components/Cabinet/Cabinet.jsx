import styles from "@/styles/Cabinet.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import FavouriteBlock from "./items/FavouriteBlock";
import MyOrders from "./items/MyOrders/MyOrders";
import HistoryOrders from "./items/HistoryOrders";
import PersonalData from "./items/PersonalData";
import SideMenu from "./items/SideMenu";
import { useUser } from "@/contexts/UserContext";
import { getToken } from "@/lib/auth";

export default function Cabinet() {
    const router = useRouter();
    const { page } = router.query;
    const { user, isLoadingUser } = useUser();

    useEffect(() => {
        // Проверяем авторизацию
        if (!isLoadingUser) {
            const token = getToken();
            if (!token || !user) {
                console.log("No token or user, redirecting to home");
                router.push("/");
                return;
            }
        }
    }, [user, isLoadingUser, router]);

    function selectPage() {
        switch (page) {
            case "personaldata":
                return <PersonalData />;
            case "favourites":
                return <FavouriteBlock />;
            case "myorders":
                return <MyOrders />;
            case "historyorders":
                return <HistoryOrders />;
        }
    }

    // Показываем загрузку пока проверяем авторизацию
    if (isLoadingUser) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <p>Загрузка...</p>
            </div>
        );
    }

    // Если нет токена или пользователя - не показываем кабинет
    if (!getToken() || !user) {
        return null;
    }

    return (
        <div className={styles.main}>
            <SideMenu />
            {selectPage()}
        </div>
    );
}
