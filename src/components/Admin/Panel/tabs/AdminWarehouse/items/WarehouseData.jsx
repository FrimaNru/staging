import Input from "@/ui/Inputs/Input/Input";
import styles from "../styles.module.css";
import { useState } from "react";
import Button from "@/ui/Button/Button";
import { useRouter } from "next/navigation";
import { Modal, ModalContent, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../../apiConfig";

export default function WarehouseData({ products, load }) {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('less');
    const router = useRouter();
    const [selectedProduct, setSelectedProduct] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [updData, setUpdData] = useState({ variant: '', count: '' });
    const [disabled, setDisabled] = useState(false);
    const toast = useToast();

    const filteredProducts = products && products?.filter((item) => {
        const matchesSearch =
            item._id.toString().includes(search.toLowerCase()) ||
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.article.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    });

    const sortedProducts = products && [...filteredProducts]?.sort((a, b) => {
        if (sort === 'less') {
            return a.count - b.count;
        } else {
            return b.count - a.count;
        }
    });

    const upd = async () => {
        if (updData.variant === '') return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не выбрали тип операции</div>), duration: 3000 });
        if (updData.count === '') return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не указали количество</div>), duration: 3000 });

        try {
            setDisabled(false);
            await axios.put(`${API_BASE_URL}admin/warehouse/count-upd/${selectedProduct._id}`, { data: updData }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } });

            load();
            onClose();
            toast({ position: 'bottom-right', render: () => (<div className="toast">Количество обновлено</div>), duration: 3000 });
            setUpdData({ variant: '', count: '' });
        } catch (error) {
            console.log(error);
            if (error.status === 400) return toast({ position: 'bottom-right', render: () => (<div className="toast">Количество не может быть меньше нуля</div>), duration: 3000 });
        } finally {
            setDisabled(false);
        }
    };

    return (
        <div className={styles.card}>
            <p className={styles.subtitle}>Товары</p>
            <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Введите название, артикул или id товара"
            />
            <div className={styles.line}>
                <button
                    className={`${styles.orderCardButton} ${sort === 'less' ? styles.orderCardButtonSelect : ''}`}
                    onClick={() => setSort('less')}
                >
                    Сначала меньше
                </button>
                <button
                    className={`${styles.orderCardButton} ${sort === 'more' ? styles.orderCardButtonSelect : ''}`}
                    onClick={() => setSort('more')}
                >
                    Сначала больше
                </button>
            </div>
            <div className={styles.column}>
                <div className={styles.tableHeader}>
                    <p className={styles.tableHeaderItem}>Название</p>
                    <p className={styles.tableHeaderItemBig}>Артикул</p>
                    <p className={styles.tableHeaderItemSmall}>Кол-во</p>
                    <p className={`${styles.tableHeaderItem} ${styles.alignTextRight}`}>Действие</p>
                </div>
                {sortedProducts && sortedProducts.map((item, index) => (
                    <div className={styles.tableItem} key={index}>
                        <p className={styles.tableItemValue}>
                            <Button
                                variant="download"
                                size="small"
                                onClick={() => router.push(`/adminpanel?page=editProduct&id=${item._id}`)}
                            >
                                {item.name}
                            </Button>
                        </p>
                        <p className={styles.tableItemValueBig}>{item.article}</p>
                        <p className={styles.tableItemValueSmall}>{item.count}</p>
                        <div className={`${styles.tableItemValue} ${styles.tableItemEnd}`}>
                            <Button
                                variant="success"
                                size="small"
                                onClick={() => { setSelectedProduct(item); onOpen(); }}
                            >
                                Обновить
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isOpen} size='xl' onClose={() => { onClose(); setUpdData({ variant: '', count: '' }); }} isCentered autoFocus={false}>
                <ModalOverlay />
                <ModalContent bg='none' borderRadius='none'>
                    <div className={styles.modal}>
                        <p className={styles.title}>{selectedProduct?.name}</p>
                        <div className={styles.line}>
                            <button
                                className={`${styles.orderCardButton} ${updData.variant === 'supply' ? styles.orderCardButtonSelect : ''}`}
                                onClick={() => setUpdData({ ...updData, variant: 'supply' })}
                            >
                                Поставка
                            </button>
                            <button
                                className={`${styles.orderCardButton} ${updData.variant === 'write-downs' ? styles.orderCardButtonSelect : ''}`}
                                onClick={() => setUpdData({ ...updData, variant: 'write-downs' })}
                            >
                                Списание
                            </button>
                        </div>
                        <Input
                            value={updData.count}
                            onChange={(e) => setUpdData({ ...updData, count: e.target.value })}
                            placeholder="Введите количество"
                        />
                        <Button
                            onClick={upd}
                            disabled={disabled}
                        >Обновить</Button>
                    </div>
                </ModalContent>
            </Modal>
        </div>
    );
}