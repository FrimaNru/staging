import styles from "../../StartBlock/styles.module.css";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import { API_BASE_URL } from "../../../../apiConfig";
import Link from "next/link";

export default function Banner() {

    const [banners, setBanners] = useState([]);
    let sliderRef = useRef(null);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => { load(); }, []);

    const load = async () => {
        await axios.get(`${API_BASE_URL}mainPage/banners`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then((res) => { setBanners(res.data); })
            .catch((e) => console.log(e));
    };

    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        afterChange: (current) => {
            setActiveSlide(current);
        }
    };

    return <div className={styles.sliderColumn}>
        {banners.length > 1
            ? <Slider {...settings} ref={slider => { sliderRef = slider; }}>
                {banners.length > 0 && banners.map((item, index) => (
                    <Link key={index} href="/catalog" className={styles.sliderImageLink}>
                        <img src={item} className={styles.sliderImage} />
                    </Link>
                ))}
            </Slider>
            : banners.length === 1 && (
                <Link href="/catalog" className={styles.sliderImageLink}>
                    <img src={banners[0]} className={styles.sliderImage} />
                </Link>
            )}
        {banners.length > 1 && <div className={styles.sliderDotsLine}>
            {banners.map((_, index) => <div key={index} className={`${styles.sliderDot} ${index === activeSlide ? styles.sliderDotSelect : ''}`} onClick={() => sliderRef.slickGoTo(index)} />)}
        </div>}
    </div>
};