import { Modal, ModalContent, ModalOverlay, useToast } from "@chakra-ui/react";
import styles from "../styles.module.css";
import Input from "@/ui/Inputs/Input/Input";
import CircleCheckBox from "@/ui/CircleCheckbox/CircleCheckbox";
import { useState } from "react";
import Button from "@/ui/Button/Button";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../../apiConfig";

export default function MessagesCreateModal({ isOpen, setIsOpen, load }) {

    const [data, setData] = useState({ type: 'Email', title: '', text: '', confirm: false, localName: '' });
    const toast = useToast();
    const [disabled, setDisabled] = useState(false);

    const createMessage = async () => {
        if (data.type === 'Email' && data.title === '') return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не указали тему письма</div>), duration: 3000 });
        try {
            setDisabled(true);

            await axios.post(`${API_BASE_URL}admin/messages/create`, { text: data.text, title: data.title, type: data.type, localName: data.localName }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });

            setIsOpen(false);
            load();
            toast({ position: 'bottom-right', render: () => (<div className="toast">Рассылка успешно отправлена</div>), duration: 3000 });
            setData({ text: '', title: '', type: 'Email', confirm: false, localName: '' });
        } catch (error) {
            console.log(error);
            
            if (error.status === 400) return toast({ position: 'bottom-right', render: () => (<div className="toast">Пользователи для рассылки не найдены</div>), duration: 3000 });
        } finally {
            setDisabled(false);
        }
    };

    return <Modal size='xl' isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered autoFocus={false}>
        <ModalOverlay />
        <ModalContent bg='none'>
            <div className={styles.modal}>
                <p className={styles.title}>Новая рассылка</p>
                <Input
                    placeholder="Введите локальное имя"
                    value={data.localName}
                    onChange={(e) => setData({ ...data, localName: e.target.value })}
                />
                <div className={styles.modalButtonLine}>
                    <button
                        className={`${styles.modalButton} ${data.type === 'Email' ? styles.modalButtonSelect : ''}`}
                        onClick={() => setData({ ...data, type: 'Email' })}
                    >На почту</button>
                    <button
                        className={`${styles.modalButton} ${data.type === 'Phone' ? styles.modalButtonSelect : ''}`}
                        onClick={() => setData({ ...data, type: 'Phone' })}
                    >В СМС</button>
                </div>
                {data.type === 'Email'
                    && <Input
                        placeholder="Введите тему письма"
                        value={data.title}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                    />}
                <textarea
                    placeholder="Введите текст рассылки"
                    className={styles.modalTextarea}
                    value={data.text}
                    onChange={(e) => setData({ ...data, text: e.target.value })}
                />
                <div className={styles.modalLine}>
                    <CircleCheckBox active={data.confirm} onClick={() => setData({ ...data, confirm: !data.confirm })} />
                    <p className={styles.modalText}>Я подтверждаю, что проверил корректность текста, а также его орфографию и пунктуацию</p>
                </div>
                <Button
                    disabled={!data.confirm || data.text === '' || disabled}
                    onClick={createMessage}
                >Отправить</Button>
            </div>
        </ModalContent>
    </Modal>
};