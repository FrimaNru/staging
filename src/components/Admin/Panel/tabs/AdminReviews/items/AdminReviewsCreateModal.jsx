import { Modal, ModalContent, ModalOverlay, useToast } from "@chakra-ui/react";
import styles from "../styles.module.css";
import { useState, useEffect } from "react";
import Button from "@/ui/Button/Button";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../../apiConfig";
import { StarRating } from "@/components/Reviews/StarRating";

export default function AdminReviewsCreateModal({ isOpen, setIsOpen, load }) {
    const [productId, setProductId] = useState("");
    const [authorName, setAuthorName] = useState("Покупатель Mi Alegria");
    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");
    const [products, setProducts] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (isOpen) {
            axios
                .get(`${API_BASE_URL}getProducts`)
                .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
                .catch(() => setProducts([]));
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!productId || rating < 1 || rating > 5) {
            toast({
                position: "bottom-right",
                render: () => (
                    <div className="toast">Выберите товар и оценку (1-5)</div>
                ),
                duration: 3000,
            });
            return;
        }

        try {
            setDisabled(true);
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("tokenAdmin")}`,
                    "X-Admin-Token": localStorage.getItem("tokenAdmin"),
                },
                body: JSON.stringify({
                    productId,
                    rating,
                    text: text.trim(),
                    isAdmin: true,
                    authorName: authorName.trim() || "Покупатель Mi Alegria",
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Ошибка");
            }

            toast({
                position: "bottom-right",
                render: () => (
                    <div className="toast">Отзыв создан</div>
                ),
                duration: 3000,
            });
            setIsOpen(false);
            setProductId("");
            setAuthorName("Покупатель Mi Alegria");
            setRating(5);
            setText("");
            load();
        } catch (err) {
            toast({
                position: "bottom-right",
                render: () => (
                    <div className="toast">{err.message || "Ошибка при создании"}</div>
                ),
                duration: 3000,
            });
        } finally {
            setDisabled(false);
        }
    };

    return (
        <Modal
            size="lg"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            isCentered
            autoFocus={false}
        >
            <ModalOverlay />
            <ModalContent bg="none">
                <div className={styles.modal}>
                    <p className={styles.title}>Создать отзыв</p>

                    <div className={styles.modalRow}>
                        <label className={styles.modalLabel}>Товар</label>
                        <select
                            className={styles.modalInput}
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                        >
                            <option value="">— Выберите товар —</option>
                            {products.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.name || p.article || p._id}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.modalRow}>
                        <label className={styles.modalLabel}>Имя автора</label>
                        <input
                            type="text"
                            className={styles.modalInput}
                            placeholder="Покупатель Mi Alegria"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                        />
                    </div>

                    <div className={styles.modalRow}>
                        <label className={styles.modalLabel}>Оценка</label>
                        <StarRating
                            interactive
                            value={rating}
                            onChange={setRating}
                        />
                    </div>

                    <div className={styles.modalRow}>
                        <label className={styles.modalLabel}>Текст отзыва</label>
                        <textarea
                            className={`${styles.modalInput} ${styles.modalTextarea}`}
                            placeholder="Текст отзыва..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    <Button
                        disabled={!productId || disabled}
                        onClick={handleSubmit}
                    >
                        Создать
                    </Button>
                </div>
            </ModalContent>
        </Modal>
    );
}
