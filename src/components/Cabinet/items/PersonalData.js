import styles from "@/styles/PersonalData.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { API_BASE_URL } from "../../../../apiConfig";
import { Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react";

export function PersonalData() {

    const toast = useToast();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [sex, setSex] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dateBirthday, setDateBirthday] = useState('');
    const [addresses, setAddresses] = useState([]);

    const [hidePassword, setHidePassword] = useState(true);
    const [hidePassword2, setHidePassword2] = useState(true);

    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [idAddress, setIdAddress] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [house, setHouse] = useState('');
    const [appartment, setAppartment] = useState('');

    const [error, setError] = useState(false);

    useEffect(() => {
        load();
    }, []);

    function load() {
        axios.get(`${API_BASE_URL}getUser`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((res) => {
                setPhone(res.data.phone);
                setEmail(res.data.email);
                setName(res.data.name);
                setLastName(res.data.personalData.lastName);
                setSex(res.data.personalData.sex);
                setDateBirthday(res.data.personalData.dateBirthday);
                setAddresses(res.data.personalData.addresses);
            })
            .catch((e) => console.log(e));
    };

    function saveData() {
        if (password === '') {
            axios.post(`${API_BASE_URL}saveData`, { email, name, lastName, sex, phone, dateBirthday, addresses }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
                .then((res) => {
                    toast({ position: 'bottom-right', render: () => (<div className="toast">Данные успешно обновлены</div>), duration: 3000 });
                })
                .catch((e) => console.log(e));
        } else {
            if (password === repeatPassword) {
                axios.post(`${API_BASE_URL}saveData`, { email, name, lastName, sex, phone, dateBirthday, addresses, password }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
                    .catch((e) => console.log(e));
            } else {
                if (password !== repeatPassword) return setError(true);
            }
        }
    };

    return <div className={styles.main}>
        <div className={styles.dataColumn}>
            <div className={styles.titleColumn}>
                <hr className={`${styles.hr} ${styles.hrMobile}`} />
                <p className={styles.title}>Личные данные</p>
                <hr className={`${styles.hr} ${styles.hrMobile}`} />
                <div className={styles.inputColumn}>
                    <p className={styles.inputTitle}>Имя</p>
                    <input className={styles.input} onChange={(e) => setName(e.target.value)} value={name} />
                </div>
                <div className={styles.inputColumn}>
                    <p className={styles.inputTitle}>Фамилия</p>
                    <input className={styles.input} onChange={(e) => setLastName(e.target.value)} value={lastName} />
                </div>
                <div className={styles.inputColumn}>
                    <p className={styles.inputTitle}>Пол</p>
                    <div className={styles.lineSex}>
                        <div className={styles.lineLilSex} onClick={() => setSex('женский')} >
                            <img src={sex === 'женский' ? '/goldDotSelect.svg' : '/goldCircle.svg'} className={styles.sexCircle} />
                            <p className={styles.sexText} >Женский</p>
                        </div>
                        <div className={styles.lineLilSex} onClick={() => setSex('мужской')}>
                            <img src={sex === 'мужской' ? '/goldDotSelect.svg' : '/goldCircle.svg'} className={styles.sexCircle} />
                            <p className={styles.sexText} >Мужской</p>
                        </div>
                    </div>
                </div>
                <div className={styles.inputColumn}>
                    <p className={styles.inputTitle}>E-mail</p>
                    <input className={styles.input} onChange={(e) => setEmail(e.target.value)} value={email} />
                </div>
                <div className={styles.inputColumn}>
                    <p className={styles.inputTitle}>Телефон</p>
                    <InputMask mask="+7 (999) 999-99-99" className={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className={styles.inputColumn}>
                    <p className={styles.inputTitle}>Дата рождения</p>
                    <InputMask mask="99.99.9999" className={styles.input} value={dateBirthday} onChange={(e) => setDateBirthday(e.target.value)} />
                </div>
            </div>
        </div>
        {/*  <hr className={styles.hr} />
        <div className={styles.lineAddressBox}>
            <div className={styles.lineAddress}>
                <p className={`${styles.title} ${styles.hrMobile}`}>Адреса доставки</p>
                <hr className={`${styles.hr} ${styles.hrMobile}`} />
                {addresses.length > 0 && addresses.map((x, i) => <div key={i} className={styles.addressBlock}>
                    <img src='/iconMap.svg' className={styles.addressBlockIcon} />
                    <div className={styles.addressBlockColumn}>
                        <p className={styles.addressBlockText}>{x.street}, д.{x.house}, кв.{x.appartment}</p>
                        <div className={styles.addressBlockLine}>
                            <p className={styles.addressBlockButton} onClick={() => {
                                setCity(x.city); setStreet(x.street); setHouse(x.house); setAppartment(x.appartment); setIdAddress(x.idAddress); onOpen();
                            }}>Изменить</p>
                            <p className={styles.addressBlockButton} onClick={() => {
                                setAddresses(old => old.filter(y => x.street !== y.street && x.appartment !== y.appartment));
                            }} >Удалить</p>
                        </div>
                    </div>
                </div>)}
                <div className={styles.buttonAddAddress} onClick={() => { onOpen(); setIdAddress(Math.floor(Math.random() * 900000) + 100000); }}>Добавить адрес</div>
            </div>
        </div> */}
        <hr className={styles.hr} />
        <div className={styles.passwordColumn}>
            <div className={styles.titleColumn}>
                <p className={styles.title}>Изменить пароль</p>
                <hr className={`${styles.hr} ${styles.hrMobile}`} />
                <div className={styles.inputColumn}>
                    <p className={styles.inputTitle}>Новый пароль</p>
                    <div className={styles.inputIconLine}>
                        <input className={styles.input} type={hidePassword ? 'password' : 'text'} onChange={(e) => { setPassword(e.target.value); }} value={password} />
                        <>
                            {hidePassword
                                ? <img src='/showIcon.svg' className={styles.inputIcon} onClick={() => setHidePassword(false)} />
                                : <img src='/hideIcon.svg' className={styles.inputIcon} onClick={() => setHidePassword(true)} />}
                        </>
                    </div>
                </div>
            </div>
            <div className={styles.inputColumn}>
                {error
                    ? <p className={`${styles.inputTitle} ${styles.errorText}`}>Пароли не совпадают</p>
                    : <p className={styles.inputTitle}>Подтверждение нового пароля</p>}
                <div className={styles.inputIconLine}>
                    <input className={styles.input} type={hidePassword2 ? 'password' : 'text'} onChange={(e) => { setRepeatPassword(e.target.value); setError(false); }} value={repeatPassword} />
                    <>
                        {hidePassword2
                            ? <img src='/showIcon.svg' className={styles.inputIcon} onClick={() => setHidePassword2(false)} />
                            : <img src='/hideIcon.svg' className={styles.inputIcon} onClick={() => setHidePassword2(true)} />}
                    </>
                </div>
            </div>
        </div>
        <hr className={styles.hr} />
        <button className={styles.saveButton} onClick={saveData}>СОХРАНИТЬ</button>
        <Modal onClose={onClose} isOpen={isOpen} autoFocus={false} isCentered size='xl' >
            <ModalOverlay />
            <ModalContent p={0} bg='none' boxShadow='none' >
                <ModalBody p={0}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalHeaderLine}>
                                <p className={styles.modalHeaderTitle}>ДОБАВИТЬ АДРЕС</p>
                                <img src='/cross.svg' className={styles.cross} onClick={() => onClose()} />
                                <img src='/crossMobile.svg' className={styles.crossMobile} onClick={() => onClose()} />
                            </div>
                            <hr className={styles.modalHr} />
                            <div className={styles.modalColumn}>
                                <p className={styles.modalSubtitle}>Запоните данные адреса доставки</p>
                                <div className={styles.modalColumnInput}>
                                    <p className={styles.modalInputTitle}>Город</p>
                                    <input className={styles.modalInput} onChange={(e) => setCity(e.target.value)} value={city} />
                                </div>
                                <div className={styles.modalColumnInput}>
                                    <p className={styles.modalInputTitle}>Улица</p>
                                    <input className={styles.modalInput} onChange={(e) => setStreet(e.target.value)} value={street} />
                                </div>
                                <div className={styles.modalInputLine} >
                                    <div className={styles.modalColumnInput}>
                                        <p className={styles.modalInputTitle}>Дом</p>
                                        <input className={styles.modalInputLil} onChange={(e) => setHouse(e.target.value)} value={house} />
                                    </div>
                                    <div className={styles.modalColumnInput}>
                                        <p className={styles.modalInputTitle}>Квартира</p>
                                        <input className={styles.modalInputLil} onChange={(e) => setAppartment(e.target.value)} value={appartment} />
                                    </div>
                                </div>
                                <div className={styles.modalSaveButton} onClick={() => {
                                    let state = false;
                                    addresses.forEach(x => {
                                        if (idAddress === x.idAddress) {
                                            x.city = city;
                                            x.street = street;
                                            x.house = house;
                                            x.appartment = appartment;
                                            state = true;
                                            setCity('');
                                            setStreet('');
                                            setHouse('');
                                            setAppartment('');
                                            setIdAddress('');
                                            onClose();
                                        };
                                    })
                                    if (!state) {
                                        setAddresses(old => [...old, { city, street, house, appartment, idAddress }]);
                                        onClose();
                                        setCity('');
                                        setStreet('');
                                        setHouse('');
                                        setAppartment('');
                                        setIdAddress('');
                                    };
                                }}>СОХРАНИТЬ</div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    </div>
};