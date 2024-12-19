import styles from "@/styles/Admin/Banners/Banners.module.css";
import { useState } from "react";
import MainPage from "./Sections/MainPage";
import Sections from "./Sections/Sections";

export default function AdminBanners() {

    const [selectSection, setSelectSection] = useState('главная');

    const sections = ['главная', 'разделы'];

    function section() {
        switch (selectSection) {
            case 'разделы':
                return <Sections />;
            default:
                return <MainPage />;
        }
    };

    return <div className={styles.main}>
        <p className={styles.title}>Баннеры</p>
        <div className={styles.selectLine}>
            {sections.map((item, index) => <button key={index} className={`${styles.sectionButton} ${selectSection === item ? styles.sectionButtonSelect : ''}`} onClick={() => setSelectSection(item)}>{item}</button>)}
        </div>
        {section()}
    </div>
};