import styles from "./styles.module.css";

export default function CircleCheckBox({ active, onClick }) {
    return <div className={`${styles.box} ${active ? styles.boxActive : ''}`} onClick={onClick} >
        <div className={`${styles.circle} ${active ? styles.circleActive : ''}`} />
    </div>
};