import styles from "@/styles/Bag.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import { Modal, ModalBody, ModalContent, ModalOverlay, useToast, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import InputMask from "react-input-mask";

function formatNumber(num) {
    return num?.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, '.');
};

function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
};

export function Bag() {

    const router = useRouter();
    const { paymentType } = router.query;
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [data, setData] = useState([]);
    const [dataUser, setDataUser] = useState({});
    const [total, setTotal] = useState(0);
    const toast = useToast();
    const [selectDelivery, setSelectDelivery] = useState('');

    const [address, setAddress] = useState('');
    const [newAddressData, setNewAddressData] = useState({});
    const [order, setOrder] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [successData, setSuccessData] = useState({});

    useEffect(() => {
        load();
        if (window.location.href.includes('paymentType') && window.location.href?.split('/bag?')[1].split('&')[0] === 'paymentType=success') {
            successPayment();
        }
    }, []);

    function load() {
        axios.get(`${API_BASE_URL}getUser`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((res) => {
                setData(res.data.bag);
                setDataUser(res.data);
                let d = 0
                if (res.data.bag.length === 0) return setTotal(0);
                res.data.bag.map(x => {
                    axios.post(`${API_BASE_URL}getOneProduct`, { id: x })
                        .then((r) => {
                            d = d + r.data.cost;
                            setTotal(d);
                        })
                        .catch((e) => console.log(e));
                })
            })
            .catch((e) => console.log(e));
    };

    const itemCounts = data.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
    }, {});

    function clearBag() {
        axios.post(`${API_BASE_URL}clearBag`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                toast({ position: 'bottom-right', render: () => (<div className="toast">Корзина успешно очищена</div>), duration: 3000 });
                load();
                setOrder(false);
            })
            .catch((e) => console.log(e));
    };

    function buy() {
        if (dataUser.name.length > 0 && dataUser.phone.length === 18 && dataUser.name.length > 0) {

            const delivery = { street: 'Улица троицкая, д.54 кв.8', date: '8.10.24 с 12:00 до 15:00' };

            axios.post(`${API_BASE_URL}createOrder`, { dataUser, data, total, delivery }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
                .then((res) => {
                    router.push(res.data.PaymentURL);
                })
                .catch((e) => console.log(e));
        } else {
        }
    };

    function successPayment() {
        // setSuccessData(res.data);
        setSuccessModal(true);
        setOrder(false);
        load();
    };

    return <div className={styles.main}>
        <div className={styles.mainRow}>
            <div className={styles.columnProducts}>
                <div className={styles.rowHeader} >
                    <p className={styles.rowHeaderTitle}>КОРЗИНА</p>
                    <button className={styles.rowHeaderClear} onClick={clearBag} >Очистить корзину</button>
                </div>
                {data.length > 0 && Object.entries(itemCounts)
                    .filter(([item, count], index, self) => self.findIndex(([x]) => x === item) === index)
                    .map(([item, count], i) => (
                        <div key={i} className={styles.itemColumn}>
                            <ProductItem item={item} count={count} setTotal={setTotal} total={total} load={load} />
                            <hr className={styles.hr} />
                        </div>
                    ))
                }
                {data.length === 0 && <div className={styles.emptyBag} >
                    <p className={styles.emptyBagTitle}>К сожалению, ваша корзина пуста</p>
                    <button className={styles.emptyBagButton} onClick={() => router.push('/catalog')}>В КАТАЛОГ</button>
                    <hr className={styles.hr} />
                </div>}
            </div>
            <div className={styles.totalColumn}>
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="5" viewBox="0 0 11 5" fill="none">
                                    <path d="M10.2008 4.53996H0.800781V0.459961H10.2008V4.53996Z" fill="#C49748" />
                                </svg>
                            </div>
                            <p className={styles.totalText}>Стоимость доставки будет рассчитана позднее на основании выбранного способа доставки</p>
                        </div>
                    </div>
                    <hr className={styles.hr} />
                    <div className={styles.totalRow} >
                        <p className={styles.totalSubtitle}>Итого</p>
                        <p className={styles.totalGold}>{formatNumber(total)} руб.</p>
                    </div>
                </div>
                {data.length > 0 && !order && <button className={styles.totalButton} onClick={() => setOrder(true)} >ОФОРМИТЬ ЗАКАЗ</button>}
            </div>
        </div>
        {order && <div className={styles.order}>
            <div className={styles.orderColumn} >
                <p className={styles.orderTitle}>ЛИЧНЫЕ ДАННЫЕ</p>
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
            <p className={styles.orderTitle} >СПОСОБЫ ДОСТАВКИ</p>
            <div className={styles.orderLineDelivery} onClick={() => setSelectDelivery('courier')}>
                <img src={selectDelivery === 'courier' ? '/goldDotSelect.svg' : '/goldDot.svg'} className={styles.orderDeliveryDot} />
                <p className={styles.orderDeliveryText} >Курьерская доставка до двери</p>
            </div>
            {selectDelivery === 'courier' && <>
                {address === ''
                    ? <div className={styles.orderDeliveryLineAddress}>
                        {dataUser.personalData.addresses.map((x, i) => <div key={i} className={styles.orderDeliveryAddress} onClick={() => setAddress(x.idAddress)} >
                            <img src='/iconMap.svg' />
                            <p className={styles.orderDeliveryAddressText} >{x.street}, д.{x.house}, кв.{x.appartment}</p>
                        </div>)}
                        <div className={styles.anotherAddress} onClick={() => { setNewAddressData({ ...newAddressData, idAddress: Math.floor(Math.random() * 900000) + 100000 }); onOpen(); }} >Добавить адрес</div>
                    </div>
                    : <>
                        <div className={styles.orderDeliveryLineAddress}>
                            {dataUser.personalData.addresses.map((x, i) => x.idAddress === address && <div key={i} className={styles.orderDeliveryAddress} onClick={() => setAddress(x.idAddress)}>
                                <img src='/iconMap.svg' />
                                <p className={styles.orderDeliveryAddressText} >{x.street}, д.{x.house}, кв.{x.appartment}</p>
                            </div>)}
                            <div className={styles.anotherAddress} onClick={() => setAddress('')} >Другой адрес</div>
                        </div>
                    </>}
            </>}
            <hr className={styles.hr} />
            <button className={styles.orderButtonPay} onClick={buy} >ОПЛАТИТЬ</button>
        </div>}
        <Modal onClose={onClose} isOpen={isOpen} autoFocus={false} isCentered size='xl' >
            <ModalOverlay />
            <ModalContent>
                <ModalBody p={0}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalHeaderLine}>
                                <p className={styles.modalHeaderTitle}>ДОБАВИТЬ АДРЕС</p>
                                <img src='/cross.svg' className={styles.cross} onClick={() => onClose()} />
                            </div>
                            <hr className={styles.modalHr} />
                            <div className={styles.modalColumn}>
                                <p className={styles.modalSubtitle}>Заполните данные адреса доставки</p>
                                <div className={styles.modalColumnInput}>
                                    <p className={styles.modalInputTitle}>Город</p>
                                    <input className={styles.modalInput} onChange={(e) => setNewAddressData({ ...newAddressData, city: e.target.value })} value={newAddressData.city} />
                                </div>
                                <div className={styles.modalColumnInput}>
                                    <p className={styles.modalInputTitle}>Улица</p>
                                    <input className={styles.modalInput} onChange={(e) => setNewAddressData({ ...newAddressData, street: e.target.value })} value={newAddressData.street} />
                                </div>
                                <div className={styles.modalInputLine} >
                                    <div className={styles.modalColumnInput}>
                                        <p className={styles.modalInputTitle}>Дом</p>
                                        <input className={styles.modalInputLil} onChange={(e) => setNewAddressData({ ...newAddressData, house: e.target.value })} value={newAddressData.house} />
                                    </div>
                                    <div className={styles.modalColumnInput}>
                                        <p className={styles.modalInputTitle}>Квартира</p>
                                        <input className={styles.modalInputLil} onChange={(e) => setNewAddressData({ ...newAddressData, appartment: e.target.value })} value={newAddressData.appartment} />
                                    </div>
                                </div>
                                <div className={styles.modalSaveButton} onClick={() => {
                                    setDataUser({ ...dataUser, personalData: { ...dataUser.personalData, addresses: [...dataUser.personalData.addresses, newAddressData] } });
                                    setNewAddressData({});
                                    onClose();
                                }}>СОХРАНИТЬ</div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
        <Modal onClose={() => setSuccessModal(false)} isOpen={successModal} autoFocus={false} isCentered size='xl' >
            <ModalOverlay />
            <ModalContent>
                <ModalBody p={0}>
                    <div className={styles.modalSuccess}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalHeaderLine}>
                                <p className={styles.modalHeaderTitle}>ЗАКАЗ ОФОРМЛЕН</p>
                                <img src='/cross.svg' className={styles.cross} onClick={() => setSuccessModal(false)} />
                            </div>
                            <hr className={styles.modalHr} />
                        </div>
                        <div className={styles.modalSuccessColumn}>
                            <div className={styles.modalSuccessColumnLil}>
                                <p className={styles.modalSuccessTitle}>ЗАКАЗ № {successData.id}</p>
                                <p className={styles.modalSuccessText}>{formatDate(successData.createDate)}</p>
                            </div>
                            <div className={styles.modalSuccessStatus} >
                                <img src='/infoIcon.svg' />
                                <p className={styles.modalSuccessText}>Ваш заказ обрабатывается </p>
                            </div>
                            <div className={styles.modalSuccessColumnMiddle} >
                                <p className={styles.modalSuccessTitle}>Доставка</p>
                                <div className={styles.itemTextColumn}>
                                    <div className={styles.modalSuccessLine}>
                                        <img src='/iconMap.svg' className={styles.modalSuccessLineIcon} style={{ width: '22px' }} />
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
                            <p className={styles.modalSuccessGold} >Оплачено: {formatNumber(successData.total)} руб.</p>
                            <div className={styles.modalSaveButton} onClick={() => router.push('/cabinet?page=myorders')}>ДЕТАЛИ ЗАКАЗА</div>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    </div >
};


