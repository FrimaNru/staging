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
                    // На проде запросы к api.mi-alegria.shop из браузера ловят CORS,
                    // поэтому ходим в same-origin API-роут, который проксирует запрос сервер-сервер.
                    servicePath: '/api/map_service/service.php',
                    apiKey: 'a2ab5825-bf63-4a48-b7dc-c03fd2fe6ebf',
                    goods: [{ weight: 0.5, height: 10, width: 10, length: 10 }],
                    // Важно: передаем координаты, а не строку, чтобы виджет не делал geocodeString("Москва")
                    // (это часто падает из-за ограничений/ключей Яндекса и вызывает Unhandled Runtime Error)
                    defaultLocation: [55.7558, 37.6173],
                    map: {
                        provider: 'yandex',
                        yandex: {
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