import fs from 'fs';
import path from 'path';

// data/ в .gitignore — отзывы хранятся в data/reviews.json
const DATA_DIR = path.join(process.cwd(), 'data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

function readReviews() {
    ensureDataDir();
    try {
        const data = fs.readFileSync(REVIEWS_FILE, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function writeReviews(reviews) {
    ensureDataDir();
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf8');
}

export function getAllReviews() {
    return readReviews();
}

export function getApprovedReviewsByProduct(productId) {
    const reviews = readReviews();
    return reviews.filter(
        (r) => r.productId === productId && r.status === 'approved'
    );
}

export function getReviewById(id) {
    return readReviews().find((r) => r.id === id);
}

export function createReview(review) {
    const reviews = readReviews();
    const newReview = {
        id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        ...review,
        createdAt: new Date().toISOString(),
    };
    reviews.push(newReview);
    writeReviews(reviews);
    return newReview;
}

export function updateReview(id, updates) {
    const reviews = readReviews();
    const idx = reviews.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    reviews[idx] = { ...reviews[idx], ...updates };
    writeReviews(reviews);
    return reviews[idx];
}

export function deleteReview(id) {
    const reviews = readReviews().filter((r) => r.id !== id);
    if (reviews.length === readReviews().length) return false;
    writeReviews(reviews);
    return true;
}

export function getReviewsByUser(userId) {
    return readReviews().filter((r) => r.userId === userId);
}

export function hasUserReviewedProduct(userId, productId) {
    return readReviews().some(
        (r) => r.userId === userId && r.productId === productId
    );
}
