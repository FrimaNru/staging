import styles from "@/styles/Brand.module.css";

export function Brand() {
    return <div className={styles.main}>
        <div className={styles.imageBlock} >
            <img className={styles.backImg} src='/backHandImage.png' />
            <img src='/logoText.svg' className={styles.logoText} />
        </div>
        <div className={styles.contentColumn}>
            <p className={styles.title} >О БРЕНДЕ</p>
            <hr className={styles.hr} />
            <div className={styles.contentColumnBig} >
                <div className={styles.line} >
                    <p className={styles.text} >Mi Alegria - это гармоничное соединение многовековых культурных традиций
                        и современного прочтения. </p>
                    <img src='/brandImg.png' className={styles.imgLine} />
                </div>
                <div className={styles.line} >
                    <img src='/brandImg.png' className={styles.imgLine} />
                    <p className={styles.text} style={{ textAlign: 'right' }} >Наши украшения созданы<br /> для тех, кто хочет смело<br /> и со вкусом подчеркнуть<br /> свою индивидуальность.</p>
                </div>
                <p className={styles.text2}>Мы не гонимся за проходящими тенденциями в моде,
                    наш дизайн актуален для любого пола, возраста, стиля и случая. </p>
                <img src='/brandImg.png' />
                <p className={styles.subtitle} >Вы сами создаете свой неповторимый стиль - дорогой,<br /> выразительный и дерзкий.</p>
            </div>
        </div>
    </div>
}