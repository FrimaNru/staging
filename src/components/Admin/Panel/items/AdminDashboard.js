import styles from "@/styles/Admin.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../../apiConfig";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useToast } from '@chakra-ui/react';
import { formatDateFromTimestamp, formatNumber } from "@/lib/Formatting";
import Link from "next/link";
import { ButtonDownloadExcel } from "@/components";

const stataTitle = {
    'accounts': 'Созданных аккаунтов',
    'orders': 'Оформленных заказов',
    'products': 'Купленных товаров'
};

const status = {
    'CONFIRMED': 'Оплачено',
    'REJECTED': 'Не оплачено'
};

export function AdminDashboard() {

    const [statistick, setStatistick] = useState({});
    const [users, setUsers] = useState([]);
    const toast = useToast();

    useEffect(() => {
        load();
    }, []);

    function load() {
        axios.get(`${API_BASE_URL}statistickDashboard`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then((res) => {
                setStatistick(res.data);
            })
            .catch((e) => console.log(e));
        axios.get(`${API_BASE_URL}allUsers`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then((res) => {
                setUsers(res.data);
            })
            .catch((e) => console.log(e));
    };

    function deleteUser(id) {
        axios.post(`${API_BASE_URL}deleteUser`, { id }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then(() => {
                load();
                toast({ position: 'bottom-right', render: () => (<div className="toast">Пользователь успешно удален</div>), duration: 3000 });
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.dashboard}>
        <p className={styles.title}>Дашборд</p>
        <div className={styles.dashboardLine}>
            {['accounts', 'orders', 'products'].map((x, i) => <div key={i} className={styles.dashboardLineItem} >{stataTitle[x]}: {statistick[x]}</div>)}
        </div>
        <div className={styles.dashboardColumn}>
            <div className={styles.dashboardSubtitleLine}>
                <p className={styles.subtitle}>Пользователи</p>
                <ButtonDownloadExcel data={users} type='users' />
            </div>
            <Accordion allowToggle>
                <div className={styles.dashboardColumnUsers}>
                    <div className={styles.dashboardAccordionTableInfo}>
                        <p className={styles.dashboardAccordionButtonTextLil}>Имя</p>
                        <p className={styles.dashboardAccordionButtonTextLil}>Телефон</p>
                        <p className={styles.dashboardAccordionButtonTextLil}>Почта</p>
                        <div className={styles.dashboardAccordionButtonBlockLil}>Активные заказы</div>
                        <div className={styles.dashboardAccordionButtonBlockLil}>Заверш. заказы</div>
                        <div className={styles.dashboardAccordionButtonBlockLil}>Избранные</div>
                    </div>
                    {users.length > 0 && users.map((x, i) => <AccordionItem border='none' key={i}>
                        <div className={styles.dashboardAccordionButton}>
                            <p className={styles.dashboardAccordionButtonText}>{x.name}</p>
                            <p className={styles.dashboardAccordionButtonText}>{x.phone}</p>
                            <p className={styles.dashboardAccordionButtonText}>{x.email}</p>
                            <div className={styles.dashboardAccordionButtonBlock}>{x.orders.length}</div>
                            <div className={styles.dashboardAccordionButtonBlock}>{x.history.length}</div>
                            <div className={styles.dashboardAccordionButtonBlock}>{x.favourite.length}</div>
                            <div className={`${styles.dashboardAccordionButtonBlock} ${styles.dashboarNoBorder}`}>
                                <AccordionButton p={0} alignItems='center' justifyContent='center' _hover={{ bg: 'none' }}>
                                    <AccordionIcon />
                                </AccordionButton>
                            </div>
                        </div>
                        <AccordionPanel p={0}>
                            <div className={styles.accordionPanel}>
                                <div className={styles.accordionPanelColumn}>
                                    <p className={styles.accordionPanelTitle}>Персональная информация</p>
                                    <div className={styles.accordionPanelLine}>
                                        <p className={styles.accordionPanelText}>Фамилия: <span style={{ fontWeight: 800 }}>{x.personalData.lastName}</span></p>
                                        <p className={styles.accordionPanelText}>Пол: <span style={{ fontWeight: 800 }}>{x.personalData.sex}</span></p>
                                        <p className={styles.accordionPanelText}>Дата рождения: <span style={{ fontWeight: 800 }}>{x.personalData.dateBirthday}</span></p>
                                        <p className={styles.accordionPanelText}>Дата создания аккаунта: <span style={{ fontWeight: 800 }}>{formatDateFromTimestamp(Number(x.registerDate))}</span></p>
                                    </div>
                                </div>
                                <hr className={styles.hr} />
                                <div className={styles.accordionPanelColumn}>
                                    <p className={styles.accordionPanelTitle}>Активные заказы</p>
                                    {x.orders.length === 0
                                        ? <p className={styles.accordionPanelText}>Активных заказов нет</p>
                                        : x.orders.map((y, n) => <div key={n} className={styles.accrdionPanelItem}>
                                            <p className={styles.accordionPanelText}>ID: <span style={{ fontWeight: 800 }}>{y.id}</span></p>
                                            <p className={styles.accordionPanelText}>Сумма: <span style={{ fontWeight: 800 }}>{formatNumber(y.total)} руб.</span></p>
                                            <div className={styles.accordionPanelProductLine}>
                                                <p className={styles.accordionPanelText}>Товары:</p>
                                                <div className={styles.accordionPanelProductLineLil}>{y.products.map((z, j) => <ProductItem key={j} id={z} type='img' />)}</div>
                                            </div>
                                            <p className={styles.accordionPanelText}>Статус: <span style={{ fontWeight: 800 }}>{status[y.paymentStatus] ?? 'Не оплачено'}</span></p>
                                        </div>)}
                                </div>
                                <hr className={styles.hr} />
                                <div className={styles.accordionPanelColumn}>
                                    <p className={styles.accordionPanelTitle}>Завершенные заказы</p>
                                    {x.history.length === 0
                                        ? <p className={styles.accordionPanelText}>Завершенных заказов нет</p>
                                        : x.history.map((y, n) => <div key={n} className={styles.accrdionPanelItem}>
                                            <p className={styles.accordionPanelText}>ID: <span style={{ fontWeight: 800 }}>{y.id}</span></p>
                                            <p className={styles.accordionPanelText}>Сумма: <span style={{ fontWeight: 800 }}>{formatNumber(y.total)} руб.</span></p>
                                            <div className={styles.accordionPanelProductLine}>
                                                <p className={styles.accordionPanelText}>Товары:</p>
                                                <div className={styles.accordionPanelProductLineLil}>{y.products.map((z, j) => <ProductItem key={j} id={z} type='img' />)}</div>
                                            </div>
                                            <p className={styles.accordionPanelText}>Статус: <span style={{ fontWeight: 800 }}>{status[y.paymentStatus] ?? 'Не оплачено'}</span></p>
                                        </div>)}
                                </div>
                                <hr className={styles.hr} />
                                <div className={styles.accordionPanelColumn}>
                                    <p className={styles.accordionPanelTitle}>Корзина</p>
                                    {x.bag.length === 0
                                        ? <p className={styles.accordionPanelText}>Корзина пуста</p>
                                        : x.bag.map((y, n) => <ProductItem key={n} id={y} type='bag' />)}
                                </div>
                                <hr className={styles.hr} />
                                <div className={styles.accordionPanelColumn}>
                                    <p className={styles.accordionPanelTitle}>Избранные</p>
                                    {x.favourite.length === 0
                                        ? <p className={styles.accordionPanelText}>Избранных нет</p>
                                        : x.favourite.map((y, n) => <ProductItem key={n} id={y} type='bag' />)}
                                </div>
                                <hr className={styles.hr} />
                                <button className={styles.accordionPanelButton} onClick={() => deleteUser(x._id)} >Удалить аккаунт</button>
                            </div>
                        </AccordionPanel>
                    </AccordionItem>)}
                </div>
            </Accordion>
        </div>
    </div>
};


function ProductItem({ id, type }) {

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

    return (type === 'img'
        ? (data._id && <Link href={`https://mi-alegria.shop/product?id=${data._id}`} className="link" target="_blank" >
            <img src={`https://api.mi-alegria.shop/uploads/${data.cover}`} className={styles.productImg} />
        </Link>)
        : (data.name && <Link href={`https://mi-alegria.shop/product?id=${data._id}`} target="_blank">
            <div className={styles.accrdionPanelItem}>
                <p className={styles.accordionPanelText}><span style={{ fontWeight: 800 }}>{data.name.toUpperCase()}</span></p>
                <img src={`https://api.mi-alegria.shop/uploads/${data.cover}`} className={styles.productImg} />
                <p className={styles.accordionPanelText}><span style={{ fontWeight: 800 }}>{formatNumber(data.cost)} руб.</span></p>
            </div>
        </Link>))
};