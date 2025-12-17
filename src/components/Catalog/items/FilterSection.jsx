import styles from "../styles.module.css";

export default function FilterSection({
    sales,
    types,
    stateSales,
    stateType,
    setStateSales,
    setStateType,
    // legacy single-select color (kept for backward compatibility)
    stateColor,
    setStateColor,
    // new filters
    availableColors = [],
    selectedColors = [],
    setSelectedColors,
    priceMin,
    priceMax,
    setPriceMin,
    setPriceMax,
    absoluteMinPrice,
    absoluteMaxPrice,
}) {
    const toggleColor = (color) => {
        if (!setSelectedColors) return;
        setSelectedColors((old) => (old.includes(color) ? old.filter((c) => c !== color) : [...old, color]));
    };
    
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
            </div>

            <div className={styles.lilColumn}>
                <p className={styles.filterTitle}>ФИЛЬТР</p>

                <div className={styles.filterSubBlock}>
                    <p className={styles.filterSubTitle}>Цена</p>
                    <div className={styles.priceInputs}>
                        <input
                            className={styles.priceInput}
                            inputMode="numeric"
                            placeholder={absoluteMinPrice != null ? String(absoluteMinPrice) : "От"}
                            value={priceMin ?? ""}
                            onChange={(e) => setPriceMin?.(e.target.value)}
                        />
                        <span className={styles.priceDash}>—</span>
                        <input
                            className={styles.priceInput}
                            inputMode="numeric"
                            placeholder={absoluteMaxPrice != null ? String(absoluteMaxPrice) : "До"}
                            value={priceMax ?? ""}
                            onChange={(e) => setPriceMax?.(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.filterSubBlock}>
                    <p className={styles.filterSubTitle}>Цвет</p>
                    <div className={styles.colorsList}>
                        {availableColors.length === 0 ? (
                            <p className={styles.filterHint}>Цвета не найдены</p>
                        ) : (
                            availableColors.map((c) => (
                                <div
                                    key={c}
                                    className={styles.filterLine}
                                    onClick={() => toggleColor(c)}
                                >
                                    {selectedColors.includes(c) ? <img src='/goldDotSelect.svg' /> : <img src='/goldDot.svg' />}
                                    <p className={styles.filterText}>{c}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}