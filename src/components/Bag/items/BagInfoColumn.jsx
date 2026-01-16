import { formatNumber } from "@/lib/Formatting";
import styles from "../styles.module.css";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-scroll";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { AuthModal } from "@/components/Header/items/AuthModal";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiConfig";

export default function BagInfoColumn({ total, deliveryCost, order, setOrder, setIsWidgetVisible, prevPath, fullWidth, promocode, setPromocode, discount, setDiscount, originalTotalBeforeDiscount, readOnly = false, hidePromocode = false }) {

    const { cart } = useCart();
    const { user } = useUser();
    const router = useRouter();
    const { onOpen, onClose, isOpen } = useDisclosure();
    const toast = useToast();
    const [promocodeInput, setPromocodeInput] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    const handleGoToCatalog = () => {
        if (prevPath) {
            router.push(prevPath);
        } else {
            router.push('/catalog');
        }
    };

    const handleApplyPromocode = async () => {
        if (!promocodeInput.trim()) return;

        setIsApplying(true);
        try {
            const response = await axios.post(`${API_BASE_URL}promocodes/check`, {
                title: promocodeInput.trim()
            });

            // Обрабатываем структуру ответа: может быть response.data.promocode или response.data напрямую
            const promocodeData = response.data.promocode || response.data;
            const currentTotal = Number(total) || 0;
            
            // Отладочная информация
            if (process.env.NODE_ENV === 'development') {
                console.log('Promocode response:', response.data);
                console.log('Promocode data:', promocodeData);
                console.log('Current total:', currentTotal);
            }
            
            if (!promocodeData) {
                toast({
                    position: 'bottom-right',
                    render: () => <div className="toast">Ошибка: промокод не найден</div>,
                    duration: 3000,
                    status: 'error'
                });
                setIsApplying(false);
                return;
            }

            const now = new Date();
            const dateOff = new Date(promocodeData.date_off);

            // Проверка даты
            if (dateOff < now) {
                toast({
                    position: 'bottom-right',
                    render: () => <div className="toast">Промокод истёк</div>,
                    duration: 3000,
                    status: 'error'
                });
                setIsApplying(false);
                return;
            }

            // Проверка минимальной суммы
            const availableMin = Number(promocodeData.available) || 0;
            if (availableMin > 0 && currentTotal < availableMin) {
                toast({
                    position: 'bottom-right',
                    render: () => <div className="toast">Промокод действителен от корзины {availableMin} руб.</div>,
                    duration: 3000,
                    status: 'error'
                });
                setIsApplying(false);
                return;
            }

            // Расчет скидки на фронтенде
            // Если бэкенд вернул уже рассчитанную скидку, используем её, иначе рассчитываем сами
            let calculatedDiscount = 0;
            
            if (promocodeData.discount !== null && promocodeData.discount !== undefined) {
                // Бэкенд уже рассчитал скидку
                calculatedDiscount = Number(promocodeData.discount) || 0;
            } else {
                // Рассчитываем скидку на фронтенде от точной суммы (без округления)
                const promocodeValue = Number(promocodeData.value);
                
                if (isNaN(promocodeValue) || isNaN(currentTotal)) {
                    toast({
                        position: 'bottom-right',
                        render: () => <div className="toast">Ошибка: некорректные данные промокода</div>,
                        duration: 3000,
                        status: 'error'
                    });
                    setIsApplying(false);
                    return;
                }
                
                if (promocodeData.type === 'fix') {
                    // Фиксированная скидка
                    calculatedDiscount = promocodeValue;
                } else if (promocodeData.type === 'procent') {
                    // Процентная скидка от точной суммы
                    calculatedDiscount = Math.round(currentTotal * (promocodeValue / 100));
                }
            }

            // Убеждаемся, что скидка не больше суммы заказа
            calculatedDiscount = Math.min(calculatedDiscount, currentTotal);

            setPromocode(promocodeData);
            setDiscount(calculatedDiscount);
            setPromocodeInput('');
            toast({
                position: 'bottom-right',
                render: () => <div className="toast">Промокод применен</div>,
                duration: 3000,
                status: 'success'
            });
        } catch (error) {
            // Логируем ошибку для отладки
            console.error('Ошибка при применении промокода:', error);
            console.error('Response:', error.response?.data);
            console.error('Status:', error.response?.status);
            
            if (error.response?.status === 404) {
                toast({
                    position: 'bottom-right',
                    render: () => <div className="toast">Промокод не найден</div>,
                    duration: 3000,
                    status: 'error'
                });
            } else {
                toast({
                    position: 'bottom-right',
                    render: () => <div className="toast">Ошибка при применении промокода</div>,
                    duration: 3000,
                    status: 'error'
                });
            }
        } finally {
            setIsApplying(false);
        }
    };

    return total > 0 && <div className={`${styles.totalColumn} ${fullWidth ? styles.fullWidth : ''}`}>
        <div className={styles.total}>
            <p className={styles.totalTitle}>ИТОГО</p>
            <div className={styles.totalContent}>
                <div className={styles.totalRow}>
                    <p className={styles.totalSubtitle}>Товаров на сумму</p>
                    <p className={styles.totalGold}>{formatNumber(total)} руб.</p>
                </div>
                <div className={styles.totalColumnLil}>
                    <div className={styles.totalRow}>
                        <p className={styles.totalSubtitle}>Доставка</p>
                        {(originalTotalBeforeDiscount >= 3000 || (Number(total) || 0) >= 3000)
                            ? <p className={styles.totalGold}>0 руб.</p>
                            : ((Number(total) || 0) - (Number(discount) || 0)) < 3000
                                ? <>
                                    {(Number(deliveryCost) || 0) === 0
                                        ? <p className={styles.totalGold}>Платная</p>
                                        : <p className={styles.totalGold}>{formatNumber(Number(deliveryCost) || 0)} руб.</p>}
                                </>
                                : <p className={styles.totalGold}>0 руб.</p>}
                    </div>
                    <p className={styles.totalText}>При заказе от 3000 рублей, доставка бесплатная</p>
                </div>
                {!hidePromocode && <div className={styles.totalColumnLil}>
                    <div className={styles.totalRow}>
                        <p className={styles.totalSubtitle}>Промокод</p>
                    </div>
                    {promocode ? (
                        <div className={styles.promocodeApplied}>
                            <input
                                type="text"
                                className={styles.promocodeInput}
                                value={promocode?.title || ''}
                                disabled
                                style={{ borderColor: 'var(--beige)' }}
                            />
                            <p className={styles.promocodeDiscount}>-{formatNumber(Number(discount) || 0)} руб.</p>
                        </div>
                    ) : readOnly ? (
                        <p className={styles.totalText} style={{ marginTop: '6px' }}>Не применен</p>
                    ) : (
                        <div className={styles.promocodeRow}>
                            <input
                                type="text"
                                className={styles.promocodeInput}
                                placeholder="Введите промокод"
                                value={promocodeInput || ''}
                                onChange={(e) => setPromocodeInput(e.target.value.toUpperCase())}
                            />
                            <button
                                className={styles.promocodeButton}
                                onClick={handleApplyPromocode}
                                disabled={isApplying || !promocodeInput?.trim()}
                            >
                                Применить
                            </button>
                        </div>
                    )}
                </div>}
            </div>
            <hr className={styles.hr} />
            <div className={styles.totalRow}>
                <p className={styles.totalSubtitle}>Итого</p>
                <p className={styles.totalGold}>
                    {(() => {
                        // Используем точные значения для расчетов (без округления)
                        const currentTotal = Number(total) || 0;
                        const currentDiscount = Number(discount) || 0;
                        const currentDeliveryCost = Number(deliveryCost) || 0;
                        
                        const isFreeDelivery = originalTotalBeforeDiscount >= 3000 || currentTotal >= 3000;
                        // Сначала вычитаем скидку из суммы товаров, потом добавляем доставку
                        const subtotalAfterDiscount = currentTotal - currentDiscount;
                        const finalSum = subtotalAfterDiscount + (isFreeDelivery ? 0 : currentDeliveryCost);
                        
                        // Округление применяется только при отображении через formatNumber
                        return formatNumber(finalSum);
                    })()} руб. 
                    {(() => {
                        const currentTotal = Number(total) || 0;
                        const currentDiscount = Number(discount) || 0;
                        const currentDeliveryCost = Number(deliveryCost) || 0;
                        const subtotalAfterDiscount = currentTotal - currentDiscount;
                        const isFreeDelivery = originalTotalBeforeDiscount >= 3000 || currentTotal >= 3000;
                        return subtotalAfterDiscount < 3000 && !isFreeDelivery && currentDeliveryCost === 0 ? ' без доставки' : '';
                    })()}
                </p>
            </div>
        </div>
        {cart.length > 0 && !order && !readOnly && <>
            <Link to={user ? 'personalData' : ''} smooth={true} offset={-180}>
                <button className={styles.totalButton} onClick={() => {
                    if (user) {
                        setOrder(true);
                        setIsWidgetVisible(true);
                    } else {
                        onOpen();
                    }
                }}>ОФОРМИТЬ ЗАКАЗ</button>
            </Link>
            <button className={styles.countinueShoppingButton} onClick={handleGoToCatalog}>ПРОДОЛЖИТЬ ПОКУПКИ</button>
        </>}
        <AuthModal isOpen={isOpen} onClose={onClose} />
    </div>
};