import WidgetPVZ from "@/components/Common/WidgetPVZ";
import styles from "../styles.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiConfig";
import BagInfoColumn from "./BagInfoColumn";

export default function BagDelivery({ order, setDeliveryDate, setDeliveryCost, deliveryDate, setSelectedPVZ, isWidgetVisible, selectedPVZ, total, deliveryCost, setOrder, setIsWidgetVisible, prevPath }) {

    const normalizePvz = (pvz) => {
        // Виджет СДЭК возвращает разные наборы полей в зависимости от версии/типа
        if (!pvz || typeof pvz !== 'object') return null;
        return {
            address: pvz.address || pvz.location || pvz.address_full || '',
            work_time: pvz.work_time || pvz.workTime || pvz.schedule || '',
            postal_code: pvz.postal_code || pvz.postIndex || pvz.postcode || '',
            city: pvz.city || pvz.cityName || pvz.city_name || '',
            region: pvz.region || pvz.regionName || pvz.region_name || '',
            code: pvz.code || pvz.id || pvz.pvz_code || '',
        };
    };

    const handleSelectPVZ = async (pvzRaw) => {
        try {
            const pvz = normalizePvz(pvzRaw);
            setSelectedPVZ(pvz);
            const response = await axios.post(
                `${API_BASE_URL}calculateDelivery`,
                { address: pvz.address, postal_code: pvz.postal_code },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, timeout: 5000 }
            );
            // Показываем как возвращает API (без +1), и склонение оставляем как есть
            setDeliveryDate(`${response.data.period_min} - ${response.data.period_max} дня`);
            setDeliveryCost(response.data.total_sum);
        } catch (error) {
            console.error("Ошибка при расчете доставки:", error.message || error);
        }
    };

    return <div className={styles.orderColumn}>
        {order && <>
            <p className={styles.orderTitle}>ПУНКТ ВЫДАЧИ ЗАКАЗОВ</p>
            <p className={styles.orderText}>Стоимость доставки: рассчитывается в корзине автоматически при оформлении заказа. Частичный выкуп невозможен. Заказ хранится в пункте выдачи 14 дней. Вам придет уведомление, когда заказ поступит в ПВЗ.</p>
        </>}
        <div style={{ height: isWidgetVisible ? 'auto' : '0px', width: '100%' }}>
            <WidgetPVZ onSelectPVZ={handleSelectPVZ} />
        </div>
        {order && <div className={styles.column}>
            <div className={styles.orderInfo}>
                <div className={styles.orderInfoColumn}>
                    <p className={styles.orderInfoColumnTitle}>Пункт самовывоза находится по адресу:</p>
                    <p className={styles.orderInfoColumnText}>{selectedPVZ?.address ?? 'Не выбрано'}</p>
                </div>
                <div className={styles.orderInfoColumn}>
                    <p className={styles.orderInfoColumnTitle}>График работы:</p>
                    <p className={styles.orderInfoColumnText}>{selectedPVZ?.work_time ?? 'Не выбрано'}</p>
                </div>
                <div className={styles.orderInfoColumn}>
                    <p className={styles.orderInfoColumnTitle}>Срок доставки:</p>
                    <p className={styles.orderInfoColumnText}>{deliveryDate !== '' ? deliveryDate : 'Не выбрано'}</p>
                </div>
            </div>
            <BagInfoColumn
                total={total}
                deliveryCost={deliveryCost}
                order={order}
                setOrder={setOrder}
                setIsWidgetVisible={setIsWidgetVisible}
                prevPath={prevPath}
                fullWidth={true}
            />
        </div>}
    </div>
};