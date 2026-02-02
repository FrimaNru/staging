import { useState, useEffect } from 'react';
import { StarRating } from './StarRating';
import { formatDate } from '@/lib/Formatting';
import { API_BASE_URL } from '../../../apiConfig';
import styles from './Reviews.module.css';

export default function ProductReviews({ productId }) {
    const [data, setData] = useState({ reviews: [], avgRating: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!productId) return;
        fetch(`${API_BASE_URL}reviews?productId=${productId}`)
            .then((res) => res.json())
            .then(setData)
            .catch(() => setData({ reviews: [], avgRating: 0 }))
            .finally(() => setLoading(false));
    }, [productId]);

    if (loading) return <p className={styles.reviewsEmpty}>Загрузка...</p>;

    return (
        <div className={styles.reviewsBlock}>
            <div className={styles.reviewsHeader}>
                <div className={styles.reviewsSummary}>
                    <StarRating rating={data.avgRating} size="md" />
                    <span className={styles.reviewsCount}>
                        {data.reviews.length} {data.reviews.length === 1 ? 'отзыв' : data.reviews.length < 5 ? 'отзыва' : 'отзывов'}
                    </span>
                </div>
            </div>
            {data.reviews.length > 0 ? (
                <div className={styles.reviewsList}>
                    {data.reviews.slice(0, 5).map((r) => (
                        <div key={r.id} className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <span className={styles.reviewAuthor}>{r.authorName}</span>
                                <span className={styles.reviewDate}>{formatDate(r.createdAt)}</span>
                            </div>
                            <StarRating rating={r.rating} size="sm" />
                            {r.text && <p className={styles.reviewText}>{r.text}</p>}
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.reviewsEmpty}>Пока нет отзывов</p>
            )}
        </div>
    );
}
