import styles from "@/styles/PersonalData.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { API_BASE_URL } from "../../../../apiConfig";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import DocumentsModal from "@/components/Common/DocumentsModal";
import { useUser } from "@/contexts/UserContext";
import { getToken } from "@/lib/auth";

export default function PersonalData() {
    const toast = useToast();
    const router = useRouter();
    const { user, setUser } = useUser();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [data, setData] = useState(null);
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [sex, setSex] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dateBirthday, setDateBirthday] = useState("");
    const [mailing, setMailing] = useState("");
    const [disabled, setDisabled] = useState(false);

    const [hidePassword, setHidePassword] = useState(true);
    const [hidePassword2, setHidePassword2] = useState(true);

    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [error, setError] = useState(false);

    const [initialData, setInitialData] = useState(null);

    const [phoneCode, setPhoneCode] = useState("");
    const [emailCode, setEmailCode] = useState("");
    const [isPhoneCodeSend, setIsPhoneCodeSend] = useState(false);
    const [isEmailCodeSend, setIsEmailCodeSend] = useState(false);

    const [checkBoxes, setCheckBoxes] = useState({ news: false });
    const [news, setNews] = useState(false);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        await axios
            .get(`${API_BASE_URL}getUser`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            .then((res) => {
                const userData = {
                    phone: res.data.phone,
                    email: res.data.email,
                    isVerified: res.data.isVerified,
                    name: res.data.name,
                    lastName: res.data.personalData.lastName,
                    sex: res.data.personalData.sex,
                    dateBirthday: res.data.personalData.dateBirthday,
                    mailing: res.data.personalData.mailing,
                    isVerifiedPhone: res.data.isVerifiedPhone,
                };

                setData(userData);

                setPhone(userData.phone);
                setEmail(userData.email);
                setName(userData.name);
                setLastName(userData.lastName);
                setSex(userData.sex);
                setDateBirthday(userData.dateBirthday);
                setMailing(userData.mailing);

                if (res.data.personalData.mailing !== "")
                    setCheckBoxes({ ...checkBoxes, news: true });

                setInitialData(userData);
            })
            .catch((e) => console.log(e));
    };

    const hasChanges = () => {
        return (
            initialData &&
            (phone !== initialData.phone ||
                email !== initialData.email ||
                name !== initialData.name ||
                lastName !== initialData.lastName ||
                sex !== initialData.sex ||
                dateBirthday !== initialData.dateBirthday ||
                mailing !== initialData.mailing)
        );
    };

    const handleRouteChange = (url) => {
        if (hasChanges()) {
            onOpen(); // Показываем модальное окно
            router.events.emit("routeChangeError"); // Останавливаем навигацию
            throw "routeChange aborted."; // Прерываем переход
        }
    };

    useEffect(() => {
        router.events.on("routeChangeStart", handleRouteChange);

        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, [phone, email, name, lastName, sex, dateBirthday, mailing, initialData]);

    function saveData() {
        if (password === "") {
            axios
                .post(
                    `${API_BASE_URL}saveData`,
                    {
                        email,
                        name,
                        lastName,
                        sex,
                        phone,
                        dateBirthday,
                        mailing,
                    },
                    { headers: { Authorization: `Bearer ${getToken()}` } }
                )
                .then(() => {
                    onClose();
                    const userData = {
                        phone,
                        email,
                        name,
                        lastName,
                        sex,
                        dateBirthday,
                        mailing,
                    };
                    setInitialData(userData);
                    toast({
                        position: "bottom-right",
                        render: () => (
                            <div className="toast">
                                Данные успешно обновлены
                            </div>
                        ),
                        duration: 3000,
                    });
                })
                .catch((e) => console.log(e));
        } else {
            if (password === repeatPassword) {
                axios
                    .post(
                        `${API_BASE_URL}saveData`,
                        {
                            email,
                            name,
                            lastName,
                            sex,
                            phone,
                            dateBirthday,
                            password,
                            mailing,
                        },
                        { headers: { Authorization: `Bearer ${getToken()}` } }
                    )
                    .then(() => {
                        onClose();
                        const userData = {
                            phone,
                            email,
                            name,
                            lastName,
                            sex,
                            dateBirthday,
                            mailing,
                        };
                        setInitialData(userData);
                    })
                    .catch((e) => console.log(e));
            } else {
                if (password !== repeatPassword) return setError(true);
            }
        }
    }

    const sendMessage = async () => {
        if (initialData.phone === phone && initialData.isVerifiedPhone === true)
            return toast({
                position: "bottom-right",
                render: () => (
                    <div className="toast">Этот номер уже подтвержден</div>
                ),
                duration: 3000,
            });
        try {
            setDisabled(true);

            await axios.post(
                `${API_BASE_URL}verifiedPhone`,
                { phone },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );

            setIsPhoneCodeSend(true);
            toast({
                position: "bottom-right",
                render: () => (
                    <div className="toast">Код успешно отправлен</div>
                ),
                duration: 3000,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setDisabled(false);
        }
    };

    const mobilePhoneCheck = async () => {
        try {
            setDisabled(true);

            await axios.post(
                `${API_BASE_URL}verifiedPhoneCode`,
                { code: phoneCode },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );

            load();
            toast({
                position: "bottom-right",
                render: () => (
                    <div className="toast">Телефон успешно подтвержден</div>
                ),
                duration: 3000,
            });
            setIsPhoneCodeSend(false);
            setPhoneCode("");
        } catch (error) {
            console.log(error);
        } finally {
            setDisabled(false);
        }
    };

    const sendEmailCode = async () => {
        if (initialData.email === email && initialData.isVerified === true)
            return toast({
                position: "bottom-right",
                render: () => (
                    <div className="toast">Эта почта уже подтвержден</div>
                ),
                duration: 3000,
            });
        await axios
            .post(
                `${API_BASE_URL}verifiedEmail`,
                { email },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            )
            .then(() => setIsEmailCodeSend(true))
            .catch((e) => console.log(e));
    };

    const emailCheck = async () => {
        await axios
            .post(
                `${API_BASE_URL}verifiedEmailCode`,
                { code: emailCode },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            )
            .then(() => {
                toast({
                    position: "bottom-right",
                    render: () => (
                        <div className="toast">Почта успешно подтверждена</div>
                    ),
                    duration: 3000,
                });
                setIsEmailCodeSend(false);
                setEmailCode("");
            })
            .catch((e) => console.log(e));
    };

    return (
        <div className={styles.main}>
            <div className={styles.dataColumn}>
                <div className={styles.titleColumn}>
                    <hr className={`${styles.hr} ${styles.hrMobile}`} />
                    <p className={styles.title}>Личные данные</p>
                    <hr className={`${styles.hr} ${styles.hrMobile}`} />
                    <div className={styles.inputColumn}>
                        <p className={styles.inputTitle}>Имя</p>
                        <input
                            className={styles.input}
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>
                    <div className={styles.inputColumn}>
                        <p className={styles.inputTitle}>Фамилия</p>
                        <input
                            className={styles.input}
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                        />
                    </div>
                    <div className={styles.inputColumn}>
                        <p className={styles.inputTitle}>Пол</p>
                        <div className={styles.lineSex}>
                            <div
                                className={styles.lineLilSex}
                                onClick={() => setSex("женский")}
                            >
                                <img
                                    src={
                                        sex === "женский"
                                            ? "/goldDotSelect.svg"
                                            : "/goldCircle.svg"
                                    }
                                    className={styles.sexCircle}
                                />
                                <p className={styles.sexText}>Женский</p>
                            </div>
                            <div
                                className={styles.lineLilSex}
                                onClick={() => setSex("мужской")}
                            >
                                <img
                                    src={
                                        sex === "мужской"
                                            ? "/goldDotSelect.svg"
                                            : "/goldCircle.svg"
                                    }
                                    className={styles.sexCircle}
                                />
                                <p className={styles.sexText}>Мужской</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.inputLilColumn}>
                        <div className={styles.inputColumn}>
                            <p className={styles.inputTitle}>
                                E-mail {data?.isVerified && "✔"}
                            </p>
                            <input
                                className={styles.input}
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>
                        <div className={styles.inputColumn}>
                            <p className={styles.inputTitle}>
                                Код подтверждения E-mail
                            </p>
                            <div className={styles.codeLine}>
                                <input
                                    className={styles.lilInputCode}
                                    onChange={(e) =>
                                        setEmailCode(e.target.value)
                                    }
                                    value={emailCode}
                                />
                                {isEmailCodeSend ? (
                                    <button
                                        className={styles.buttonCode}
                                        onClick={emailCheck}
                                    >
                                        ПОДТВЕРДИТЬ
                                    </button>
                                ) : (
                                    <button
                                        className={styles.buttonCode}
                                        onClick={sendEmailCode}
                                    >
                                        ОТПРАВИТЬ ПИСЬМО
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={styles.inputLilColumn}>
                        <div className={styles.inputColumn}>
                            <p className={styles.inputTitle}>
                                Телефон {data?.isVerifiedPhone && "✔"}
                            </p>
                            <InputMask
                                mask="+7 (999) 999-99-99"
                                className={styles.input}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className={styles.inputColumn}>
                            <p className={styles.inputTitle}>
                                Код подтверждения телефона
                            </p>
                            <div className={styles.codeLine}>
                                <input
                                    className={styles.lilInputCode}
                                    onChange={(e) =>
                                        setPhoneCode(e.target.value)
                                    }
                                    value={phoneCode}
                                />
                                <button
                                    className={`${styles.buttonCode} ${
                                        disabled ? styles.buttonDisabled : ""
                                    }`}
                                    onClick={() => {
                                        if (isPhoneCodeSend)
                                            return mobilePhoneCheck();
                                        else sendMessage();
                                    }}
                                >
                                    {isPhoneCodeSend
                                        ? "ПОДТВЕРДИТЬ"
                                        : "ОТПРАВИТЬ SMS"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.inputColumn}>
                        <p className={styles.inputTitle}>Получать рассылки</p>
                        <div className={styles.lineSex}>
                            <div
                                className={styles.lineLilSex}
                                onClick={() => setMailing("Email")}
                            >
                                <img
                                    src={
                                        mailing === "Email"
                                            ? "/goldDotSelect.svg"
                                            : "/goldCircle.svg"
                                    }
                                    className={styles.sexCircle}
                                />
                                <p className={styles.sexText}>E-mail</p>
                            </div>
                            <div
                                className={styles.lineLilSex}
                                onClick={() => setMailing("Phone")}
                            >
                                <img
                                    src={
                                        mailing === "Phone"
                                            ? "/goldDotSelect.svg"
                                            : "/goldCircle.svg"
                                    }
                                    className={styles.sexCircle}
                                />
                                <p className={styles.sexText}>Телефон</p>
                            </div>
                        </div>
                        <div className={styles.checkBoxLine}>
                            {checkBoxes.news ? (
                                <img
                                    src="/checkbox.svg"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        setCheckBoxes({
                                            ...checkBoxes,
                                            news: false,
                                        });
                                        setMailing("");
                                    }}
                                />
                            ) : (
                                <img
                                    src="/emptyCheckbox.svg"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        setCheckBoxes({
                                            ...checkBoxes,
                                            news: true,
                                        });
                                        setMailing("Email");
                                    }}
                                />
                            )}
                            <p className={styles.checkBoxText}>
                                Я хочу получать{" "}
                                <span
                                    className={styles.checkBoxSpan}
                                    onClick={() => setNews(true)}
                                >
                                    сообщения о новостях, акциях и персональные
                                    рекомендации
                                </span>
                            </p>
                        </div>
                        <DocumentsModal news={news} setNews={setNews} />
                    </div>
                    <div className={styles.inputColumn}>
                        <p className={styles.inputTitle}>Дата рождения</p>
                        <InputMask
                            mask="99.99.9999"
                            className={styles.input}
                            value={dateBirthday}
                            onChange={(e) => setDateBirthday(e.target.value)}
                        />
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
                            <input
                                className={styles.input}
                                type={hidePassword ? "password" : "text"}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                value={password}
                            />
                            <>
                                {hidePassword ? (
                                    <img
                                        src="/showIcon.svg"
                                        className={styles.inputIcon}
                                        onClick={() => setHidePassword(false)}
                                    />
                                ) : (
                                    <img
                                        src="/hideIcon.svg"
                                        className={styles.inputIcon}
                                        onClick={() => setHidePassword(true)}
                                    />
                                )}
                            </>
                        </div>
                    </div>
                </div>
                <div className={styles.inputColumn}>
                    {error ? (
                        <p
                            className={`${styles.inputTitle} ${styles.errorText}`}
                        >
                            Пароли не совпадают
                        </p>
                    ) : (
                        <p className={styles.inputTitle}>
                            Подтверждение нового пароля
                        </p>
                    )}
                    <div className={styles.inputIconLine}>
                        <input
                            className={styles.input}
                            type={hidePassword2 ? "password" : "text"}
                            onChange={(e) => {
                                setRepeatPassword(e.target.value);
                                setError(false);
                            }}
                            value={repeatPassword}
                        />
                        <>
                            {hidePassword2 ? (
                                <img
                                    src="/showIcon.svg"
                                    className={styles.inputIcon}
                                    onClick={() => setHidePassword2(false)}
                                />
                            ) : (
                                <img
                                    src="/hideIcon.svg"
                                    className={styles.inputIcon}
                                    onClick={() => setHidePassword2(true)}
                                />
                            )}
                        </>
                    </div>
                </div>
            </div>
            <hr className={styles.hr} />
            <button className={styles.saveButton} onClick={saveData}>
                СОХРАНИТЬ
            </button>
            {/* <Modal onClose={onClose} isOpen={isOpen} autoFocus={false} isCentered size='xl' >
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
        </Modal> */}
            <Modal
                onClose={onClose}
                isOpen={isOpen}
                autoFocus={false}
                isCentered
                size="xl"
            >
                <ModalOverlay />
                <ModalContent p={0} bg="none" boxShadow="none">
                    <ModalBody p={0}>
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <p className={styles.modalHeaderTitle}>
                                    СОХРАНИТЬ ИЗМЕНЕНИЯ?
                                </p>
                                <img
                                    src="/cross.svg"
                                    onClick={onClose}
                                    className={styles.modalCross}
                                />
                            </div>
                            <div className={styles.modalColumn}>
                                <button
                                    onClick={saveData}
                                    className={styles.modalDeleteAll}
                                >
                                    СОХРАНИТЬ
                                </button>
                                <button
                                    onClick={() => {
                                        setPhone(initialData.phone);
                                        setEmail(initialData.email);
                                        setName(initialData.name);
                                        setLastName(initialData.lastName);
                                        setSex(initialData.sex);
                                        setDateBirthday(
                                            initialData.dateBirthday
                                        );
                                        setMailing(initialData.mailing);
                                        onClose();
                                    }}
                                    className={styles.modalClose}
                                >
                                    НЕТ
                                </button>
                            </div>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}
