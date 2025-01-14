import styles from "@/styles/Faq.module.css";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@chakra-ui/react'
import { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Banner from "../Common/Banner/Banner";

export default function Faq() {

    const [open, setOpen] = useState('');

    const data = [
        { ques: 'Где изготовлены украшения?', answ: 'Мы вдохновлены культурными традициями разных стран и народов. Путешествуя по миру, мы выбираем для вас самые необычные и интересные украшения. <br />На сайте представлены изделия, созданные дизайнерами Турции, Китая, Индии и Таиланда. ' },
        { ques: 'Из чего изготовлены украшения?', answ: 'Mi Alegria - это бренд, который предлагает своим клиентам стильную и качественную бижутерию из износостойкого и гипоаллергенного сплава zamak. <br />Основа готового украшения покрывается гальваническим методом. Гальванизация приводит к появлению на обработанной поверхности украшения тонкого, но стойкого защитного покрытия из различных сплавов: меди, олова, хрома, цинка, золота или серебра. Так украшение намного дольше сохраняет свой вид и меньше изнашивается. ' },
        { ques: 'Как ухаживать за украшениями? ', answ: 'Наши украшения выполнены из износостойкого сплава с защитным покрытием, они устойчивы к воздействию внешних факторов, таких как влага и пыль, а также к механическим повреждениям, но если вы хотите, чтобы они радовали вас долгое время своими прекрасным внешним видом, соблюдайте несколько рекомендаций. <br />Храните украшения в сухом чистом месте. Не нужно хранить их в пластиковых коробках и целлофановых пакетах. <br />Если украшение испачкалось, его можно очистить теплой водой с шампунем и вытереть насухо, не нужно использовать грубые чистящие средства и щетки. <br />Избегайте попадания косметических и химических средств на украшение. Не подвергайте украшения воздействию высоких температур. Не носите бижутерию в бане, солярии, на пляже.' },
        { ques: 'Можно ли вернуть покупку или сделать обмен?', answ: 'Да, вы можете вернуть украшение в течение 14 дней. Возврат и обмен непродовольственного товара надлежащего качества проводится, если указанный товар не был в употреблении, сохранены его товарный вид, потребительские свойства, пломбы, фабричные ярлыки, а также имеется товарный чек или кассовый чек либо иной подтверждающий оплату указанного товара документ.' }
    ];

    return <div className={styles.main}>
        <Banner />
        <div className={styles.mainColumn}>
            <Breadcrumb />
            <div className={styles.titleBlock}>
                <p className={styles.title}>ЧАСТЫЕ  ВОПРОСЫ</p>
                <hr className={styles.hr} />
            </div>
            <div className={styles.accordionBox} >
                <Accordion w='100%' allowToggle>
                    <div className={styles.accordionColumn}>
                        {data.map((x, i) => <AccordionItem key={i} border='none' >
                            {({ isExpanded }) => (
                                <>
                                    <AccordionButton p={0} _hover={{}}>
                                        <div className={`${styles.accordionButton} ${open === i && styles.accordionButtonSelect}`} onClick={() => { open === i ? setOpen('') : setOpen(i) }}>
                                            <p className={styles.accordionButtonText}>{x.ques.toUpperCase()}</p>
                                            {isExpanded
                                                ? <img src='/faqArrowOpen.svg' className={styles.accordionButtonArrow} />
                                                : <img src='/faqArrowClose.svg' className={styles.accordionButtonArrow} />}
                                            {isExpanded
                                                ? <img src='/faqArrowOpenMobile.svg' className={styles.accordionButtonArrowMobile} />
                                                : <img src='/faqArrowCloseMobile.svg' className={styles.accordionButtonArrowMobile} />}
                                        </div>
                                    </AccordionButton>
                                    <AccordionPanel p={0}>
                                        <div className={styles.accordionPanel}>
                                            <hr className={styles.hr} />
                                            <div className={styles.accordionPanelText} dangerouslySetInnerHTML={{ __html: x.answ }} />
                                        </div>
                                    </AccordionPanel>
                                </>
                            )}
                        </AccordionItem>)}
                    </div>
                </Accordion>
            </div>
        </div>
    </div>
}