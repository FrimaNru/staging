import styles from "@/styles/Admin/Products/Products.module.css";
import CustomMenu from "@/components/Common/Menu/Menu";
import Input from "@/ui/Inputs/Input/Input";
import Button from "@/ui/Button/Button";
import { useRouter } from "next/navigation";
import CircleCheckBox from "@/ui/CircleCheckbox/CircleCheckbox";

const sortTypes = ['Все виды', 'Кольца', 'Серьги', 'Браслеты', 'Колье'];
const sortSections = ['Все разделы', 'Новинки', 'Популярное', 'Скидки'];

export default function FilterBlock({ sortType, sortSection, setSortType, setSortSection, search, setSearch, onlyActive, setOnlyActive, productsView, setProductsView, setOnlyNotActive, onlyNotActive }) {

    const router = useRouter();

    return <div className={styles.card}>
        <div className={styles.subtitleLine}>
            <p className={styles.subtitle}>Фильтры</p>
            <Button
                size="small"
                variant="delete"
                onClick={() => {
                    setSearch('');
                    setSortSection('Все разделы');
                    setSortType('Все виды');
                    setProductsView('blocks');
                    setOnlyActive(false);
                }}
            >Сбросить</Button>
        </div>
        <div className={styles.sortColumn}>
            <Input
                placeholder="Введите название товара или артикул"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className={styles.sortLine}>
                <CustomMenu title={sortType} items={sortTypes} setState={setSortType} />
                <CustomMenu title={sortSection} items={sortSections} setState={setSortSection} />
            </div>
        </div>
        <div className={styles.fullLine}>
            <div className={styles.lilColumn}>
                <p>Отображение списка товаров</p>
                <div className={styles.lilLine}>
                    <div
                        className={`${styles.sortButton} ${productsView === 'blocks' ? styles.sortButtonSelect : ''}`}
                        onClick={() => setProductsView('blocks')}
                    >
                        <img src='/assets/icons/sortBlocks.svg' />
                        Карточками
                    </div>
                    <div
                        className={`${styles.sortButton} ${productsView === 'lines' ? styles.sortButtonSelect : ''}`}
                        onClick={() => setProductsView('lines')}
                    >
                        <img src='/assets/icons/sortLines.svg' />
                        Таблицей
                    </div>
                </div>
            </div>
            <div className={styles.lilColumn}>
                <p>Только активные товары</p>
                <CircleCheckBox active={onlyActive} onClick={() => { setOnlyActive(!onlyActive); setOnlyNotActive(false); }} />
            </div>
            <div className={styles.lilColumn}>
                <p>Только отсутсвующие товары</p>
                <CircleCheckBox active={onlyNotActive} onClick={() => { setOnlyNotActive(!onlyNotActive); setOnlyActive(false); }} />
            </div>
        </div>
    </div>
};