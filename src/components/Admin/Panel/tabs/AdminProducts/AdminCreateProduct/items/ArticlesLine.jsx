import styles from "@/styles/Admin/Products/ProductItem.module.css";
import { Modal, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

export default function ArtcilesLine({ data, setData, activeArticleNumber, setActiveArticleNumber }) {

    const { onOpen, isOpen, onClose } = useDisclosure();
    const [article, setArticle] = useState('');

    return <>
        <div className={styles.createArticlesLineBox}>
            <div className={styles.createArticlesLine}>
                {data.articles.map((item, index) => <button key={index} className={`${styles.articleItem} ${activeArticleNumber === index ? styles.articleItemSelect : ''}`} onClick={() => setActiveArticleNumber(index)} >{item.toUpperCase()}</button>)}
                <button className={styles.lilBlackButton} onClick={onOpen}>ДОБАВИТЬ АРТИКУЛ</button>
            </div>
        </div>
        <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} isCentered size='lg'>
            <ModalOverlay />
            <ModalContent bg={0} p={0}>
                <div className={styles.modal}>
                    <div className={styles.modalColumn}>
                        <p className={styles.modalTitle}>ДОБАВИТЬ АРТИКУЛ</p>
                        <img src='/cross.svg' className={styles.modalCross} onClick={onClose} />
                    </div>
                    <div className={styles.modalContent}>
                        <input className={styles.modalInput} value={article} onChange={(e) => setArticle(e.target.value)} />
                        <button className={styles.modalButton} onClick={() => {
                            if (article === '') return;
                            setData({ ...data, articles: [...data.articles, article] });
                            onClose();
                            setArticle('');
                        }} >ДОБАВИТЬ АРТИКУЛ</button>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    </>
};