import { useState, useEffect } from 'react';
import { StarRating } from './StarRating';
import { API_BASE_URL } from '../../../apiConfig';
import styles from './Reviews.module.css';

export default function ReviewsSummary({ productId, compact = false }) {
    const [data, setData] = useState({ reviews: [], avgRating: 0 });

    useEffect(() => {
        if (!productId) return;
        fetch(`${API_BASE_URL}reviews?productId=${productId}`)
            .then((res) => res.json())
            .then(setData)
            .catch(() => setData({ reviews: [], avgRating: 0 }));
    }, [productId]);

    if (!data.avgRating && !data.reviews?.length) return null;

    return (
        <div className={styles.reviewInline}>
            <StarRating rating={data.avgRating} size="sm" />
            <span className={styles.reviewInlineCount}>
                {data.avgRating > 0 && `${data.avgRating} · `}
                {data.reviews.length} {data.reviews.length === 1 ? 'отзыв' : data.reviews.length < 5 ? 'отзыва' : 'отзывов'}
            </span>
        </div>
    );
}
