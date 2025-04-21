import CustomMenu from "@/components/Common/Menu/Menu";
import { ORDER_STATUSES_ADMIN } from "@/constants/constants.text";
import styles from "@/styles/Admin/Orders/Order.module.css";
import Button from "@/ui/Button/Button";
import CircleCheckBox from "@/ui/CircleCheckbox/CircleCheckbox";
import Input from "@/ui/Inputs/Input/Input";

export default function OrderFilter({ search, setSearch, sortType, setSortType, setProductsView, productsView, onlyActive, setOnlyActive, onlyNotActive, setOnlyNotActive }) {

    const dropdownItems =
        (!onlyActive && !onlyNotActive)
            ? Object.keys(ORDER_STATUSES_ADMIN)
                .map((key) => ORDER_STATUSES_ADMIN[key])
            : onlyActive
                ? Object.keys(ORDER_STATUSES_ADMIN)
                    .filter((key) => key !== "complete" && key !== "canceled")
                    .map((key) => ORDER_STATUSES_ADMIN[key])
                : onlyNotActive && Object.keys(ORDER_STATUSES_ADMIN)
                    .filter((key) => key === "complete" || key === "canceled")
                    .map((key) => ORDER_STATUSES_ADMIN[key]);


    return <div className={styles.card}>
        <div className={styles.fullLine}>
            <p className={styles.subtitle}>Фильтры</p>
            <Button
                size="small"
                variant="delete"
                onClick={() => {
                    setSearch('');
                    setProductsView('blocks');
                    setOnlyActive(false);
                    setOnlyNotActive(false);
                    setSortType('Статус');
                }}
            >Сбросить</Button>
        </div>
        <Input
            className={styles.mainInput}
            placeholder="Введите номер заказа или ИМ номер"
            value={search}
            fullWidth={true}
            onChange={(e) => setSearch(e.target.value)}
        />
        <CustomMenu title={sortType} items={dropdownItems} setState={setSortType} />
        <div className={styles.mainLine}>
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
                <p>Только активные</p>
                <CircleCheckBox active={onlyActive} onClick={() => { setOnlyActive(!onlyActive); setOnlyNotActive(false); }} />
            </div>
            <div className={styles.lilColumn}>
                <p>Только выполненные и возврат</p>
                <CircleCheckBox active={onlyNotActive} onClick={() => { setOnlyNotActive(!onlyNotActive); setOnlyActive(false); }} />
            </div>
        </div>
    </div>
};