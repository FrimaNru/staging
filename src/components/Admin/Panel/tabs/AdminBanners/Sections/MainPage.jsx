import styles from "@/styles/Admin/Banners/Banners.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../../../../apiConfig";

export default function MainPage() {
    const [banners, setBanners] = useState([]);

    useEffect(() => { load(); }, []);

    const load = async () => {
        axios.get(`${API_BASE_URL}constans/banners`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then((res) => { setBanners(res.data); console.log(res.data) })
            .catch((e) => console.log(e));
    };

    const coverUp = (image) => {
        setBanners((prev) => {
            const index = prev.findIndex(item => item === image);
            if (index > 0) {
                const updated = [...prev];
                [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
                saveBanners(updated);
                return updated;
            }
            return prev;
        });
    };

    const coverDown = (image) => {
        setBanners((prev) => {
            const index = prev.findIndex(item => item === image);
            if (index < prev.length - 1) {
                const updated = [...prev];
                [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
                saveBanners(updated);
                return updated;
            }
            return prev;
        });
    };

    const saveBanners = async (banners) => {
        try {
            await axios.post(`${API_BASE_URL}constans/banners/update`, { banners }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });
        } catch (error) {
            console.error("Ошибка сохранения баннеров:", error);
        }
    };

    const deleteBanner = async (imagePath) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}constans/banners/delete`,
                { imagePath },
                { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } }
            );
            if (response.status === 200) {
                setBanners((prev) => prev.filter((item) => item !== imagePath));
            }
        } catch (error) {
            console.error("Ошибка удаления баннера:", error);
        }
    };

    const uploadBanner = async (file) => {
        const formData = new FormData();
        formData.append("banner", file);

        try {
            const response = await axios.post(`${API_BASE_URL}constans/banners/upload`, formData, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}`, "Content-Type": "multipart/form-data" } });

            if (response.status === 200) {
                setBanners((prev) => [...prev, response.data.bannerUrl]);
            }
        } catch (error) {
            console.error("Ошибка загрузки баннера:", error);
        }
    };

    return (
        <div className={styles.mainPage}>
            {banners.map((item, index) => (
                <div className={styles.mainPageColumn} key={index}>
                    <p className={styles.mainPageCount}>{index + 1}</p>
                    <img src={item} alt={`Banner ${index + 1}`} className={styles.banners} />
                    <div className={styles.mainPageButtonsLine}>
                        <button className={styles.mainPageButton} onClick={() => coverUp(item)}>
                            <img src="/bannerArrow.svg" alt="Up" />
                        </button>
                        <button className={styles.mainPageButtonDelete} onClick={() => deleteBanner(item)}>Удалить</button>
                        <button className={styles.mainPageButton} onClick={() => coverDown(item)}>
                            <img src="/bannerArrow.svg" className={styles.mainPageButtonArrow} alt="Down" />
                        </button>
                    </div>
                </div>
            ))
            }
            <div className={styles.mainPagePlusButtonBox}>
                <label className="input-file">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files[0]) uploadBanner(e.target.files[0]);
                        }}
                    />
                    <span className={styles.mainPagePlusButton}>
                        <img src="/plusBanner.svg" alt="Upload" />
                    </span>
                </label>
            </div>
        </div>
    );
};
