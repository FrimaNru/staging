import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import { Modal, ModalBody, ModalContent, ModalOverlay, useToast, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { formatNumber, roundToHundreds } from "@/lib/Formatting";
import { useCart } from "@/contexts/CartContext";
import { formatDate } from "@/lib/Formatting";
import { useUser } from "@/contexts/UserContext";
import BagPersonalData from "./items/BagPersonalData";
import BagProducts from "./items/BagProducts";
import BagInfoColumn from "./items/BagInfoColumn";
import BagDelivery from "./items/BagDelivery";

export default function Bag() {
    const router = useRouter();
    const { orderId } = router.query;
    const { startSetCart, cart } = useCart();
    const { setUser, user } = useUser();
    const [dataUser, setDataUser] = useState({});
    const [prevPath, setPrevPath] = useState(null);
    const [total, setTotal] = useState(0);
    const [deliveryCost, setDeliveryCost] = useState(0);
    const [deliveryDate, setDeliveryDate] = useState('');
    const { isOpen, onClose, onOpen } = useDisclosure();
    const toast = useToast();
    const [order, setOrder] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [errorModal, setErrorModal] = useState(false);
    const [successData, setSuccessData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [promocode, setPromocode] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [originalTotalBeforeDiscount, setOriginalTotalBeforeDiscount] = useState(0);
    const regexMail = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;

    const [isWidgetVisible, setIsWidgetVisible] = useState(false);

    useEffect(() => {
        load();

        if (orderId) {
            checkOrderStatus();
        }
    }, [orderId]);

    useEffect(() => {
        // Пересчитываем сумму только при изменении количества товаров в корзине
        if (cart.length > 0) {
            load();
        } else {
            setTotal(0);
            // Очищаем промокод, если корзина пуста
            if (promocode) {
                setPromocode(null);
                setDiscount(0);
            }
        }
    }, [cart.length]);

    // Пересчитываем сумму при изменении промокода или скидки
    useEffect(() => {
        if (cart.length > 0) {
            load();
        }
    }, [promocode, discount]);

    useEffect(() => {
        const path = sessionStorage.getItem('prevPath');
        if (path && path.includes('product')) {
            setPrevPath(path);
        }
    }, []);

    const checkOrderStatus = async () => {
        await axios.post(`${API_BASE_URL}orders/status`, { orderId }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then((res) => {
                if (res.status === 201) return;
                setUser(res.data.user);
                setSuccessData(res.data.order);
                setSuccessModal(true);
                setOrder(false);
                load();
            })
            .catch((e) => { console.log(e); });
    };

    const load = async () => {
        try {
            if (user) setDataUser(user);

            const productRequests = cart.map(product =>
                axios.post(`${API_BASE_URL}getOneProduct`, { id: product.id })
                    .then(res => {
                        // Используем ту же логику округления, что и в каталоге
                        const price = Number(res.data.saleCost || res.data.cost);
                        return roundToHundreds(price);
                    })
                    .catch(error => {
                        console.error(`Ошибка при получении товара с ID ${product.id}:`, error);
                        return 0;
                    })
            );

            const costs = await Promise.all(productRequests);
            const summ = costs.reduce((acc, cost) => acc + cost, 0);
            setTotal(summ);
            // Сохраняем оригинальную сумму для проверки бесплатной доставки
            if (summ >= 3000) {
                setOriginalTotalBeforeDiscount(summ);
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    };

    const clearBag = async () => {
        const token = localStorage.getItem('token');
        
        // Очищаем локальную корзину всегда
        startSetCart([]);
        setIsWidgetVisible(false);
        
        // Сразу обнуляем сумму, чтобы блок "ИТОГО" исчез
        setTotal(0);
        
        // Очищаем промокод, если он был применен
        if (promocode) {
            setPromocode(null);
            setDiscount(0);
        }
        
        // Отправляем на сервер только если пользователь авторизован
        if (token) {
            try {
                await axios.post(`${API_BASE_URL}clearBag`, {}, { 
                    headers: { Authorization: `Bearer ${token}` } 
                });
            } catch (error) {
                // Если ошибка на сервере, но корзина уже очищена локально,
                // просто логируем ошибку, но не прерываем выполнение
                console.error("Ошибка при синхронизации с сервером:", error.message || error);
            }
        }
        
        onClose();
        toast({ 
            position: 'bottom-right', 
            render: () => (<div className="toast">Корзина успешно очищена</div>), 
            duration: 3000 
        });
        setOrder(false);
    }

    function buy() {
        if (!user) {
            return toast({
                position: 'bottom-right',
                render: () => <div className="toast">Вы не вошли в аккаунт</div>,
                duration: 3000
            });
        }

        const validations = [
            { condition: !user.name, message: "Вы не указали имя" },
            { condition: user.phone.replaceAll('_', '').length !== 18, message: "Вы неправильно указали номер телефона" },
            { condition: !user.personalData.lastName, message: "Вы не указали фамилию" },
            { condition: !regexMail.test(user.email), message: "Вы неправильно указали почту" },
            { condition: !selectedPVZ?.address, message: "Вы не выбрали пункт выдачи заказа" },
            { condition: !deliveryDate, message: "Срок доставки не указан" },
            { condition: !user.isVerifiedPhone, message: "Вы не подтвердили номер телефона" }
        ];

        const failedValidation = validations.find(v => v.condition);
        if (failedValidation) return toast({
            position: 'bottom-right',
            render: () => <div className="toast">{failedValidation.message}</div>,
            duration: 3000
        });

        setIsLoading(true);
        // Если оригинальная сумма была >= 3000, доставка остается бесплатной даже после скидки
        const currentTotal = Number(total) || 0;
        const currentDiscount = Number(discount) || 0;
        const currentDeliveryCost = Number(deliveryCost) || 0;
        const isFreeDelivery = originalTotalBeforeDiscount >= 3000 || currentTotal >= 3000;
        const finalTotal = (currentTotal - currentDiscount) + (isFreeDelivery ? 0 : currentDeliveryCost);
        axios.post(`${API_BASE_URL}createOrder`, {
            dataUser,
            data: cart,
            total: finalTotal,
            promocode: promocode ? promocode._id : null,
            delivery: {
                street: `${selectedPVZ.region}, ${selectedPVZ.city}, ${selectedPVZ.address}`,
                date: deliveryDate,
                pvzCode: selectedPVZ.code
            }
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((res) => {
                setIsLoading(false);
                router.push(res.data.formUrl);
            })
            .catch((e) => {
                console.error(e);
                setIsLoading(false);
            });
    }

    const [selectedPVZ, setSelectedPVZ] = useState(null);

    if (!cart) return;

    return <div className={styles.main}>
        <div className={styles.mainRow}>
            <div className={styles.columnProducts}>
                <div className={styles.rowHeader}>
                    <hr className={`${styles.hr} ${styles.hrMobile}`} />
                    <p className={styles.rowHeaderTitle}>КОРЗИНА</p>
                    <hr className={`${styles.hr} ${styles.hrMobile}`} />
                    {cart.length > 0 && <button className={styles.rowHeaderClear} onClick={onOpen}>Очистить корзину</button>}
                </div>
                <BagProducts
                    load={load}
                    total={total}
                    setTotal={setTotal}
                    promocode={promocode}
                    setPromocode={setPromocode}
                    setDiscount={setDiscount}
                />
                {cart.length === 0 && <div className={styles.emptyBag}>
                    <p className={styles.emptyBagTitle}>К сожалению, ваша корзина пуста</p>
                    <button className={styles.emptyBagButton} onClick={() => router.push('/catalog')}>В КАТАЛОГ</button>
                </div>}
            </div>
            <BagInfoColumn
                total={total}
                deliveryCost={deliveryCost}
                order={order}
                setOrder={setOrder}
                setIsWidgetVisible={setIsWidgetVisible}
                prevPath={prevPath}
                promocode={promocode}
                setPromocode={setPromocode}
                discount={discount}
                setDiscount={setDiscount}
                originalTotalBeforeDiscount={originalTotalBeforeDiscount}
                hidePromocode={true}
            />
        </div>
        <div id="personalData" />
        <div className={styles.order}>
            {order && <BagPersonalData load={load} dataUser={dataUser} setDataUser={setDataUser} />}
            {order && <hr className={styles.hr} />}
            <BagDelivery
                order={order}
                total={total}
                deliveryCost={deliveryCost}
                setDeliveryDate={setDeliveryDate}
                setSelectedPVZ={setSelectedPVZ}
                setDeliveryCost={setDeliveryCost}
                deliveryDate={deliveryDate}
                isWidgetVisible={isWidgetVisible}
                selectedPVZ={selectedPVZ}
                setOrder={setOrder}
                setIsWidgetVisible={setIsWidgetVisible}
                prevPath={prevPath}
                promocode={promocode}
                setPromocode={setPromocode}
                discount={discount}
                setDiscount={setDiscount}
                originalTotalBeforeDiscount={originalTotalBeforeDiscount}
            />
            {order && <>
                <hr className={styles.hr} />
                <button className={`${styles.orderButtonPay} ${isLoading && styles.loading}`} onClick={buy}>ОПЛАТИТЬ</button>
            </>}
        </div>
        <Modal onClose={async () => { setSuccessModal(false); }} isOpen={successModal} autoFocus={false} isCentered size='xl' >
            <ModalOverlay />
            <ModalContent p={0} bg='none' boxShadow='none' >
                <ModalBody p={0}>
                    {successData && <div className={styles.modalSuccess}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalHeaderLine}>
                                <p className={styles.modalHeaderTitle}>ЗАКАЗ ОФОРМЛЕН</p>
                                <img src='/cross.svg' className={styles.cross} onClick={() => setSuccessModal(false)} />
                            </div>
                            <hr className={styles.modalHr} />
                        </div>
                        <div className={styles.modalSuccessColumn}>
                            <div className={styles.modalSuccessColumnLil}>
                                <p className={styles.modalSuccessTitle}>ЗАКАЗ № {successData.number}</p>
                                <p className={styles.modalSuccessText}>{formatDate(successData.createDate)}</p>
                            </div>
                            <div className={styles.modalSuccessStatus} >
                                <img src='/infoIcon.svg' className={styles.modalSuccessStatusIcon} />
                                <p className={styles.modalSuccessText}>Ваш заказ создан</p>
                            </div>
                            <div className={styles.modalSuccessColumnMiddle}>
                                <p className={styles.modalSuccessTitle}>Доставка</p>
                                <div className={styles.itemTextColumn}>
                                    <div className={styles.modalSuccessLine}>
                                        <img src='/iconMap.svg' className={`${styles.modalSuccessLineIcon} ${styles.modalSuccessLineIconMap}`} />
                                        <p className={styles.modalSuccessText}>{successData?.delivery?.street}</p>
                                    </div>
                                    <div className={styles.modalSuccessLine}>
                                        <img src='/clock.svg' className={styles.modalSuccessLineIcon} />
                                        <p className={styles.modalSuccessText}>{successData?.delivery?.date}</p>
                                    </div>
                                    <div className={styles.modalSuccessLine}>
                                        <img src='/phone.svg' className={styles.modalSuccessLineIcon} />
                                        <p className={styles.modalSuccessText}>{user?.phone}</p>
                                    </div>
                                </div>
                            </div>
                            <p className={styles.modalSuccessGold} >Оплачено: {formatNumber(Number(successData.total))} руб.</p>
                            <button className={styles.modalSaveButton} onClick={() => router.push('/cabinet?page=myorders')}>ДЕТАЛИ ЗАКАЗА</button>
                        </div>
                    </div>}
                </ModalBody>
            </ModalContent>
        </Modal>
        <Modal onClose={() => setErrorModal(false)} isOpen={errorModal} autoFocus={false} isCentered size='xl' >
            <ModalOverlay />
            <ModalContent bg='none' boxShadow='none' >
                <ModalBody p={0}>
                    {successData && <div className={styles.modalSuccess}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalHeaderLine}>
                                <p className={styles.modalHeaderTitle}>НЕДОСТАТОЧНО СРЕДСТВ</p>
                                <img src='/cross.svg' className={styles.cross} onClick={() => setErrorModal(false)} />
                            </div>
                            <hr className={styles.modalHr} />
                        </div>
                        <div className={styles.modalSuccessColumn}>
                            <div className={styles.modalSuccessColumnLil}>
                                <p className={styles.modalSuccessTitle}>ЗАКАЗ № {successData.id}</p>
                                <p className={styles.modalSuccessText}>{formatDate(successData.createDate)}</p>
                            </div>
                            <p className={styles.modalSuccessGold} >К ОПЛАТЕ: {formatNumber(Number(successData.total))} руб.</p>
                            <div className={styles.modalSaveButton} onClick={() => router.push('/cabinet?page=myorders')}>ОПЛАТИТЬ ЗАКАЗ</div>
                        </div>
                    </div>}
                </ModalBody>
            </ModalContent>
        </Modal>
        <Modal isOpen={isOpen} onClose={onClose} autoFocus='false' isCentered size='xl' >
            <ModalOverlay />
            <ModalContent background='none'>
                <div className={styles.modalClear}>
                    <div className={styles.modalHeaderClear}>
                        <p className={styles.modalHeaderTitle}>ОЧИСТИТЬ КОРЗИНУ?</p>
                        <img src='/cross.svg' onClick={onClose} className={styles.modalCross} />
                    </div>
                    <div className={styles.modalColumn}>
                        <button onClick={clearBag} className={styles.modalDeleteAll}>ОЧИСТИТЬ КОРЗИНУ</button>
                        <button onClick={onClose} className={styles.modalClose}>НЕТ</button>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    </div >
};