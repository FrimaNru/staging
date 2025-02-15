import styles from "@/styles/Admin/Products/ProductItem.module.css";
import { useState } from "react";
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

export default function AdminCreateProduct() {

    const [isLoading, setIsLoading] = useState(false);
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
        type: ''
    });

    const toast = useToast();
    const router = useRouter();

    const addProduct = async () => {
        if (data.article !== '' && data?.name !== '' && data?.cost !== 0 && data?.type !== '' && data.color !== '' && data.weight !== '' && data.cover && data.images.length !== 0) {
            setIsLoading(true);

            const formData = new FormData();

            formData.append(`cover`, data.cover);

            data.images.forEach((file, fileIndex) => {
                formData.append(`images[${fileIndex}]`, file);
            });

            formData.append('data', JSON.stringify(data));

            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            try {
                await axios.post(`${API_BASE_URL}addProduct`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                router.push('/adminpanel?page=products');
            } catch (e) {
                console.log(e);
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

    return <div className={styles.createColumn}>
        {/* <ArticlesLine data={data} setData={setData} activeArticleNumber={activeArticleNumber} setActiveArticleNumber={setActiveArticleNumber} /> */}
        <div className={styles.createLilColumn}>
            <p className={styles.createSubtitle}>Артикул</p>
            <input className={styles.productsInput} placeholder="Введите артикул товара" onChange={(e) => setData({ ...data, article: e.target.value })} value={data?.article || ""} />
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
        <button className={`${styles.createButton} ${isLoading ? styles.loading : ''}`} onClick={addProduct}>Создать товар</button>
    </div>
};