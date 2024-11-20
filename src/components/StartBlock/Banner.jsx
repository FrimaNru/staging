import styles from "@/styles/StartBlock.module.css";

export default function BannerMainPage() {
    return <div className={styles.imageBlock}>
        <img className={styles.backImg} src='/backCatalog.png' />
        <p className={styles.logoText}>ЮВЕЛИРНЫЕ ДИЗАЙНЕРСКИЕ УКРАШЕНИЯ</p>
    </div>
};