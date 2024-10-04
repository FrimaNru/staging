import { useEffect, useRef } from 'react';
import CdekWidget from '@cdek-it/widget';

const WidgetPVZ = ({ onSelectPVZ }) => {
  const widgetRef = useRef(null);

  useEffect(() => {
    // if (!window.CdekWidget) {
    //   console.error('CdekWidget не загружен');
    //   return;
    // }

    try {
      const widget = new CdekWidget({
        element: widgetRef.current,
        root: 'cdek-map',
        servicePath: 'https://api.mi-alegria.shop/map_service/service.php',
        apiKey: '7a275500-155b-4b65-87a4-b6f39744f0f7',
        // apikey: 'oq6SGTH2JEszUlewiFNSi9DHagsfMviF', // Замените на ваш фактический API-ключ СДЭК
        goods: [{ weight: 0.5, height: 10, width: 10, length: 10 }],
        defaultLocation: 'Москва', // Передача города как строки
        map: {
          provider: 'yandex',
          yandex: {
            center: [55.7558, 37.6173],
            zoom: 10,
          },
        },
        hideDeliveryOptions: {
          office: false,
          door: false,
        },
        onChoose: (pvz) => {
          onSelectPVZ(pvz);
        },
      });

      return () => {
        widget.destroy();
      };
    } catch (error) {
      console.error('Ошибка инициализации виджета СДЭК:', error);
    }
  }, [onSelectPVZ]);

  return <div ref={widgetRef} style={{ width: '100%', height: '500px' }}></div>;
};

export default WidgetPVZ;