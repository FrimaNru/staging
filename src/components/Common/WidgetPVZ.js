import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Button } from '@chakra-ui/react';

const WidgetPVZ = () => {
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);

  useEffect(() => {
    const initCDEKWidget = () => {
      if (typeof window !== 'undefined' && window.CDEKWidget) {
        window.widget = new window.CDEKWidget({
          from: 'Новосибирск',
          root: 'cdek-map',
          apiKey: 'oq6SGTH2JEszUlewiFNSi9DHagsfMviF',
          canChoose: true,
          servicePath: '/service.php',
          hideFilters: {
            have_cashless: false,
            have_cash: false,
            is_dressing_room: false,
            type: false,
          },
          hideDeliveryOptions: {
            office: false,
            door: true,
          },
          popup: true,
          debug: true,
          goods: [
            {
              width: 10,
              height: 10,
              length: 10,
              weight: 10,
            },
          ],
          defaultLocation: [82.9346, 55.0415],
          lang: 'rus',
          currency: 'RUB',
          tariffs: {
            office: [233, 137, 139],
            door: [234, 136, 138],
          },
          onReady() {
            console.log('Виджет загружен');
            // Попробуйте открыть виджет сразу после загрузки
            // window.widget.open();
          },
          onCalculate() {
            console.log('Расчет стоимости доставки произведен');
          },
          onChoose(pvz) {
            console.log('Доставка выбрана:', pvz);
            // Сохраните выбранный ПВЗ, если нужно
          },
        });
      } else {
        console.error('CDEKWidget не найден');
      }
    };

    if (isWidgetLoaded) {
      initCDEKWidget();
    }
  }, [isWidgetLoaded]);

  const openWidget = () => {
    if (window.widget) {
      console.log('Попытка открыть виджет...');
      window.widget.open();
    } else {
      console.error('Виджет не инициализирован');
    }
  };

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@cdek-it/widget@3"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('Скрипт виджета CDEK загружен');
          setIsWidgetLoaded(true);
        }}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@unocss/runtime"
        strategy="beforeInteractive"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css"
        rel="stylesheet"
      />
      <div className="ml-2">
        <p className="my-2">Пример инициализации виджета с указанием всех параметров виджета</p>
        <Button
          onClick={openWidget}
          className="p-1 my-2 border-stone-500 border-2 rounded-md"
        >
          Показать ПВЗ
        </Button>
        <div id="cdek-map"></div>
      </div>
    </>
  );
};

export default WidgetPVZ;
