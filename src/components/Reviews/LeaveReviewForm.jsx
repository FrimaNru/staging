import { useState } from 'react';
import { StarRating } from './StarRating';
import { useToast } from '@chakra-ui/react';
import styles from './Reviews.module.css';

export default function LeaveReviewForm({ productId, productName, orderId, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating < 1 || rating > 5) {
            toast({
                position: 'bottom-right',
                render: () => <div className="toast">Выберите оценку от 1 до 5 звёзд</div>,
                duration: 3000,
            });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ productId, rating, text: text.trim(), orderId }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Ошибка при отправке');
            }
            toast({
                position: 'bottom-right',
                render: () => <div className="toast">Спасибо! Отзыв отправлен на модерацию</div>,
                duration: 3000,
            });
            setRating(0);
            setText('');
            onSuccess?.();
        } catch (err) {
            toast({
                position: 'bottom-right',
                render: () => <div className="toast">{err.message}</div>,
                duration: 4000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.reviewForm} onSubmit={handleSubmit}>
            <div className={styles.reviewFormStars}>
                <span className={styles.reviewFormLabel}>Оценка</span>
                <StarRating
                    interactive
                    value={rating}
                    onChange={setRating}
                />
            </div>
            <div>
                <span className={styles.reviewFormLabel}>Текст отзыва (необязательно)</span>
                <textarea
                    className={styles.reviewFormTextarea}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Поделитесь впечатлениями о покупке..."
                    maxLength={1000}
                />
            </div>
            <button
                type="submit"
                className={styles.reviewFormSubmit}
                disabled={loading || rating < 1}
            >
                {loading ? 'Отправка...' : 'Отправить отзыв'}
            </button>
        </form>
    );
}
