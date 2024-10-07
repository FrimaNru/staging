import styles from "@/styles/Admin.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { API_BASE_URL } from "../../../../apiConfig";
import { AdminDashboard, AdminOrders, AdminProducts, SideMenuAdmin } from "@/components";

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
                return <AdminProducts />
            case 'orders':
                return <AdminOrders />
            default:
                return <AdminDashboard />
        }
    };

    return <div className={styles.adminMain}>
        <SideMenuAdmin />
        <div className={styles.adminMainBox}>
            {selectPage()}
        </div>
    </div>
}