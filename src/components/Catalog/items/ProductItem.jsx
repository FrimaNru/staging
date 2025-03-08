import styles from "@/styles/Catalog.module.css";
import Link from "next/link";
import { FavouriteButton } from "@/components";
import { formatNumber } from "@/lib/Formatting";

export default function ProductItem({ product }) {
    return (
        <div className={styles.sliderItem}>
            <div className={styles.sliderItemContent}>
                <Link href={`/product?id=${product._id}`} className={styles.sliderItemLink}>
                    <img src={`https://api.mi-alegria.shop/uploads/${product.cover}`} className={styles.sliderItemImage} />
                </Link>
                <p className={styles.sliderItemTitle}>{product.name}</p>
                <p className={styles.productItemArticle}>Артикул: {product.article}</p>
                <div className={styles.productItemCostLine}>
                    <div className={styles.productItemCostEmpty} />
                    <p className={styles.sliderItemCost}>{formatNumber(product.cost)} руб.</p>
                    <FavouriteButton idProduct={product._id} size={(product.type === 'ring' || product.type === 'bracelets') ? 16 : 28} color={product.color} article={product.article} type='small' />
                </div>
            </div>
        </div>
    );
}