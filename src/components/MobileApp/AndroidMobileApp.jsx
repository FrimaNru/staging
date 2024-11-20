import styles from "@/styles/MobileApp.module.css";

export default function AndroidMobileApp() {
    return <div className={styles.main}>
        <div className={styles.lilLine}>
            <img src='/Android.svg' className={styles.mainIcon} />
            <p className={styles.mainTitle}>МОБИЛЬНАЯ ВЕРСИЯ ДЛЯ ANDROID</p>
        </div>
        <p className={styles.text}>Чтобы вывести ссылку на сайт на рабочий стол, выполните следующие действия в зависимости от браузера:</p>
        <div className={styles.column}>
            <div className={styles.lilColumn}>
                <div className={styles.titleLine}>
                    <img src='/google.svg' />
                    <p className={styles.titleAndroid}>Google Chrome</p>
                </div>
                <p className={styles.text}>Находясь на вкладке с нужным сайтом, нажмите кнопку главного меню в виде троеточия («⋮») и в списке выберите «Добавить на главный экран».</p>
            </div>
            <hr className={styles.hr} />
            <div className={styles.lilColumn}>
                <div className={styles.titleLine}>
                    <img src='/yandex.svg' />
                    <p className={styles.titleAndroid}>Яндекс.Браузер</p>
                </div>
                <p className={styles.text}>Находясь на вкладке с нужным сайтом, нажмите кнопку главного меню в виде троеточия («⋮») и в списке выберите «Добавить ярлык».</p>
            </div>
            <hr className={styles.hr} />
            <div className={styles.lilColumn}>
                <div className={styles.titleLine}>
                    <img src='/microsoft.svg' />
                    <p className={styles.titleAndroid}>Microsoft Edge</p>
                </div>
                <p className={styles.text}>Находясь на вкладке с нужным сайтом, откройте главное меню, нажав кнопку в виде троеточия («⋯») по центру, и в списке выберите «Добавить на телефоне».</p>
            </div>
            <hr className={styles.hr} />
            <div className={styles.lilColumn}>
                <div className={styles.titleLine}>
                    <img src='/opera.svg' />
                    <p className={styles.titleAndroid}>Opera</p>
                </div>
                <p className={styles.text}>Находясь на вкладке с нужным сайтом, нажмите кнопку главного меню в виде троеточия («⋮») и в списке выберите «Домашний экран» под заголовком «Добавить на».</p>
            </div>
            <hr className={styles.hr} />
        </div>
    </div>
};