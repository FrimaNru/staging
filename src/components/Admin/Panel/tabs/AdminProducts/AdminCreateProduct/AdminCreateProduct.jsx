import styles from "@/styles/Admin/Products/ProductItem.module.css";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../../apiConfig";
import { useRouter } from "next/router";
import ImagesLine from "./ImagesLine";
import SizeLine from "../items/SizeLine";
import ColorsLine from "../items/ColorsLine";
import Input from "@/ui/Inputs/Input/Input";
import Button from "@/ui/Button/Button";

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
    'Серьги': ['Длинные', 'Крупные', 'Под золото', 'Под серебро', 'Бижутерия под золото', 'Бижутерия под серебро'],
    'Кольца': ['Крупные', 'Под золото', 'Под серебро', 'Бижутерия под золото', 'Бижутерия под серебро'],
    'Браслеты': ['Широкие', 'Жесткие', 'Под золото', 'Под серебро', 'Бижутерия под золото', 'Бижутерия под серебро'],
    'Колье': ['Многослойные', 'Крупные', 'Длинные', 'Под золото', 'Под серебро', 'Бижутерия под золото', 'Бижутерия под серебро']
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
        type: '',
        subcategories: [],
        description: ''
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
        <p className={styles.title}>Новый товар</p>
        <div className={styles.card}>
            <div className={styles.createLilColumn}>
                <p className={styles.subtitle}>Артикул</p>
                <Input
                    placeholder="Введите артикул товара"
                    onChange={(e) => setData({ ...data, article: e.target.value })}
                    value={data?.article || ""}
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
            {(data.type === 'earrings' || data.type === 'ring' || data.type === 'bracelets' || data.type === 'necklace') && (
                <div className={styles.createLilColumn}>
                <p className={styles.subtitle}>Подкатегории (можно выбрать несколько)</p>
                    {(() => {
                        const allSubcategories = subcategories[data.type === 'earrings' ? 'Серьги' : data.type === 'ring' ? 'Кольца' : data.type === 'bracelets' ? 'Браслеты' : 'Колье'] || [];
                        const regularSubcategories = allSubcategories.filter(s => !s.includes('Бижутерия под'));
                        const newSubcategories = allSubcategories.filter(s => s.includes('Бижутерия под'));
                        
                        return (
                            <>
                                <div className={styles.createLilLine}>
                                    {regularSubcategories.map((subcategory, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSubcategoryToggle(subcategory)}
                                            className={`${styles.createTypeItem} ${data.subcategories && Array.isArray(data.subcategories) && data.subcategories.includes(subcategory) ? styles.createTypeItemSelect : ''}`}>
                                            {subcategory}
                                        </button>
                                    ))}
                                </div>
                                {newSubcategories.length > 0 && (
                                    <div className={styles.createLilLine} style={{ marginTop: '10px' }}>
                                        {newSubcategories.map((subcategory, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSubcategoryToggle(subcategory)}
                                                className={`${styles.createTypeItem} ${data.subcategories && Array.isArray(data.subcategories) && data.subcategories.includes(subcategory) ? styles.createTypeItemSelect : ''}`}>
                                                {subcategory}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        );
                    })()}
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
                <p className={styles.subtitle}>Описание товара</p>
                <textarea
                    className={styles.textarea}
                    placeholder="Введите описание товара (необязательно)"
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    value={data?.description || ""}
                    rows={5}
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
            <Button
                disabled={isLoading}
                onClick={addProduct}
                className={isLoading ? styles.loading : ''}
            >{isLoading ? 'Создание...' : 'Создать товар'}</Button>
        </div>
    </div>
};