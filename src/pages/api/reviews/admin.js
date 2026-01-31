import { getAllReviews } from '@/lib/reviewsStore';
import axios from 'axios';
import { API_BASE_URL } from '../../../../apiConfig';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end();
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }

    try {
        await axios.get(`${API_BASE_URL}getAdminData`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch {
        return res.status(401).json({ error: 'Неверный токен администратора' });
    }

    const reviews = getAllReviews();
    const { status } = req.query;
    let filtered = reviews;
    if (status === 'pending') {
        filtered = reviews.filter((r) => r.status === 'pending');
    } else if (status === 'approved') {
        filtered = reviews.filter((r) => r.status === 'approved');
    } else if (status === 'rejected') {
        filtered = reviews.filter((r) => r.status === 'rejected');
    }

    return res.status(200).json(filtered);
}
