import styles from "@/styles/Admin/Products/ProductItem.module.css";
import { useState } from "react";
import { Menu, MenuButton, MenuList, MenuItem, useToast } from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../../apiConfig";
import { useRouter } from "next/router";
import ArtcilesLine from "./items/ArticlesLine";

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
        additionally: []
    });
    const [activeArticleNumber, setActiveArticleNumber] = useState(0);
    const [countColors, setCountColors] = useState(1);
    const [photoURL, setPhotoURL] = useState('');
    const [cover, setCover] = useState(null);
    const [images, setImages] = useState([]);
    const [imageURLs, setImageURLs] = useState([]);
    const toast = useToast();
    const router = useRouter();

    const addProduct = async () => {
        if (data?.name?.length > 0 && data?.cost?.length > 0 && data?.type?.length > 0 && data.colors.length > 0 && data.articles.length > 0 && cover !== null && images.length > 0) {
            setIsLoading(true);

            const formData = new FormData();

            if (cover) formData.append('cover', cover);

            images.forEach(image => {
                formData.append('images', image);
            });

            formData.append('data', JSON.stringify(data));

            axios.post(`${API_BASE_URL}addProduct`, formData, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}`, 'Content-Type': 'multipart/form-data' } })
                .then((res) => {
                    setIsLoading(false);
                    router.push('/adminpanel?page=products')
                })
                .catch((e) => {
                    console.log(e);
                    setIsLoading(false);
                });
        } else {
            if (data?.name?.length === 0 || !data.name) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не ввели название товара</div>), duration: 3000 });
            if (data?.cost?.length === 0 || !data.cost) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не ввели стоимость товара</div>), duration: 3000 });
            if (data?.type?.length === 0 || !data.type) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не ввыбрали тип товара</div>), duration: 3000 });
            if (cover === null) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не добавили обложку товара</div>), duration: 3000 });
            if (data.colors.length === 0) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не выбрали цвета товаров</div>), duration: 3000 });
            if (data.articles.length === 0) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не ввели артикулы товаров</div>), duration: 3000 });
            if (images.length === 0) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не добавили фотографии товара</div>), duration: 3000 });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setCover(file);
        setPhotoURL(URL.createObjectURL(file));
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...images, ...files];
        setImages(newImages);

        const newImageURLs = newImages.map(file => URL.createObjectURL(file));
        setImageURLs(newImageURLs);
    };

    const removeImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);

        const updatedImageURLs = updatedImages.map(file => URL.createObjectURL(file));
        setImageURLs(updatedImageURLs);
    };

    return <div className={styles.createColumn}>
        <ArtcilesLine data={data} setData={setData} activeArticleNumber={activeArticleNumber} setActiveArticleNumber={setActiveArticleNumber} />
        {data.articles.length !== 0 ? <>
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
                <p className={styles.createSubtitle}>Обложка</p>
                <div className={styles.newsImageButtonBox} >
                    {photoURL ? (
                        <div className={styles.newsCoverBox}>
                            <img src={photoURL} className={styles.newsCoverImage} />
                            <button className={styles.createCountButton} onClick={() => { setPhotoURL(''); setCover(null); }} >
                                <img src='/trash.svg' />
                            </button>
                        </div>
                    ) :
                        <label className="input-file">
                            <input type='file' onChange={handleFileChange} />
                            <div className={styles.newsImageButton}>
                                <img src='/plusIcon.svg' className={styles.newsPlus} />
                            </div>
                        </label>
                    }
                </div>
            </div> */}
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
            {/* <div className={styles.createLilColumn}>
                <p className={styles.createSubtitle}>Артикулы</p>
                {data.colors.length === 0
                    ? <p className={styles.createCountTitle}>Для начала выберите цвета изделий</p>
                    : <>{Array.from({ length: data.colors.length }).map((_, i) => (
                        <input
                            key={i}
                            className={styles.productsInputArticle}
                            placeholder={`Введите артикул для "${data.colors[i]}"`}
                            value={data.articles[i] || ''}
                            onChange={(e) => {
                                const updatedArticles = [...data.articles];
                                updatedArticles[i] = e.target.value;
                                setData({ ...data, articles: updatedArticles });
                            }}
                        />
                    ))}</>}
            </div> */}
            {/* <div className={styles.createLilColumn}>
                <p className={styles.createSubtitle}>Фотографии</p>
                <div className={styles.newsCoverBox}>
                    {imageURLs.map((url, index) => (
                        <div key={index} className={styles.newsCoverBox}>
                            <img src={url} className={styles.newsCoverImage} />
                            <button className={styles.createCountButton} onClick={() => removeImage(index)}>
                                <img src='/trash.svg' />
                            </button>
                        </div>
                    ))}
                </div>
                <div className={styles.newsImageButtonBox}>
                    <label className="input-file">
                        <input type='file' multiple onChange={handleImagesChange} />
                        <div className={styles.newsImageButton}>
                            <img src='/plusIcon.svg' className={styles.newsPlus} />
                        </div>
                    </label>
                </div>
            </div> */}
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
        </> : <p>Для начала создания товара добавьте артикул</p>}
    </div>
}