import styles from "@/styles/Admin/Products/ProductItem.module.css";
import { Menu, MenuButton, MenuList, MenuItem, Modal, ModalOverlay, useDisclosure, ModalContent, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../../../../apiConfig";

export default function ColorsLine({ data, setData }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [colors, setColors] = useState([]);
    const [newColor, setNewColor] = useState('');
    const toast = useToast();

    useEffect(() => { load(); }, []);

    const load = async () => {
        await axios.get(`${API_BASE_URL}constans/product/colors`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then((res) => { setColors(res.data); })
            .catch((e) => console.log(e));
    };

    const addNewColor = async () => {
        if (newColor !== '') {
            await axios.post(`${API_BASE_URL}constans/product/colors`, { newColor }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
                .then(() => {
                    setNewColor('');
                    load();
                    onClose();
                    toast({ position: 'bottom-right', render: () => (<div className="toast">Цвет успешно добавлен</div>), duration: 3000 });
                })
                .catch((e) => console.log(e));
        }
    };

    return <>
        <div className={styles.createLilColumn}>
            <p className={styles.createSubtitle}>Цвет</p>
            <Menu>
                <MenuButton>
                    <div className={styles.createColorButton}>
                        <p>{data.color ?? 'Выберите цвет'}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="9" viewBox="0 0 16 9" fill="none">
                            <path d="M1 0.5L8 7.5L15 0.5" stroke="#140702" strokeLinecap="round" />
                        </svg>
                    </div>
                </MenuButton>
                <MenuList boxShadow='none' border='none' p={0} bg='none'>
                    <div className={styles.createColorsPanel}>
                        {colors.map((item, i) => (
                            <MenuItem key={i} p={0} bg='none' _hover={{ bg: 'none' }}>
                                <p className={`${styles.createColorsItem} ${i === colors.length - 1 ? styles.createColorsItemLast : ''}`} onClick={() => setData({ ...data, color: item })}>{item}</p>
                            </MenuItem>
                        ))}
                    </div>
                </MenuList>
            </Menu>
            <button className={styles.buttonBlackMiddle} onClick={onOpen} >Добавить новый цвет</button>
        </div>
        <Modal isOpen={isOpen} onClose={() => { onClose(); setNewColor(''); }} isCentered autoFocus={false} size='lg'>
            <ModalOverlay />
            <ModalContent>
                <div className={styles.modal}>
                    <div className={styles.modalColumn}>
                        <p className={styles.modalTitle}>ДОБАВИТЬ НОВЫЙ ЦВЕТ</p>
                        <img src='/cross.svg' className={styles.modalCross} onClick={onClose} />
                    </div>
                    <div className={styles.modalContent}>
                        <input className={styles.modalInput} value={newColor} type="text" onChange={(e) => setNewColor(e.target.value)} />
                        <button className={styles.modalButton} onClick={addNewColor}>ДОБАВИТЬ ЦВЕТ</button>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    </>
};