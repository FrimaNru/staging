import styles from "@/styles/Admin/Products/ProductItem.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../../../../apiConfig";
import { Modal, ModalContent, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react";

export default function SizeLine({ data, setData, activeArticleNumber }) {

    const [sizes, setSizes] = useState({});
    const [newSize, setNewSize] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [selectDeleteSize, setSelectDeleteSize] = useState('');
    const toast = useToast();

    useEffect(() => { load(); }, []);

    const load = async () => {
        await axios.get(`${API_BASE_URL}constans/product/sizes`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then((res) => { setSizes(res.data); })
            .catch((e) => console.log(e));
    };

    const handleToggleSize = (item) => {
        const updatedSizes = [...data.sizes];

        if (!updatedSizes[activeArticleNumber]) {
            updatedSizes[activeArticleNumber] = [];
        }

        const itemIndex = updatedSizes[activeArticleNumber].indexOf(item);

        if (itemIndex !== -1) {
            updatedSizes[activeArticleNumber].splice(itemIndex, 1);
        } else {
            updatedSizes[activeArticleNumber] = [...updatedSizes[activeArticleNumber], item];
        }

        setData({ ...data, sizes: updatedSizes });
    };

    const addNewSize = async () => {
        if (newSize !== '') {
            await axios.post(`${API_BASE_URL}/constans/product/sizes`, { newSize, type: data.type }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
                .then(() => {
                    onClose();
                    setNewSize('');
                    load();
                    toast({ position: 'bottom-right', render: () => (<div className="toast">Размер успешно добавлен</div>), duration: 3000 });
                })
                .catch((e) => console.log(e));
        } else {
            if (newSize === '') return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не ввели размер</div>), duration: 3000 });
        }
    };

    const deleteSize = async () => {
        await axios.post(`${API_BASE_URL}constans/product/sizes/delete`, { deleteSize: selectDeleteSize, type: data.type }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then(() => {
                setIsOpenDelete(false);
                toast({ position: 'bottom-right', render: () => (<div className="toast">Успешно удалено</div>), duration: 3000 });
                load();
            })
            .catch((e) => console.log(e));
    };

    return <>
        <div className={styles.createLilColumn}>
            <p className={styles.createSubtitle}>Размер, <span className={styles.createSubtitleSpan}>мм</span></p>
            {(data.type !== '' && data.type !== 'earrings')
                ? <div className={styles.sizesLine}>
                    {sizes[data.type].map((item, index) => <div key={index} className={styles.sizeColumn}>
                        <button className={`${styles.sizeItem} ${data.sizes[activeArticleNumber]?.includes(item) ? styles.sizeItemSelect : ''}`} onClick={() => handleToggleSize(item)}>{item}</button>
                        <button className={styles.sizeDelete} onClick={() => { setSelectDeleteSize(item); setIsOpenDelete(true); }} >Удалить</button>
                    </div>)}
                    <button className={styles.sizeItem} onClick={onOpen}>
                        <img src='/plus.svg' className={styles.sizeItemIcon} />
                    </button>
                </div>
                : data.type === 'earrings'
                    ? <p className={styles.noArticlesText}>Для серьг не нужно указывать размер</p>
                    : <p className={styles.noArticlesText}>Выберите тип изделия перед указанием размеров</p>}
        </div>
        <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} isCentered size='lg'>
            <ModalOverlay />
            <ModalContent>
                <div className={styles.modal}>
                    <div className={styles.modalColumn}>
                        <p className={styles.modalTitle}>ДОБАВИТЬ РАЗМЕР</p>
                        <img src='/cross.svg' className={styles.modalCross} onClick={onClose} />
                    </div>
                    <div className={styles.modalContent}>
                        <input className={styles.modalInput} value={newSize} type="number" onChange={(e) => setNewSize(e.target.value)} />
                        <button className={styles.modalButton} onClick={addNewSize}>ДОБАВИТЬ РАЗМЕР</button>
                    </div>
                </div>
            </ModalContent>
        </Modal>

        <Modal isOpen={isOpenDelete} onClose={() => setIsOpenDelete(false)} autoFocus={false} isCentered size='lg'>
            <ModalOverlay />
            <ModalContent>
                <div className={styles.modal}>
                    <div className={styles.modalColumn}>
                        <p className={styles.modalTitle}>Вы уверены, что хотите удалить?</p>
                        <img src='/cross.svg' className={styles.modalCross} onClick={() => setIsOpenDelete(false)} />
                    </div>
                    <div className={styles.modalContent}>
                        <p className={styles.modalText}>Вы хотите удалить {selectDeleteSize} размер</p>
                        <button className={styles.modalButton} onClick={deleteSize}>УДАЛИТЬ РАЗМЕР</button>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    </>
};