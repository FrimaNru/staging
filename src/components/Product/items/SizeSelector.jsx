import styles from "@/styles/Product/Product.module.css";
import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react'
import { ringSizes, textSizeBracelets, textSizeNecklace, textSizeRings } from "@/constants/constants.text";

export default function SizeSelector({ data, activeCount, sizeOfProduct, setSizeOfProduct }) {

    const [isOpenModalSize, setIsOpenModalSize] = useState(false);
    const [millimeters, setMillimeters] = useState('');
    const [buttonText, setButtonText] = useState('Рассчитать');

    const handleInputChange = (e) => {
        const value = e.target.value;

        if (value === '' || (/^\d{1,2}$/.test(value) && Number(value) <= 99)) {
            setMillimeters(value);
            setButtonText('Рассчитать');
        }
    };

    const handleCalculateClick = () => {
        const size = getRingSize(Number(millimeters));
        if (size !== null) {
            setButtonText(`Ваш размер: ${size}`);
        } else {
            setButtonText('Не существует');
        }
    };

    function getRingSize(mm) {
        const sizeObj = ringSizes.find(
            ({ minCircumference, maxCircumference }) =>
                mm >= minCircumference && mm <= maxCircumference
        );
        return sizeObj ? sizeObj.size : null;
    };

    return <>
        {(data.type === 'ring' || data.type === 'necklace' || data.type === 'bracelets') && <div className={styles.sizeColumn}>
            <p className={styles.sizeTitle}>Размер, <span className={styles.sizeTitleMM}>{data.type === 'ring' ? 'мм' : 'см'}</span></p>
            <div className={styles.sizeLine}>
                {data.sizes.length > 0 &&
                    data.sizes?.sort((a, b) => {
                        const numA = parseFloat(String(a).replace(',', '.'));
                        const numB = parseFloat(String(b).replace(',', '.'));
                        return numA - numB;
                    })?.map((item, index) => (
                        <button
                            key={index}
                            className={`${styles.sizeItem} ${item === sizeOfProduct ? styles.sizeItemSelect : ''}`}
                            onClick={() => setSizeOfProduct(item)}
                        >
                            {item}
                        </button>
                    ))}
            </div>
            <button className={styles.sizeButton} onClick={() => setIsOpenModalSize(true)}>Как определить размер?</button>
        </div>}
        <Modal isOpen={isOpenModalSize} size='xl' onClose={() => {
            setIsOpenModalSize(false); setMillimeters(''); setButtonText('Рассчитать');
        }} isCentered autoFocus={false}>
            <ModalOverlay />
            <ModalContent bg='none' boxShadow='none'>
                <ModalBody p={0}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalHeaderLine}>
                                <p className={styles.modalHeaderTitleSize}>КАК ОПРЕДЕЛИТЬ РАЗМЕР?</p>
                                <img src='/cross.svg' className={styles.modalHeaderCross} onClick={() => setIsOpenModalSize(false)} />
                                <img src='/crossMobile.svg' className={styles.modalHeaderCrossMobile} onClick={() => setIsOpenModalSize(false)} />
                            </div>
                            <hr className={styles.modalHeaderHr} />
                        </div>
                        <div className={styles.modalBodySize}>
                            {data.type === 'ring'
                                ? <>
                                    {textSizeRings.map((x, i) => <div key={i} className={styles.modalSizeLine}>
                                        <img src={x.img} className={styles.modalSizeIcon} />
                                        <p className={styles.modalSizeText}>{x.text}</p>
                                    </div>)}
                                    <div className={`${styles.modalSizeLine} ${styles.modalSizeLineMobile}`}>
                                        <input
                                            type="text"
                                            value={millimeters}
                                            onChange={handleInputChange}
                                            placeholder="Введите мм"
                                            className={styles.modalSizeInput}
                                        />
                                        <button onClick={handleCalculateClick} className={styles.modalSizeButton}>{buttonText}</button>
                                    </div>
                                </>
                                : data.type === 'necklace'
                                    ? <>
                                        {textSizeNecklace.map((x, i) => <div key={i} className={styles.modalSizeLine}>
                                            <img src={x.img} className={styles.modalSizeIcon} />
                                            <p className={styles.modalSizeText}>{x.text}</p>
                                        </div>)}
                                    </>
                                    : <>
                                        {textSizeBracelets.map((x, i) => <div key={i} className={styles.modalSizeLine}>
                                            <img src={x.img} className={styles.modalSizeIcon} />
                                            <p className={styles.modalSizeText}>{x.text}</p>
                                        </div>)}
                                    </>}
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
};