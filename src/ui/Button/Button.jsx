import React from 'react';
import styles from './styles.module.css';

export default function Button({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    onClick,
    bold = 'regular',
    disabled = false,
    className = '',
    ...props
}) {
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        styles[bold],
        fullWidth ? styles.fullWidth : '',
        disabled ? styles.disabled : '',
        className
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={classNames} disabled={disabled} onClick={onClick} {...props}>
            {children}
        </button>
    );
};
