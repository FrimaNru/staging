import React, { useState, useEffect, useRef } from 'react';

const Dropdown = ({ options, onSelect, getOptionLabel, getOptionValue, placeholder = "Select an option", defaultValue, value }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(defaultValue || null);
    const dropdownRef = useRef(null);

    const currentSelected = value !== undefined ? value : selected;

    const handleSelect = (val) => {
        if (val !== currentSelected) {
            setSelected(val);
            onSelect(val);
        }
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => { if (defaultValue) setSelected(defaultValue); }, [defaultValue]);
    useEffect(() => { if (value !== undefined) setSelected(value); }, [value]);

    return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button onClick={() => setIsOpen((prev) => !prev)}>
                {currentSelected
                    ? getOptionLabel(options.find((o) => getOptionValue(o) === currentSelected))
                    : placeholder}
                <span>{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {options.map((option) => (
                        <li key={getOptionValue(option)} onClick={() => handleSelect(getOptionValue(option))}>
                            {getOptionLabel(option)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;