import styles from "@/styles/Catalog.module.css";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

export default function SortSection({ stateSortItems, setStateSortItems, sortItems }) {
    return (
        <div className={styles.lineSort}>
            <p className={styles.lineSortText}>Сортировать</p>
            <Menu>
                <MenuButton pos='relative' zIndex={1}>
                    <div className={styles.menuButton} zIndex={5} pos='relative'>
                        <p className={styles.menuButtonText}>{stateSortItems}</p>
                        <svg style={{ marginTop: '3px' }} width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.496094 0.5L5.49609 5.5L10.4961 0.5" stroke="#140702" strokeLinecap="round" />
                        </svg>
                    </div>
                </MenuButton>
                <MenuList boxShadow='none' p={0} border='none' bg='none' pos='relative' zIndex={0}>
                    <div className={styles.menuList}>
                        {sortItems.filter(x => x !== stateSortItems).map((x, i) => (
                            <MenuItem bg='none' p={0} key={i} onClick={() => setStateSortItems(x)}>
                                <div className={styles.menuItemColumn}>
                                    <p className={styles.menuItem}>{x}</p>
                                    {sortItems.filter(x => x !== stateSortItems).length - 1 > i && <hr className={styles.menuItemHr} />}
                                </div>
                            </MenuItem>
                        ))}
                    </div>
                </MenuList>
            </Menu>
        </div>
    );
}