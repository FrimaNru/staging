import { useEffect, useRef } from 'react';

const WidgetPVZ = ({ onSelectPVZ }) => {
    const widgetRef = useRef(null);
    const widgetInstance = useRef(null); // Храним экземпляр виджета

    useEffect(() => {
        const loadWidget = async () => {
            try {
                const CdekWidget = await import('@cdek-it/widget');
                widgetInstance.current = new CdekWidget.default({
                    element: widgetRef.current,
                    root: 'cdek-map',
                    servicePath: 'https://api.mi-alegria.shop/map_service/service.php',
                    apiKey: 'a2ab5825-bf63-4a48-b7dc-c03fd2fe6ebf',
                    goods: [{ weight: 0.5, height: 10, width: 10, length: 10 }],
                    map: {
                        provider: 'yandex',
                        yandex: {
                            apiKey: process.env.NEXT_PUBLIC_YANDEX_MAP_KEY,
                            center: [55.7558, 37.6173],
                            zoom: 10,
                        },
                    },
                    hideDeliveryOptions: {
                        office: false,
                        door: true,
                    },
                    tariffs: {
                        office: [136],
                    },
                    onChoose(type, tariff, address) {
                        onSelectPVZ(address);
                    },
                });
            } catch (error) {
                console.error('Ошибка загрузки виджета:', error);
            }
        };

        // Загружаем виджет только один раз
        loadWidget();

        return () => {
            // Уничтожаем виджет при размонтировании компонента
            if (widgetInstance.current) {
                widgetInstance.current.destroy();
            }
        };
    }, []); // Пустой массив зависимостей

    return <div ref={widgetRef} id="cdek-map" className="widget"></div>;
};

export default WidgetPVZ;