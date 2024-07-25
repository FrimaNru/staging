import styles from "@/styles/Catalog.module.css";
import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

export function Catalog() {

    const [stateSales, setStateSales] = useState([]);
    const [stateGenders, setStateGenders] = useState('');
    const [stateType, setStateType] = useState('');

    const sales = ['Новинки', 'Популярное', 'Скидки'];
    const genders = ['Мужчинам', 'Женщинам', 'Унисекс'];
    const types = ['Кольца', 'Серьги', 'Браслеты', 'Цепочки', 'Колье'];

    const sortItems = ['По популярности', 'По возрастанию цены', 'По убыванию цены'];
    const [stateSortItems, setStateSortItems] = useState('По популярности');

    return <div className={styles.main}>
        <div className={styles.imageBlock} >
            <img className={styles.backImg} src='/backCatalog.png' />
            <p className={styles.logoText}>ЮВЕЛИРНЫЕ ДИЗАЙНЕРСКИЕ УКРАШЕНИЯ</p>
        </div>
        <div className={styles.row}>
            <div className={styles.filter}>
                <div className={styles.lilColumn}>
                    {sales.map((x, i) => <div key={i} className={styles.filterLine} onClick={() => setStateSales(old => old.includes(x) ? old.filter(item => item !== x) : [...old, x])}>
                        {stateSales.includes(x) ? <img src='/goldDotSelect.svg' /> : <img src='/goldDot.svg' />}
                        <p>{x}</p>
                    </div>)}
                </div>
                <div className={styles.lilColumn}>
                    <p className={styles.filterTitle}>КОМУ</p>
                    {genders.map((x, i) => <div key={i} className={styles.filterLine} onClick={() => setStateGenders(x)} >
                        {stateGenders === x ? <img src='/goldDotSelect.svg' /> : <img src='/goldDot.svg' />}
                        <p>{x}</p>
                    </div>)}
                </div>
                <div className={styles.lilColumn}>
                    <p className={styles.filterTitle}>ВИД ИЗДЕЛИЯ</p>
                    {types.map((x, i) => <div key={i} className={styles.filterLine} onClick={() => setStateType(x)}>
                        {stateType === x ? <img src='/goldDotSelect.svg' /> : <img src='/goldDot.svg' />}
                        <p>{x}</p>
                    </div>)}
                </div>
            </div>
            <div className={styles.catalogColumn}>
                <div className={styles.lineSort} >
                    <p className={styles.lineSortText} >Сортировать</p>
                    <Menu>
                        <MenuButton>
                            <div className={styles.menuButton} >
                                <p>По популярности</p>
                                <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.496094 0.5L5.49609 5.5L10.4961 0.5" stroke="#140702" stroke-linecap="round" />
                                </svg>
                            </div>
                        </MenuButton>
                        <MenuList border='solid 1px #140702' w='185px' >
                            {sortItems.map((x, i) => x !== stateSortItems && <MenuItem bg='none' key={i} onClick={() => setStateSortItems(x)}>{x}</MenuItem>)}
                        </MenuList>
                    </Menu>
                </div>
            </div>
        </div>
    </div>
}