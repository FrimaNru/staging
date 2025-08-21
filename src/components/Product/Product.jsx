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
import { PRODUCT_TYPES } from "@/constants/items";

export default function Product({ product }) {
    const { addToCart } = useCart();
    const router = useRouter();
    const [colorOfProduct, setColorOfProduct] = useState('');
    const [sizeOfProduct, setSizeOfProduct] = useState(0);
    const [activeCount, setActiveCount] = useState(0);
    const [isOpenModal, setIsOpenModal] = useState(false);

    useEffect(() => {
        if (product) {
            setColorOfProduct(product.color || '');
            if (product.type === 'ring' || product.type === 'bracelets') {
                setSizeOfProduct(product.sizes[0]);
            } else if (product.type === 'necklace') {
                setSizeOfProduct(product.sizes[0]);
            }
        }
    }, [product]);

    const buy = async () => {
        addToCart({
            id: product._id,
            size: sizeOfProduct,
            color: colorOfProduct,
            article: product?.article,
        });
        setIsOpenModal(true);

        if (localStorage.getItem('token')) {
            await axios.post(`${API_BASE_URL}addProductToBag`, {
                id: product._id,
                size: sizeOfProduct,
                color: colorOfProduct,
                article: product?.article,
            }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        }
    };

    return (
        <div className={styles.main}>
            <div className={styles.mainColumn}>
                <Breadcrumb />
                <div className={styles.infoLine}>
                    <ImageSlider data={product} activeCount={activeCount} />
                    <div className={styles.infoColumn}>
                        <div className={styles.infoColumnText}>
                            <div className={styles.infoTitleLine}>
                                <h1 className={styles.infoTitle}>{PRODUCT_TYPES[product.type]} {product.name}</h1>
                                {product.article && <FavouriteButton idProduct={product._id} size={sizeOfProduct} color={colorOfProduct} article={product.article} />}
                            </div>
                            <p className={styles.description} data-noindex="true">Mi Alegria - это гармоничное соединение многовековых культурных традиций и современного прочтения. Наши украшения созданы для тех, кто хочет смело и со вкусом подчеркнуть свою индивидуальность.</p>
                            <SizeSelector data={product} activeCount={activeCount} sizeOfProduct={sizeOfProduct} setSizeOfProduct={setSizeOfProduct} />
                            <ColorSelector data={product} colorOfProduct={colorOfProduct} setColorOfProduct={setColorOfProduct} setActiveCount={setActiveCount} />
                            {product.articles && <p className={styles.articles} data-noindex="true">Артикул: {product.article}</p>}
                        </div>
                        <div className={styles.infoButtonColumn}>
                            <p className={styles.infoCost}>{formatNumber(Number(product.cost))} руб.</p>
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
                                    <img src={product.cover} className={styles.modalBodyImg} />
                                    <p className={styles.modalBodyTitle}>{PRODUCT_TYPES[product.type]} {product.name}</p>
                                </div>
                                <div className={styles.modalBodyColumnButtons}>
                                    <button className={styles.modalBodyButtonComplete} onClick={() => setIsOpenModal(false)}>ПРОДОЛЖИТЬ ПОКУПКИ</button>
                                    <button className={styles.modalBodyButtonBag} onClick={() => router.push('/bag')}>ОФОРМИТЬ ЗАКАЗ</button>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}

export async function getServerSideProps({ query, res }) {
    const { id } = query;

    if (!id) {
        return { notFound: true };
    }

    try {
        const response = await axios.post(`${API_BASE_URL}getOneProduct`, { id });
        const product = response.data;

        if (!product || !product._id) {
            return { notFound: true };
        }

        return {
            props: {
                product,
            },
        };
    } catch (error) {
        console.error('Ошибка при загрузке продукта:', error.message);
        return { notFound: true };
    }
}