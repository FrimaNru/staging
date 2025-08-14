// Pagination.js (полностью переписанный)
import styles from "../styles.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import { getPaginationUrl } from "@/lib/seo";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const router = useRouter();
    
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

    // Генерируем URL для страницы используя SEO конфигурацию
    const getPageUrl = (page) => {
        return getPaginationUrl(page, '/catalog', router.query);
    };

    const visiblePages = getVisiblePages();

    return (
        <div className={styles.pagination}>
            {/* Кнопка "Предыдущая" */}
            {currentPage > 1 ? (
                <Link href={getPageUrl(currentPage - 1)}>
                    <button className={styles.paginationButton}>
                        <img
                            src='/assets/icons/lilArrow.svg'
                            className={styles.paginationButtonIconLeft}
                            alt="Предыдущая страница"
                        />
                    </button>
                </Link>
            ) : (
                <button
                    disabled
                    className={styles.paginationButton}
                >
                    <img
                        src='/assets/icons/lilArrow.svg'
                        className={styles.paginationButtonIconLeft}
                        alt="Предыдущая страница"
                    />
                </button>
            )}
            
            <div className={styles.paginationLine}>
                {visiblePages.map((page, index) => (
                    page === '...' ? (
                        <span key={`dots-${index}`} className={styles.paginationDots}>...</span>
                    ) : (
                        <Link key={page} href={getPageUrl(page)}>
                            <button
                                className={`${styles.paginationButton} ${currentPage === page ? styles.paginationButtonActive : ''}`}
                            >
                                {page}
                            </button>
                        </Link>
                    )
                ))}
            </div>

            {/* Кнопка "Следующая" */}
            {currentPage < totalPages ? (
                <Link href={getPageUrl(currentPage + 1)}>
                    <button className={styles.paginationButton}>
                        <img
                            src='/assets/icons/lilArrow.svg'
                            className={styles.paginationButtonIcon}
                            alt="Следующая страница"
                        />
                    </button>
                </Link>
            ) : (
                <button
                    disabled
                    className={styles.paginationButton}
                >
                    <img
                        src='/assets/icons/lilArrow.svg'
                        className={styles.paginationButtonIcon}
                        alt="Следующая страница"
                    />
                </button>
            )}
        </div>
    );
}