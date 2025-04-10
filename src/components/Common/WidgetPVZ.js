import { useEffect, useRef } from 'react';

const WidgetPVZ = ({ onSelectPVZ }) => {
    const widgetRef = useRef(null);

    useEffect(() => {
        let widget;

        const loadWidget = async () => {
            try {
                const CdekWidget = await import('@cdek-it/widget');
                widget = new CdekWidget.default({
                    element: widgetRef.current,
                    root: 'cdek-map',
                    servicePath: 'https://api.mi-alegria.shop/map_service/service.php',
                    apiKey: 'a2ab5825-bf63-4a48-b7dc-c03fd2fe6ebf',
                    goods: [{ weight: 0.5, height: 10, width: 10, length: 10 }],
                    defaultLocation: 'Москва',
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
                        office: [136]
                    },
                    onChoose(type, tariff, address) {
                        onSelectPVZ(address);
                    },
                });
            } catch (error) {
                console.error('Ошибка загрузки виджета:', error);
            }
        };

        loadWidget();

        return () => {
            if (widget) {
                widget.destroy();
            }
        };
    }, [onSelectPVZ]);

    return <div ref={widgetRef} id="cdek-map" className="widget"></div>;
};

export default WidgetPVZ;