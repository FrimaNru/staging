import styles from '@/styles/Footer.module.css';
import Link from 'next/link';

export function Footer() {
    return <div className={styles.main}>
        <hr className={styles.hr} />
        <div className={styles.content}>
            <div className={styles.brandColumn}>
                <Link href='/' style={{ width: 'max-content' }}>
                    <img src='/logoBlack.svg' className={styles.logo} />
                </Link>

                <div className={styles.contacts}>
                    <p className={`${styles.contactItem} ${styles.contactAddress}`}>
                        БЦ "Омега Плаза", улица Ленинская Слобода, 19, Москва, 115280
                    </p>
                    <a className={styles.contactLink} href="tel:+79165850585">+7 (916) 585-0-585</a>
                    <a className={styles.contactLink} href="mailto:clientcare@mi-alegria.shop">clientcare@mi-alegria.shop</a>
                    <p className={styles.contactItem}>Пн-Пт 10:00 - 19:00</p>
                </div>
            </div>
            {links.map((x, i) => <div key={i} className={styles.column}>
                <p className={styles.title} >{x.title}</p>
                {x.links.map((y, n) => x.title === 'Соц сети' || x.title === 'МОБИЛЬНАЯ ВЕРСИЯ'
                    ? <Link href={y.link} key={n} target={x.title === 'Соц сети' ? '_blank' : ''}>
                        <div className={styles.line}>
                            <img src={`/${y.text}.svg`} />
                            <p className={styles.text}>{y.text}</p>
                        </div>
                    </Link>
                    : <Link href={y.link} key={n} ><p className={styles.text}>{y.text}</p></Link>)}
            </div>)}
            <div className={styles.lineMobile}>
                {linksMobile.map((x, i) => (x.title === 'КЛИЕНТАМ' || x.title === 'Информация' || x.title === 'Документация') && <div key={i} className={styles.columnMobile}>
                    <p className={styles.title} >{x.title}</p>
                    {x.links.map((y, n) => x.title === 'Соц сети' || x.title === 'МОБИЛЬНАЯ ВЕРСИЯ'
                        ? <Link href={y.link} key={n} target={x.title === 'Соц сети' ? '_blank' : ''}>
                            <div className={styles.line}>
                                <img src={`/${y.text}.svg`} />
                            </div>
                        </Link>
                        : <Link href={y.link} key={n} ><p className={styles.text}>{y.text}</p></Link>)}
                </div>)}
            </div>
            <div className={styles.columnMobile}>
                {linksMobile.map((x, i) => (x.title === 'Соц сети' || x.title === 'МОБИЛЬНАЯ ВЕРСИЯ') && <div key={i} className={styles.columnMobile} style={{ marginTop: i === 4 ? '10px' : null }} >
                    <p className={styles.title} >{x.title}</p>
                    <div className={styles.columnMobileLine}>
                        {x.links.map((y, n) => x.title === 'Соц сети' || x.title === 'МОБИЛЬНАЯ ВЕРСИЯ'
                            ? <Link href={y.link} key={n} target={x.title === 'Соц сети' ? '_blank' : ''}>
                                <div className={styles.line}>
                                    <img src={`/${y.text}.svg`} className={styles.icon} />
                                </div>
                            </Link>
                            : <Link href={y.link} key={n}><p className={styles.text}>{y.text}</p></Link>)}
                    </div>
                </div>)}
            </div>
        </div>
    </div>
}

const links = [
    { title: 'КЛИЕНТАМ', links: [{ text: 'О бренде', link: '/brand' }, { text: 'Новинки', link: '/catalog?filter=new' }, { text: 'Каталог', link: '/catalog' }] },
    { title: 'Информация', links: [{ text: 'Частые вопросы', link: '/faq' }, { text: 'Доставка', link: '/delivery' }, { text: 'Контакты', link: '/kontakty' }] },
    { title: 'Соц сети', links: [{ text: 'Telegram', link: 'https://t.me/miAlegriaru' }, { text: 'WhatsApp', link: 'https://wa.me/79165850585' }, { text: 'ВКонтакте', link: 'https://vk.com/mialegriashop' }] },
    { title: 'Документация', links: [{ text: 'Политика конфиденциальности', link: '/documents/policy' }, { text: 'Пользовательское соглашение', link: '/documents/agreement' }, { text: 'Обратная связь', link: '/feedback' }] },
    { title: 'МОБИЛЬНАЯ ВЕРСИЯ', links: [{ text: 'IOS', link: '/mobileApp/ios' }, { text: 'Android', link: '/mobileApp/android' }] },
];

const linksMobile = [
    { title: 'КЛИЕНТАМ', links: [{ text: 'О бренде', link: '/brand' }, { text: 'Новинки', link: '/catalog?filter=new' }, { text: 'Каталог', link: '/catalog' }] },
    { title: 'Информация', links: [{ text: 'Частые вопросы', link: '/faq' }, { text: 'Доставка', link: '/delivery' }, { text: 'Контакты', link: '/kontakty' }] },
    { title: 'Документация', links: [{ text: 'Политика конфиденциальности', link: '/documents/policy' }, { text: 'Пользовательское соглашение', link: '/documents/agreement' }, { text: 'Обратная связь', link: '/feedback' }] },
    { title: 'Соц сети', links: [{ text: 'Telegram', link: 'https://t.me/miAlegriaru' }, { text: 'WhatsApp', link: 'https://wa.me/79165850585' }, { text: 'ВКонтакте', link: 'https://vk.com/mialegriashop' }] },
    { title: 'МОБИЛЬНАЯ ВЕРСИЯ', links: [{ text: 'IOS', link: '/mobileApp/ios' }, { text: 'Android', link: '/mobileApp/android' }] },
];