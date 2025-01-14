import { dataCharacteristic } from "@/constants/constants.text";
import styles from "@/styles/Product/Product.module.css";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from "@chakra-ui/react";

export default function CharasteristicBlock() {
    return <div className={styles.charasteristicColumn}>
        <Accordion allowToggle>
            {dataCharacteristic.map((x, i) => <AccordionItem key={i} border='none' style={{ borderBottom: dataCharacteristic.length === i + 1 ? 'solid 1px #140702' : null }}>
                {({ isExpanded }) => (
                    <>
                        <h2>
                            <AccordionButton _hover={{}} p={0} >
                                <div className={styles.accordionButton}>
                                    <div dangerouslySetInnerHTML={{ __html: x.title }} className={styles.accordionButtonTitle} />
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
                            <p className={styles.accordionText} dangerouslySetInnerHTML={{ __html: x.text }} />
                        </AccordionPanel>
                    </>
                )}
            </AccordionItem>)}
        </Accordion>
    </div>
};