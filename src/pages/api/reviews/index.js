import {
    getAllReviews,
    getApprovedReviewsByProduct,
    createReview,
    hasUserReviewedProduct,
} from '@/lib/reviewsStore';
import axios from 'axios';
import { API_BASE_URL } from '../../../../apiConfig';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { productId } = req.query;
        if (productId) {
            const reviews = getApprovedReviewsByProduct(productId);
            const avgRating =
                reviews.length > 0
                    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
                    : 0;
            return res
                .status(200)
                .json({ reviews, avgRating: Math.round(avgRating * 10) / 10 });
        }
        return res.status(400).json({ error: 'productId required' });
    }

    if (req.method === 'POST') {
        const { productId, rating, text, orderId, isAdmin, authorName } =
            req.body || {};
        const authHeader = req.headers.authorization;
        const token = authHeader?.replace('Bearer ', '');

        if (!productId || !rating || rating < 1 || rating > 5) {
            return res
                .status(400)
                .json({ error: 'productId и rating (1-5) обязательны' });
        }

        if (isAdmin && token) {
            const adminToken = req.headers['x-admin-token'] || token;
            try {
                await axios.get(`${API_BASE_URL}getAdminData`, {
                    headers: { Authorization: `Bearer ${adminToken}` },
                });
                const review = createReview({
                    productId,
                    rating: Number(rating),
                    text: (text || '').trim(),
                    authorName: authorName || 'Покупатель Mi Alegria',
                    status: 'approved',
                    isAdminCreated: true,
                });
                return res.status(201).json(review);
            } catch (e) {
                return res.status(401).json({ error: 'Неверный токен администратора' });
            }
        }

        if (!token) {
            return res.status(401).json({ error: 'Требуется авторизация' });
        }

        try {
            const userRes = await axios.get(`${API_BASE_URL}getUser`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const user = userRes.data;
            const history = user.history || [];
            const orderIds = user.orders || [];

            // Проверяем в history
            let hasPurchased = history.some(
                (order) =>
                    order.products &&
                    Array.isArray(order.products) &&
                    order.products.some((p) => String(p.id) === String(productId))
            );

            // Если не найден в history — проверяем заказы со статусом complete (бэкенд может ещё не перенести их в history)
            if (!hasPurchased && orderIds.length > 0) {
                for (const orderId of orderIds) {
                    try {
                        const orderRes = await axios.post(
                            `${API_BASE_URL}order`,
                            { id: orderId },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        const order = orderRes.data;
                        if (
                            order &&
                            order.status === 'complete' &&
                            Array.isArray(order.products) &&
                            order.products.some((p) => String(p.id) === String(productId))
                        ) {
                            hasPurchased = true;
                            break;
                        }
                    } catch (e) {
                        // Пропускаем заказ при ошибке
                    }
                }
            }

            if (!hasPurchased) {
                return res
                    .status(403)
                    .json({ error: 'Вы можете оставить отзыв только на купленные товары' });
            }

            if (hasUserReviewedProduct(user._id, productId)) {
                return res
                    .status(400)
                    .json({ error: 'Вы уже оставили отзыв на этот товар' });
            }

            const authorNameToUse =
                user.name || (user.personalData?.firstName || 'Покупатель');
            const review = createReview({
                productId,
                userId: user._id,
                rating: Number(rating),
                text: (text || '').trim(),
                authorName: authorNameToUse,
                orderId: orderId || null,
                status: 'pending',
                isAdminCreated: false,
            });
            return res.status(201).json(review);
        } catch (e) {
            if (e?.response?.status === 401) {
                return res.status(401).json({ error: 'Недействительный токен' });
            }
            console.error('Create review error:', e);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end();
}
