import styles from "@/styles/Delivery.module.css";
import Link from "next/link";
import { useState } from "react";
import { Breadcrumb } from "@/components";

export function DeliveryPage() {

    const [state, setState] = useState('Доставка');

    return <div className={styles.main}>
        <Breadcrumb />
        <div className={styles.mainRow} >
            <div className={styles.columnNavigation} >
                <div className={styles.columnNavigationLil} >
                    <p className={`${styles.navigationLink} ${state === 'Доставка' && styles.navigationLinkSelect}`} onClick={() => setState('Доставка')} >Доставка</p>
                    {state === 'Доставка' && <hr className={styles.hr} style={{ width: '94px' }} />}
                </div>
                <div className={styles.columnNavigationLil} >
                    <p className={`${styles.navigationLink} ${state === 'Способы оплаты' && styles.navigationLinkSelect}`} onClick={() => setState('Способы оплаты')}>Способы оплаты</p>
                    {state === 'Способы оплаты' && <hr className={styles.hr} style={{ width: '169px' }} />}
                </div>
                <Link href='/policy'>
                    <p className={`${styles.navigationLink}`}>Политика конфиденциальности</p>
                </Link>
            </div>
            <div className={styles.contentColumn}>
                {state === 'Доставка'
                    ? <>
                        <div className={styles.contentFirstColumn} >
                            <p className={styles.contentFirstColumnTitle} >Способы доставки</p>
                            <div className={styles.contentFirstColumnLil} >
                                <div className={styles.contentFirstColumnLine} >
                                    <img src='/goldCircle.svg' className={styles.contentFirstColumnCircle} />
                                    <p className={styles.contentFirstColumnText} >Курьерская доставка до двери</p>
                                </div>
                                <div className={styles.contentFirstColumnLine}>
                                    <img src='/goldCircle.svg' className={styles.contentFirstColumnCircle} />
                                    <p className={styles.contentFirstColumnText}>Пункты выдачи СДЭК</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.orderLoadBlock} >Заказы обрабатываются с 10:00 до 18:00 с понедельника по пятницу.</div>
                        <hr className={styles.hr} />
                        <div className={styles.contentFirstColumnLil}>
                            <p className={styles.contentFirstColumnTitle}>Курьерская доставка до двери</p>
                            <p className={styles.contentFirstColumnText}>Курьерская доставка по Москве (в пределах МКАД):<br />
                                Доставка возможна на следующий рабочий день, если заказ был оформлен <br />
                                до 12:00 по Московскому времени. Вам придет sms уведомление, когда заказ <br />
                                будет отгружен (передан в курьерскую службу).</p>
                        </div>
                        <div className={styles.contentFirstColumnLil}>
                            <p className={styles.contentFirstColumnTitle}>Пункты выдачи СДЭК</p>
                            <p className={styles.contentFirstColumnText}>Курьерская доставка по Москве (в пределах МКАД):<br />
                                Доставка возможна на следующий рабочий день, если заказ был оформлен <br />
                                до 12:00 по Московскому времени. Вам придет sms уведомление, когда заказ <br />
                                будет отгружен (передан в курьерскую службу).</p>
                        </div>
                    </>
                    : <></>}
            </div>
        </div>
    </div>
}