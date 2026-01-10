import { Modal, ModalContent, ModalOverlay, useToast } from "@chakra-ui/react";
import styles from "../styles.module.css";
import Input from "@/ui/Inputs/Input/Input";
import { useState, useEffect } from "react";
import Button from "@/ui/Button/Button";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../../apiConfig";

export default function PromocodesCreateModal({ isOpen, setIsOpen, load, editingItem }) {

    const [data, setData] = useState({ 
        title: '', 
        type: 'fix', 
        value: '', 
        available: '', 
        date_off: '', 
        name: '' 
    });
    const toast = useToast();
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (editingItem) {
            setData({
                title: editingItem.title || '',
                type: editingItem.type || 'fix',
                value: editingItem.value || '',
                available: editingItem.available || '',
                date_off: editingItem.date_off ? new Date(editingItem.date_off).toISOString().split('T')[0] : '',
                name: editingItem.name || ''
            });
        } else {
            setData({ 
                title: '', 
                type: 'fix', 
                value: '', 
                available: '', 
                date_off: '', 
                name: '' 
            });
        }
    }, [editingItem, isOpen]);

    const savePromocode = async () => {
        if (!data.title || !data.value || !data.date_off) {
            return toast({ 
                position: 'bottom-right', 
                render: () => (<div className="toast">Заполните все обязательные поля</div>), 
                duration: 3000 
            });
        }

        try {
            setDisabled(true);
            const payload = {
                title: data.title,
                type: data.type,
                value: Number(data.value),
                available: data.available ? Number(data.available) : 0,
                date_off: new Date(data.date_off).toISOString(),
                name: data.name || ''
            };

            if (editingItem) {
                await axios.put(`${API_BASE_URL}admin/promocodes/${editingItem._id}`, payload, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` }
                });
                toast({ 
                    position: 'bottom-right', 
                    render: () => (<div className="toast">Промокод успешно обновлен</div>), 
                    duration: 3000 
                });
            } else {
                // Пробуем стандартный REST путь (POST на коллекцию)
                await axios.post(`${API_BASE_URL}admin/promocodes`, payload, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` }
                });
                toast({ 
                    position: 'bottom-right', 
                    render: () => (<div className="toast">Промокод успешно создан</div>), 
                    duration: 3000 
                });
            }

            setIsOpen(false);
            load();
            setData({ 
                title: '', 
                type: 'fix', 
                value: '', 
                available: '', 
                date_off: '', 
                name: '' 
            });
        } catch (error) {
            console.log(error);
            toast({ 
                position: 'bottom-right', 
                render: () => (<div className="toast">Ошибка при сохранении промокода</div>), 
                duration: 3000 
            });
        } finally {
            setDisabled(false);
        }
    };

    return <Modal size='xl' isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered autoFocus={false}>
        <ModalOverlay />
        <ModalContent bg='none'>
            <div className={styles.modal}>
                <p className={styles.title}>{editingItem ? 'Редактировать промокод' : 'Новый промокод'}</p>
                
                <Input
                    placeholder="Промокод (например, SALES)"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value.toUpperCase() })}
                />
                
                <Input
                    placeholder="Локальное имя (необязательно)"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                />
                
                <div className={styles.modalButtonLine}>
                    <button
                        className={`${styles.modalButton} ${data.type === 'fix' ? styles.modalButtonSelect : ''}`}
                        onClick={() => setData({ ...data, type: 'fix' })}
                    >Фиксированная сумма</button>
                    <button
                        className={`${styles.modalButton} ${data.type === 'procent' ? styles.modalButtonSelect : ''}`}
                        onClick={() => setData({ ...data, type: 'procent' })}
                    >Процент</button>
                </div>
                
                <Input
                    type="number"
                    placeholder={data.type === 'fix' ? 'Сумма скидки (руб.)' : 'Процент скидки'}
                    value={data.value}
                    onChange={(e) => setData({ ...data, value: e.target.value })}
                />
                
                <Input
                    type="number"
                    placeholder="Минимальная сумма заказа (руб., 0 = любая)"
                    value={data.available}
                    onChange={(e) => setData({ ...data, available: e.target.value })}
                />
                
                <Input
                    type="date"
                    placeholder="Дата окончания действия"
                    value={data.date_off}
                    onChange={(e) => setData({ ...data, date_off: e.target.value })}
                />
                
                <Button
                    disabled={!data.title || !data.value || !data.date_off || disabled}
                    onClick={savePromocode}
                >{editingItem ? 'Сохранить' : 'Создать'}</Button>
            </div>
        </ModalContent>
    </Modal>
};

