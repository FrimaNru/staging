import React, { useState } from 'react';
import styles from "@/styles/Common.module.css";

const Menu = ({ children }) => {
    return (
        <div className={styles.menu}>
            {children}
        </div>
    );
};

const MenuButton = ({ children, onClick }) => {
    return (
        <button className={`${styles.menuButton}`} onClick={onClick}>
            <p className={styles.menuButtonText}>{children}</p>
            <img src='/sortArrowIcon.svg' className={styles.menuButtonIcon} />
        </button>
    );
};

const MenuList = ({ isOpen, children }) => {
    return (
        <div className={`${styles.menuList} ${isOpen ? styles.menuListOpen : ''}`}>
            {children}
        </div>
    );
};

const MenuItem = ({ children, onClick }) => {
    return (
        <div className={styles.menuItem} onClick={onClick}>
            {children}
        </div>
    );
};

const CustomMenu = ({ title, items, setState }) => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <Menu>
            <MenuButton onClick={toggleMenu}>{title}</MenuButton>
            <MenuList isOpen={isOpen}>
                {items?.map((item, i) => item !== title && <MenuItem key={i} onClick={() => { setState(item); closeMenu(); }}>{item}</MenuItem>)}
            </MenuList>
        </Menu>
    );
};

export default CustomMenu;