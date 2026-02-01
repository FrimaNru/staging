import styles from './Reviews.module.css';

export function StarRating({ rating, size = 'md', interactive = false, value, onChange }) {
    const stars = [1, 2, 3, 4, 5];
    const currentValue = interactive ? (value ?? 0) : rating;

    const handleClick = (s) => interactive && onChange && onChange(s);
    const handleMouseEnter = (s) => interactive && onChange && onChange(s);

    return (
        <div className={`${styles.stars} ${styles[size]}`}>
            {stars.map((s) => (
                <span
                    key={s}
                    className={`${styles.star} ${s <= currentValue ? styles.starFilled : ''} ${interactive ? styles.starInteractive : ''}`}
                    onClick={() => handleClick(s)}
                    onMouseEnter={() => handleMouseEnter(s)}
                    role={interactive ? 'button' : undefined}
                >
                    ★
                </span>
            ))}
        </div>
    );
}
