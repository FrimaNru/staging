import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const maxVisiblePages = 3; // Максимальное количество видимых страниц (текущая + соседние)
    const showEllipsis = totalPages > maxVisiblePages + 2; // Показывать ли точки

    // Вычисление видимых страниц
    const getVisiblePages = () => {
        if (totalPages <= maxVisiblePages + 2) {
            // Если страниц мало, показываем все
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const visiblePages = new Set(); // Используем Set для уникальности

        // Всегда добавляем первую страницу
        visiblePages.add(1);

        // Логика для текущей страницы
        if (currentPage === 1) {
            // Первая страница: [1, 2, 3, ..., последняя]
            for (let i = 2; i <= 3; i++) {
                if (i <= totalPages) visiblePages.add(i); // Добавляем только допустимые страницы
            }
        } else if (currentPage === totalPages) {
            // Последняя страница: [1, ..., предпоследняя, последняя]
            for (let i = totalPages - 2; i <= totalPages; i++) {
                if (i > 0) visiblePages.add(i); // Добавляем только допустимые страницы
            }
        } else {
            // Средние страницы: [1, ..., предыдущая, текущая, следующая, ..., последняя]
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                if (i > 0 && i <= totalPages) visiblePages.add(i); // Добавляем только допустимые страницы
            }
        }

        // Всегда добавляем последнюю страницу
        visiblePages.add(totalPages);

        // Преобразуем Set в массив и сортируем
        const uniquePages = [...visiblePages].sort((a, b) => a - b);

        // Добавляем точки между разрывами
        const finalPages = [];
        for (let i = 0; i < uniquePages.length; i++) {
            finalPages.push(uniquePages[i]);
            if (i < uniquePages.length - 1 && uniquePages[i + 1] - uniquePages[i] > 1) {
                finalPages.push("...");
            }
        }

        return finalPages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
            {/* Кнопка "Назад" */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                    padding: "5px 10px",
                    backgroundColor: "#f0f0f0",
                    border: "none",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    borderRadius: "5px",
                }}
            >
                &larr;
            </button>

            {/* Видимые страницы */}
            {visiblePages.map((page, index) => {
                if (page === "...") {
                    return (
                        <span key={index} style={{ margin: "0 5px", fontSize: "16px", color: "#aaa" }}>
                            ...
                        </span>
                    );
                }

                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        style={{
                            margin: "0 5px",
                            padding: "5px 10px",
                            backgroundColor: currentPage === page ? "#007bff" : "#f0f0f0",
                            color: currentPage === page ? "#fff" : "#000",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "5px",
                        }}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Кнопка "Вперед" */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                    padding: "5px 10px",
                    backgroundColor: "#f0f0f0",
                    border: "none",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    borderRadius: "5px",
                }}
            >
                &rarr;
            </button>
        </div>
    );
}