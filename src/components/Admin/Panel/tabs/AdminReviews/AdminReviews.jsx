import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../apiConfig";
import Button from "@/ui/Button/Button";
import { StarRating } from "@/components/Reviews/StarRating";
import { formatDate } from "@/lib/Formatting";
import AdminReviewsCreateModal from "./items/AdminReviewsCreateModal";

const STATUS_LABELS = {
    pending: 'На модерации',
    approved: 'Одобрен',
    rejected: 'Отклонён',
};

export default function AdminReviews() {
    const [data, setData] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [createOpen, setCreateOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const url = statusFilter
                ? `${API_BASE_URL}reviews/admin?status=${statusFilter}`
                : `${API_BASE_URL}reviews/admin`;
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` },
            });
            setData(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [statusFilter]);

    const handleModerate = async (id, status) => {
        try {
            await axios.patch(`${API_BASE_URL}reviews/${id}`, { status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` },
            });
            load();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Удалить отзыв?')) return;
        try {
            await axios.delete(`${API_BASE_URL}reviews/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` },
            });
            load();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.main}>
            <p className={styles.title}>Отзывы</p>
            <div className={styles.card}>
                <div className={styles.subtitleLine}>
                    <div className={styles.filterLine}>
                        <span className={styles.filterLabel}>Статус:</span>
                        <select
                            className={styles.filterSelect}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Все</option>
                            <option value="pending">На модерации</option>
                            <option value="approved">Одобренные</option>
                            <option value="rejected">Отклонённые</option>
                        </select>
                    </div>
                    <Button variant="success" size="small" onClick={() => setCreateOpen(true)}>
                        Создать отзыв
                    </Button>
                </div>
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <p className={styles.thProduct}>Товар</p>
                        <p className={styles.thAuthor}>Автор</p>
                        <p className={styles.thRating}>Оценка</p>
                        <p className={styles.thText}>Текст</p>
                        <p className={styles.thStatus}>Статус</p>
                        <p className={styles.thDate}>Дата</p>
                        <p className={styles.thActions}>Действия</p>
                    </div>
                    <div className={styles.tableContent}>
                        {loading ? (
                            <p className={styles.noItems}>Загрузка...</p>
                        ) : data.length > 0 ? (
                            [...data].reverse().map((item) => (
                                <div key={item.id} className={styles.tableRow}>
                                    <div className={styles.tdProduct}>{item.productId}</div>
                                    <div className={styles.tdAuthor}>{item.authorName}</div>
                                    <div className={styles.tdRating}>
                                        <StarRating rating={item.rating} size="sm" />
                                    </div>
                                    <div className={styles.tdText}>{item.text || '—'}</div>
                                    <div className={styles.tdStatus}>
                                        <span className={styles[`status_${item.status}`]}>
                                            {STATUS_LABELS[item.status] || item.status}
                                        </span>
                                    </div>
                                    <div className={styles.tdDate}>{formatDate(item.createdAt)}</div>
                                    <div className={styles.tdActions}>
                                        {item.status === 'pending' && (
                                            <>
                                                <button
                                                    className={styles.actionBtn}
                                                    onClick={() => handleModerate(item.id, 'approved')}
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    className={styles.actionBtnReject}
                                                    onClick={() => handleModerate(item.id, 'rejected')}
                                                >
                                                    ✕
                                                </button>
                                            </>
                                        )}
                                        <button
                                            className={styles.actionBtnDelete}
                                            onClick={() => handleDelete(item.id)}
                                            title="Удалить"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noItems}>Отзывов нет</p>
                        )}
                    </div>
                </div>
                <AdminReviewsCreateModal
                    isOpen={createOpen}
                    setIsOpen={setCreateOpen}
                    load={load}
                />
            </div>
        </div>
    );
}
