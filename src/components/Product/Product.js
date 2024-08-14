import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Product.module.css";
import Slider from "react-slick";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import { FavouriteButton } from "../Common/FavouriteButton";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";

export function Product() {

    let sliderRef = useRef(null);
    const [data, setData] = useState({});

    useEffect(() => {
        load();
    }, []);

    function load() {
        axios.post(`${API_BASE_URL}getOneProduct`, { id: window.location.href.split('?id=')[1] })
        .then((res) => {
            setData(res.data);
        })
        .catch((e) => console.log(e));
    };

    const SampleNextArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div className={className} onClick={onClick}>
                <svg width="23" height="36" viewBox="0 0 23 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 33L18.5 18L3.5 3" stroke="#140702" strokeWidth="6" strokeLinecap="round" />
                </svg>
            </div>
        );
    };

    const SamplePrevArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div className={className} onClick={onClick}>
                <svg width="23" height="36" viewBox="0 0 23 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.5 3L4.5 18L19.5 33" stroke="#140702" strokeWidth="6" strokeLinecap="round" />
                </svg>
            </div>
        );
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    const dataCharacteristic = [
        { title: 'МАТЕРИАЛ', text: 'Серьги Caramel — воплощение тренда этого года на крупные текучие украшения. Словно застывшая капля сладкого текучего лакомства. Изделие изготовлено из ювелирной латуни с покрытием из 18-каратного золота' },
        { title: 'ГАБАРИТЫ', text: 'Серьги Caramel — воплощение тренда этого года на крупные текучие украшения. Словно застывшая капля сладкого текучего лакомства. Изделие изготовлено из ювелирной латуни с покрытием из 18-каратного золота' },
        { title: 'ДОСТАВКА, ОПЛАТА И ВОЗВРАТ', text: 'Серьги Caramel — воплощение тренда этого года на крупные текучие украшения. Словно застывшая капля сладкого текучего лакомства. Изделие изготовлено из ювелирной латуни с покрытием из 18-каратного золота' },
        { title: 'ГАРАНТИЯ И УХОД', text: 'Серьги Caramel — воплощение тренда этого года на крупные текучие украшения. Словно застывшая капля сладкого текучего лакомства. Изделие изготовлено из ювелирной латуни с покрытием из 18-каратного золота' }
    ];

    return <div className={styles.main}>
        <div className={styles.infoLine} >
            <div className={styles.imgSliderBoxColumn} >
                <div className={styles.imgSliderBox} >
                    <Slider {...settings} ref={slider => {
                        sliderRef = slider;
                    }}>
                        <div className={styles.sliderItem} >
                            <img src="/tovar2.png" className={styles.sliderItemImg} />
                        </div>
                        <div className={styles.sliderItem}>
                            <img src="/tovar2.png" className={styles.sliderItemImg} />
                        </div>
                        <div className={styles.sliderItem}>
                            <img src="/tovar2.png" className={styles.sliderItemImg} />
                        </div>
                        <div className={styles.sliderItem}>
                            <img src="/tovar2.png" className={styles.sliderItemImg} />
                        </div>
                    </Slider>
                </div>
                <div className={styles.lineDots} >
                    {[0, 1, 2, 3].map((x, i) => <img src='/tovar2.png' className={styles.dot} key={i} onClick={() => sliderRef.slickGoTo(x)} />)}
                </div>
            </div>
            <div className={styles.infoColumn}>
                <div className={styles.infoColumnText}>
                    <div className={styles.infoLilColumnText} >
                        <div className={styles.infoTitleLine} >
                            <p className={styles.infoTitle}>{data.name}</p>
                            <FavouriteButton idProduct={data._id} />
                        </div>
                        <p className={styles.infoSubtitle} >{data.text}</p>
                    </div>
                    <p className={styles.description}>Серьги Caramel — воплощение тренда этого года на крупные текучие украшения. Словно застывшая капля сладкого текучего лакомства. Изделие изготовлено из ювелирной латуни с покрытием из 18-каратного золота</p>
                </div>
                <div className={styles.infoButtonColumn}>
                    <p className={styles.infoCost} >{data.cost}</p>
                    <div className={styles.infoButton}>КУПИТЬ</div>
                </div>
            </div>
        </div>
        <div className={styles.charasteristicColumn}>
            <Accordion allowToggle >
                {dataCharacteristic.map((x, i) => <AccordionItem key={i} border='none' >
                    {({ isExpanded }) => (
                        <>
                            <h2>
                                <AccordionButton _hover={{}} p={0} >
                                    <div className={styles.accordionButton} >
                                        <p className={styles.accordionButtonTitle} >{x.title}</p>
                                        {isExpanded ? <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21 11.5L11 1.5L1 11.5" stroke="#140702" strokeLinecap="round" />
                                        </svg>
                                            : <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 0.5L11 10.5L21 0.5" stroke="#140702" strokeLinecap="round" />
                                            </svg>}

                                    </div>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel p={0}>
                                <p className={styles.accordionText} >{x.text}</p>
                            </AccordionPanel>
                        </>
                    )}
                </AccordionItem>)}
            </Accordion>

        </div>
    </div>
};