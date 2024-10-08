import styles from "@/styles/Admin.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../../../apiConfig";
import { Accordion, AccordionItem, AccordionPanel, AccordionIcon, AccordionButton, useToast } from "@chakra-ui/react";
import { formatNumber, formatDate } from "@/lib/Formatting";
import Link from "next/link";
import { ButtonDownloadExcel } from "./DownloadExcel";

const stataTitle = {
    'total': 'Общее количество заказов',
    'active': 'Количество активных заказов'
};

const status = {
    'processed': 'Ваш заказ обрабатывается',
    'CONFIRMED': 'Оплачено',
    'delivery': 'Ваш заказ передан в доставку',
    'complete': 'Доставлен',
    'canceled': 'Отменён'
};

export function AdminOrders() {

    const toast = useToast();
    const [statistick, setStatistick] = useState({});
    const [active, setActive] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        load();
    }, []);

    function load() {
        axios.get(`${API_BASE_URL}statistickOrders`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then((res) => {
                setStatistick(res.data);
            })
            .catch((e) => console.log(e));
        axios.get(`${API_BASE_URL}allOrders`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then((res) => {
                console.log(res.data);
                setActive(res.data.active);
                setHistory(res.data.history);
            })
            .catch((e) => console.log(e));

    };

    function changeStatus(status, orderId, userId) {
        axios.post(`${API_BASE_URL}changeStatus`, { status, orderId, userId }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then(() => {
                load();
                toast({ position: 'bottom-right', render: () => (<div className="toast">Успешно обновлено</div>), duration: 3000 });
            })
            .catch((e) => console.log(e));
    };

    function deleteOrder(status, orderId, userId) {
        axios.post(`${API_BASE_URL}deleteOrder`, { status, orderId, userId }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then(() => {
                load();
                toast({ position: 'bottom-right', render: () => (<div className="toast">Заказ удалён</div>), duration: 3000 });
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.dashboard}>
        <p className={styles.title}>Заказы</p>
        <div className={styles.dashboardLine}>
            {['total', 'active'].map((x, i) => <div key={i} className={styles.ordersLineItem}>{stataTitle[x]}: {statistick[x]}</div>)}
        </div>

        <div className={styles.ordersColumn}>
            <div className={styles.dashboardSubtitleLine}>
                <p className={styles.subtitle}>Активные заказы</p>
                <ButtonDownloadExcel data={active} type='active' />
            </div>
            <Accordion allowToggle>
                <div className={styles.ordersColumn}>
                    {active.length > 0 && (active.map((x, i) => <AccordionItem border='none' key={i}>
                        <div className={styles.dashboardAccordionButton}>
                            <p className={styles.dashboardAccordionButtonText}>ID: {x.id}</p>
                            <p className={styles.dashboardAccordionButtonText}>{formatNumber(x.total)} руб.</p>
                            <p className={styles.ordersAccordionButtonText}>{status[x.status]}</p>
                            <div className={styles.dashboardAccordionButtonBlock}>{x.products.length}</div>
                            <div className={`${styles.dashboardAccordionButtonBlock} ${styles.dashboarNoBorder}`}>
                                <AccordionButton p={0} alignItems='center' justifyContent='center' _hover={{ bg: 'none' }}>
                                    <AccordionIcon />
                                </AccordionButton>
                            </div>
                        </div>
                        <AccordionPanel p={0}>
                            <div className={styles.accordionPanel}>
                                <UserItem id={x.userId} />
                                <hr className={styles.hr} />
                                {x.products.map((x, i) => <ProductItem id={x} key={i} />)}
                                <hr className={styles.hr} />
                                <div className={styles.ordersUserLine} >
                                    <p className={styles.ordersUserItem}>{formatDate(x.createDate)}</p>
                                    <p className={styles.ordersUserItem}>{status[x.paymentStatus]}</p>
                                    <p className={styles.ordersUserItem}>{x.delivery.street}</p>
                                    <p className={styles.ordersUserItem}>{x.delivery.date}</p>
                                </div>
                                <hr className={styles.hr} />
                                <div className={styles.ordersButtonLine}>
                                    <button disabled={x.status === 'delivery' && true} className={`${styles.ordersButton} ${x.status === 'delivery' && styles.ordersButtonDisabled}`} onClick={() => changeStatus('delivery', x.id, x.userId)}>В доставке</button>
                                    <button disabled={x.status === 'complete' && true} className={`${styles.ordersButton} ${x.status === 'complete' && styles.ordersButtonDisabled}`} onClick={() => changeStatus('complete', x.id, x.userId)}>Доставлен</button>
                                    <button disabled={x.status === 'canceled' && true} className={`${styles.ordersButton} ${x.status === 'canceled' && styles.ordersButtonDisabled}`} onClick={() => changeStatus('canceled', x.id, x.userId)}>Отменить</button>
                                    <button className={styles.ordersDeleteButton} onClick={() => deleteOrder(x.status, x.id, x.userId)}>
                                        <img src='/deleteIcon.svg' />
                                    </button>
                                </div>
                            </div>
                        </AccordionPanel>
                    </AccordionItem>))}
                    {active.length === 0 && <p className={styles.ordersUserItem}>Активных заказов нет</p>}
                </div>
            </Accordion>
        </div>

        <div className={styles.ordersColumn}>
            <div className={styles.dashboardSubtitleLine}>
                <p className={styles.subtitle}>Прошедшие заказы</p>
                <ButtonDownloadExcel data={active} type='history' />
            </div>
            <Accordion allowToggle>
                <div className={styles.ordersColumn}>
                    {history.length > 0 && history.map((x, i) => <AccordionItem border='none' key={i}>
                        <div className={styles.dashboardAccordionButton}>
                            <p className={styles.dashboardAccordionButtonText}>ID: {x.id}</p>
                            <p className={styles.dashboardAccordionButtonText}>{formatNumber(x.total)} руб.</p>
                            <p className={styles.ordersAccordionButtonText}>{status[x.status]}</p>
                            <div className={styles.dashboardAccordionButtonBlock}>{x.products.length}</div>
                            <div className={`${styles.dashboardAccordionButtonBlock} ${styles.dashboarNoBorder}`}>
                                <AccordionButton p={0} alignItems='center' justifyContent='center' _hover={{ bg: 'none' }}>
                                    <AccordionIcon />
                                </AccordionButton>
                            </div>
                        </div>
                        <AccordionPanel p={0}>
                            <div className={styles.accordionPanel}>
                                <UserItem id={x.userId} />
                                <hr className={styles.hr} />
                                {x.products.map((x, i) => <ProductItem id={x} key={i} />)}
                                <hr className={styles.hr} />
                                <div className={styles.ordersUserLine} >
                                    <p className={styles.ordersUserItem}>{formatDate(x.createDate)}</p>
                                    <p className={styles.ordersUserItem}>{status[x.paymentStatus]}</p>
                                    <p className={styles.ordersUserItem}>{x.delivery.street}</p>
                                    <p className={styles.ordersUserItem}>{x.delivery.date}</p>
                                </div>
                                <hr className={styles.hr} />
                                <div className={styles.ordersButtonLine}>
                                    <button disabled={x.status === 'delivery' && true} className={`${styles.ordersButton} ${x.status === 'delivery' && styles.ordersButtonDisabled}`} onClick={() => changeStatus('delivery', x.id, x.userId)}>В доставке</button>
                                    <button disabled={x.status === 'complete' && true} className={`${styles.ordersButton} ${x.status === 'complete' && styles.ordersButtonDisabled}`} onClick={() => changeStatus('complete', x.id, x.userId)}>Доставлен</button>
                                    <button disabled={x.status === 'processed' && true} className={`${styles.ordersButton} ${x.status === 'processed' && styles.ordersButtonDisabled}`} onClick={() => changeStatus('processed', x.id, x.userId)}>В обработку</button>
                                    <button className={styles.ordersDeleteButton}>
                                        <img src='/deleteIcon.svg' />
                                    </button>
                                </div>
                            </div>
                        </AccordionPanel>
                    </AccordionItem>)}
                    {history.length === 0 && <p className={styles.ordersUserItem}>Завершённых заказов нет</p>}
                </div>
            </Accordion>
        </div>
    </div>
}

function UserItem({ id }) {

    const [data, setData] = useState({});

    useEffect(() => {
        load();
    }, []);

    function load() {
        axios.post(`${API_BASE_URL}getOneUser`, { id }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then((res) => {
                setData(res.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return <div className={styles.ordersUserLine} >
        <p className={styles.ordersUserItem}>{data?.name} {data?.personalData?.lastName}</p>
        <p className={styles.ordersUserItem}>{data.email}</p>
        <p className={styles.ordersUserItem}>{data.phone}</p>
    </div>
};

function ProductItem({ id }) {

    const [data, setData] = useState({});

    useEffect(() => {
        load();
    }, []);

    function load() {
        axios.post(`${API_BASE_URL}getOneProduct`, { id })
            .then((res) => {
                setData(res.data);
            })
            .catch((e) => console.log(e));
    };

    return (data.name && <Link href={`/product?id=${data._id}`} target="_blank">
        <div className={styles.accrdionPanelItem}>
            <p className={styles.accordionPanelText}>{data.name.toUpperCase()}</p>
            <img src={`https://api.mi-alegria.shop/uploads/${data.cover}`} className={styles.productImg} />
            <p className={styles.accordionPanelText}>{formatNumber(Number(data.cost))} руб.</p>
        </div>
    </Link>)
};