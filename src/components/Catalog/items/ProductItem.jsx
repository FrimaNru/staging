import styles from "../styles.module.css";
import Link from "next/link";
import { FavouriteButton } from "@/components";
import { formatNumber } from "@/lib/Formatting";
import { PRODUCT_TYPES } from "@/constants/items";
import { buildProductSlug } from "@/lib/seo";

export default function ProductItem({ product }) {
    const slug = buildProductSlug(product);
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
                    <p className={styles.sliderItemCost}>{formatNumber(product.cost)} руб.</p>
                    <FavouriteButton idProduct={product._id} size={(product.type === 'ring' || product.type === 'bracelets') ? product.sizes[0] : product.sizes[0]} color={product.color} article={product.article} type='small' />
                </div>
            </div>
        </div>
    );
}