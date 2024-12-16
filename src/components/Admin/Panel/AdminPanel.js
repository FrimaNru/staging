import styles from "@/styles/Admin.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { API_BASE_URL } from "../../../../apiConfig";
import { AdminCreateProduct, AdminDashboard, AdminEditProduct, AdminOrders, AdminProducts } from "@/components";
import AdminWarehouse from "./items/AdminWarehouse";
import { SideMenu } from "./items/SideMenu";
import AdminBanners from "./items/AdminBanners/AdminBanners";

export function AdminPanel() {

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
                return <AdminCreateProduct />;
            case 'editProduct':
                return <AdminEditProduct />;
            case 'warehouse':
                return <AdminWarehouse />
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