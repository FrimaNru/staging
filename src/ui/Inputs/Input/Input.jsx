import React from "react";
import styles from "./styles.module.css";

export default function Input({
    value,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    type = "text",
    placeholder = "",
    size = "medium",
    align = "left",
    fullWidth = false,
    customWidth,
    inputMode = "text",
    error = false,
    maxLength,
}) {
    const classNames = [
        styles.input,
        styles[size],
        styles[align],
        fullWidth ? styles.fullWidth : "",
        error ? styles.error : "",
    ]
        .filter(Boolean)
        .join(" ");

    const inputStyle = customWidth ? { width: customWidth } : undefined;

    return (
        <input
            type={type}
            value={value}
            inputMode={inputMode}
            onChange={onChange}
            className={classNames}
            style={inputStyle}
            placeholder={placeholder}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            maxLength={maxLength}
        />
    );
}