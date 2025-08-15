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

    
    const getPageUrl = (page) => {
        if (page === 1) {
           
            const newQuery = { ...router.query };
            delete newQuery.PAGEN_1;
            delete newQuery.page;
            
            const queryString = new URLSearchParams(newQuery).toString();
            return queryString ? `/catalog?${queryString}` : '/catalog';
        } else {
            
            const newQuery = { ...router.query };
            newQuery.PAGEN_1 = page.toString();
            
            const queryString = new URLSearchParams(newQuery).toString();
            return `/catalog?${queryString}`;
        }
    };

    
    const handleFirstPageClick = (e) => {
        e.preventDefault();
        
       
        if (currentPage === 1) return;
        
        
        const newQuery = { ...router.query };
        delete newQuery.PAGEN_1;
        delete newQuery.page;
        
        
        router.push({
            pathname: '/catalog',
            query: newQuery
        });
    };

    
    const handlePrevPageClick = (e) => {
        e.preventDefault();
        
        if (currentPage === 2) {
            
            const newQuery = { ...router.query };
            delete newQuery.PAGEN_1;
            delete newQuery.page;
            
            router.push({
                pathname: '/catalog',
                query: newQuery
            });
        } else {
            
            window.location.href = getPageUrl(currentPage - 1);
        }
    };

    const visiblePages = getVisiblePages();

    return (
        <div className={styles.pagination}>
            
            {currentPage > 1 ? (
                currentPage === 2 ? (
                    
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
                            
                            <button
                                key={page}
                                onClick={handleFirstPageClick}
                                className={`${styles.paginationButton} ${currentPage === page ? styles.paginationButtonActive : ''}`}
                            >
                                {page}
                            </button>
                        ) : (
                            
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