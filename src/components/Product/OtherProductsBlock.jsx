import styles from "@/styles/PopularBlock.module.css";
import Slider from "react-slick";
import Link from "next/link";
import { formatNumber } from "@/lib/Formatting";
import { FavouriteButton } from "@/components/Common/FavouriteButton";
import { PRODUCT_TYPES } from "@/constants/items";
import { buildProductSlug } from "@/lib/seo";
import { useCart } from "@/contexts/CartContext";
import { ProductModal } from "@/components/Product/Product";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

function SampleNextArrow(props) {
    const { onClick } = props;
    return (
        <div onClick={onClick} className={styles.nextArrow}>
            <svg width="22" height="36" viewBox="0 0 22 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 2L18.5 18L2.5 34" stroke="#140702" strokeWidth="4" strokeLinecap="round" />
            </svg>
        </div>
    );
}

function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
        <div onClick={onClick} className={styles.prevArrow} >
            <svg width="22" height="36" viewBox="0 0 22 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.5 2L3.5 18L19.5 34" stroke="#140702" strokeWidth="4" strokeLinecap="round" />
            </svg>
        </div>
    );
}

function SampleNextArrowMobile(props) {
    const { onClick } = props;
    return (
        <div onClick={onClick} className={styles.nextArrow}>
            <svg width="18" height="29" viewBox="0 0 18 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L14.5 14.5L2 27" stroke="#140702" strokeWidth="4" strokeLinecap="round" />
            </svg>
        </div>
    );
}

function SamplePrevArrowMobile(props) {
    const { onClick } = props;
    return (
        <div onClick={onClick} className={styles.prevArrow} >
            <svg width="18" height="29" viewBox="0 0 18 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L3.5 14.5L16 27" stroke="#140702" strokeWidth="4" strokeLinecap="round" />
            </svg>
        </div>
    );
}

export default function OtherProductsBlock({ title, products = [] }) {
    const router = useRouter();
    const { addToCart } = useCart();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [modalProduct, setModalProduct] = useState(null);

    const settings = useMemo(() => ({
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    }), []);

    const settingsMobile = useMemo(() => ({
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrowMobile />,
        prevArrow: <SamplePrevArrowMobile />
    }), []);

    const buy = (product) => {
        setModalProduct(product);
        addToCart({
            id: product._id,
            size: product.type === 'ring' || product.type === 'bracelets' ? product.sizes?.[0] : product.sizes?.[0],
            color: product.color,
            article: product?.article,
        });
        setIsOpenModal(true);
    };

    if (!Array.isArray(products) || products.length === 0) return null;

    return (
        <div className={styles.main}>
            <p className={styles.title}>{title}</p>

            <div className={styles.sliderBlock}>
                {products.length > 1 && (
                    <Slider {...settings}>
                        {products.map((x, i) => {
                            const slug = buildProductSlug(x);
                            return (
                                <div className={styles.sliderItem} key={x?._id || i}>
                                    <div className={styles.sliderItemContent}>
                                        <Link style={{ width: 'max-content' }} href={`/product/${slug}`}>
                                            <img src={x.cover} className={styles.sliderItemImage} />
                                        </Link>
                                        <div className={styles.sliderItemColumn}>
                                            <p className={styles.sliderItemTitle}>{PRODUCT_TYPES[x.type]} {x.name}</p>
                                            <p className={styles.sliderItemText}>Артикул: {x.article}</p>
                                        </div>
                                        <div className={styles.productItemCostLine}>
                                            <div className={styles.productItemCostEmpty} />
                                            <p className={styles.sliderItemCost}>{formatNumber(x.saleCost && x.saleCost > 0 ? x.saleCost : x.cost)} руб.</p>
                                            <FavouriteButton idProduct={x._id} size={(x.type === 'ring' || x.type === 'bracelets') ? 16 : 28} color={x.color} article={x.article} type='small' />
                                        </div>
                                        <button className={styles.buyButton} onClick={() => buy(x)}>КУПИТЬ</button>
                                    </div>
                                </div>
                            );
                        })}
                    </Slider>
                )}
            </div >

            <div className={styles.sliderBlockMobile}>
                {products.length > 1 && (
                    <Slider {...settingsMobile}>
                        {products.map((x, i) => {
                            const slug = buildProductSlug(x);
                            return (
                                <div className={styles.sliderItem} key={`m-${x?._id || i}`}>
                                    <div className={styles.sliderItemContent}>
                                        <Link style={{ width: 'max-content' }} href={`/product/${slug}`}>
                                            <img src={x.cover} className={styles.sliderItemImage} />
                                        </Link>
                                        <div className={styles.sliderItemColumn}>
                                            <p className={styles.sliderItemTitle}>{PRODUCT_TYPES[x.type]} {x.name}</p>
                                            <p className={styles.sliderItemText}>Артикул: {x.article}</p>
                                        </div>
                                        <div className={styles.productItemCostLine}>
                                            <div className={styles.productItemCostEmpty} />
                                            <p className={styles.sliderItemCost}>{formatNumber(x.saleCost && x.saleCost > 0 ? x.saleCost : x.cost)} руб.</p>
                                            <FavouriteButton idProduct={x._id} size={(x.type === 'ring' || x.type === 'bracelets') ? 16 : 28} color={x.color} article={x.article} type='small' />
                                        </div>
                                        <button className={styles.buyButton} onClick={() => buy(x)}>КУПИТЬ</button>
                                    </div>
                                </div>
                            );
                        })}
                    </Slider>
                )}
            </div>

            {modalProduct && <ProductModal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} product={modalProduct} router={router} />}
        </div>
    );
}


