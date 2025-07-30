import styles from "./styles.module.css";
import Link from "next/link";
import Breadcrumb from "../Common/Breadcrumb";

export default function DeliveryPage() {
    return <div className={styles.main}>
        <Breadcrumb />
        <div className={styles.mainRow}>
            <div className={styles.columnNavigation}>
                <div className={styles.columnNavigationLil}>
                    <p className={`${styles.navigationLink} ${styles.navigationLinkSelect}`}>Доставка и оплата</p>
                    <hr className={styles.hrLink} />
                </div>
                <Link href='/documents/policy'>
                    <p className={`${styles.navigationLink}`}>Политика конфиденциальности</p>
                </Link>
                <Link href='/documents/agreement'>
                    <p className={`${styles.navigationLink}`}>Пользовательское соглашение</p>
                </Link>
            </div>
            <div className={styles.contentColumn}>
                <div className={styles.contentFirstColumn}>
                    <h1 className={styles.contentFirstColumnTitle}>Способы доставки</h1>
                    <div className={styles.contentFirstColumnLil}>
                        <div className={styles.contentFirstColumnLine}>
                            <img src='/goldCircle.svg' className={styles.contentFirstColumnCircle} />
                            <p className={styles.contentFirstColumnText}>Пункты выдачи СДЭК</p>
                        </div>
                    </div>
                </div>
                <div className={styles.orderLoadBlock} >Заказы обрабатываются с 10:00 до 18:00 с понедельника по пятницу.</div>
                <hr className={styles.hr} />
                {/* <div className={styles.contentFirstColumnLil}>
                            <p className={styles.contentSecondColumnTitle}>Курьерская доставка до двери</p>
                            <p className={styles.contentFirstColumnText}>Курьерская доставка по Москве (в пределах МКАД):<br />
                                Доставка возможна на следующий рабочий день, если заказ был оформлен <br />
                                до 12:00 по Московскому времени. Вам придет sms уведомление, когда заказ <br />
                                будет отгружен (передан в курьерскую службу).</p>
                        </div> */}
                <div className={styles.contentFirstColumnLil}>
                    <p className={styles.contentSecondColumnTitle}>Пункты выдачи СДЭК</p>
                    <p className={styles.contentFirstColumnText}>Доставка осуществляется курьерской службой до пункта выдачи заказов (ПВЗ). Сроки доставки зависят от региона и отобразятся после выбора конкретного ПВЗ.<br /><br />Оплата при оформлении заказа картой в личном кабинете.</p>
                </div>
            </div>
        </div>
    </div>
}