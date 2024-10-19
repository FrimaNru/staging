import styles from "@/styles/Admin.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../../../apiConfig";
import { formatNumber } from "@/lib/Formatting";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useDisclosure, Modal, ModalOverlay, ModalCloseButton, ModalContent } from "@chakra-ui/react";

const stataTitle = {
    'earrings': 'СЕРЬГИ',
    'ring': 'КОЛЬЦА',
    'bracelets': 'БРАСЛЕТЫ',
    'necklace': 'КОЛЬЕ'
};

export function AdminProducts() {

    const router = useRouter();
    const [statistick, setStatistick] = useState([]);
    const [products, setProducts] = useState([]);
    const [deleteProduct, setDeleteProduct] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
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

    function changePopular(id) {
        axios.post(`${API_BASE_URL}changePopular`, { id }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then(() => {
                load();
                toast({ position: 'bottom-right', render: () => (<div className="toast">Успешно обновлено</div>), duration: 3000 });
            })
            .catch((e) => console.log(e));
    };

    function delProduct() {
        console.log(deleteProduct._id)
        axios.post(`${API_BASE_URL}deleteProduct`, { id: deleteProduct._id }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then((res) => {
                onClose();
                load();
                toast({ position: 'bottom-right', render: () => (<div className="toast">Успешно удалено</div>), duration: 3000 });
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.dashboard}>
        <p className={styles.title}>Товары</p>
        <div className={styles.dashboardLine}>
            {['earrings', 'ring', 'bracelets', 'necklace'].map((x, i) => <div key={i} className={styles.dashboardLineItem} >{stataTitle[x]}: {statistick[x]} шт.</div>)}
        </div>
        <div className={styles.productsColumn}>
            <div className={styles.productsLine}>
                <input placeholder="Введите id товара или название" className={styles.productsInput} />
                <button className={styles.productsButtonAddProduct} onClick={() => router.push('/adminpanel?page=createProduct')} >Добавить товар</button>
            </div>
            <div className={styles.productsGrid}>
                {products.length > 0 && products.map((x, i) => <div key={i} className={styles.productsGridItem}>
                    <img src={`https://api.mi-alegria.shop/uploads/${x.cover}`} className={styles.productsGridItemCover} />
                    <div className={styles.productsGridItemColumn}>
                        <div className={styles.productsGridItemTextLine}>
                            <p className={styles.productsGridItemText}>{x.name.toUpperCase()}</p>
                            <button className={styles.productsGridItemPopular} >
                                {x.additionally.includes('popular')
                                    ? <img src='/starFull.svg' onClick={() => changePopular(x._id)} />
                                    : <img src='/star.svg' onClick={() => changePopular(x._id)} />}
                            </button>
                        </div>  
                        <p className={styles.productsGridItemText} style={{ fontWeight: 800 }} >{formatNumber(x.cost)} руб.</p>
                        <div className={styles.productsGridItemLineButtons}>
                            <button className={styles.productsGridItemButton} onClick={() => router.push(`/adminpanel?page=editProduct&id=${x._id}`)} >Изменить</button>
                            <button className={styles.productsGridItemButton} onClick={() => { setDeleteProduct(x); onOpen(); }}>Удалить</button>
                        </div>
                    </div>
                </div>)}
            </div>
        </div>
        <Modal isOpen={isOpen} onClose={onClose} isCentered autoFocus={false} size='lg' >
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