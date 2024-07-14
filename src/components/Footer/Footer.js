import styles from '@/styles/Footer.module.css';

export function Footer() {
    return <div className={styles.main}>
        <hr className={styles.hr} />
        <div className={styles.content}>
            <img src='/logoBlack.svg' />
            {links.map((x, i) => <div key={i} className={styles.column} >
                <p className={styles.title} >{x.title}</p>
                {x.links.map((y, n) => x.title === 'Соц сети'
                    ? <div className={styles.line} >
                        <img src={`/${y.text}.svg`} />
                        <p>{y.text}</p>
                    </div>
                    : <p key={n} className={styles.text} >{y.text}</p>)}
            </div>)}
        </div>
    </div>
}

const links = [
    { title: 'КЛИЕНТАМ', links: [{ text: 'О бренде', link: '/brand' }, { text: 'Новинки', link: '/brand' }, { text: 'Каталог', link: '/brand' }] },
    { title: 'Информация', links: [{ text: 'Частые вопросы', link: '/questions' }, { text: 'Доставка', link: '/delivery' }] },
    { title: 'Соц сети', links: [{ text: 'Telegram', link: '/' }, { text: 'WhatsApp', link: '/' }, { text: 'ВКонтакте', link: '/' }] },
    { title: 'Документация', links: [{ text: 'Политика конфиденциальности', link: '/questions' }, { text: 'Обратная связь', link: '/delivery' }] }
];