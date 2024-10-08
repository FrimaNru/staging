import React from "react";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import styles from "@/styles/Admin.module.css";

export function ButtonDownloadExcel({ data, type }) {
    const handleDownload = async () => {
        const workbook = new Workbook();
        const sheet = workbook.addWorksheet("Sheet1");

        sheet.addRow(["id", "Имя", "Почта", "Номер телефона", "Дата регистрации (в миллисекундах)", "Персональная информация", "Активные заказы", "Корзина", "Избранное", "Завершенные заказы"]);

        data.forEach((item) => {
            sheet.addRow(Object.values(item));
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        saveAs(blob, "База пользователей.xlsx");
    };

    const handleDownloadOrders = async () => {
        const workbook = new Workbook();
        const sheet = workbook.addWorksheet("Sheet1");

        sheet.addRow(["id товаров", "Сумма заказа", "Адрес доставки", "Дата создания заказа", "id заказа", "Статус заказа", "Статус оплаты", "id клиента"]);

        data.forEach((item) => {
            sheet.addRow(Object.values(item));
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        saveAs(blob, "База заказов.xlsx");
    };

    return <button className={styles.accordionPanelButton} onClick={() => { type === 'users' ? handleDownload() : handleDownloadOrders() }}>{type === 'users' ? 'Выгрузить таблицу пользователей' : type === 'active' ? 'Выгрузить таблицу активных заказов' : 'Выгрузить таблицу прошедших заказов'}</button>
};