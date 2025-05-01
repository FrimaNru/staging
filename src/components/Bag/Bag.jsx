import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import { Modal, ModalBody, ModalContent, ModalOverlay, useToast, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { formatNumber } from "@/lib/Formatting";
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
    const [prevPath, setPrevPath] = useState(null);
    const [data, setData] = useState([]);
    const [dataUser, setDataUser] = useState({});
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
    const regexMail = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;

    const [isWidgetVisible, setIsWidgetVisible] = useState(false);

    useEffect(() => {
        load();
        
        if (orderId) {
            checkOrderStatus();
        }
    }, [orderId]);

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
        await axios.get(`${API_BASE_URL}getUser`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then((res) => {
                startSetCart(res.data.bag);
                setData(res.data.bag);
                setDataUser(res.data);
                let d = 0;
                if (res.data.bag.length === 0) return setTotal(0);
                res.data.bag.map(x => {
                    axios.post(`${API_BASE_URL}getOneProduct`, { id: x.id })
                        .then((r) => {
                            d = Number(d) + Number(r.data.cost);
                            setTotal(d);
                        })
                        .catch((e) => {
                            console.log(e);
                        });
                });
            })
            .catch((e) => console.log(e));
    };

    function clearBag() {
        axios.post(`${API_BASE_URL}clearBag`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                onClose();
                load();
                startSetCart([]);
                setIsWidgetVisible(false);
                toast({ position: 'bottom-right', render: () => (<div className="toast">Корзина успешно очищена</div>), duration: 3000 });
                setOrder(false);
            })
            .catch((e) => console.log(e));
    }

    function buy() {
        if (dataUser.name.length > 0 && dataUser.phone.replaceAll('_', '').length === 18 && dataUser.personalData.lastName.length > 0 && regexMail.test(dataUser.email) && selectedPVZ?.address && deliveryDate !== '' && dataUser.isVerifiedPhone) {
            setIsLoading(true);
            axios.post(`${API_BASE_URL}createOrder`, { dataUser, data, total: total + (total >= 3000 ? 0 : deliveryCost), delivery: { street: `${selectedPVZ?.region}, ${selectedPVZ?.city}, ${selectedPVZ?.address}`, date: deliveryDate, pvzCode: selectedPVZ?.code } }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
                .then((res) => {
                    setIsLoading(false);
                    router.push(res.data.formUrl);
                })
                .catch((e) => { console.log(e); setIsLoading(false); });
        } else {
            if (dataUser.name.length === 0) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не указали имя</div>), duration: 3000 });
            if (dataUser.phone.replaceAll('_', '').length !== 18) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы неправильно указали номер телефона</div>), duration: 3000 });
            if (dataUser.personalData.lastName.length === 0) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не указали фамилию</div>), duration: 3000 });
            if (!regexMail.test(dataUser.email)) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы неправильно указали почту</div>), duration: 3000 });
            if (!selectedPVZ?.address) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не выбрали пункт выдачи заказа</div>), duration: 3000 });
            if (!user.isVerifiedPhone) return toast({ position: 'bottom-right', render: () => (<div className="toast">Вы не подтвердили номер телефона</div>), duration: 3000 });
        }
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
                    setData={setData}
                    load={load}
                    total={total}
                    setTotal={setTotal}
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
            />
        </div>
        <div id="personalData" />
        <div className={styles.order}>
            {order && <BagPersonalData setDataUser={setDataUser} dataUser={dataUser} load={load} />}
            {order && <hr className={styles.hr} />}
            <BagDelivery
                order={order}
                total={total}
                setDeliveryDate={setDeliveryDate}
                setSelectedPVZ={setSelectedPVZ}
                setDeliveryCost={setDeliveryCost}
                deliveryDate={deliveryDate}
                isWidgetVisible={isWidgetVisible}
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
                                        <p className={styles.modalSuccessText}>{dataUser.phone}</p>
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