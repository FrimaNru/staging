import styles from "@/styles/Admin/Products/ProductItem.module.css";
import { useState } from "react";
import { Menu, MenuButton, MenuList, MenuItem, useToast } from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../../apiConfig";
import { useRouter } from "next/router";
import ArticlesLine from "./items/ArticlesLine";
import ImagesLine from "./items/ImagesLine";

const types = {
    'earrings': 'серьги',
    'ring': 'кольца',
    'necklace': 'колье',
    'bracelets': 'браслеты'
};

const additionally = {
    'popular': 'Добавить в "Популярное"',
    'new': 'Добавить в "Новинки"',
    'sale': 'Добавить в "Скидки"'
};

const colors = ['Золотой цвет с патиной', 'Серебряный цвет с патиной', 'Бронзовый цвет с патиной', 'Золотой цвет', 'Серебряный цвет', 'Золотой цвет патина с серебренным цветом патина', 'Золотой цвет патина с деревянными чёрными элементами'];

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
        weight: []
    });
    const [activeArticleNumber, setActiveArticleNumber] = useState(0);
    const [countColors, setCountColors] = useState(1);        
    
    const toast = useToast();
    const router = useRouter();

    const addProduct = async () => {
        console.log(data);
        // if (data?.name?.length > 0 && data?.cost?.length > 0 && data?.type?.length > 0 && data.colors.length > 0 && data.articles.length > 0 && cover !== null && images.length > 0) {
        //     setIsLoading(true);

        //     const formData = new FormData();

        //     if (cover) formData.append('cover', cover);

        //     images.forEach(image => {
        //         formData.append('images', image);
        //     });

        //     formData.append('data', JSON.stringify(data));

        //     axios.post(`${API_BASE_URL}addProduct`, formData, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}`, 'Content-Type': 'multipart/form-data' } })
        //         .then((res) => {
        //             setIsLoading(false);
        //             router.push('/adminpanel?page=products')
        //         })
        //         .catch((e) => {
        //             console.log(e);
        //             setIsLoading(false);
        //         });
        // } else {
        //     if (data?.name?.length === 0 || !data.name) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не ввели название товара</div>), duration: 3000 });
        //     if (data?.cost?.length === 0 || !data.cost) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не ввели стоимость товара</div>), duration: 3000 });
        //     if (data?.type?.length === 0 || !data.type) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не ввыбрали тип товара</div>), duration: 3000 });
        //     if (cover === null) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не добавили обложку товара</div>), duration: 3000 });
        //     if (data.colors.length === 0) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не выбрали цвета товаров</div>), duration: 3000 });
        //     if (data.articles.length === 0) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не ввели артикулы товаров</div>), duration: 3000 });
        //     if (images.length === 0) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не добавили фотографии товара</div>), duration: 3000 });
        // }
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
                <input className={styles.productsInput} placeholder="Введите название товара" onChange={(e) => setData({ ...data, name: e.target.value })} value={data?.name} />
            </div>
            <div className={styles.createLilColumn}>
                <p className={styles.createSubtitle}>Стоимость</p>
                <input className={styles.productsInput} type="number" placeholder="Введите стоимость товара" onChange={(e) => setData({ ...data, cost: e.target.value })} value={data?.cost} />
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
            {/* <div className={styles.createLilColumn}>
                <p className={styles.createSubtitle}>Цвета</p>
                <div className={styles.createCountLine}>
                    <p className={styles.createCountTitle}>Количество цветов:</p>
                    {[1, 2, 3, 4, 5, 6, 7].map((x, i) => <button key={i} className={`${styles.createCountButton} ${x === countColors ? styles.createCountButtonSelect : ''}`} onClick={() => { setCountColors(x); setData({ ...data, colors: [] }) }}>{x}</button>)}
                </div>
                {Array.from({ length: countColors }).map((_, index) => (
                    <Menu key={index}>
                        <MenuButton>
                            <div className={styles.createColorButton}>
                                {data?.colors?.length < index + 1 ? 'Выберите цвет' : data?.colors[index]}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="9" viewBox="0 0 16 9" fill="none">
                                    <path d="M1 0.5L8 7.5L15 0.5" stroke="#140702" strokeLinecap="round" />
                                </svg>
                            </div>
                        </MenuButton>
                        <MenuList boxShadow='none' border='none' p={0} bg='none'>
                            <div className={styles.createColorsPanel}>
                                {colors.map((x, i) => (
                                    <MenuItem key={i} p={0} bg='none' _hover={{ bg: 'none' }}
                                        onClick={() => {
                                            const updatedColors = [...data.colors];
                                            updatedColors[index] = x;
                                            setData({ ...data, colors: updatedColors });
                                        }}>
                                        <p className={`${styles.createColorsItem} ${i === colors.length - 1 ? styles.createColorsItemLast : ''}`}>
                                            {x}
                                        </p>
                                    </MenuItem>
                                ))}
                            </div>
                        </MenuList>
                    </Menu>
                ))}
            </div> */}
            <div className={styles.createLilColumn}>
                <p className={styles.createSubtitle}>Вес товара, <span className={styles.createSubtitleSpan}>кг</span></p>
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