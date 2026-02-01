import { hasUserReviewedProduct } from '@/lib/reviewsStore';
import axios from 'axios';
import { API_BASE_URL } from '../../../../apiConfig';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end();
    }

    const { productId } = req.query;
    if (!productId) return res.status(400).json({ error: 'productId required' });

    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
        return res.status(200).json({ hasReviewed: false });
    }

    try {
        const userRes = await axios.get(`${API_BASE_URL}getUser`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const hasReviewed = hasUserReviewedProduct(userRes.data._id, productId);
        return res.status(200).json({ hasReviewed });
    } catch {
        return res.status(200).json({ hasReviewed: false });
    }
}
