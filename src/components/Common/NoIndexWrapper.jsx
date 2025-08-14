import React from 'react';

/**
 * Компонент-обертка для элементов, которые не должны индексироваться поисковыми системами
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние элементы
 * @param {string} props.tag - HTML тег для рендеринга (по умолчанию 'div')
 * @param {string} props.className - CSS классы
 * @param {Object} props.style - Инлайн стили
 * @param {Object} props.otherProps - Другие HTML атрибуты
 */
export default function NoIndexWrapper({ 
    children, 
    tag: Tag = 'div', 
    className = '', 
    style = {}, 
    ...otherProps 
}) {
    return (
        <Tag
            data-noindex="true"
            className={className}
            style={style}
            {...otherProps}
        >
            {children}
        </Tag>
    );
}

/**
 * Специализированные компоненты для часто используемых элементов
 */
export const NoIndexParagraph = ({ children, className = '', ...props }) => (
    <NoIndexWrapper tag="p" className={className} {...props}>
        {children}
    </NoIndexWrapper>
);

export const NoIndexSpan = ({ children, className = '', ...props }) => (
    <NoIndexWrapper tag="span" className={className} {...props}>
        {children}
    </NoIndexWrapper>
);

export const NoIndexDiv = ({ children, className = '', ...props }) => (
    <NoIndexWrapper tag="div" className={className} {...props}>
        {children}
    </NoIndexWrapper>
);
