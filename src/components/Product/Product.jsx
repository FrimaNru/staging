import { useEffect, useState } from "react";
import styles from "@/styles/Product/Product.module.css";
import { Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react';
import { FavouriteButton } from "../Common/FavouriteButton";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import { useRouter } from "next/router";
import { useCart } from "@/contexts/CartContext";
import Breadcrumb from "../Common/Breadcrumb";
import { formatNumber } from "@/lib/Formatting";
import ImageSlider from "./items/ImageSlider";
import SizeSelector from "./items/SizeSelector";
import ColorSelector from "./items/ColorSelector";
import CharasteristicBlock from "./items/CharasteristicBlock";

export function Product() {

    const { addToCart } = useCart();
    const [data, setData] = useState({});
    const router = useRouter();
    const [id, setId] = useState(null);
    const [colorOfProduct, setColorOfProduct] = useState('');
    const [sizeOfProduct, setSizeOfProduct] = useState(0);

    const [activeCount, setActiveCount] = useState(0);

    const [isOpenModal, setIsOpenModal] = useState(false);

    useEffect(() => {
        const urlId = new URLSearchParams(window.location.search).get('id');
        setId(urlId);

        load();
        const handleRouteChange = (url) => {
            load();
        };
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, []);

    const load = async () => {
        await axios.post(`${API_BASE_URL}getOneProduct`, { id: window.location.href.split('?id=')[1] })
            .then((res) => {
                setData(res.data);
                setColorOfProduct(res.data.color);
                if (res.data.type === 'ring' || res.data.type === 'bracelets') setSizeOfProduct(res.data.sizes[0])
                else if (res.data.type === 'necklace') setSizeOfProduct(res.data.sizes[0]);
            })
            .catch((e) => console.log(e));
    };

    const buy = async () => {
        addToCart({ id: window.location.href.split('?id=')[1], size: sizeOfProduct, color: colorOfProduct, article: data?.article });
        setIsOpenModal(true);
        
        if (localStorage.getItem('token')) {
            await axios.post(`${API_BASE_URL}addProductToBag`, {
                id: window.location.href.split('?id=')[1],
                size: sizeOfProduct,
                color: colorOfProduct,
                article: data?.article
            }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        }
    };

    return <div className={styles.main}>
        <div className={styles.mainColumn} >
            <Breadcrumb />
            <div className={styles.infoLine}>
                <ImageSlider data={data} activeCount={activeCount} />
                <div className={styles.infoColumn}>
                    <div className={styles.infoColumnText}>
                        <div className={styles.infoTitleLine}>
                            <p className={styles.infoTitle}>{data?.name?.length > 0 && data.name}</p>
                            {data?.article?.length > 0 ? <FavouriteButton idProduct={data._id} size={sizeOfProduct} color={colorOfProduct} article={data?.article} /> : <></>}
                        </div>
                        <p className={styles.description}>Mi Alegria - это гармоничное соединение многовековых культурных традиций и современного прочтения. Наши  украшения созданы для тех, кто хочет смело и со вкусом подчеркнуть свою индивидуальность.</p>
                        <SizeSelector data={data} activeCount={activeCount} sizeOfProduct={sizeOfProduct} setSizeOfProduct={setSizeOfProduct} />
                        <ColorSelector data={data} colorOfProduct={colorOfProduct} setColorOfProduct={setColorOfProduct} setActiveCount={setActiveCount} />
                        {data?.articles?.length > 0 && <p className={styles.articles}>Артикул: {data?.article}</p>}
                    </div>
                    <div className={styles.infoButtonColumn}>
                        <p className={styles.infoCost} >{formatNumber(Number(data.cost))} руб.</p>
                        <button className={styles.infoButton} onClick={buy}>КУПИТЬ</button>
                    </div>
                </div>
            </div>
        </div>
        <CharasteristicBlock />
        <Modal isOpen={isOpenModal} size='xl' onClose={() => setIsOpenModal(false)} isCentered autoFocus={false}>
            <ModalOverlay />
            <ModalContent bg='none' boxShadow='none'>
                <ModalBody p={0}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalHeaderLine}>
                                <p className={styles.modalHeaderTitle}>ДОБАВЛЕНО В КОРЗИНУ</p>
                                <p className={styles.modalHeaderTitleMobile}>В КОРЗИНЕ</p>
                                <img src='/cross.svg' className={styles.modalHeaderCross} onClick={() => setIsOpenModal(false)} />
                                <img src='/crossMobile.svg' className={styles.modalHeaderCrossMobile} onClick={() => setIsOpenModal(false)} />
                            </div>
                            <hr className={styles.modalHeaderHr} />
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.modalBodyColumn}>
                                <img src={data?.cover?.length > 0 && data.cover} className={styles.modalBodyImg} />
                                <p className={styles.modalBodyTitle}>{data?.name?.length > 0 && data.name}</p>
                            </div>
                            <div className={styles.modalBodyColumnButtons}>
                                <button className={styles.modalBodyButtonComplete} onClick={() => setIsOpenModal(false)} >ПРОДОЛЖИТЬ ПОКУПКИ</button>
                                <button className={styles.modalBodyButtonBag} onClick={() => router.push('/bag')}>ОФОРМИТЬ ЗАКАЗ</button>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    </div>
};