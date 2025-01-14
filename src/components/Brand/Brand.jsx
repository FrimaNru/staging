import styles from "@/styles/Brand.module.css";
import Breadcrumb from "../Common/Breadcrumb";
import Banner from "../Common/Banner/Banner";

export function Brand() {
    return <div className={styles.main}>
        <Banner />
        <div className={styles.mainColumn}>
            <Breadcrumb />
            <div className={styles.contentColumn}>
                <p className={styles.title} >О БРЕНДЕ</p>
                <hr className={styles.hr} />
                <div className={styles.contentColumnBig} >
                    <div className={styles.line}>
                        <p className={styles.text}>Mi Alegria - это естественное и гармоничное соединение многовековых культурных традиций и современного прочтения в мире украшений. </p>
                        <img src='/brandImg.png' className={styles.imgLine} />
                    </div>
                    <div className={styles.line} >
                        <img src='/brandImg.png' className={styles.imgLine} />
                        <p className={`${styles.text} ${styles.textRight}`}>Наш бренд предлагает  премиальную бижутерию для тех, кто ценит качество и хочет смело, но со вкусом подчеркнуть свою индивидуальность. </p>
                    </div>
                    <div className={styles.columnMobile}>
                        <p className={styles.text} >Mi Alegria - это естественное и гармоничное соединение многовековых культурных традиций и современного прочтения в мире украшений.</p>
                        <div className={styles.lineMobile}>
                            <img src='/brandImageMobile.png' className={styles.imgLine} />
                            <img src='/brandImageMobile.png' className={styles.imgLine} />
                        </div>
                        <p className={`${styles.text} ${styles.textRight}`}>Наш бренд предлагает  премиальную бижутерию для тех, кто ценит качество и хочет смело, но со вкусом подчеркнуть свою индивидуальность. </p>
                    </div>
                    <p className={styles.text2}>Мы не гонимся за проходящими сезонными тенденциями в моде, наш дизайн актуален для любого возраста, стиля и случая. В офисе, в театре, в ресторане и на прогулке вы будете выглядеть великолепно. </p>
                    <img src='/brandImg.png' />
                    <p className={styles.subtitle} >Пробуйте, экспериментируйте, сочетайте - создавайте сами свой неповторимый стиль - дорогой, выразительный и дерзкий.</p>
                </div>
            </div>
        </div>
    </div>
}