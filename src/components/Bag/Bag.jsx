import styles from "@/styles/Bag.module.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import { Modal, ModalBody, ModalContent, ModalOverlay, useToast, useDisclosure, ModalCloseButton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import InputMask from "react-input-mask";
import { formatNumber } from "@/lib/Formatting";
import WidgetPVZ from "../Common/WidgetPVZ";
import { Link } from "react-scroll"
import { useCart } from "@/contexts/CartContext";
import { formatDate } from "@/lib/Formatting";
import { useUser } from "@/contexts/UserContext";

export default function Bag() {

    const router = useRouter();
    const { startSetCart } = useCart();
    const { setUser } = useUser();
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

    useEffect(() => {
        load();
        if (window.location.href.includes('orderId')) {
            checkOrderStatus();
        };
    }, []);

    useEffect(() => {
        const path = sessionStorage.getItem('prevPath');
        if (path && path.includes('product')) {
            setPrevPath(path);
        }
    }, []);

    const checkOrderStatus = async () => {
        await axios.post(`${API_BASE_URL}orders/status`, { orderId: window.location.href.split('orderId=')[1].split('&')[0] }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then((res) => {
                if (res.status === 201) return;
                setUser(res.data.user);
                setSuccessModal(true);
                setOrder(false);
                setSuccessData(res.data.order);
            })
            .catch((e) => { console.log(e); });
    };

    const handleGoToCatalog = () => {
        if (prevPath) {
            router.push(prevPath);
        } else {
            router.push('/catalog');
        }
    };

    const load = async () => {
        await axios.get(`${API_BASE_URL}getUser`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then((res) => {
                startSetCart(res.data.bag);
                setData(res.data.bag);
                setDataUser(res.data);
                let d = 0
                if (res.data.bag.length === 0) return setTotal(0);
                res.data.bag.map(x => {
                    axios.post(`${API_BASE_URL}getOneProduct`, { id: x.id })
                        .then((r) => {
                            const index = r.data.articles.findIndex(y => y === x.article);
                            d = Number(d) + Number(r.data.cost[index]);
                            setTotal(d);
                        })
                        .catch((e) => {
                            console.log(e);
                        });
                });
            })
            .catch((e) => console.log(e));
    };

    const itemCounts = data.reduce((acc, item) => {
        const key = JSON.stringify({ id: item.id, size: item.size, color: item.color, article: item.article });
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    function clearBag() {
        axios.post(`${API_BASE_URL}clearBag`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                onClose();
                load();
                startSetCart([]);
                toast({ position: 'bottom-right', render: () => (<div className="toast">Корзина успешно очищена</div>), duration: 3000 });
                setOrder(false);
            })
            .catch((e) => console.log(e));
    };

    function buy() {
        if (dataUser.name.length > 0 && dataUser.phone.replaceAll('_', '').length === 18 && dataUser.personalData.lastName.length > 0 && regexMail.test(dataUser.email) && selectedPVZ?.address && deliveryDate !== '') {
            setIsLoading(true);

            axios.post(`${API_BASE_URL}createOrder`, { dataUser, data, total: total + (total >= 3000 ? 0 : deliveryCost), delivery: { street: selectedPVZ?.address, date: deliveryDate, pvzCode: selectedPVZ?.code } }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
                .then((res) => {
                    console.log(res.data);
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

        }
    };

    const [selectedPVZ, setSelectedPVZ] = useState(null);

    const handleSelectPVZ = (pvz) => {
        setSelectedPVZ(pvz);

        axios.post(`${API_BASE_URL}calculateDelivery`, { address: pvz.address, postal_code: pvz.postal_code }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then((res) => {
                setDeliveryDate(`${res.data.period_min} - ${res.data.period_max} дня`);
                setDeliveryCost(res.data.total_sum);
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.main}>
        <div className={styles.mainRow}>
            <div className={styles.columnProducts}>
                <div className={styles.rowHeader} >
                    <hr className={`${styles.hr} ${styles.hrMobile}`} />
                    <p className={styles.rowHeaderTitle}>КОРЗИНА</p>
                    <hr className={`${styles.hr} ${styles.hrMobile}`} />
                    {data.length > 0 && <button className={styles.rowHeaderClear} onClick={onOpen} >Очистить корзину</button>}
                </div>
                {data.length > 0 && Object.entries(itemCounts)
                    .filter(([key, count], index, self) => self.findIndex(([x]) => x === key) === index)
                    .map(([key, count], i) => {
                        const item = JSON.parse(key);
                        return (
                            <div key={i} className={styles.itemColumn}>
                                <ProductItem item={item} count={count} setTotal={setTotal} total={total} load={load} setData={setData} />
                                <hr className={styles.hr} />
                            </div>
                        );
                    })
                }
                {data.length === 0 && <div className={styles.emptyBag} >
                    <p className={styles.emptyBagTitle}>К сожалению, ваша корзина пуста</p>
                    <button className={styles.emptyBagButton} onClick={() => router.push('/catalog')}>В КАТАЛОГ</button>
                </div>}
            </div>
            {total > 0 && <div className={styles.totalColumn}>
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
                                {total < 3000
                                    ? <>{deliveryCost === 0
                                        ? <svg xmlns="http://www.w3.org/2000/svg" width="11" height="5" viewBox="0 0 11 5" fill="none">
                                            <path d="M10.2008 4.53996H0.800781V0.459961H10.2008V4.53996Z" fill="#C49748" />
                                        </svg>
                                        : <p className={styles.totalGold}>{formatNumber(deliveryCost)} руб.</p>}
                                    </>
                                    : <p className={styles.totalGold}>0 руб.</p>}
                            </div>
                            <p className={styles.totalText}>При заказе от 3000 рублей, доставка бесплатная</p>
                        </div>
                    </div>
                    <hr className={styles.hr} />
                    <div className={styles.totalRow} >
                        <p className={styles.totalSubtitle}>Итого</p>
                        <p className={styles.totalGold}>{formatNumber(total + (total >= 3000 ? 0 : deliveryCost))} руб.</p>
                    </div>
                </div>
                {data.length > 0 && !order && <>
                    <Link to='personalData' smooth={true} offset={-180} >
                        <button className={styles.totalButton} onClick={() => setOrder(true)} >ОФОРМИТЬ ЗАКАЗ</button>
                    </Link>
                    <button className={styles.countinueShoppingButton} onClick={handleGoToCatalog} >ПРОДОЛЖИТЬ ПОКУПКИ</button>
                </>}
            </div>}
        </div>
        <div id="personalData" />
        {order && <div className={styles.order}>
            <div className={styles.orderColumn}>
                <hr className={`${styles.hr} ${styles.hrMobile}`} />
                <p className={styles.orderTitle}>ЛИЧНЫЕ ДАННЫЕ</p>
                <hr className={`${styles.hr} ${styles.hrMobile}`} />
                <div className={styles.orderLine}>
                    <div className={styles.orderColumnBig}>
                        <div className={styles.orderColumnLil}>
                            <p className={styles.orderInputTitle}>Имя</p>
                            <input className={styles.orderInput} onChange={(e) => setDataUser({ ...dataUser, name: e.target.value })} value={dataUser.name} />
                        </div>
                        <div className={styles.orderColumnLil}>
                            <p className={styles.orderInputTitle}>Фамилия</p>
                            <input className={styles.orderInput} value={dataUser.personalData?.lastName} onChange={(e) => setDataUser({ ...dataUser, personalData: { ...dataUser.personalData, lastName: e.target.value } })} />
                        </div>
                    </div>
                    <div className={styles.orderColumnBig}>
                        <div className={styles.orderColumnLil}>
                            <p className={styles.orderInputTitle}>E-mail</p>
                            <input className={styles.orderInput} onChange={(e) => setDataUser({ ...dataUser, email: e.target.value })} value={dataUser.email} />
                        </div>
                        <div className={styles.orderColumnLil}>
                            <p className={styles.orderInputTitle}>Телефон</p>
                            <InputMask mask="+7 (999) 999-99-99" className={styles.orderInput} value={dataUser.phone} onChange={(e) => setDataUser({ ...dataUser, phone: e.target.value })} />
                        </div>
                    </div>
                </div>
            </div>
            <hr className={styles.hr} />
            <div className={styles.orderColumn}>
                <p className={styles.orderTitle}>ПУНКТ ВЫДАЧИ ЗАКАЗОВ</p>
                <p className={styles.orderText}>Стоимость доставки: рассчитывается в корзине автоматически при оформлении заказа. Частичный выкуп невозможен. Заказ хранится в пункте выдачи 14 дней. Вам придет уведомление, когда заказ поступит в ПВЗ.</p>
                <WidgetPVZ onSelectPVZ={handleSelectPVZ} />
                <div className={styles.orderInfo}>
                    <div className={styles.orderInfoColumn}>
                        <p className={styles.orderInfoColumnTitle}>Пункт самовывовоза находится по адресу:</p>
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
            </div>
            <hr className={styles.hr} />
            <button className={`${styles.orderButtonPay} ${isLoading && styles.loading}`} onClick={buy}>ОПЛАТИТЬ</button>
        </div>}
        <Modal onClose={async () => { setSuccessModal(false); await load(); }} isOpen={successModal} autoFocus={false} isCentered size='xl' >
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


function ProductItem({ item, count, load, setData }) {

    const [data, setDataProduct] = useState({});
    const toast = useToast();
    const { removeLastFromCart, addToCart } = useCart();
    const [activeCount, setActiveCount] = useState(0);

    useEffect(() => {
        loadNow();
    }, []);

    function loadNow() {
        axios.post(`${API_BASE_URL}getOneProduct`, { id: item.id })
            .then((res) => {
                const index = res.data.articles.findIndex(x => x === item.article);
                setActiveCount(index);
                setDataProduct(res.data);
            })
            .catch((e) => console.log(e));
    };

    function deleteProduct() {
        axios.post(`${API_BASE_URL}deleteProductFromBag`, { id: item.id, size: item.size, color: item.color, article: item.article }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                setData([]);
                toast({ position: 'bottom-right', render: () => (<div className="toast">Товар успешно удален</div>), duration: 3000 });
                load();
            })
            .catch((e) => console.log(e));
    };

    function plusProduct() {
        axios.post(`${API_BASE_URL}plusProductToBag`, { id: item.id, size: item.size, color: item.color, article: item.article }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                addToCart({ id: item.id, size: item.size, color: item.color, article: item.article });
                load();
            })
            .catch((e) => console.log(e));
    };

    function minusProduct() {
        axios.post(`${API_BASE_URL}minusProductFromBag`, { id: item.id, size: item.size, color: item.color, article: item.article }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                load();
                removeLastFromCart();
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.item}>
        <div className={styles.itemRow}>
            <img src={`https://api.mi-alegria.shop/uploads/${data?.cover?.length > 0 && data?.cover[activeCount]}`} className={styles.itemCover} />
            <div className={styles.itemTextColumn}>
                <div className={styles.itemNameLine}>
                    <div className={styles.itemNameColumn}>
                        <p className={styles.itemName}>{data?.name?.length > 0 && data?.name[activeCount]}</p>
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

                <p className={styles.itemCost} >{formatNumber(Number(data?.cost?.length > 0 && data?.cost[activeCount]))} руб.</p>
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
    </div>
};