// Pagination.js (полностью переписанный)
import styles from "../styles.module.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const getVisiblePages = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 3) {
            return [1, 2, 3, 4, '...', totalPages];
        }

        if (currentPage >= totalPages - 2) {
            return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }

        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    const visiblePages = getVisiblePages();

    return (
        <div className={styles.pagination}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
            >
                <img
                    src='/assets/icons/lilArrow.svg'
                    className={styles.paginationButtonIconLeft}
                />
            </button>
            <div className={styles.paginationLine}>
                {visiblePages.map((page, index) => (
                    page === '...' ? (
                        <span key={`dots-${index}`} className={styles.paginationDots}>...</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`${styles.paginationButton} ${currentPage === page ? styles.paginationButtonActive : ''
                                }`}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
            >
                <img
                    src='/assets/icons/lilArrow.svg'
                    className={styles.paginationButtonIcon}
                />
            </button>
        </div>
    );
}