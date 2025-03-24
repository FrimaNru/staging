import styles from "@/styles/Admin/Products/Products.module.css";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { API_BASE_URL } from "../../../../../../apiConfig";
import { formatNumber } from "@/lib/Formatting";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useDisclosure, Modal, ModalOverlay, ModalCloseButton, ModalContent } from "@chakra-ui/react";
import FilterBlock from "./items/FilterBlock";
import Button from "@/ui/Button/Button";
import Link from "next/link";

const stataTitle = {
    'earrings': 'СЕРЬГИ',
    'ring': 'КОЛЬЦА',
    'bracelets': 'БРАСЛЕТЫ',
    'necklace': 'КОЛЬЕ'
};

const additionally = {
    'popular': 'Популярное',
    'new': 'Новинки',
    'sales': 'Скидки'
};

export default function AdminProducts() {
    const router = useRouter();
    const [statistick, setStatistick] = useState([]);
    const [products, setProducts] = useState([]);
    const [deleteProduct, setDeleteProduct] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [sortType, setSortType] = useState('Все виды');
    const [sortSection, setSortSection] = useState('Все разделы');
    const [search, setSearch] = useState('');
    const toast = useToast();
    const [onlyActive, setOnlyActive] = useState(false);
    const [productsView, setProductsView] = useState('blocks');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        await axios.get(`${API_BASE_URL}statistickProducts`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then((res) => {
                setStatistick(res.data);
            })
            .catch((e) => console.log(e));

        await axios.get(`${API_BASE_URL}admin/products`, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then((res) => {
                const p = res.data.reverse();
                setProducts(p);
                setCurrentPage(1);
            })
            .catch((e) => console.log(e));
    };

    const delProduct = async () => {
        await axios.post(`${API_BASE_URL}deleteProduct`, { id: deleteProduct._id }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then(() => {
                onClose();
                load();
                toast({ position: 'bottom-right', render: () => (<div className="toast">Успешно удалено</div>), duration: 3000 });
            })
            .catch((e) => console.log(e));
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [sortType, sortSection, search, onlyActive]);

    const filteredProducts = useMemo(() => {
        return products.filter(item => {
            const sortTypeKey = Object.keys(stataTitle).find(key => stataTitle[key].toLowerCase() === sortType.toLowerCase());

            const typeFilter =
                sortType === 'Все виды' ||
                item.type === sortTypeKey;

            const sectionFilter =
                sortSection === 'Все разделы' ||
                item.additionally.includes(Object.keys(additionally).find(key => additionally[key] === sortSection));

            const searchFilter =
                search === '' ||
                (item.name.toLowerCase().includes(search.toLowerCase().trim())) ||
                (item.article.toLowerCase().includes(search.toLowerCase().trim()));

            const activeFilter = onlyActive === true ? item.isVisible : true;

            return typeFilter && sectionFilter && searchFilter && activeFilter;
        });
    }, [products, sortType, sortSection, search, onlyActive]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber < 1) pageNumber = 1;
        if (pageNumber > totalPages) pageNumber = totalPages;
        setCurrentPage(pageNumber);
    };

    return <div className={styles.main}>
        <p className={styles.title}>Товары</p>
        <FilterBlock sortType={sortType} setSortSection={setSortSection} setSortType={setSortType} sortSection={sortSection} search={search} setSearch={setSearch} onlyActive={onlyActive} setOnlyActive={setOnlyActive} productsView={productsView} setProductsView={setProductsView} />
        <div className={styles.card}>
            <div className={styles.fullLineBig}>
                <p className={styles.subtitle}>Товары</p>
                <Button
                    size="small"
                    variant="success"
                    onClick={() => router.push('/adminpanel?page=createProduct')}
                >Создать товар</Button>
            </div>
            {productsView === 'lines'
                ? <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <p className={styles.tableHeaderItem}>Артикул</p>
                        <p className={styles.tableHeaderItem}>Название</p>
                        <p className={styles.tableHeaderItem}>Цена</p>
                        <p className={styles.tableHeaderItem}>Цвет</p>
                        <p className={`${styles.tableHeaderItem} ${styles.alignTextRight}`}>Действие</p>
                    </div>
                    <div className={styles.tableContent}>
                        {currentItems.length > 0
                            ? currentItems.map((item, index) => (
                                <div key={index} className={`${styles.tableItem} ${!item.isVisible ? styles.productsGridItemHide : ''}`}>
                                    <div className={styles.tableItemValue}>{item.article}</div>
                                    <div className={styles.tableItemValue}>{item.name}</div>
                                    <div className={styles.tableItemValue}>{formatNumber(item.cost)}</div>
                                    <div className={styles.tableItemValue}>{item.color}</div>
                                    <div className={`${styles.tableItemValue} ${styles.alignRight} ${styles.tableItemLine}`}>
                                        <img
                                            src='/assets/icons/trash.svg'
                                            className={styles.tableItemValueIcon}
                                            onClick={() => { setDeleteProduct(item); onOpen(); }}
                                        />
                                        <img
                                            src='/assets/icons/editIcon.svg'
                                            onClick={() => router.push(`/adminpanel?page=editProduct&id=${item._id}`)}
                                            className={styles.tableItemValueIcon}
                                        />
                                    </div>
                                </div>
                            ))
                            : <p className={styles.tableNoItems}>Нет подходящих товаров.</p>
                        }
                    </div>
                </div>
                : <div className={styles.productsGrid}>
                    {currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <ProductItem key={index} item={item} setDeleteProduct={setDeleteProduct} onOpen={onOpen} load={load} />
                        ))
                    ) : (
                        <p className={styles.noItems}>Нет подходящих товаров.</p>
                    )}
                </div>}

            {filteredProducts.length > 0 && (
                <div className={styles.paginationContainer}>
                    <div className={styles.paginationInfo}>
                        Показано {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} из {filteredProducts.length} товаров
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                onClick={() => paginate(1)}
                                disabled={currentPage === 1}
                                className={styles.paginationButton}
                            >
                                «
                            </button>
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={styles.paginationButton}
                            >
                                Назад
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => paginate(pageNum)}
                                        className={`${styles.paginationButton} ${currentPage === pageNum ? styles.paginationButtonActive : ''}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <span className={styles.paginationDots}>...</span>
                            )}

                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <button
                                    onClick={() => paginate(totalPages)}
                                    className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonActive : ''}`}
                                >
                                    {totalPages}
                                </button>
                            )}

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={styles.paginationButton}
                            >
                                Вперед
                            </button>
                            <button
                                onClick={() => paginate(totalPages)}
                                disabled={currentPage === totalPages}
                                className={styles.paginationButton}
                            >
                                »
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
        <Modal isOpen={isOpen} onClose={onClose} isCentered autoFocus={false} size='lg'>
            <ModalOverlay />
            <ModalCloseButton />
            <ModalContent>
                <div className={styles.createModal}>
                    <p className={styles.createModalTitle}>Вы уверены, что хотите удалить {deleteProduct?.name?.length > 0 && deleteProduct?.name?.toUpperCase()}?</p>
                    <img className={styles.createModalCover} src={deleteProduct?.cover} />
                    <div className={styles.createModalLine} >
                        <button className={styles.createModalButton} onClick={delProduct}>Удалить</button>
                        <button className={styles.createModalButtonCancel} onClick={() => { onClose(); setDeleteProduct({}); }}>Отменить</button>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    </div>
};

