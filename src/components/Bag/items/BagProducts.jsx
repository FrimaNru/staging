import { useCart } from "@/contexts/CartContext";
import styles from "../styles.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiConfig";
import { useEffect, useState } from "react";
import { useDisclosure, useToast, Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { formatNumber, roundToHundreds } from "@/lib/Formatting";
import { useProducts } from "@/contexts/ProductsContext";
import { PRODUCT_TYPES } from "@/constants/items";
import { AuthModal } from "@/components/Header/items/AuthModal";

export default function BagProducts({ load, total, setTotal, promocode, setPromocode, setDiscount }) {

    const { cart } = useCart();

    // Отладка
    const itemCounts = cart.reduce((acc, item) => {
        const key = JSON.stringify({ id: item.id, size: item.size, color: item.color, article: item.article });
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    if (cart.length === 0) {
        return null;
    }

    const entries = Object.entries(itemCounts);
    
    if (entries.length === 0) {
        return null;
    }

    return entries
        .map(([key, count], i) => {
            const item = JSON.parse(key);
            return (
                <div key={i} className={styles.itemColumn}>
                    <ProductItem 
                        item={item} 
                        count={count} 
                        setTotal={setTotal} 
                        total={total}
                        load={load}
                        promocode={promocode}
                        setPromocode={setPromocode}
                        setDiscount={setDiscount}
                    />
                    <hr className={styles.hr} />
                </div>
            );
        })
};

function ProductItem({ item, count, load, promocode, setPromocode, setDiscount, total }) {

    const [data, setDataProduct] = useState({});
    const { products } = useProducts();
    const toast = useToast();
    const { removeFromCart, addToCart, cart } = useCart();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isWarningOpen, onOpen: onWarningOpen, onClose: onWarningClose } = useDisclosure();
    const [pendingAction, setPendingAction] = useState(null); // 'delete' или 'minus'

    useEffect(() => {
        const productData = products.filter(product => product._id === item.id)[0];
        if (productData) {
            setDataProduct(productData);
        } else {
            // Если товар не найден в products, загружаем его через API
            axios.post(`${API_BASE_URL}getOneProduct`, { id: item.id })
                .then(res => {
                    setDataProduct(res.data);
                })
                .catch(error => {
                    console.error(`Ошибка при получении товара с ID ${item.id}:`, error);
                });
        }
    }, [products, item.id]);

    const makePostRequest = async (url, data, headers = {}) => {
        try {
            const response = await axios.post(url, data, {
                headers,
                timeout: 5000
            });
            return response.data;
        } catch (error) {
            console.error(`Ошибка при запросе к ${url}:`, error.message || error);
            throw error;
        }
    };

    // Проверка, будет ли сумма достаточной для промокода после удаления/уменьшения
    const checkPromocodeAfterAction = async (action) => {
        if (!promocode) return true; // Если промокод не применен, действие разрешено

        // Получаем цену товара, если данные еще не загружены - делаем запрос
        // Используем округленную цену, как в каталоге
        let itemPrice = roundToHundreds(Number(data?.saleCost || data?.cost || 0));
        if (!itemPrice) {
            try {
                const response = await axios.post(`${API_BASE_URL}getOneProduct`, { id: item.id });
                const price = Number(response.data.saleCost || response.data.cost || 0);
                itemPrice = roundToHundreds(price);
            } catch (error) {
                console.error("Ошибка при получении цены товара:", error);
                return true; // Если не удалось получить цену, разрешаем действие
            }
        }

        let newTotal = Number(total) || 0;

        if (action === 'delete') {
            // Удаляем все экземпляры товара
            const itemCount = cart.filter(p => 
                p.id === item.id && 
                p.size === item.size && 
                p.color === item.color && 
                p.article === item.article
            ).length;
            newTotal = newTotal - (itemPrice * itemCount);
        } else if (action === 'minus') {
            // Удаляем один экземпляр товара
            newTotal = newTotal - itemPrice;
        }

        const availableMin = Number(promocode.available) || 0;
        return newTotal >= availableMin;
    };

    const handleDeleteClick = async () => {
        // Проверяем промокод перед удалением (работает и без авторизации)
        if (promocode) {
            const willBeValid = await checkPromocodeAfterAction('delete');
            if (!willBeValid) {
                setPendingAction('delete');
                onWarningOpen();
                return;
            }
        }

        await executeDelete();
    };

    const executeDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            // Удаляем из локальной корзины с учетом всех параметров
            removeFromCart(item.id, 'all', item.size, item.color, item.article);

            // Отправляем на сервер только если пользователь авторизован
            if (token) {
                try {
                    const url = `${API_BASE_URL}deleteProductFromBag`;
                    await makePostRequest(url, { id: item.id, size: item.size, color: item.color, article: item.article }, {
                        Authorization: `Bearer ${token}`
                    });
                } catch (serverError) {
                    // Если ошибка на сервере, но товар уже удален из локальной корзины,
                    // просто логируем ошибку, но не прерываем выполнение
                    console.error("Ошибка при синхронизации с сервером:", serverError.message || serverError);
                }
            }

            // Проверяем, остался ли промокод валидным после удаления товара
            if (promocode) {
                // Пересчитываем сумму после удаления товара
                const itemCount = cart.filter(p => 
                    p.id === item.id && 
                    p.size === item.size && 
                    p.color === item.color && 
                    p.article === item.article
                ).length;
                const itemPrice = roundToHundreds(Number(data?.saleCost || data?.cost || 0));
                const newTotal = (Number(total) || 0) - (itemPrice * itemCount);
                const availableMin = Number(promocode.available) || 0;
                
                // Если сумма стала меньше минимальной для промокода - очищаем его
                if (availableMin > 0 && newTotal < availableMin) {
                    setPromocode(null);
                    setDiscount(0);
                }
                // Если промокод остался валидным, оставляем его как есть
            }

            toast({
                position: 'bottom-right',
                render: () => (<div className="toast">Товар успешно удален</div>),
                duration: 3000
            });
            
            // load() будет вызван автоматически через useEffect при изменении cart.length или promocode
        } catch (error) {
            // Эта ошибка может возникнуть только при проблемах с локальной корзиной
            console.error("Ошибка при удалении продукта:", error.message || error);
        }
    };

    const deleteProduct = async () => {
        await handleDeleteClick();
    };

    const plusProduct = async () => {
        const token = localStorage.getItem('token');
        try {
            // Добавляем в локальную корзину
            addToCart({ id: item.id, size: item.size, color: item.color, article: item.article });

            // Отправляем на сервер только если пользователь авторизован
            if (token) {
                try {
                    const url = `${API_BASE_URL}plusProductToBag`;
                    await makePostRequest(url, { id: item.id, size: item.size, color: item.color, article: item.article }, {
                        Authorization: `Bearer ${token}`
                    });
                } catch (serverError) {
                    // Если ошибка на сервере, но товар уже добавлен в локальную корзину,
                    // просто логируем ошибку, но не прерываем выполнение
                    console.error("Ошибка при синхронизации с сервером:", serverError.message || serverError);
                }
            }

            // load() будет вызван автоматически через useEffect при изменении cart.length
        } catch (error) {
            // Эта ошибка может возникнуть только при проблемах с локальной корзиной
            console.error("Ошибка при увеличении количества продукта:", error.message || error);
        }
    };

    const handleMinusClick = async () => {
        // Проверяем промокод перед уменьшением (работает и без авторизации)
        if (promocode) {
            const willBeValid = await checkPromocodeAfterAction('minus');
            if (!willBeValid) {
                setPendingAction('minus');
                onWarningOpen();
                return;
            }
        }

        await executeMinus();
    };

    const executeMinus = async () => {
        const token = localStorage.getItem('token');
        try {
            // Удаляем из локальной корзины с учетом всех параметров
            removeFromCart(item.id, 'one', item.size, item.color, item.article);

            // Отправляем на сервер только если пользователь авторизован
            if (token) {
                try {
                    const url = `${API_BASE_URL}minusProductFromBag`;
                    await makePostRequest(url, { id: item.id, size: item.size, color: item.color, article: item.article }, {
                        Authorization: `Bearer ${token}`
                    });
                } catch (serverError) {
                    // Если ошибка на сервере, но товар уже удален из локальной корзины,
                    // просто логируем ошибку, но не прерываем выполнение
                    console.error("Ошибка при синхронизации с сервером:", serverError.message || serverError);
                }
            }

            // Проверяем, остался ли промокод валидным после уменьшения количества
            if (promocode) {
                // Пересчитываем сумму после уменьшения количества
                const itemPrice = roundToHundreds(Number(data?.saleCost || data?.cost || 0));
                const newTotal = (Number(total) || 0) - itemPrice;
                const availableMin = Number(promocode.available) || 0;
                
                // Если сумма стала меньше минимальной для промокода - очищаем его
                if (availableMin > 0 && newTotal < availableMin) {
                    setPromocode(null);
                    setDiscount(0);
                }
                // Если промокод остался валидным, оставляем его как есть
            }

            // load() будет вызван автоматически через useEffect при изменении cart.length или promocode
        } catch (error) {
            // Эта ошибка может возникнуть только при проблемах с локальной корзиной
            console.error("Ошибка при уменьшении количества продукта:", error.message || error);
        }
    };

    const minusProduct = async () => {
        await handleMinusClick();
    };

    const handleConfirmAction = async () => {
        onWarningClose();
        if (pendingAction === 'delete') {
            await executeDelete();
        } else if (pendingAction === 'minus') {
            await executeMinus();
        }
        setPendingAction(null);
    };

    return <div className={styles.item}>
        <div className={styles.itemRow}>
            <img src={data?.cover?.length > 0 ? data?.cover : ''} className={styles.itemCover} />
            <div className={styles.itemTextColumn}>
                <div className={styles.itemNameLine}>
                    <div className={styles.itemNameColumn}>
                        <p className={styles.itemName}>{data.type && PRODUCT_TYPES[data.type]} {data?.name?.length > 0 && data?.name}</p>
                        <p className={styles.itemNameStat}>Артикул: {item.article}</p>
                        <p className={styles.itemNameStat}>Цвет: {item.color}</p>
                        {data.type !== "earrings" && <p className={styles.itemNameStat}>Размер: {item.size}</p>}
                    </div>
                    <img src='/cross.svg' className={styles.itemCrossMobile} onClick={deleteProduct} />
                </div>
                <div className={styles.itemCountLineMobile}>
                    <button className={styles.itemCountSymbolBox} onClick={minusProduct}>
                        <img src='/minus.svg' />
                    </button>
                    <div className={styles.itemCountNumber}>{count}</div>
                    <button className={styles.itemCountSymbolBox} onClick={plusProduct}>
                        <img src='/plus.svg' />
                    </button>
                </div>

                <p className={styles.itemCost} >{formatNumber(Number(data?.saleCost && data?.saleCost > 0 ? data?.saleCost : data?.cost))} руб.</p>
            </div>
        </div>
        <div className={styles.itemRowLil}>
            <div className={styles.itemCountLine}>
                <button className={styles.itemCountSymbolBox} onClick={minusProduct}>
                    <img src='/minus.svg' />
                </button>
                <div className={styles.itemCountNumber}>{count}</div>
                <button className={styles.itemCountSymbolBox} onClick={plusProduct}>
                    <img src='/plus.svg' />
                </button>
            </div>
            <img src='/cross.svg' className={styles.itemCross} onClick={deleteProduct} />
        </div>
        <AuthModal isOpen={isOpen} onClose={onClose} />
        <Modal isOpen={isWarningOpen} onClose={onWarningClose} autoFocus={false} isCentered size='xl'>
            <ModalOverlay />
            <ModalContent background='none'>
                <div className={styles.modalClear}>
                    <div className={styles.modalHeaderClear}>
                        <p className={styles.modalHeaderTitle}>ПРЕДУПРЕЖДЕНИЕ</p>
                        <img src='/cross.svg' onClick={onWarningClose} className={styles.modalCross} />
                    </div>
                    <div className={styles.modalColumn}>
                        <p className={styles.modalWarningText}>
                            {pendingAction === 'delete' 
                                ? <>При удалении данного товара промокод <span className={styles.modalPromocodeHighlight}>{promocode?.title || ''}</span> перестанет действовать, так как общей суммы заказа будет не хватать.</>
                                : <>Если вы уменьшите количество товаров, промокод <span className={styles.modalPromocodeHighlight}>{promocode?.title || ''}</span> перестанет действовать, так как общей суммы заказа будет не хватать.</>
                            }
                        </p>
                        <div className={styles.modalWarningButtons}>
                            <button onClick={onWarningClose} className={styles.modalClose}>
                                Отменить
                            </button>
                            <button onClick={handleConfirmAction} className={styles.modalDeleteAll}>
                                {pendingAction === 'delete' ? 'Удалить' : 'Уменьшить'}
                            </button>
                        </div>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    </div>
};