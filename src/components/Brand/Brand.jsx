import styles from "./styles.module.css";
import Breadcrumb from "../Common/Breadcrumb";
import Banner from "../Common/Banner/Banner";
import { brandMaterialText } from "@/constants/constants.text";

export function Brand() {
    return <div className={styles.main}>
        <Banner />
        <div className={styles.mainColumn}>
            <Breadcrumb />
            <div className={styles.contentColumn}>
                <h1 className={styles.title}>О БРЕНДЕ</h1>
                <hr className={styles.hr} />
                <div className={styles.contentColumnBig} >
                    <div className={styles.line}>
                        <p className={styles.text} data-noindex="true">Mi Alegria - это естественное и гармоничное соединение многовековых культурных традиций и современного прочтения в мире украшений. </p>
                        <img src='/assets/images/aboutBrandSmall1.webp' className={styles.imgLine} />
                    </div>
                    <div className={styles.line} >
                        <img src='/assets/images/aboutBrandSmall2.webp' className={styles.imgLine} />
                        <p className={`${styles.text} ${styles.textRight}`}>Наш бренд предлагает  премиальную бижутерию для тех, кто ценит качество и хочет смело, но со вкусом подчеркнуть свою индивидуальность. </p>
                    </div>
                    <div className={styles.columnMobile}>
                        <p className={styles.text} data-noindex="true">Mi Alegria - это естественное и гармоничное соединение многовековых культурных традиций и современного прочтения в мире украшений.</p>
                        <div className={styles.lineMobile}>
                            <img src='/assets/images/aboutBrandSmall1.webp' className={styles.imgLine} />
                            <img src='/assets/images/aboutBrandSmall2.webp' className={styles.imgLine} />
                        </div>
                        <p className={`${styles.text} ${styles.textRight}`}>Наш бренд предлагает  премиальную бижутерию для тех, кто ценит качество и хочет смело, но со вкусом подчеркнуть свою индивидуальность. </p>
                    </div>
                    <p className={styles.text2}>Мы не гонимся за проходящими сезонными тенденциями в моде, наш дизайн актуален для любого возраста, стиля и случая. В офисе, в театре, в ресторане и на прогулке вы будете выглядеть великолепно. </p>
                    <img src='/assets/images/aboutBrandBig.webp' />
                    <p className={styles.subtitle} >Пробуйте, экспериментируйте, сочетайте - создавайте сами свой неповторимый стиль - дорогой, выразительный и дерзкий.</p>
                    <div className={styles.materialMovedBlock}>
                        <p className={styles.materialMovedTitle}>Материал</p>
                        <p className={styles.materialMovedText} dangerouslySetInnerHTML={{ __html: brandMaterialText }} data-noindex="true" />
                    </div>
                </div>
            </div>
        </div>
    </div>
}