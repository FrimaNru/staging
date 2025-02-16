import styles from "@/styles/Admin/Products/ProductItem.module.css";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../../apiConfig";
import { useRouter } from "next/router";
import ArticlesLine from "../items/ArticlesLine";
import ImagesLine from "./ImagesLine";
import SizeLine from "../items/SizeLine";
import ColorsLine from "../items/ColorsLine";

const types = {
    'earrings': 'серьги',
    'ring': 'кольца',
    'necklace': 'колье',
    'bracelets': 'браслеты'
};

const additionally = {
    'popular': 'Добавить в "Популярное"',
    'new': 'Добавить в "Новинки"',
    'sales': 'Добавить в "Скидки"'
};

export default function AdminEditProduct() {

    const [isLoading, setIsLoading] = useState(false);
    const [family, setFamily] = useState([]);
    const [data, setData] = useState({
        name: '',
        cost: 0,
        cover: null,
        images: [],
        color: null,
        article: '',
        additionally: [],
        weight: '',
        sizes: [],
        type: '',
        family: []
    });

    const toast = useToast();
    const router = useRouter();

    useEffect(() => { load(); }, []);

    const load = async () => {
        await axios.post(`${API_BASE_URL}getOneProduct`, { id: router.query.id })
            .then((res) => {
                setData(res.data);
                setFamily(res.data.family[0]._id);
                console.log(res.data)
            })
            .catch((e) => console.log(e));
    };

    const editProduct = async () => {
        if (data?.name !== '' && data?.cost !== 0 && data?.type !== '' && data.color && data.weight !== '' && data.cover && data.images.length !== 0) {
            setIsLoading(true);

            const formData = new FormData();
            if (data.cover instanceof File) {
                formData.append(`cover`, data.cover);
            } else {
                formData.append(`coverNames`, data.cover);
            }

            data.images.forEach((item, index) => {
                if (item instanceof File) {
                    formData.append(`images[${index}]`, item);
                } else if (typeof item === 'string') {
                    formData.append(`imageNames[${index}]`, item);
                }
            });

            formData.append('data', JSON.stringify(data));

            try {
                await axios.post(`${API_BASE_URL}editProduct`, formData, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });
                router.push('/adminpanel?page=products');
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }

        } else {
            if (data?.name === '') return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не ввели название товара</div>), duration: 3000 });
            if (data?.cost === 0) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не ввели стоимость товара</div>), duration: 3000 });
            if (data?.type === '') return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не выбрали тип товара</div>), duration: 3000 });
            if (!data.color) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не выбрали цвет товара</div>), duration: 3000 });
            if (data.weight === '') return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не ввели вес товара</div>), duration: 3000 });
            if (!data.cover) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не добавили обложку товара</div>), duration: 3000 });
            if (data.images.length === 0) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не добавили фотографии товара</div>), duration: 3000 });
        }
    };

    const changeVisible = async () => {
        try {
            await axios.post(`${API_BASE_URL}admin/product/visible`, { id: router.query.id }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });
            load();
        } catch (error) {
            console.log(error);
        }
    }

    return <div className={styles.createColumn}>
        <div className={styles.createLilColumn}>
            <p className={styles.createSubtitle}>Id товара</p>
            <p className={styles.createSubtitle}>{data._id}</p>
        </div>
        <div className={styles.createLilColumn}>
            <p className={styles.createSubtitle}>Артикул</p>
            <div className={styles.inputLine}>
                <input className={styles.productsInput} placeholder="Введите артикул товара" onChange={(e) => setData({ ...data, article: e.target.value })} value={data?.article || ""} />
                <button className={styles.lilBlackButton} style={{ opacity: !data.isVisible ? 0.5 : 1 }} onClick={changeVisible}>{data && data.isVisible === true ? 'СКРЫТЬ' : 'ОТОБРАЖАТЬ'}</button>
            </div>
        </div>
        <ImagesLine data={data} setData={setData} />
        <div className={styles.createLilColumn}>
            <p className={styles.createSubtitle}>Название</p>
            <input className={styles.productsInput} placeholder="Введите название товара" onChange={(e) => setData({ ...data, name: e.target.value })} value={data?.name || ""} />
        </div>
        <div className={styles.createLilColumn}>
            <p className={styles.createSubtitle}>Стоимость</p>
            <input className={styles.productsInput} type="number" placeholder="Введите стоимость товара" onChange={(e) => setData({ ...data, cost: e.target.value })} value={data?.cost || ""} />
        </div>
        <div className={styles.createLilColumn}>
            <p className={styles.createSubtitle}>Тип товара</p>
            <div className={styles.createLilLine}>
                {Object.entries(types).map(([key, value], i) => (
                    <button
                        key={i}
                        onClick={() => setData({ ...data, type: key })}
                        className={`${styles.createTypeItem} ${key === data.type ? styles.createTypeItemSelect : ''}`}>
                        {value}
                    </button>
                ))}
            </div>
        </div>
        <SizeLine data={data} setData={setData} />
        <ColorsLine data={data} setData={setData} />
        <div className={styles.createLilColumn}>
            <p className={styles.createSubtitle}>Вес товара, <span className={styles.createSubtitleSpan}>гр</span></p>
            <input className={styles.productsInput} placeholder="Введите вес товара" onChange={(e) => setData({ ...data, weight: e.target.value })} value={data?.weight || ""} />
        </div>
        <div className={styles.createLilColumn}>
            <p className={styles.createSubtitle}>Дополнительно</p>
            <div className={styles.createLineAdditionally}>
                {Object.entries(additionally).map(([key, value], i) => (
                    <button
                        key={i}
                        onClick={() => {
                            const updatedAdditionally = data.additionally.includes(key)
                                ? data.additionally.filter(x => x !== key)
                                : [...data.additionally, key];
                            setData({ ...data, additionally: updatedAdditionally });
                        }}
                        className={`${styles.createAdditionallyItem} ${data.additionally.includes(key) ? styles.createTypeItemSelect : ''}`}>
                        {value}
                    </button>
                ))}
            </div>
        </div>
        <div className={styles.createLilColumn}>
            <p className={styles.createSubtitle}>Второй товар</p>
            <input className={styles.productsInput} placeholder="Введите ID товара" onChange={(e) => setFamily(e.target.value)} value={family || ""} />
        </div>
        <button className={`${styles.createButton} ${isLoading ? styles.loading : ''}`} onClick={editProduct}>Обновить товар</button>
    </div>
};