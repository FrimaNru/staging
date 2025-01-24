import axios from "axios";
import { API_BASE_URL } from "../../../../../../../apiConfig";

export default function AdminEditOrder() {

    function deleteOrder(status, orderId, userId) {
        axios.post(`${API_BASE_URL}deleteOrder`, { status, orderId, userId }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then(() => {
                load();
                toast({ position: 'bottom-right', render: () => (<div className="toast">Заказ удалён</div>), duration: 3000 });
            })
            .catch((e) => console.log(e));
    };


    return <div></div>
};


function UserItem({ id }) {

    const [data, setData] = useState({});

    useEffect(() => {
        load();
    }, []);

    function load() {
        axios.post(`${API_BASE_URL}getOneUser`, { id }, { headers: { Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}` } })
            .then((res) => {
                setData(res.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return <div className={styles.ordersUserLine} >
        <p className={styles.ordersUserItem}>{data?.name} {data?.personalData?.lastName}</p>
        <p className={styles.ordersUserItem}>{data.email}</p>
        <p className={styles.ordersUserItem}>{data.phone}</p>
    </div>
};

function ProductItem({ id }) {

    const [data, setData] = useState({});

    useEffect(() => {
        load();
    }, []);

    function load() {
        axios.post(`${API_BASE_URL}getOneProduct`, { id })
            .then((res) => {
                setData(res.data);
            })
            .catch((e) => console.log(e));
    };

    return (data.name && <Link href={`/product?id=${data._id}`} target="_blank">
        <div className={styles.accrdionPanelItem}>
            <p className={styles.accordionPanelText}>{data.name[0]?.toUpperCase()}</p>
            <img src={`https://api.mi-alegria.shop/uploads/${data.cover[0]}`} className={styles.productImg} />
            <p className={styles.accordionPanelText}>{formatNumber(Number(data.cost[0]))} руб.</p>
        </div>
    </Link>)
};