import { useEffect } from 'react';
import { Button, Box, Text } from '@chakra-ui/react';

const WidgetPVZ = () => {
  useEffect(() => {
    // Функция для загрузки скрипта
    const loadScript = (src, onLoad) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = onLoad;
      script.onerror = () => console.error(`Ошибка загрузки скрипта ${src}`);
      document.body.appendChild(script);
    };

    if (typeof window !== 'undefined') {
      loadScript('https://cdn.jsdelivr.net/npm/@cdek-it/widget@3', () => {
        if (window.CDEKWidget) {
          try {
            window.widget = new window.CDEKWidget({
              apiKey: 'a2ab5825-bf63-4a48-b7dc-c03fd2fe6ebf', // Ваш API-ключ
              defaultLocation: 'Москва', // Город по умолчанию
              popup: true // Открытие в модальном окне
            });
          } catch (error) {
            console.error('Ошибка инициализации CDEKWidget:', error);
          }
        }
      });
    }
  }, []);

  const openWidget = () => {
    if (window.widget) {
      window.widget.open();
    } else {
      console.error('Виджет не инициализирован');
    }
  };

  const closeWidget = () => {
    if (window.widget) {
      window.widget.close();
    } else {
      console.error('Виджет не инициализирован');
    }
  };

  return (
    <Box>
      <Text fontSize="xl" mb={4}>Выберите пункт выдачи СДЭК</Text>
      <Button onClick={openWidget} colorScheme="teal" mr={4}>
        Показать виджет
      </Button>
      <Button onClick={closeWidget} colorScheme="red">
        Скрыть виджет
      </Button>
    </Box>
  );
};

export default WidgetPVZ;