function ProductItem({ item, count, load }) {

    const [data, setData] = useState({});
    const toast = useToast();

    useEffect(() => {
        loadNow();
    }, []);

    function loadNow() {
        axios.post(`${API_BASE_URL}getOneProduct`, { id: item })
            .then((res) => {
                setData(res.data);
            })
            .catch((e) => console.log(e));
    };

    function deleteProduct() {
        axios.post(`${API_BASE_URL}deleteProductFromBag`, { id: item }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                toast({ position: 'bottom-right', render: () => (<div className="toast">Товар успешно удален</div>), duration: 3000 });
                load();
            })
            .catch((e) => console.log(e));
    };

    function plusProduct() {
        axios.post(`${API_BASE_URL}plusProductToBag`, { id: item }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                load();
            })
            .catch((e) => console.log(e));
    };

    function minusProduct() {
        axios.post(`${API_BASE_URL}minusProductFromBag`, { id: item }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                load();
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.item}>
        <div className={styles.itemRow}>
            <img src={`/${data.img}`} className={styles.itemCover} />
            <div className={styles.itemTextColumn}>
                <div className={styles.itemTextColumnLil} >
                    <p className={styles.itemName}>{data.name}</p>
                    <p className={styles.itemText}>{data.text}</p>
                </div>
                <p className={styles.itemCost} >{formatNumber(data.cost)} руб.</p>
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