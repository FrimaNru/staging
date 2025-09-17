import styles from "./styles.module.css";
import { useState } from "react";

export default function HomeDetails() {
    const reasons = [
        {
            title: 'Эксклюзивный дизайн.',
            text: 'Каждое украшение из коллекции Mi Alegria уникально, его дизайн неповторим. Дорогая эффектная бижутерия делает образ утонченным и элегантным, помогая выделяться без лишних слов.'
        },
        {
            title: 'Универсальность.',
            text: 'Украшения бренда можно вписать в любой образ — как повседневный, так и вечерний. Одни и те же серьги или колье будут прекрасно смотреться как с простой белой рубашкой и джинсами, так и с роскошным платьем.'
        },
        {
            title: 'Вневременной характер.',
            text: 'Бижутерия класса люкс от бренда Mi Alegria гармонично сочетает классику и современность, поэтому ее дизайн всегда остается актуальным и прекрасно сочетается с одеждой разных стилей. Ее можно встретить на женщинах всех возрастов — на каждой из них она смотрится уместно и подчеркивает ее индивидуальность.'
        },
        {
            title: 'Ручная работа.',
            text: 'Каждое украшение изготавливается вручную с огромным вниманием к деталям. В качестве основы для аксессуаров используется специальный гипоаллергенный сплав, который затем защищается гальваническим покрытием. Это придает изделиям мягкий блеск и делает их износостойкими.'
        },
        {
            title: 'Доступность.',
            text: 'Ценность украшений не зависит от их цены — именно поэтому в коллекции бренда можно найти уникальные аксессуары, которые сможет позволить себе каждая.'
        }
    ];

    const [openMap, setOpenMap] = useState({});

    const toggle = (index) => {
        setOpenMap((prev) => ({ ...prev, [index]: !prev[index] }));
    };
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>Какую бижутерию класса люкс можно купить у нас</h2>
                <p className={styles.paragraph}>
                    В магазине Mi Alegria представлена элитная бижутерия от лучших мастеров Индии, Таиланда, Турции и Китая. Здесь вы найдете необычные украшения с этническим флером, лаконичные изделия в стиле минимализм и вневременную классику:
                </p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Эффектные браслеты — массивные обручи, тонкие цепочки, элегантные браслеты-кольца;</li>
                    <li className={styles.listItem}>Акцентные многоярусные колье, лаконичные чокеры и изящные кулоны;</li>
                    <li className={styles.listItem}>Оригинальные серьги в виде пусетов и подвесок;</li>
                    <li className={styles.listItem}>Кольца необычного дизайна — как крупные и массивные, так и минималистичные.</li>
                </ul>
                <p className={`${styles.paragraph} ${styles.paragraphSmall}`}>
                    Мы привозим в Москву из наших путешествий только самые выразительные и интересные украшения, отражающие дух и ценности бренда. Все для того, чтобы вы смогли найти среди них свой новый любимый аксессуар для любого случая.
                </p>

                <div className={styles.spacer} />

                <h2 className={styles.title}>5 причин выбрать дизайнерскую бижутерию Mi Alegria</h2>
                <ul className={`${styles.list} ${styles.reasons}`}>
                    {reasons.map((item, index) => (
                        <li className={styles.listItem} key={index}>
                            <div className={styles.accordionHeader} onClick={() => toggle(index)}>
                                <span className={styles.accordionTitle}>{item.title}</span>
                                <img className={styles.accordionIcon} src={openMap[index] ? '/faqArrowOpen.svg' : '/faqArrowClose.svg'} alt={openMap[index] ? 'close' : 'open'} />
                            </div>
                            <div className={`${styles.accordionContent} ${openMap[index] ? styles.accordionContentOpen : ''}`}>
                                <p className={`${styles.paragraph} ${styles.paragraphSmall}`}>{item.text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <p className={`${styles.paragraph} ${styles.paragraphSmall}`}>
                    Купить элитную бижутерию из коллекции Mi Alegria можно на сайте бренда — мы отправим ваш заказ курьерской службой в удобный для вас пункт выдачи.
                </p>
            </div>
        </section>
    );
}


