import styles from "@/styles/PopularBlock.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { API_BASE_URL } from "../../../apiConfig";
import Link from "next/link";
import { formatNumber } from "@/lib/Formatting";

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

export function PopularBlock() {

    const [data, setData] = useState([]);

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

    function load() {
        axios.get(`${API_BASE_URL}getPopularProducts`)
            .then((res) => {
                setData(res.data);
            })
            .catch((e) => console.log(e));
    }

    return <div className={styles.main}>
        <p className={styles.title}>Популярное</p>

        <div className={styles.sliderBlock}>
            <Slider {...settings}>
                {data.map((x, i) => <Link style={{ width: 'max-content' }} key={i} href={`/product?id=${x._id}`}>
                    <div className={styles.sliderItem}>
                        <div className={styles.sliderItemContent}>
                            <img src={`https://api.mi-alegria.shop/uploads/${x.cover}`} className={styles.sliderItemImage} />
                            <div className={styles.sliderItemColumn}>
                                <p className={styles.sliderItemTitle}>{x.name}</p>
                            </div>
                            <p className={styles.sliderItemCost}>{formatNumber(x.cost)} руб.</p>
                        </div>
                    </div>
                </Link>)}
            </Slider>
        </div>

        <div className={styles.sliderBlockMobile}>
            <Slider {...settingsMobile}>
                {data.map((x, i) => <Link style={{ width: 'max-content' }} key={i} href={`/product?id=${x._id}`}>
                    <div className={styles.sliderItem}>
                        <div className={styles.sliderItemContent}>
                            <img src={`https://api.mi-alegria.shop/uploads/${x.cover}`} className={styles.sliderItemImage} />
                            <p className={styles.sliderItemTitle}>{x.name}</p>
                            <p className={styles.sliderItemCost}>{formatNumber(x.cost)} руб.</p>
                        </div>
                    </div>
                </Link>)}
            </Slider>
        </div>
    </div>
}