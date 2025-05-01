import WidgetPVZ from "@/components/Common/WidgetPVZ";
import styles from "../styles.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiConfig";

export default function BagDelivery({ order, setDeliveryDate, setDeliveryCost, deliveryDate, setSelectedPVZ, isWidgetVisible, selectedPVZ }) {

    const handleSelectPVZ = async (pvz) => {
        try {
            setSelectedPVZ(pvz);
            const response = await axios.post(
                `${API_BASE_URL}calculateDelivery`,
                { address: pvz.address, postal_code: pvz.postal_code },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, timeout: 5000 }
            );
            setDeliveryDate(`${response.data.period_min} - ${response.data.period_max + 1} дня`);
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
        {order && <div className={styles.orderInfo}>
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
        </div>}
    </div>
};