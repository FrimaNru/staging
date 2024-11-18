import styles from "@/styles/Favourite.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../apiConfig";
import { useRouter } from "next/router";
import Link from "next/link";
import { useToast } from "@chakra-ui/react";
import { useDisclosure, Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { useFavourite } from "@/contexts/FavouriteContext";

function formatNumber(number) {
    let numStr = number.toString();
    let parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
};

export function FavouriteBlock() {

    const [data, setData] = useState([]);
    const { onOpen, isOpen, onClose } = useDisclosure();
    const router = useRouter();
    const toast = useToast();
    const { removeLastFromFavourite, startSetFavourite } = useFavourite();

    useEffect(() => {
        load();
    }, []);

    function load() {
        setData([]);
        axios.get(`${API_BASE_URL}getFavourites`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then((res) => {
                res.data.forEach(x => {
                    axios.post(`${API_BASE_URL}getOneProduct`, { id: x.id })
                        .then((res) => {
                            setData(old => [...old, { ...res.data, color: x.color, size: x.size, article: x.article }]);
                            console.log({ ...res.data, color: x.color, size: x.size, article: x.article })
                        })
                        .catch((e) => console.log(e));
                })
            })
            .catch((e) => console.log(e));
    };

    function deleteOneProduct(id) {
        axios.post(`${API_BASE_URL}daleteOneFavourite`, { id }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                load();
                removeLastFromFavourite();
                toast({ position: 'bottom-right', render: () => (<div className="toast">Товар удален из избранного</div>), duration: 3000 })
            })
            .catch((e) => console.log(e));
    };

    function deleteAllProducts() {
        axios.delete(`${API_BASE_URL}deleteAllFavourites`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                startSetFavourite([]);
                onClose();
                load();
                toast({ position: 'bottom-right', render: () => (<div className="toast">Все товары удалены из избранных</div>), duration: 3000 });
            })
            .catch((e) => console.log(e));
    };

    function buy(id, size, color, article) {
        axios.post(`${API_BASE_URL}addProductToBag`, { id, size, color, article }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                toast({ position: 'bottom-right', render: () => (<div className="toast">Товар добавлен в корзину</div>), duration: 3000 });
            })
            .catch((e) => console.log(e));
    };

    function buyAll() {
        data.map((x, i) => {
            axios.post(`${API_BASE_URL}addProductToBag`, { id: x._id }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
                .catch((e) => console.log(e));
        })
        return toast({ position: 'bottom-right', render: () => (<div className="toast">Все товары добавлены в корзину</div>), duration: 3000 });
    }

    return <div className={styles.main}>
        <hr className={`${styles.hr} ${styles.hrMobile}`} />
        <p className={styles.titleMain}>ИЗБРАННОЕ</p>
        <hr className={`${styles.hr} ${styles.hrMobile}`} />
        {data.length > 0
            ? <>
                {data.map((x, i) => <div key={i} className={styles.column} >
                    <div className={styles.item}>
                        <div className={styles.itemRow}>
                            <Link href={`/product?id=${x?._id}`} style={{ width: 'max-content' }}>
                                <img src={`https://api.mi-alegria.shop/uploads/${x?.cover} `} className={styles.itemImg} />
                            </Link>
                            <div className={styles.itemColumn}>
                                <div className={styles.itemLilColumn}>
                                    <Link href={`/product?id=${x?._id}`} style={{ width: 'max-content' }}>
                                        <p className={styles.itemName}>{x?.name}</p>
                                    </Link>
                                    <p className={styles.itemText}>{x.totalCount > 0 ? 'В наличии' : 'Нет в наличии'}</p>
                                    <div className={styles.itemLilTextColumn}>
                                        <p className={styles.itemTexLil}>Артикул: {x.article}</p>
                                        <p className={styles.itemTexLil}>Цвет: {x.color}</p>
                                        {x.type !== "earrings" && <p className={styles.itemTexLil}>Размер: {x.size}</p>}
                                    </div>
                                    <p className={styles.itemCost}>{formatNumber(x?.cost)} руб.</p>
                                </div>
                                {x.totalCount > 0 && <div className={styles.lilButton} onClick={() => buy(x?._id, x.size, x.color, x.article)}>В КОРЗИНУ</div>}
                            </div>
                        </div>
                        <img src='/cross.svg' className={styles.itemCross} onClick={() => deleteOneProduct(x._id)} />
                    </div>
                    <hr className={styles.hr} />
                </div>)}
                <div className={styles.lineButtons}>
                    <div className={styles.toBagButton} onClick={() => buyAll()}>ДОБАВИТЬ ВСЕ В КОРЗИНУ</div>
                    <div className={styles.deleteAllButton} onClick={onOpen}>УДАЛИТЬ ВСЕ</div>
                </div>
            </>
            : <>
                <p className={styles.title} >К сожалению, в избранном пока нет товаров</p>
                <div className={styles.blackButtonLil} onClick={() => router.push('/catalog')}>В КАТАЛОГ</div>
                <hr className={`${styles.hr} ${styles.hrLast}`} />
            </>}
        <Modal isOpen={isOpen} onClose={onClose} autoFocus='false' isCentered size='xl' >
            <ModalOverlay />
            <ModalContent background='none'>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <p className={styles.modalHeaderTitle}>УДАЛИТЬ ВСЕ?</p>
                        <img src='/cross.svg' onClick={onClose} className={styles.modalCross} />
                    </div>
                    <div className={styles.modalColumn}>
                        <button onClick={deleteAllProducts} className={styles.modalDeleteAll}>УДАЛИТЬ ВСЕ</button>
                        <button onClick={onClose} className={styles.modalClose}>НЕТ</button>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    </div>
}