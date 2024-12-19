import styles from "@/styles/Admin/Banners/Sections.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../../apiConfig";
import { useToast } from "@chakra-ui/react";

export default function Sections() {

    const [data, setData] = useState({});

    useEffect(() => { load(); }, []);

    const load = async () => {
        await axios.get(`${API_BASE_URL}mainPage/start`)
            .then((res) => { setData(res.data); })
            .catch((e) => console.log(e));
    };

    return <div className={styles.main}>
        <div className={styles.line}>
            {["first", "second"].map((item, index) => <SectionItem key={index} index={index} section={item} data={data[item]} setData={setData} fullData={data} />)}
        </div>
        <hr className={styles.hr} />
        <div className={styles.line}>
            {["third", "fourth"].map((item, index) => <SectionItem key={index} index={index + 2} section={item} data={data[item]} setData={setData} fullData={data} />)}
        </div>
    </div>
};

function SectionItem({ section, data, index, setData, fullData }) {

    const [cover, setCover] = useState(null);
    const [photoUrl, setPhotoUrl] = useState('');
    const toast = useToast();

    const save = async () => {
        const formData = new FormData();
        formData.append("banner", cover);
        formData.append("section", section);
        formData.append("data", JSON.stringify({
            title: data.title,
            textColor: data.textColor,
            cover: data.cover
        }));

        axios.post(`${API_BASE_URL}constans/start/update`, formData, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then(() => {
                toast({ position: 'bottom-right', render: () => (<div className="toast">Успешно обновлено</div>), duration: 3000 });
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.item}>
        <p className={styles.count}>{index + 1}</p>
        <div className={styles.itemImageColumn}>
            <img src={photoUrl === '' ? data?.cover : photoUrl} className={styles.itemImage} />
            <div className={styles.itemImageButtonBox}>
                <label className="input-file">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setCover(file);
                            setPhotoUrl(URL.createObjectURL(file));
                        }}
                    />
                    <span className={styles.itemImageButton}>Заменить</span>
                </label>
            </div>
        </div>
        <div className={styles.itemLilColumn}>
            <p className={styles.itemSubtitle}>Текст</p>
            <input value={data?.title} className={styles.itemInput} onChange={(e) => setData({
                ...fullData,
                [section]: {
                    ...fullData[section],
                    title: e.target.value
                }
            })} />
        </div>
        <div className={styles.itemLilColumn}>
            <p className={styles.itemSubtitle}>Цвет</p>
            <div className={styles.itemColorLine}>
                <div className={styles.itemColorBeige} onClick={() => setData({
                    ...fullData,
                    [section]: {
                        ...fullData[section],
                        textColor: 'white'
                    }
                })}>
                    {data?.textColor === 'white' && <div className={styles.itemColorPointBlack} />}
                </div>
                <div className={styles.itemColorBlack} onClick={() => setData({
                    ...fullData,
                    [section]: {
                        ...fullData[section],
                        textColor: 'black'
                    }
                })}>
                    {data?.textColor === 'black' && <div className={styles.itemColorPointBeige} />}
                </div>
            </div>
        </div>
        <button className={styles.itemButtonSave} onClick={save}>Сохранить</button>
    </div>
};