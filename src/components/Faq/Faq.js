import styles from "@/styles/Faq.module.css";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@chakra-ui/react'
import { useState } from "react";

export function Faq() {

    const [open, setOpen] = useState('');

    const data = [
        { ques: 'ГДЕ ИЗГОТОВЛЕНЫ ВАШИ ЮВЕЛИРНЫЕ УКРАШЕНИЯ?', answ: 'Все украшения результат кропотливой ручной работы. Они изготавливаются в Индии и Таиланде. Также некоторые материалы для коллекций поступают из Италии.' },
        { ques: 'ГДЕ ИЗГОТОВЛЕНЫ ВАШИ ЮВЕЛИРНЫЕ УКРАШЕНИЯ?', answ: 'Все украшения результат кропотливой ручной работы. Они изготавливаются в Индии и Таиланде. Также некоторые материалы для коллекций поступают из Италии.' },
        { ques: 'ГДЕ ИЗГОТОВЛЕНЫ ВАШИ ЮВЕЛИРНЫЕ УКРАШЕНИЯ?', answ: 'Все украшения результат кропотливой ручной работы. Они изготавливаются в Индии и Таиланде. Также некоторые материалы для коллекций поступают из Италии.' },
        { ques: 'ГДЕ ИЗГОТОВЛЕНЫ ВАШИ ЮВЕЛИРНЫЕ УКРАШЕНИЯ?', answ: 'Все украшения результат кропотливой ручной работы. Они изготавливаются в Индии и Таиланде. Также некоторые материалы для коллекций поступают из Италии.' },
        { ques: 'ГДЕ ИЗГОТОВЛЕНЫ ВАШИ ЮВЕЛИРНЫЕ УКРАШЕНИЯ?', answ: 'Все украшения результат кропотливой ручной работы. Они изготавливаются в Индии и Таиланде. Также некоторые материалы для коллекций поступают из Италии.' }
    ];

    return <div className={styles.main}>
        <div className={styles.imageBlock} >
            <img className={styles.backImg} src='/backHandImage.png' />
            <img src='/logoText.svg' className={styles.logoText} />
        </div>
        <div className={styles.accordionBox} >
            <Accordion w='100%' allowToggle>
                <div className={styles.accordionColumn}>
                    {data.map((x, i) => <AccordionItem key={i}>
                        {({ isExpanded }) => (
                            <>
                                <AccordionButton p={0}>
                                    <div className={`${styles.accordionButton} ${open === i && styles.accordionButtonSelect}`} onClick={() => { open === i ? setOpen('') : setOpen(i) }}>
                                        <p className={styles.accordionButtonText}>{x.ques}</p>
                                        {isExpanded
                                            ? <svg width="24" height="13" viewBox="0 0 24 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M23 11.5L12 1.5L1 11.5" stroke="#140702" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" />
                                            </svg>
                                            : <svg width="24" height="13" viewBox="0 0 24 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1.5L12 11.5L23 1.5" stroke="#140702" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" />
                                            </svg>}
                                    </div>
                                </AccordionButton>
                                <AccordionPanel p={0}>
                                    <div className={styles.accordionPanel}>
                                        <hr className={styles.hr} />
                                        <p className={styles.accordionPanelText} >
                                            {x.answ}
                                        </p>
                                    </div>
                                </AccordionPanel>
                            </>
                        )}
                    </AccordionItem>)}
                </div>
            </Accordion>
        </div>
    </div>
}