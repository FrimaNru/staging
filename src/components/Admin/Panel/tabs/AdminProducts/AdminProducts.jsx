
import styles from "@/styles/Admin/Products/Products.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../../../../apiConfig";
import { formatNumber } from "@/lib/Formatting";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useDisclosure, Modal, ModalOverlay, ModalCloseButton, ModalContent } from "@chakra-ui/react";
import CustomMenu from "@/components/Common/Menu/Menu";

const stataTitle = {
    'earrings': 'СЕРЬГИ',
    'ring': 'КОЛЬЦА',
    'bracelets': 'БРАСЛЕТЫ',
    'necklace': 'КОЛЬЕ'
};

const additionally = {
    'popular': 'Популярное',
    'new': 'Новинки',
    'sales': 'Скидки'
};

const sortTypes = ['Все виды', 'Кольца', 'Серьги', 'Браслеты', 'Колье'];
const sortSections = ['Все разделы', 'Новинки', 'Популярное', 'Скидки'];

export default function AdminProducts() {
    const router = useRouter();
    const [statistick, setStatistick] = useState([]);
    const [products, setProducts] = useState([]);
    const [deleteProduct, setDeleteProduct] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [sortType, setSortType] = useState('Все виды');
    const [sortSection, setSortSection] = useState('Все разделы');
    const toast = useToast();

    useEffect(() => {
        load();
    }, []);

    function load() {
        axios.get(`${API_BASE_URL}statistickProducts`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then((res) => {
                setStatistick(res.data);
            })
            .catch((e) => console.log(e));

        axios.get(`${API_BASE_URL}getProducts`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then((res) => {
                setProducts(res.data);
            })
            .catch((e) => console.log(e));
    };

    const delProduct = async () => {
        await axios.post(`${API_BASE_URL}deleteProduct`, { id: deleteProduct._id }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then(() => {
                onClose();
                load();
                toast({ position: 'bottom-right', render: () => (<div className="toast">Успешно удалено</div>), duration: 3000 });
            })
            .catch((e) => console.log(e));
    };

    const filteredProducts = products.filter(item => {
        const sortTypeKey = Object.keys(stataTitle).find(key => stataTitle[key].toLowerCase() === sortType.toLowerCase());
        console.log(sortTypeKey, sortType, item.type)
        const typeFilter =
            sortType === 'Все виды' ||
            item.type === sortTypeKey;

        const sectionFilter =
            sortSection === 'Все разделы' ||
            item.additionally.includes(Object.keys(additionally).find(key => additionally[key] === sortSection));

        return typeFilter && sectionFilter;
    });


    return <div className={styles.main}>
        <p className={styles.title}>Товары</p>
        <div className={styles.mainLine}>
            {['earrings', 'ring', 'bracelets', 'necklace'].map((x, i) => <div key={i} className={styles.mainItem}>{stataTitle[x]}: {statistick[x]} шт.</div>)}
        </div>
        <div className={styles.sortColumn}>
            <div className={styles.productsLine}>
                <input placeholder="Поиск" className={styles.productsInput} />
                <button className={styles.productsButtonAddProduct} onClick={() => router.push('/adminpanel?page=createProduct')} >Добавить товар</button>
            </div>
            <div className={styles.sortLine}>
                <CustomMenu title={sortType} items={sortTypes} setState={setSortType} />
                <CustomMenu title={sortSection} items={sortSections} setState={setSortSection} />
            </div>
        </div>
        <div className={styles.productsGrid}>
            {filteredProducts.length > 0 ? (
                filteredProducts.map((item, index) => (
                    <ProductItem key={index} item={item} setDeleteProduct={setDeleteProduct} onOpen={onOpen} load={load} />
                ))
            ) : (
                <p className={styles.noItems}>Нет подходящих товаров.</p>
            )}
        </div>
        <Modal isOpen={isOpen} onClose={onClose} isCentered autoFocus={false} size='lg'>
            <ModalOverlay />
            <ModalCloseButton />
            <ModalContent>
                <div className={styles.createModal}>
                    <p className={styles.createModalTitle}>Вы уверены, что хотите удалить {deleteProduct?.name?.toUpperCase()}?</p>
                    <img className={styles.createModalCover} src={`https://api.mi-alegria.shop/uploads/${deleteProduct.cover}`} />
                    <div className={styles.createModalLine} >
                        <button className={styles.createModalButton} onClick={delProduct}>Удалить</button>
                        <button className={styles.createModalButtonCancel} onClick={() => { onClose(); setDeleteProduct({}); }}>Отменить</button>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    </div>
};


function ProductItem({ item, setDeleteProduct, onOpen, load }) {

    const toast = useToast();
    const router = useRouter();

    const changeAdditional = async (key) => {
        await axios.post(`${API_BASE_URL}admin/product/additional`, { id: item._id, key }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then(() => {
                load();
                toast({ position: 'bottom-right', render: () => (<div className="toast">Успешно обновлено</div>), duration: 3000 });
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.productsGridItem}>
        <img src={`https://api.mi-alegria.shop/uploads/${item.cover}`} className={styles.productsGridItemCover} />
        <div className={styles.productsGridItemColumn}>
            <p className={styles.productsGridItemTitle}>{item.name.toUpperCase()}</p>
            <p className={styles.productsGridItemCost}>{formatNumber(item.cost)} руб.</p>
            <div className={styles.addtitionallyLine}>
                {Object.entries(additionally).map(([key, value], index) => <button key={index} className={`${styles.additionallyButton} ${item.additionally.includes(key) ? styles.additionallyButtonSelect : ''}`} onClick={() => changeAdditional(key)} >{value}</button>)}
            </div>
            <div className={styles.productsGridItemLineButtons}>
                <button className={styles.productsGridItemButton} onClick={() => router.push(`/adminpanel?page=editProduct&id=${item._id}`)} >Изменить</button>
                <button className={styles.productsGridItemButton} onClick={() => { setDeleteProduct(item); onOpen(); }}>Удалить</button>
            </div>
        </div>
    </div>
};