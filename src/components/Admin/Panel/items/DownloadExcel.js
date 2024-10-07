import React from "react";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import styles from "@/styles/Admin.module.css";

export function ButtonDownloadExcel({ data }) {
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

    return <button className={styles.accordionPanelButton} onClick={handleDownload}>Выгрузить таблицу пользователей</button>
};