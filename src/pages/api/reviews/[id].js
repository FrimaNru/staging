import {
    getReviewById,
    updateReview,
    deleteReview,
} from '@/lib/reviewsStore';
import axios from 'axios';
import { API_BASE_URL } from '../../../../apiConfig';

async function verifyAdmin(req) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return false;
    try {
        await axios.get(`${API_BASE_URL}getAdminData`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return true;
    } catch {
        return false;
    }
}

export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id required' });

    const review = getReviewById(id);
    if (!review) return res.status(404).json({ error: 'Отзыв не найден' });

    if (req.method === 'PATCH') {
        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) {
            return res.status(401).json({ error: 'Требуются права администратора' });
        }
        const { status } = req.body || {};
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Недопустимый статус' });
        }
        const updated = updateReview(id, { status });
        return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) {
            return res.status(401).json({ error: 'Требуются права администратора' });
        }
        deleteReview(id);
        return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['PATCH', 'DELETE']);
    return res.status(405).end();
}
