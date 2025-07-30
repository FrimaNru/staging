import styles from "./styles.module.css";

export default function IOSMobileApp() {
    return <div className={styles.main}>
        <div className={styles.lilLine}> 
            <img src='/IOS.svg' />
            <h1 className={styles.mainTitle}>МОБИЛЬНАЯ ВЕРСИЯ ДЛЯ IOS</h1>
        </div>
        <p className={styles.text}>Чтобы вывести ссылку на сайт на рабочий стол, выполните следующие действия в зависимости от браузера:</p>
        <div className={styles.column}>
            <div className={styles.lilColumn}>
                <p className={styles.title}>Safari</p>
                <p className={styles.text}>Находясь на вкладке с нужным сайтом, откройте меню «Поделиться», нажав кнопку по центру, и в списке выберите «На экран „Домой“».</p>
            </div>
            <hr className={styles.hr} />
            <div className={styles.lilColumn}>
                <p className={styles.title}>Сторонние браузеры</p>
                <p className={styles.text}>Сторонние браузеры на iOS и iPadOS не поддерживают создание ярлыков сайтов для домашнего экрана, поэтому на iPhone и iPad их можно сделать только с помощью Safari</p>
            </div>
            <hr className={styles.hr} />
        </div>
    </div>
};