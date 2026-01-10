import Input from "@/ui/Inputs/Input/Input";
import styles from "../styles.module.css";
import Button from "@/ui/Button/Button";

export default function PromocodesFilter({ search, setSearch }) {
    return <div className={styles.card}>
        <div className={styles.subtitleLine}>
            <p className={styles.subtitle}>Фильтры</p>
            <Button
                variant="delete"
                size="small"
                onClick={() => setSearch('')}
            >Сбросить</Button>
        </div>
        <Input
            placeholder="Введите промокод или название"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
    </div>
};

