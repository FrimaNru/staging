import styles from "@/styles/Admin/Admin.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { API_BASE_URL } from "../../../../apiConfig";
import { SideMenu } from "./items/SideMenu";
import AdminBanners from "./tabs/AdminBanners/AdminBanners";
import AdminDashboard from "./tabs/AdminDashboard/AdminDashboard";
import AdminProducts from "./tabs/AdminProducts/AdminProducts";
import AdminCreateProduct from "./tabs/AdminProducts/AdminCreateProduct/AdminCreateProduct";
import AdminEditProduct from "./tabs/AdminProducts/AdminEditProduct/AdminEditProduct";
import AdminOrders from "./tabs/AdminOrders/AdminOrders";
import AdminEditOrder from "./tabs/AdminOrders/items/AdminEditOrder";

export default function AdminPanel() {

    const router = useRouter();
    const { page } = router.query;

    useEffect(() => {
        load();
    }, []);

    function load() {
        if (!localStorage.getItem('tokenAdmin')) return router.push('/admin');

        axios.get(`${API_BASE_URL}getAdminData`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .catch(() => { router.push('/admin'); localStorage.removeItem('tokenAdmin'); });
    };

    function selectPage() {
        switch (page) {
            case 'products':
                return <AdminProducts />;
            case 'orders':
                return <AdminOrders />;
            case 'createProduct':
                return <AdminCreateProduct />
            case 'editProduct':
                return <AdminEditProduct />
            case 'editOrder':
                return <AdminEditOrder />
            case 'banners':
                return <AdminBanners />
            default:
                return <AdminDashboard />;
        }
    };

    return <div className={styles.adminMain}>
        <SideMenu />
        <div className={styles.adminMainBox}>
            {selectPage()}
        </div>
    </div>
}