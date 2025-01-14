import BigImage from "@/components/Common/BigImage";
import styles from "@/styles/Product/Product.module.css";
import Slider from "react-slick";
import { useState, useRef } from "react";

const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div className={className} onClick={onClick}>
            <img src='/productArrowNext.svg' className={styles.sliderArrow} />
        </div>
    );
};

const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div className={className} onClick={onClick}>
            <svg className={styles.sliderArrow} width="23" height="36" viewBox="0 0 23 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.5 3L4.5 18L19.5 33" stroke="#140702" strokeWidth="6" strokeLinecap="round" />
            </svg>
        </div>
    );
};

export default function ImageSlider({ data, activeCount }) {

    const [openBigImage, setOpenBigImage] = useState(false);
    let sliderRef = useRef(null);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    return <div className={styles.imgSliderBoxColumn} >
        <div className={styles.imgSliderBox} >
            <Slider {...settings} ref={slider => {
                sliderRef = slider;
            }}>
                {[0, 1, 2, 3].map((x, index) => <div key={index} className={styles.sliderItem} onClick={() => setOpenBigImage(true)}>
                    <img src={`https://api.mi-alegria.shop/uploads/${data?.cover?.length > 0 && data?.cover[activeCount]}`} className={styles.sliderItemImg} />
                </div>)}
            </Slider>
        </div>
        <div className={styles.lineDots} >
            {[0, 1, 2, 3].map((x, i) => <img src={`https://api.mi-alegria.shop/uploads/${data?.cover?.length > 0 && data?.cover[activeCount]}`} className={styles.dot} key={i} onClick={() => sliderRef.slickGoTo(x)} />)}
        </div>
        <BigImage isOpen={openBigImage} onClose={() => setOpenBigImage(false)} data={data?.cover?.length > 0 && data.cover[activeCount]} />
    </div>
};