import styles from "@/styles/Cabinet.module.css";
import { FavouriteBlock, HistoryOrders, MyOrders, PersonalData, SideMenu } from "@/components";
import { useRouter } from "next/router";

export function Cabinet() {

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