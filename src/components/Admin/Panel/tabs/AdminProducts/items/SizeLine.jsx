import styles from "@/styles/Admin/Products/ProductItem.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../../../../apiConfig";
import { Modal, ModalContent, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react";
import Button from "@/ui/Button/Button";
import Input from "@/ui/Inputs/Input/Input";

export default function SizeLine({ data, setData }) {

    const [sizes, setSizes] = useState({});
    const [newSize, setNewSize] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [selectDeleteSize, setSelectDeleteSize] = useState('');
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    useEffect(() => { load(); }, []);

    const load = async () => {
        await axios.get(`${API_BASE_URL}constans/product/sizes`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then((res) => { setSizes(res.data); })
            .catch((e) => console.log(e));
    };

    const handleToggleSize = (item) => {
        let updatedSizes = [...data.sizes];

        if (!updatedSizes) {
            updatedSizes = [];
        }

        const itemIndex = updatedSizes.indexOf(item);

        if (itemIndex !== -1) {
            updatedSizes.splice(itemIndex, 1);
        } else {
            updatedSizes = [...updatedSizes, item];
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
        setLoading(true);
        await axios.post(`${API_BASE_URL}constans/product/sizes/delete`, { deleteSize: selectDeleteSize, type: data.type }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then(() => {
                setIsOpenDelete(false);
                toast({ position: 'bottom-right', render: () => (<div className="toast">Успешно удалено</div>), duration: 3000 });
                load();
                setLoading(false);
            })
            .catch((e) => { console.log(e); setLoading(false); });
    };

    return <>
        <div className={styles.createLilColumn}>
            <p className={styles.subtitle}>Размер<span className={styles.createSubtitleSpan}>{data.type === 'ring' ? ', мм' : data.type === 'earrings' ? '' : ', см'}</span></p>
            {(data.type !== '' && data.type !== 'earrings')
                ? <div className={styles.sizesLine}>
                    {sizes[data.type]
                        ?.sort((a, b) => {
                            const parseValue = (value) => {
                                if (value.includes('-')) {
                                    const [min] = value.replace(',', '.').split('-').map(Number);
                                    return min;
                                }
                                return parseFloat(value.replace(',', '.'));
                            };

                            return parseValue(a) - parseValue(b);
                        })
                        .map((item, index) => (
                            <div key={index} className={styles.sizeColumn}>
                                <button
                                    className={`${styles.sizeItem} ${data.sizes?.includes(item) ? styles.sizeItemSelect : ''}`}
                                    onClick={() => handleToggleSize(item)}
                                >
                                    {item}
                                </button>
                                <button
                                    className={styles.sizeDelete}
                                    onClick={() => {
                                        setSelectDeleteSize(item);
                                        setIsOpenDelete(true);
                                    }}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
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
                        <Input
                            size="big"
                            value={newSize}
                            onChange={(e) => setNewSize(e.target.value)}
                            placeholder="Введите новый размер"
                        />
                        <Button
                            onClick={addNewSize}
                        >ДОБАВИТЬ РАЗМЕР</Button>
                    </div>
                </div>
            </ModalContent>
        </Modal>

        <Modal isOpen={isOpenDelete} onClose={() => setIsOpenDelete(false)} autoFocus={false} isCentered size='xl'>
            <ModalOverlay />
            <ModalContent bg='none'>
                <div className={styles.modal}>
                    <div className={styles.modalColumn}>
                        <p className={styles.modalTitle}>Вы уверены, что хотите удалить?</p>
                        <img src='/cross.svg' className={styles.modalCross} onClick={() => setIsOpenDelete(false)} />
                    </div>
                    <div className={styles.modalContent}>
                        <p className={styles.modalText}>Размер удалиться полностью из базы данных и из всех товаров. Если вы хотите убрать размер только из этого товара, тогда закройте это окно и просто кликните по размеру.<br /><br /> Вы хотите удалить <b>{selectDeleteSize}</b> размер</p>
                        <Button
                            disabled={loading}
                            onClick={deleteSize}
                        >УДАЛИТЬ РАЗМЕР</Button>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    </>
};