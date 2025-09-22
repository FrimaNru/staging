import styles from "@/styles/PopularBlock.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { API_BASE_URL } from "../../../apiConfig";
import Link from "next/link";
import { formatNumber } from "@/lib/Formatting";
import { FavouriteButton } from "../Common/FavouriteButton";
import { PRODUCT_TYPES } from "@/constants/items";
import { buildProductSlug } from "@/lib/seo";
import { useCart } from "@/contexts/CartContext";
import { ProductModal } from "@/components/Product/Product";
import { useRouter } from "next/router";

function SampleNextArrow(props) {
    const { onClick } = props;
    return (
        <div onClick={onClick} className={styles.nextArrow}>
            <svg width="22" height="36" viewBox="0 0 22 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 2L18.5 18L2.5 34" stroke="#140702" strokeWidth="4" strokeLinecap="round" />
            </svg>
        </div>
    );
};
function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
        <div onClick={onClick} className={styles.prevArrow} >
            <svg width="22" height="36" viewBox="0 0 22 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.5 2L3.5 18L19.5 34" stroke="#140702" strokeWidth="4" strokeLinecap="round" />
            </svg>
        </div>
    );
};

function SampleNextArrowMobile(props) {
    const { onClick } = props;
    return (
        <div onClick={onClick} className={styles.nextArrow}>
            <svg width="18" height="29" viewBox="0 0 18 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L14.5 14.5L2 27" stroke="#140702" strokeWidth="4" strokeLinecap="round" />
            </svg>
        </div>
    );
};
function SamplePrevArrowMobile(props) {
    const { onClick } = props;
    return (
        <div onClick={onClick} className={styles.prevArrow} >
            <svg width="18" height="29" viewBox="0 0 18 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L3.5 14.5L16 27" stroke="#140702" strokeWidth="4" strokeLinecap="round" />
            </svg>
        </div>
    );
};

export default function PopularBlock() {
    const router = useRouter();
    const [data, setData] = useState([]);
    const { addToCart } = useCart();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [product, setProduct] = useState(null);

    var settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    var settingsMobile = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrowMobile />,
        prevArrow: <SamplePrevArrowMobile />
    };

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        await axios.get(`${API_BASE_URL}getPopularProducts`)
            .then((res) => {
                setData(res.data);
            })
            .catch((e) => console.log(e));
    }

    const buy = async (product) => {
        setProduct(product);
        addToCart({
            id: product._id,
            size: product.type === 'ring' || product.type === 'bracelets' ? product.sizes[0] : product.sizes[0],
            color: product.color,
            article: product?.article,
        });
        setIsOpenModal(true);
    };

    return <div className={styles.main}>
        <p className={styles.title}>Популярное</p>

        <div className={styles.sliderBlock}>
            {data.length > 1 && <Slider {...settings}>
                {data.map((x, i) => {
                    const slug = buildProductSlug(x);
                    return <div className={styles.sliderItem} key={i}>
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
                                <p className={styles.sliderItemCost}>{formatNumber(x.cost)} руб.</p>
                                <FavouriteButton idProduct={x._id} size={(x.type === 'ring' || x.type === 'bracelets') ? 16 : 28} color={x.color} article={x.article} type='small' />
                            </div>
                            <button className={styles.buyButton} onClick={() => buy(x)}>КУПИТЬ</button>
                        </div>
                    </div>
                })}
            </Slider>}
        </div >

        <div className={styles.sliderBlockMobile}>
            {data.length > 1 && <Slider {...settingsMobile}>
                {data.map((x, i) => {
                    const slug = buildProductSlug(x);
                    return <div className={styles.sliderItem} key={i}>
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
                                <p className={styles.sliderItemCost}>{formatNumber(x.cost)} руб.</p>
                                <FavouriteButton idProduct={x._id} size={(x.type === 'ring' || x.type === 'bracelets') ? 16 : 28} color={x.color} article={x.article} type='small' />
                            </div>
                            <button className={styles.buyButton} onClick={() => buy(x)}>КУПИТЬ</button>
                        </div>
                    </div>
                })}
            </Slider>}
        </div>
        {product && <ProductModal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} product={product} router={router} />}
    </div>
}