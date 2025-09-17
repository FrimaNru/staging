import styles from "./styles.module.css";

export default function HomeIntro() {
    return (
        <section className={`${styles.section} ${styles.intro}`}>
            <div className={styles.container}>
                <div className={styles.row}>
                    <div className={styles.left}>
                        <p className={styles.paragraph}>
                            Mi Alegria — интернет-магазин дизайнерской бижутерии люкс-класса, вдохновленной традициями и культурой разных стран. Наши украшения — это не просто очередной красивый аксессуар, а способ выразить себя и транслировать свои ценности. Эффектное колье, крупные акцентные серьги или несколько минималистичных колец расскажет о вашем стиле и чувстве вкуса больше, чем любые слова. Раскройте свою индивидуальность и создайте уникальный образ с помощью элитной бижутерии от Mi Alegria!
                        </p>
                    </div>
                    <div className={styles.right}>
                        <img src='/assets/images/aboutBrandSmall2.webp' alt='Mi Alegria' className={styles.image} />
                    </div>
                </div>
            </div>
        </section>
    );
}


