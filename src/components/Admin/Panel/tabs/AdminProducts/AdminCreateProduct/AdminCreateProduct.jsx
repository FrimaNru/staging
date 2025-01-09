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
        name: [],
        cost: [],
        cover: [],
        images: [],
        colors: [],
        articles: [],
        additionally: [],
        weight: [],
        sizes: [],
        type: ''
    });
    const [activeArticleNumber, setActiveArticleNumber] = useState(0);

    const toast = useToast();
    const router = useRouter();

    const addProduct = async () => {
        if (data?.name?.length === data?.articles?.length && data?.cost?.length === data?.articles?.length && data?.type !== '' && data.colors.length === data?.articles?.length && data.weight.length === data?.articles?.length && data.cover.length === data?.articles?.length && data.images.length === data?.articles?.length) {
            setIsLoading(true);

            const formData = new FormData();

            data.cover.forEach((file, index) => {
                formData.append(`cover[${index}]`, file);
            });

            data.images.forEach((imageArray, arrayIndex) => {
                imageArray.forEach((file, fileIndex) => {
                    formData.append(`images[${arrayIndex}][${fileIndex}]`, file);
                });
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
                setIsLoading(false);
                router.push('/adminpanel?page=products');
            } catch (e) {
                console.log(e);
                setIsLoading(false);
            }

        } else {
            if (data?.name?.length !== data?.articles?.length) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не везде ввели названия товаров</div>), duration: 3000 });
            if (data?.cost?.length !== data?.articles?.length) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не везде ввели стоимости товаров</div>), duration: 3000 });
            if (data?.type === '') return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не выбрали тип товара</div>), duration: 3000 });
            if (data.colors.length !== data?.articles?.length) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не везде выбрали цвета товаров</div>), duration: 3000 });
            if (data.weight.length !== data?.articles?.length) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не везде ввели веса товаров</div>), duration: 3000 });
            if (data.cover.length !== data?.articles?.length) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не везде добавили обложки товаров</div>), duration: 3000 });
            if (data.images.length !== data?.articles?.length) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не везде добавили фотографии товаров</div>), duration: 3000 });
        }
    };

    return <div className={styles.createColumn}>
        <ArticlesLine data={data} setData={setData} activeArticleNumber={activeArticleNumber} setActiveArticleNumber={setActiveArticleNumber} />
        {data.articles.length !== 0 ? <>
            <div className={styles.createLilColumn}>
                <p className={styles.createSubtitle}>Артикул</p>
                <input className={styles.productsInput} placeholder="Введите артикул товара" onChange={(e) => setData({ ...data, articles: [...data.articles.slice(0, activeArticleNumber), e.target.value, ...data.articles.slice(activeArticleNumber + 1)] })} value={data?.articles[activeArticleNumber] || ""} />
            </div>
            <ImagesLine data={data} setData={setData} activeArticleNumber={activeArticleNumber} />
            <div className={styles.createLilColumn}>
                <p className={styles.createSubtitle}>Название</p>
                <input className={styles.productsInput} placeholder="Введите название товара" onChange={(e) => setData({ ...data, name: [...data.name.slice(0, activeArticleNumber), e.target.value, ...data.name.slice(activeArticleNumber + 1)] })} value={data?.name[activeArticleNumber] || ""} />
            </div>
            <div className={styles.createLilColumn}>
                <p className={styles.createSubtitle}>Стоимость</p>
                <input className={styles.productsInput} type="number" placeholder="Введите стоимость товара" onChange={(e) => setData({ ...data, cost: [...data.cost.slice(0, activeArticleNumber), e.target.value, ...data.cost.slice(activeArticleNumber + 1)] })} value={data?.cost[activeArticleNumber] || ""} />
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
            <SizeLine data={data} setData={setData} activeArticleNumber={activeArticleNumber} />
            <ColorsLine data={data} setData={setData} activeArticleNumber={activeArticleNumber} />
            <div className={styles.createLilColumn}>
                <p className={styles.createSubtitle}>Вес товара, <span className={styles.createSubtitleSpan}>гр</span></p>
                <input className={styles.productsInput} placeholder="Введите вес товара" onChange={(e) => setData({ ...data, weight: [...data.weight.slice(0, activeArticleNumber), e.target.value, ...data.weight.slice(activeArticleNumber + 1)] })} value={data?.weight[activeArticleNumber] || ""} />
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
        </> : <p className={styles.noArticlesText}>Для начала создания товара добавьте артикул</p>}
    </div>
};