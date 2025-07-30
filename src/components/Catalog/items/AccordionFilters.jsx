import styles from "../styles.module.css";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from "@chakra-ui/react";
import FilterSection from "./FilterSection";

export default function AccordionFilters({ sales, types, stateSales, stateType, setStateSales, setStateType, sortItems, stateSortItems, setStateSortItems }) {
    return (
        <Accordion w='100%' allowToggle className={styles.accordion}>
            <AccordionItem border='none'>
                {({ isExpanded }) => (
                    <>
                        <AccordionButton p={0} _hover={{}}>
                            <div className={styles.accordionButton}>
                                <p className={styles.accordionButtonText}>Фильтры</p>
                                {isExpanded
                                    ? <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 8L7 2L1 8" stroke="#140702" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="9" viewBox="0 0 14 9" fill="none">
                                        <path d="M1 1.47754L7 7.47754L13 1.47754" stroke="#140702" strokeWidth="2" strokeLinecap="round" />
                                    </svg>}
                            </div>
                        </AccordionButton>
                        <AccordionPanel p={0}>
                            <div className={styles.accordionPanel}>
                                <FilterSection sales={sales} types={types} stateSales={stateSales} stateType={stateType} setStateSales={setStateSales} setStateType={setStateType} />
                                <div className={styles.lilColumn}>
                                    <p className={styles.filterTitle}>СОРТИРОВКА</p>
                                    {sortItems.map((x, i) => (
                                        <div key={i} className={styles.filterLine} onClick={() => setStateSortItems(x)}>
                                            {stateSortItems === x ? <img src='/goldDotSelect.svg' /> : <img src='/goldDot.svg' />}
                                            <p className={styles.filterText}>{x}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </AccordionPanel>
                    </>
                )}
            </AccordionItem>
        </Accordion>
    );
}