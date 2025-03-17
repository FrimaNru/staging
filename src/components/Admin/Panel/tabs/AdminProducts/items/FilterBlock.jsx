import styles from "@/styles/Admin/Products/Products.module.css";
import CustomMenu from "@/components/Common/Menu/Menu";
import Input from "@/ui/Inputs/Input/Input";
import Button from "@/ui/Button/Button";
import { useRouter } from "next/navigation";

const sortTypes = ['Все виды', 'Кольца', 'Серьги', 'Браслеты', 'Колье'];
const sortSections = ['Все разделы', 'Новинки', 'Популярное', 'Скидки'];

export default function FilterBlock({ sortType, sortSection, setSortType, setSortSection, search, setSearch }) {

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
        <button
            className={styles.productsButtonAddProduct}
            onClick={() => router.push('/adminpanel?page=createProduct')}
        >Добавить товар</button>
    </div>
};