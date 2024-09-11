import styles from "@/styles/Brand.module.css";
import { Breadcrumb } from "@/components";

export function Brand() {
    return <div className={styles.main}>
        <div className={styles.imageBlock} >
            <img className={styles.backImg} src='/backHandImage.png' />
            <img src='/logoText.svg' className={styles.logoText} />
        </div>
        <div className={styles.mainColumn}>
            <Breadcrumb />
            <div className={styles.contentColumn}>
                <p className={styles.title} >О БРЕНДЕ</p>
                <hr className={styles.hr} />
                <div className={styles.contentColumnBig} >
                    <div className={styles.line} >
                        <p className={styles.text} >Mi Alegria - это естественное и гармоничное соединение многовековых культурных традиций и современного прочтения в мире украшений. </p>
                        <img src='/brandImg.png' className={styles.imgLine} />
                    </div>
                    <div className={styles.line} >
                        <img src='/brandImg.png' className={styles.imgLine} />
                        <p className={styles.text} style={{ textAlign: 'right' }}>Наш бренд предлагает  премиальную бижутерию для тех, кто ценит качество и хочет смело, но со вкусом подчеркнуть свою индивидуальность. </p>
                    </div>
                    <p className={styles.text2}>Мы не гонимся за проходящими сезонными тенденциями в моде, наш дизайн актуален для любого возраста, стиля и случая. В офисе, в театре, в ресторане и на прогулке вы будете выглядеть великолепно. </p>
                    <img src='/brandImg.png' />
                    <p className={styles.subtitle} >Пробуйте, экспериментируйте, сочетайте - создавайте сами свой неповторимый стиль - дорогой, выразительный и дерзкий.</p>
                </div>
            </div>
        </div>
    </div>
}