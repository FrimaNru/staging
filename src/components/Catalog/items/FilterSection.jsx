import styles from "../styles.module.css";

export default function FilterSection({ sales, types, stateSales, stateType, setStateSales, setStateType, stateColor, setStateColor }) {
    const colors = ['Под золото', 'Под серебро'];
    
    return (
        <div className={styles.filter}>
            <div className={styles.lilColumn}>
                {sales.map((x, i) => (
                    <div key={i} className={styles.filterLine} onClick={() => setStateSales(old => old.includes(x) ? old.filter(item => item !== x) : [...old, x])}>
                        {stateSales.includes(x) ? <img src='/goldDotSelect.svg' /> : <img src='/goldDot.svg' />}
                        <p className={styles.filterText}>{x}</p>
                    </div>
                ))}
            </div>
            <div className={styles.lilColumn}>
                <p className={styles.filterTitle}>ВИД ИЗДЕЛИЯ</p>
                {types.map((x, i) => (
                    <div key={i} className={styles.filterLine} onClick={() => {
                        if (stateType !== x) setStateType(x);
                        else setStateType('');
                    }}>
                        {stateType === x ? <img src='/goldDotSelect.svg' /> : <img src='/goldDot.svg' />}
                        <p className={styles.filterText}>{x}</p>
                    </div>
                ))}
                {colors.map((x, i) => (
                    <div key={`color-${i}`} className={styles.filterLine} onClick={() => {
                        if (stateColor !== x) setStateColor(x);
                        else setStateColor('');
                    }}>
                        {stateColor === x ? <img src='/goldDotSelect.svg' /> : <img src='/goldDot.svg' />}
                        <p className={styles.filterText}>{x}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}