import styles from "@/styles/Cabinet.module.css";
import { useRouter } from "next/router";
import FavouriteBlock from "./items/FavouriteBlock";
import MyOrders from "./items/MyOrders/MyOrders";
import HistoryOrders from "./items/HistoryOrders";
import PersonalData from "./items/PersonalData";
import SideMenu from "./items/SideMenu";

export default function Cabinet() {

    const router = useRouter();
    const { page } = router.query;

    function selectPage() {
        switch (page) {
            case 'personaldata':
                return <PersonalData />
            case 'favourites':
                return <FavouriteBlock />
            case 'myorders':
                return <MyOrders />
            case 'historyorders':
                return <HistoryOrders />
        };
    };

    return <div className={styles.main}>
        <SideMenu />
        {selectPage()}
    </div>
}