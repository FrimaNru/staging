import styles from "@/styles/PopularBlock.module.css";
import Slider from "react-slick";

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

export function PopularBlock() {

    var settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    const data = [
        { name: 'СЕРЬГИ CARAMEL', text: 'ЛАТУНЬ С ПОКРЫТИЕМ ИЗ 18 КТ ЗОЛОТА', cost: '12.500 руб.', img: 'tovar1.png' },
        { name: 'СЕРЬГИ CARAMEL', text: 'ЛАТУНЬ С ПОКРЫТИЕМ ИЗ 18 КТ ЗОЛОТА', cost: '12.500 руб.', img: 'tovar1.png' },
        { name: 'СЕРЬГИ CARAMEL', text: 'ЛАТУНЬ С ПОКРЫТИЕМ ИЗ 18 КТ ЗОЛОТА', cost: '12.500 руб.', img: 'tovar2.png' },
        { name: 'СЕРЬГИ CARAMEL', text: 'ЛАТУНЬ С ПОКРЫТИЕМ ИЗ 18 КТ ЗОЛОТА', cost: '12.500 руб.', img: 'tovar2.png' },
        { name: 'СЕРЬГИ CARAMEL', text: 'ЛАТУНЬ С ПОКРЫТИЕМ ИЗ 18 КТ ЗОЛОТА', cost: '12.500 руб.', img: 'tovar1.png' },
        { name: 'СЕРЬГИ CARAMEL', text: 'ЛАТУНЬ С ПОКРЫТИЕМ ИЗ 18 КТ ЗОЛОТА', cost: '12.500 руб.', img: 'tovar1.png' },
        { name: 'СЕРЬГИ CARAMEL', text: 'ЛАТУНЬ С ПОКРЫТИЕМ ИЗ 18 КТ ЗОЛОТА', cost: '12.500 руб.', img: 'tovar2.png' },
        { name: 'СЕРЬГИ CARAMEL', text: 'ЛАТУНЬ С ПОКРЫТИЕМ ИЗ 18 КТ ЗОЛОТА', cost: '12.500 руб.', img: 'tovar2.png' }
    ];

    return <div className={styles.main}>
        <p className={styles.title}>Популярное</p>
        <Slider {...settings}>
            {data.map((x, i) => <div key={i} className={styles.sliderItem} >
                <div className={styles.sliderItemContent} >
                    <img src={x.img} className={styles.sliderItemImage} />
                    <div className={styles.sliderItemColumn} >
                        <p className={styles.sliderItemTitle} >{x.name}</p>
                        <p className={styles.sliderItemText} >{x.text}</p>
                    </div>
                    <p className={styles.sliderItemCost} >{x.cost}</p>
                </div>
            </div>)}
        </Slider>
    </div>
}