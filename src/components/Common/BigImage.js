import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import styles from "@/styles/Product.module.css";
import Slider from "react-slick";
import { useRef } from "react";

export function BigImage({ data, onOpen, onClose, isOpen }) {

    let sliderRef = useRef(null);

    const SampleNextArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <>
                <div className={`${className}`} style={{ display: 'none' }} >
                </div>
                <svg onClick={onClick} className={styles.bigImageNextArrow} width="23" height="36" viewBox="0 0 23 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 33L18.5 18L3.5 3" stroke="#FDEDBF" strokeWidth="6" strokeLinecap="round" />
                </svg>
            </>
        );
    };

    const SamplePrevArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <>
                <div className={`${className}`} style={{ display: 'none' }} >
                </div>
                <svg onClick={onClick} className={styles.bigImagePrevArrow} width="23" height="36" viewBox="0 0 23 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.5 3L4.5 18L19.5 33" stroke="#FDEDBF" strokeWidth="6" strokeLinecap="round" />
                </svg>
            </>
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


    return <>
        <Modal size='full' isOpen={isOpen} onClose={onClose} autoFocus={false} >
            <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
            <ModalContent bg='none' boxShadow='none'>
                <div className={styles.bigImageBox} >
                    <img src='/crossGold.svg' className={styles.bigImageCross} onClick={onClose} />
                    <div className={styles.bigSliderBox} >
                        <Slider {...settings} ref={slider => { sliderRef = slider; }}>
                            <div className={styles.bigImageSliderItem}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }} >
                                    <img src={`https://api.mi-alegria.shop/uploads/${data}`} className={styles.bigImage} />
                                </div>
                            </div>
                            <div className={styles.bigImageSliderItem} >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }} >
                                    <img src={`https://api.mi-alegria.shop/uploads/${data}`} className={styles.bigImage} />
                                </div>
                            </div>
                            <div className={styles.bigImageSliderItem} >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }} >
                                    <img src={`https://api.mi-alegria.shop/uploads/${data}`} className={styles.bigImage} />
                                </div>
                            </div>
                            <div className={styles.bigImageSliderItem} >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }} >
                                    <img src={`https://api.mi-alegria.shop/uploads/${data}`} className={styles.bigImage} />
                                </div>
                            </div>
                        </Slider>
                    </div>
                    <div className={styles.lineDots} >
                        {[0, 1, 2, 3].map((x, i) => <img src={`https://api.mi-alegria.shop/uploads/${data}`} className={styles.dot} key={i} onClick={() => sliderRef.slickGoTo(x)} />)}
                    </div>
                </div>
            </ModalContent>
        </Modal>
    </>
}