import { dataCharacteristic } from "@/constants/constants.text";
import styles from "@/styles/Product/Product.module.css";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from "@chakra-ui/react";

export default function CharasteristicBlock({ product, sizeOfProduct, colorOfProduct }) {
    const characteristicsHtml =
        `<strong>Артикул</strong><br />${product?.article || '—'}` +
        `<br /><br /><strong>Размер</strong><br />${(sizeOfProduct ?? product?.sizes?.[0]) ? (sizeOfProduct ?? product?.sizes?.[0]) : '—'}` +
        `<br /><br /><strong>Цвет</strong><br />${colorOfProduct || product?.color || '—'}` +
        `<br /><br /><strong>Материал</strong><br />Сплав Zamak: цинк, магний, алюминий, медь.`;

    const items = [
        { title: 'ХАРАКТЕРИСТИКИ', text: characteristicsHtml },
        ...dataCharacteristic,
    ];

    return <div className={styles.charasteristicColumn}>
        <Accordion allowToggle>
            {items.map((x, i) => <AccordionItem key={i} border='none' style={{ borderBottom: items.length === i + 1 ? 'solid 1px #140702' : null }}>
                {({ isExpanded }) => (
                    <>
                        <h2>
                            <AccordionButton _hover={{}} p={0} >
                                <div className={styles.accordionButton}>
                                    <div dangerouslySetInnerHTML={{ __html: x.title }} className={styles.accordionButtonTitle} data-noindex="true" />
                                    {isExpanded ? <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 11.5L11 1.5L1 11.5" stroke="#140702" strokeLinecap="round" />
                                    </svg>
                                        : <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 0.5L11 10.5L21 0.5" stroke="#140702" strokeLinecap="round" />
                                        </svg>}

                                </div>
                            </AccordionButton>
                        </h2>
                        <AccordionPanel p={0}>
                            <p className={styles.accordionText} dangerouslySetInnerHTML={{ __html: x.text }} data-noindex="true" />
                        </AccordionPanel>
                    </>
                )}
            </AccordionItem>)}
        </Accordion>
    </div>
};