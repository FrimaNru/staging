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
import Button from "@/ui/Button/Button";
import Input from "@/ui/Inputs/Input/Input";
import CircleCheckBox from "@/ui/CircleCheckbox/CircleCheckbox";

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

const subcategories = {
    'Серьги': ['Длинные', 'Крупные', 'Под золото', 'Под серебро'],
    'Кольца': ['Крупные', 'Под золото', 'Под серебро'],
    'Браслеты': ['Широкие', 'Жесткие', 'Под золото', 'Под серебро'],
    'Колье': ['Многослойные', 'Крупные', 'Длинные', 'Под золото', 'Под серебро']
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
        subcategories: [],
        family: []
    });

    const toast = useToast();
    const router = useRouter();

    const handleSubcategoryToggle = (subcategory) => {
        setData(prev => {
            const currentSubcategories = prev.subcategories || [];
            return {
                ...prev,
                subcategories: currentSubcategories.includes(subcategory)
                    ? currentSubcategories.filter(s => s !== subcategory)
                    : [...currentSubcategories, subcategory]
            };
        });
    };

    useEffect(() => { load(); }, []);

    const load = async () => {
        await axios.post(`${API_BASE_URL}getOneProduct`, { id: router.query.id })
            .then((res) => {
                const productData = res.data;
                // Обрабатываем подкатегории - если это старый формат (строка), конвертируем в массив
                if (productData.subcategory && !Array.isArray(productData.subcategories)) {
                    productData.subcategories = productData.subcategory ? [productData.subcategory] : [];
                    delete productData.subcategory;
                }
                // Убеждаемся, что subcategories всегда массив и очищаем пустые строки
                if (!Array.isArray(productData.subcategories)) {
                    productData.subcategories = [];
                }
                // Удаляем пустые строки и невалидные элементы из массива подкатегорий
                productData.subcategories = productData.subcategories.filter(sub => 
                    sub && 
                    typeof sub === 'string' && 
                    sub.trim() !== ''
                );
                    setData(productData);
                    setFamily(productData.family[0]._id);
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
            setData({ ...data, isVisible: !data.isVisible });
        } catch (error) {
            console.log(error);
        }
    }

    return <div className={styles.createColumn}>
        <p className={styles.title}>Редактирование: {data.name}</p>
        <div className={styles.card}>
            <div className={styles.createLilColumn}>
                <p className={styles.subtitle}>Id товара</p>
                <p className={styles.createSubtitle}>{data._id}</p>
            </div>
            <div className={styles.createLilColumn}>
                <p className={styles.subtitle}>Артикул</p>
                <div className={styles.inputLine}>
                    <input className={styles.productsInput} placeholder="Введите артикул товара" onChange={(e) => setData({ ...data, article: e.target.value })} value={data?.article || ""} />
                </div>
            </div>
            <div className={styles.createLilColumn}>
                <p className={styles.subtitle}>Активен</p>
                <CircleCheckBox
                    active={data.isVisible}
                    onClick={changeVisible}
                />
            </div>
            <ImagesLine data={data} setData={setData} />
            <div className={styles.createLilColumn}>
                <p className={styles.subtitle}>Название</p>
                <Input
                    placeholder="Введите название товара"
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    value={data?.name || ""}
                />
            </div>
            <div className={styles.createLilColumn}>
                <p className={styles.subtitle}>Стоимость</p>
                <Input
                    type="number"
                    placeholder="Введите стоимость товара"
                    onChange={(e) => setData({ ...data, cost: e.target.value })}
                    value={data?.cost || ""}
                />
            </div>
            <div className={styles.createLilColumn}>
                <p className={styles.subtitle}>Тип товара</p>
                <div className={styles.createLilLine}>
                    {Object.entries(types).map(([key, value], i) => (
                        <button
                            key={i}
                            onClick={() => setData({ ...data, type: key, subcategories: [] })}
                            className={`${styles.createTypeItem} ${key === data.type ? styles.createTypeItemSelect : ''}`}>
                            {value}
                        </button>
                    ))}
                </div>
            </div>
            {(data.type === 'earrings' || data.type === 'ring' || data.type === 'bracelets') && (
                <div className={styles.createLilColumn}>
                <p className={styles.subtitle}>Подкатегории (можно выбрать несколько)</p>
                    <div className={styles.createLilLine}>
                        {subcategories[data.type === 'earrings' ? 'Серьги' : data.type === 'ring' ? 'Кольца' : 'Браслеты']?.map((subcategory, i) => (
                            <button
                                key={i}
                                onClick={() => handleSubcategoryToggle(subcategory)}
                                className={`${styles.createTypeItem} ${data.subcategories && Array.isArray(data.subcategories) && data.subcategories.includes(subcategory) ? styles.createTypeItemSelect : ''}`}>
                                {subcategory}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <SizeLine data={data} setData={setData} />
            <ColorsLine data={data} setData={setData} />
            <div className={styles.createLilColumn}>
                <p className={styles.subtitle}>Вес товара, <span className={styles.createSubtitleSpan}>гр</span></p>
                <Input
                    placeholder="Введите вес товара"
                    onChange={(e) => setData({ ...data, weight: e.target.value })}
                    value={data?.weight || ""}
                />
            </div>
            <div className={styles.createLilColumn}>
                <p className={styles.subtitle}>Дополнительно</p>
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
                <p className={styles.subtitle}>Второй товар</p>
                <Input
                    placeholder="Введите ID товара"
                    onChange={(e) => setFamily(e.target.value)}
                    value={family || ""}
                />
            </div>
            <Button
                disabled={isLoading}
                onClick={editProduct}
            >Обновить товар</Button>
        </div>
    </div>
};