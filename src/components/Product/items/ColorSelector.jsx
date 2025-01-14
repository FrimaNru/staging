import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Product/Product.module.css";

export default function ColorSelector({ data, colorOfProduct, setColorOfProduct, setActiveCount }) {

    const elementRef = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const element = elementRef.current;
        if (element) {
            const width = element.offsetWidth;
            setWidth(width - 2);
        };
    }, []);

    return <Menu autoSelect={false}>
        <MenuButton pos='relative' zIndex={10} p={0} ref={elementRef}>
            <div className={styles.menuButton} >
                <p className={styles.menuButtonText}>{colorOfProduct}</p>
                {data?.colors?.length > 1 && <img src='/colorArrow.svg' />}
            </div>
        </MenuButton>
        <MenuList p={0} border='none' boxShadow='none' mt='-30px' pos='relative' zIndex={0} >
            {data?.colors?.length > 0 && data.colors.map((x, i) => x !== colorOfProduct && <MenuItem p={0} key={i} _hover={{ bg: 'white' }}>
                <div className={styles.menuItem} style={{ width }} onClick={() => { setColorOfProduct(x); setActiveCount(i); }}>{x}</div>
            </MenuItem>)}
        </MenuList>
    </Menu>
};