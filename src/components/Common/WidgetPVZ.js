import { useEffect } from 'react';

const WidgetPVZ = () => {
  useEffect(() => {
    // Инициализируем виджет только на клиенте
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://widget.cdek.ru/widget/scripts/widget.js'; // URL для виджета
      script.async = true;
      script.onload = () => {
        new window.CDEKWidget({
          from: 'Новосибирск',
          root: 'cdek-map',
          apiKey: '612fd896-95e5-4772-87af-2f37b484fde1', // API-ключ Яндекс
          servicePath: 'https://widget.cdek.ru/widget/scripts/service.php', // Корректный путь
          defaultLocation: 'Новосибирск'
        });
      };

      document.body.appendChild(script);
    }
  }, []);

  return (
    <div>
      <div id="cdek-map" style={{ width: '100%', height: '500px', border: 'solid 1px red' }}></div>
    </div>
  );
};

export default WidgetPVZ;
