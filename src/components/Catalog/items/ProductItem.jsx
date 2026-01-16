import styles from "../styles.module.css";
import Link from "next/link";
import { FavouriteButton } from "@/components";
import { formatNumber } from "@/lib/Formatting";
import { PRODUCT_TYPES } from "@/constants/items";
import { buildProductSlug } from "@/lib/seo";
import { useCart } from "@/contexts/CartContext";
import { useState, memo, useCallback } from "react";
import { ProductModal } from "@/components/Product/Product";
import { useRouter } from "next/router";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiConfig";

function ProductItem({ product }) {
    const router = useRouter();
    const slug = buildProductSlug(product);
    const { addToCart } = useCart();
    const [isOpenModal, setIsOpenModal] = useState(false);

    const buy = useCallback(async () => {
        const cartItem = {
            id: product._id,
            size: product.type === 'ring' || product.type === 'bracelets' ? product.sizes[0] : product.sizes[0],
            color: product.color,
            article: product?.article,
        };
        
        addToCart(cartItem);
        setIsOpenModal(true);

        // Отправляем на сервер, если пользователь авторизован
        if (localStorage.getItem('token')) {
            try {
                await axios.post(`${API_BASE_URL}addProductToBag`, cartItem, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } catch (error) {
                console.error("Ошибка при добавлении товара в корзину на сервере:", error);
            }
        }
    }, [product._id, product.type, product.sizes, product.color, product.article, addToCart]);

    return (
        <div className={styles.sliderItem}>
            <div className={styles.sliderItemContent}>
                <Link href={`/product/${slug}`} className={styles.sliderItemLink}>
                    <img src={product.cover} className={styles.sliderItemImage} />
                </Link>
                <p className={styles.sliderItemTitle}>{PRODUCT_TYPES[product.type]} {product.name}</p>
                <p className={styles.productItemArticle} data-noindex="true">Артикул: {product.article}</p>
                <div className={styles.productItemCostLine}>
                    <div className={styles.productItemCostEmpty} />
                    <p className={styles.sliderItemCost}>{formatNumber(Number(product.saleCost && product.saleCost > 0 ? product.saleCost : product.cost))} руб.</p>
                    <FavouriteButton idProduct={product._id} size={(product.type === 'ring' || product.type === 'bracelets') ? product.sizes[0] : product.sizes[0]} color={product.color} article={product.article} type='small' />
                </div>
                <button className={styles.buyButton} onClick={buy}>КУПИТЬ</button>
            </div>
            <ProductModal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} product={product} router={router} />
        </div>
    );
}

// Мемоизируем компонент для предотвращения лишних перерисовок
export default memo(ProductItem, (prevProps, nextProps) => {
    // Перерисовываем только если изменился ID товара или его ключевые свойства
    return prevProps.product._id === nextProps.product._id &&
           prevProps.product.saleCost === nextProps.product.saleCost &&
           prevProps.product.cost === nextProps.product.cost &&
           prevProps.product.name === nextProps.product.name;
});