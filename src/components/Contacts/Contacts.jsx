import Breadcrumb from '../Common/Breadcrumb';
import styles from './styles.module.css';

export default function Contacts() {
    return <div className={styles.main}>
        <div className={styles.contactsHeader}>
            <Breadcrumb />
            <h1 className={styles.contactsHeaderTitle}>Контакты</h1>
        </div>
        <div className={styles.contactsContent}>
            <div className={styles.contactsContentColumnBig}>
                <div className={styles.contactsContentColumn}>
                    <div className={styles.contactsContentColumnText}>
                        <h2>Адрес</h2>
                        <p>БЦ "Омега Плаза", улица Ленинская Слобода, 19, Москва, 115280</p>
                    </div>
                    <div className={styles.contactsContentColumnText}>
                        <h2>Телефон</h2>
                        <a href="tel:+79165850585" target="_blank"><p>+7 (916) 585-05-85</p></a>
                    </div>
                    <div className={styles.contactsContentColumnText}>
                        <h2>Email</h2>
                        <a href="mailto:clientcare@mi-alegria.shop" target="_blank"><p>clientcare@mi-alegria.shop</p></a>
                    </div>
                    <div className={styles.contactsContentColumnText}>
                        <h2>Время работы</h2>
                        <p>Пн-Пт: 10:00 - 19:00</p>
                    </div>
                </div>
                <div className={styles.contactsMediaBlock}>
                    <div className={styles.contactsMedia}>
                        {[{ text: 'Telegram', link: 'https://t.me/miAlegriaru' }, { text: 'WhatsApp', link: 'https://wa.me/79165850585' }, { text: 'ВКонтакте', link: 'https://vk.com/mialegriashop' }].map((item, index) => (
                            <a href={item.link} target="_blank" key={index} className={styles.contactsMediaLink} >
                                <img src={`/${item.text}.svg`} alt={item.text} />
                            </a>
                        ))}
                    </div>
                    <div className={styles.visitBlock}>Посещение по предварительной записи</div>
                </div>
            </div>
            <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A92ccc18c63fd75b1fc241a929f9e5efdacb26278756556ed4c7735590a88de44&amp;source=constructor" className={styles.map} frameborder="0"></iframe>
        </div>
    </div>;
}