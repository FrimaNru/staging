import styles from '@/styles/Footer.module.css';
import Link from 'next/link';

export function Footer() {
    return <div className={styles.main}>
        <hr className={styles.hr} />
        <div className={styles.content}>
            <Link href='/' style={{ width: 'max-content' }} ><img src='/logoBlack.svg' /></Link>
            {links.map((x, i) => <div key={i} className={styles.column} >
                <p className={styles.title} >{x.title}</p>
                {x.links.map((y, n) => x.title === 'Соц сети'
                    ? <div className={styles.line} >
                        <img src={`/${y.text}.svg`} />
                        <p>{y.text}</p>
                    </div>
                    : <Link href={y.link} ><p key={n} className={styles.text} >{y.text}</p></Link>)}
            </div>)}
        </div>
    </div>
}

const links = [
    { title: 'КЛИЕНТАМ', links: [{ text: 'О бренде', link: '/brand' }, { text: 'Новинки', link: '/catalog?filter=new' }, { text: 'Каталог', link: '/catalog' }] },
    { title: 'Информация', links: [{ text: 'Частые вопросы', link: '/faq' }, { text: 'Доставка', link: '/delivery' }] },
    { title: 'Соц сети', links: [{ text: 'Telegram', link: '/' }, { text: 'WhatsApp', link: '/' }, { text: 'ВКонтакте', link: '/' }] },
    { title: 'Документация', links: [{ text: 'Политика конфиденциальности', link: '/policy' }, { text: 'Обратная связь', link: '/feedback' }] }
];