import styles from "@/styles/Favourite.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../apiConfig";
import { useRouter } from "next/router";
import Link from "next/link";
import { useToast } from "@chakra-ui/react";

function formatNumber(number) {
    let numStr = number.toString();
    let parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
};

export function FavouriteBlock() {

    const [data, setData] = useState([]);
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        load();
    }, []);

    function load() {
        setData([]);
        axios.get(`${API_BASE_URL}getFavourites`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then((res) => {
                res.data.forEach(x => {
                    axios.post(`${API_BASE_URL}getOneProduct`, { id: x })
                        .then((res) => {
                            setData(old => [...old, res.data]);
                        })
                        .catch((e) => console.log(e));
                })
            })
            .catch((e) => console.log(e));
    };

    function deleteOneProduct(id) {
        axios.post(`${API_BASE_URL}daleteOneFavourite`, { id }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                load();
                toast({
                    position: 'bottom-right',
                    render: () => (
                        <div className="toast">Товар удален из избранного</div>
                    ),
                    duration: 3000
                })
            })
            .catch((e) => console.log(e));
    };

    function deleteAllProducts() {
        axios.delete(`${API_BASE_URL}deleteAllFavourites`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                load();
                toast({
                    position: 'bottom-right',
                    render: () => (
                        <div className="toast">Все товары удалены из избранных</div>
                    ),
                    duration: 3000
                })
            })
            .catch((e) => console.log(e));
    };

    return <div className={styles.main}>
        {data.length > 0
            ? <>
                {data.map((x, i) => <div key={i} className={styles.column} >
                    <div className={styles.item}>
                        <div className={styles.itemRow}>
                            <Link href={`/product?id=${x?._id}`} style={{ width: 'max-content' }}>
                                <img src={`https://api.mi-alegria.shop/uploads/${x?.cover} `} className={styles.itemImg} />
                            </Link>
                            <div className={styles.itemColumn}>
                                <div className={styles.itemLilColumn}>
                                    <Link href={`/product?id=${x?._id}`} style={{ width: 'max-content' }}>
                                        <p className={styles.itemName}>{x?.name}</p>
                                    </Link>
                                    <p className={styles.itemText}>В наличии</p>
                                    <p className={styles.itemCost}>{formatNumber(x?.cost)} руб.</p>
                                </div>
                                <div className={styles.lilButton} onClick={() => {
                                    toast({
                                        position: 'bottom-right',
                                        render: () => (
                                            <div className="toast">Товар добавлен в корзину</div>
                                        ),
                                        duration: 3000
                                    })
                                }} >В КОРЗИНУ</div>
                            </div>
                        </div>
                        <img src='/cross.svg' className={styles.itemCross} onClick={() => deleteOneProduct(x._id)} />
                    </div>
                    <hr className={styles.hr} />
                </div>)}
                <div className={styles.lineButtons}>
                    <div className={styles.toBagButton} onClick={() => {
                        toast({
                            position: 'bottom-right',
                            render: () => (
                                <div className="toast">Все товары добавлены в корзину</div>
                            ),
                            duration: 3000
                        })
                    }} >ДОБАВИТЬ ВСЕ В КОРЗИНУ</div>
                    <div className={styles.deleteAllButton} onClick={() => deleteAllProducts()} >УДАЛИТЬ ВСЕ</div>
                </div>
            </>
            : <>
                <p className={styles.title} >К сожалению, в избранном пока нет товаров</p>
                <div className={styles.blackButtonLil} onClick={() => router.push('/catalog')}>В КАТАЛОГ</div>
                <hr className={styles.hr} />
            </>}
    </div>
}