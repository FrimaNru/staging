import { Modal, ModalContent, ModalOverlay, useToast } from "@chakra-ui/react";
import styles from "../styles.module.css";
import Input from "@/ui/Inputs/Input/Input";
import { useState, useEffect, useRef } from "react";
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
    const dateInputRef = useRef(null);
    const [isDateInputFocused, setIsDateInputFocused] = useState(false);

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

        // Проверка корректности значения в зависимости от типа
        const numValue = Number(data.value);
        if (data.type === 'procent' && (numValue < 0 || numValue > 100)) {
            return toast({ 
                position: 'bottom-right', 
                render: () => (<div className="toast">Процент скидки должен быть от 0 до 100</div>), 
                duration: 3000 
            });
        }
        if (data.type === 'fix' && (numValue < 0 || numValue > 100000)) {
            return toast({ 
                position: 'bottom-right', 
                render: () => (<div className="toast">Сумма скидки должна быть от 0 до 100000 руб.</div>), 
                duration: 3000 
            });
        }

        // Проверка даты - не может быть раньше текущего дня
        const selectedDate = new Date(data.date_off);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Сбрасываем время для корректного сравнения дат
        
        if (selectedDate < today) {
            return toast({ 
                position: 'bottom-right', 
                render: () => (<div className="toast">Дата окончания не может быть раньше текущего дня</div>), 
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
                        onClick={() => {
                            const currentValue = Number(data.value);
                            // Если переключаемся на фиксированную сумму и значение больше 100000, сбрасываем
                            const newValue = currentValue > 100000 ? '' : data.value;
                            setData({ ...data, type: 'fix', value: newValue });
                        }}
                    >Фиксированная сумма</button>
                    <button
                        className={`${styles.modalButton} ${data.type === 'procent' ? styles.modalButtonSelect : ''}`}
                        onClick={() => {
                            const currentValue = Number(data.value);
                            // Если переключаемся на процент и значение больше 100, сбрасываем
                            const newValue = currentValue > 100 ? '' : data.value;
                            setData({ ...data, type: 'procent', value: newValue });
                        }}
                    >Процент</button>
                </div>
                
                <Input
                    type="number"
                    placeholder={data.type === 'fix' ? 'Сумма скидки (руб.)' : 'Процент скидки'}
                    value={data.value}
                    onChange={(e) => {
                        const inputValue = e.target.value;
                        if (inputValue === '') {
                            setData({ ...data, value: '' });
                            return;
                        }
                        
                        const numValue = Number(inputValue);
                        
                        if (data.type === 'procent') {
                            // Для процента: от 0 до 100
                            if (numValue >= 0 && numValue <= 100) {
                                setData({ ...data, value: inputValue });
                            }
                        } else {
                            // Для фиксированной суммы: от 0 до 100000
                            if (numValue >= 0 && numValue <= 100000) {
                                setData({ ...data, value: inputValue });
                            }
                        }
                    }}
                />
                
                <Input
                    type="number"
                    placeholder="Минимальная сумма заказа (руб., 0 = любая)"
                    value={data.available}
                    onChange={(e) => setData({ ...data, available: e.target.value })}
                />
                
                <div 
                    className={styles.dateInputWrapper} 
                    onClick={(e) => {
                        e.preventDefault();
                        setIsDateInputFocused(true);
                        if (dateInputRef.current) {
                            dateInputRef.current.showPicker?.();
                            dateInputRef.current.focus();
                            dateInputRef.current.click();
                        }
                    }}
                >
                    <input
                        ref={dateInputRef}
                        type="date"
                        lang="ru"
                        className={styles.dateInput}
                        value={data.date_off}
                        min={new Date().toISOString().split('T')[0]}
                        data-has-value={data.date_off ? "true" : "false"}
                        onChange={(e) => setData({ ...data, date_off: e.target.value })}
                        onFocus={() => setIsDateInputFocused(true)}
                        onBlur={() => setIsDateInputFocused(false)}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDateInputFocused(true);
                            if (dateInputRef.current) {
                                dateInputRef.current.showPicker?.();
                            }
                        }}
                    />
                    {!data.date_off && !isDateInputFocused && (
                        <span className={styles.dateInputPlaceholder}>
                            Действует до
                        </span>
                    )}
                </div>
                
                <Button
                    disabled={!data.title || !data.value || !data.date_off || disabled}
                    onClick={savePromocode}
                >{editingItem ? 'Сохранить' : 'Создать'}</Button>
            </div>
        </ModalContent>
    </Modal>
};

