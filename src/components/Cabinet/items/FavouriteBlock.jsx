import styles from "@/styles/Favourite.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../apiConfig";
import { useRouter } from "next/router";
import Link from "next/link";
import { useToast } from "@chakra-ui/react";
import { useDisclosure, Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { useFavourite } from "@/contexts/FavouriteContext";
import { useCart } from "@/contexts/CartContext";
import { formatNumber } from "@/lib/Formatting";

export default function FavouriteBlock() {

    const [data, setData] = useState([]);
    const { onOpen, isOpen, onClose } = useDisclosure();
    const [activeCount, setActiveCount] = useState(0);
    const { addToCart } = useCart();
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
                console.log(res.data)
                res.data.forEach(x => {
                    axios.post(`${API_BASE_URL}getOneProduct`, { id: x.id })
                        .then((r) => {
                            setData(old => [...old, { ...r.data, color: x.color, size: x.size, article: x.article }]);
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
                addToCart({ id, size, color, article });
                toast({ position: 'bottom-right', render: () => (<div className="toast">Товар добавлен в корзину</div>), duration: 3000 });
            })
            .catch((e) => console.log(e));
    };

    function buyAll() {
        data.map((x, _) => {
            axios.post(`${API_BASE_URL}addProductToBag`, { id: x._id, size: x.size, color: x.color, article: x.article }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
                .then(() => {
                    addToCart({ id: x._id, size: x.size, color: x.color, article: x.article });
                })
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
                            <Link href={`/product/${(x?.type === 'ring' ? 'kolcza' : x?.type === 'necklace' ? 'kole' : x?.type === 'earrings' ? 'sergi' : 'braslety') + '-' + (x?.name || '').toLowerCase().replace(/\s+/g,'-')}`} style={{ width: 'max-content' }}>
                                <img src={x?.cover} className={styles.itemImg} />
                            </Link>
                            <div className={styles.itemColumn}>
                                <div className={styles.itemLilColumn}>
                                    <Link href={`/product/${(x?.type === 'ring' ? 'kolcza' : x?.type === 'necklace' ? 'kole' : x?.type === 'earrings' ? 'sergi' : 'braslety') + '-' + (x?.name || '').toLowerCase().replace(/\s+/g,'-')}`} style={{ width: 'max-content' }}>
                                        <p className={styles.itemName}>{x?.name}</p>
                                    </Link>
                                    <div className={styles.itemLilTextColumn}>
                                        <p className={styles.itemTexLil}>Артикул: {x.article}</p>
                                        <p className={styles.itemTexLil}>Цвет: {x.color}</p>
                                        {x.type !== "earrings" && <p className={styles.itemTexLil}>Размер: {x.size}</p>}
                                    </div>
                                    <p className={styles.itemCost}>{formatNumber(Number(x?.saleCost && x?.saleCost > 0 ? x?.saleCost : x?.cost))} руб.</p>
                                </div>
                                <div className={styles.lilButton} onClick={() => buy(x?._id, x.size, x.color, x.article)}>В КОРЗИНУ</div>
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