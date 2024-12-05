import { contestAdvertisement } from "@/constans/contestAdvertisеment";
import { contestPersonalData } from "@/constans/contestPersonalData";
import { policyText } from "@/constans/policyText";
import styles from "@/styles/Common.module.css";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";

export default function DocumentsModal({ policy, setPolicy, personal, setPersonal, news, setNews }) {
    return <>
        {policy && <Modal isOpen={policy} onClose={() => setPolicy(false)} size='6xl' autoFocus={false}>
            <ModalOverlay />
            <ModalContent p={0} borderRadius={0}>
                <div className={styles.documentsModal}>
                    <div className={styles.documentsModalLine}>
                        <p className={styles.documentsModalTitle}>Политика конфиденциальности</p>
                        <img src="/cross.svg" onClick={() => setPolicy(false)} style={{ cursor: 'pointer' }} />
                    </div>
                    {policyText.map((item, index) => <div key={index} className={styles.documentsModalItem}>
                        <p className={styles.documentsModalTitle}>{index + 1}. {item.title}</p>
                        <div className={styles.documentsModalColumn}>
                            {item.paragraphs.map((par, y) => <div key={y} dangerouslySetInnerHTML={{ __html: par }} className={styles.documentsModalParagraph} />)}
                        </div>
                    </div>)}
                </div>
            </ModalContent>
        </Modal>}
        {personal && <Modal isOpen={personal} onClose={() => setPersonal(false)} size='6xl' autoFocus={false}>
            <ModalOverlay />
            <ModalContent p={0} borderRadius={0}>
                <div className={styles.documentsModal}>
                    <div className={styles.documentsModalLine}>
                        <p className={styles.documentsModalTitle}>Согласие на обработку персональных данных</p>
                        <img src="/cross.svg" onClick={() => setPersonal(false)} style={{ cursor: 'pointer' }} />
                    </div>
                    <div className={styles.documentsModalColumn}>
                        {contestPersonalData.map((item, index) => <div key={index} className={styles.documentsModalItem}>
                            <div dangerouslySetInnerHTML={{ __html: item }} className={styles.documentsModalParagraph} />
                        </div>)}
                    </div>
                </div>
            </ModalContent>
        </Modal>}
        {news && <Modal isOpen={news} onClose={() => setNews(false)} size='6xl' autoFocus={false}>
            <ModalOverlay />
            <ModalContent p={0} borderRadius={0}>
                <div className={styles.documentsModal}>
                    <div className={styles.documentsModalLine}>
                        <p className={styles.documentsModalTitle}>Согласие на получение рекламных и информационных 
                        сообщений</p>
                        <img src="/cross.svg" onClick={() => setNews(false)} style={{ cursor: 'pointer' }} />
                    </div>
                    <div className={styles.documentsModalColumn}>
                        {contestAdvertisement.map((item, index) => <div key={index} className={styles.documentsModalItem}>
                            <div dangerouslySetInnerHTML={{ __html: item }} className={styles.documentsModalParagraph} />
                        </div>)}
                    </div>
                </div>
            </ModalContent>
        </Modal>}
    </>
};