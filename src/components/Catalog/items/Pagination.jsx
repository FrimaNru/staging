// Pagination.js (полностью переписанный)
import styles from "../styles.module.css";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Pagination({ currentPage, totalPages }) {
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

    // Генерируем URL для страницы
    const getPageUrl = (page) => {
        if (page === 1) {
            // Для первой страницы убираем параметр пагинации
            const newQuery = { ...router.query };
            delete newQuery.PAGEN_1;
            delete newQuery.page;
            
            const queryString = new URLSearchParams(newQuery).toString();
            return queryString ? `/catalog?${queryString}` : '/catalog';
        } else {
            // Для остальных страниц добавляем параметр PAGEN_1
            const newQuery = { ...router.query };
            newQuery.PAGEN_1 = page.toString();
            
            const queryString = new URLSearchParams(newQuery).toString();
            return `/catalog?${queryString}`;
        }
    };

    // Обработчик клика для первой страницы
    const handleFirstPageClick = (e) => {
        e.preventDefault();
        
        // Если мы уже на первой странице, ничего не делаем
        if (currentPage === 1) return;
        
        // Убираем параметр пагинации из URL
        const newQuery = { ...router.query };
        delete newQuery.PAGEN_1;
        delete newQuery.page;
        
        // Переходим на первую страницу
        router.push({
            pathname: '/catalog',
            query: newQuery
        });
    };

    // Обработчик для кнопки "Предыдущая" при переходе на первую страницу
    const handlePrevPageClick = (e) => {
        e.preventDefault();
        
        if (currentPage === 2) {
            // Если переходим с 2-й на 1-ю страницу
            const newQuery = { ...router.query };
            delete newQuery.PAGEN_1;
            delete newQuery.page;
            
            router.push({
                pathname: '/catalog',
                query: newQuery
            });
        } else {
            // Для остальных случаев используем обычную ссылку
            window.location.href = getPageUrl(currentPage - 1);
        }
    };

    const visiblePages = getVisiblePages();

    return (
        <div className={styles.pagination}>
            {/* Кнопка "Предыдущая" */}
            {currentPage > 1 ? (
                currentPage === 2 ? (
                    // Если мы на 2-й странице, используем специальный обработчик для перехода на 1-ю
                    <button 
                        onClick={handlePrevPageClick}
                        className={styles.paginationButton}
                    >
                        <img
                            src='/assets/icons/lilArrow.svg'
                            className={styles.paginationButtonIconLeft}
                            alt="Предыдущая страница"
                        />
                    </button>
                ) : (
                    // Для остальных страниц используем обычную ссылку
                    <Link href={getPageUrl(currentPage - 1)}>
                        <button className={styles.paginationButton}>
                            <img
                                src='/assets/icons/lilArrow.svg'
                                className={styles.paginationButtonIconLeft}
                                alt="Предыдущая страница"
                            />
                        </button>
                    </Link>
                )
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
                        page === 1 ? (
                            // Для первой страницы используем специальный обработчик
                            <button
                                key={page}
                                onClick={handleFirstPageClick}
                                className={`${styles.paginationButton} ${currentPage === page ? styles.paginationButtonActive : ''}`}
                            >
                                {page}
                            </button>
                        ) : (
                            // Для остальных страниц используем обычные ссылки
                            <Link key={page} href={getPageUrl(page)}>
                                <button
                                    className={`${styles.paginationButton} ${currentPage === page ? styles.paginationButtonActive : ''}`}
                                >
                                    {page}
                                </button>
                            </Link>
                        )
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