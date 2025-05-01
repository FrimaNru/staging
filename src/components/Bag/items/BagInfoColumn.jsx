import { formatNumber } from "@/lib/Formatting";
import styles from "../styles.module.css";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-scroll";
import { useRouter } from "next/router";

export default function BagInfoColumn({ total, deliveryCost, order, setOrder, setIsWidgetVisible, prevPath }) {

    const { cart } = useCart();
    const router = useRouter();

    const handleGoToCatalog = () => {
        if (prevPath) {
            router.push(prevPath);
        } else {
            router.push('/catalog');
        }
    };

    return total > 0 && <div className={styles.totalColumn}>
        <div className={styles.total}>
            <p className={styles.totalTitle}>ИТОГО</p>
            <div className={styles.totalContent}>
                <div className={styles.totalRow}>
                    <p className={styles.totalSubtitle}>Товаров на сумму</p>
                    <p className={styles.totalGold}>{formatNumber(total)} руб.</p>
                </div>
                <div className={styles.totalColumnLil}>
                    <div className={styles.totalRow}>
                        <p className={styles.totalSubtitle}>Доставка</p>
                        {total < 3000
                            ? <>
                                {deliveryCost === 0
                                    ? <svg xmlns="http://www.w3.org/2000/svg" width="11" height="5" viewBox="0 0 11 5" fill="none">
                                        <path d="M10.2008 4.53996H0.800781V0.459961H10.2008V4.53996Z" fill="#C49748" />
                                    </svg>
                                    : <p className={styles.totalGold}>{formatNumber(deliveryCost)} руб.</p>}
                            </>
                            : <p className={styles.totalGold}>0 руб.</p>}
                    </div>
                    <p className={styles.totalText}>При заказе от 3000 рублей, доставка бесплатная</p>
                </div>
            </div>
            <hr className={styles.hr} />
            <div className={styles.totalRow}>
                <p className={styles.totalSubtitle}>Итого</p>
                <p className={styles.totalGold}>{formatNumber(total + (total >= 3000 ? 0 : deliveryCost))} руб.</p>
            </div>
        </div>
        {cart.length > 0 && !order && <>
            <Link to='personalData' smooth={true} offset={-180}>
                <button className={styles.totalButton} onClick={() => {
                    setOrder(true);
                    setIsWidgetVisible(true);
                }}>ОФОРМИТЬ ЗАКАЗ</button>
            </Link>
            <button className={styles.countinueShoppingButton} onClick={handleGoToCatalog}>ПРОДОЛЖИТЬ ПОКУПКИ</button>
        </>}
    </div>
};