function ProductItem({ item, setDeleteProduct, onOpen, load }) {
    const toast = useToast();
    const router = useRouter();

    const changeAdditional = async (key) => {
        await axios.post(`${API_BASE_URL}admin/product/additional`, { id: item._id, key }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then(() => {
                load();
                toast({ position: 'bottom-right', render: () => (<div className="toast">Успешно обновлено</div>), duration: 3000 });
            })
            .catch((e) => console.log(e));
    };

    return <div className={`${styles.productsGridItem} ${!item.isVisible ? styles.productsGridItemHide : ''}`}>
        <div className={styles.productsGridItemLine} >
            <img src={item.cover} className={styles.productsGridItemCover} />
            <div className={styles.productsGridItemColumn}>
                <p className={styles.productsGridItemTitle}>{item.name.toUpperCase()}</p>
                <div className={styles.productsGridItemLilColumn}>
                    <p className={styles.productsGridItemText}>Цвет: {item?.color}</p>
                    <p className={styles.productsGridItemText}>Артикул: {item?.article}</p>
                </div>
                <p className={styles.productsGridItemCost}>{formatNumber(item.cost)} руб.</p>
            </div>
        </div>
        <div className={styles.addtitionallyLine}>
            {Object.entries(additionally).map(([key, value], index) => <button key={index} className={`${styles.additionallyButton} ${item.additionally.includes(key) ? styles.additionallyButtonSelect : ''}`} onClick={() => changeAdditional(key)} >{value}</button>)}
        </div>
        <div className={styles.productsGridItemLineButtons}>
            <Button
                size="small"
                variant="delete"
                onClick={() => { setDeleteProduct(item); onOpen(); }}
            >Удалить</Button>
            <Button
                size="small"
                variant="download"
                onClick={() => router.push(`/adminpanel?page=editProduct&id=${item._id}`)}
            >Изменить</Button>
        </div>
    </div>
};