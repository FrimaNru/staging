import styles from "@/styles/Admin/Products/ProductItem.module.css";
import { Modal, ModalOverlay, useDisclosure, ModalContent, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../../../../apiConfig";
import Button from "@/ui/Button/Button";
import CustomMenu from "@/components/Common/Menu/Menu";
import Input from "@/ui/Inputs/Input/Input";

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
            <div className={styles.fullLine}>
                <p className={styles.subtitle}>Цвет</p>
                <Button
                    size="small"
                    variant="success"
                    onClick={onOpen}
                >Добавить новый цвет</Button>
            </div>
            <CustomMenu
                title={data.color ?? 'Выберите цвет'}
                items={colors}
                setState={(item) => setData({ ...data, color: item })}
            />
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
                        <Input
                            value={newColor}
                            type="text"
                            size="big"
                            placeholder="Введите новый цвет"
                            onChange={(e) => setNewColor(e.target.value)} />
                        <Button onClick={addNewColor}>ДОБАВИТЬ ЦВЕТ</Button>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    </>
};