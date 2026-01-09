import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalCloseButton, useToast } from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../../../apiConfig";
import Button from "@/ui/Button/Button";
import styles from "@/styles/Admin/Products/Products.module.css";

export default function BulkYandexMarketUpdate({ isOpen, onClose, onSuccess }) {
    const [mappingText, setMappingText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleUpdate = async () => {
        if (!mappingText.trim()) {
            toast({
                position: 'bottom-right',
                render: () => (<div className="toast">Введите маппинг товаров и ссылок</div>),
                duration: 3000
            });
            return;
        }

        try {
            const mapping = JSON.parse(mappingText);
            setIsLoading(true);

            // Загружаем все товары
            const productsResponse = await axios.get(`${API_BASE_URL}getProducts`);
            const products = productsResponse.data;

            if (!Array.isArray(products)) {
                throw new Error('Не удалось загрузить товары');
            }

            const YANDEX_MARKET_BASE_URL = 'https://market.yandex.ru/business--mi-alegria/216411290';
            const YANDEX_MARKET_PARAMS = '?generalContext=t%3DshopInShop%3Bi%3D1%3Bbi%3D216411290%3B&rs=eJwzknjByPiJUYiDUWDhIVYJBo3Jr27La1xvOSMPAGXtCOA%2C&searchContext=sins_ctx';

            const buildFullUrl = (url) => {
                if (!url || url.trim() === '') return null;
                if (url.startsWith('http://') || url.startsWith('https://')) return url;
                if (url.startsWith('/')) {
                    return YANDEX_MARKET_BASE_URL + url + (url.includes('?') ? '' : YANDEX_MARKET_PARAMS);
                }
                return YANDEX_MARKET_BASE_URL + '/' + url + (url.includes('?') ? '' : YANDEX_MARKET_PARAMS);
            };

            let updatedCount = 0;
            let errorCount = 0;
            let notFoundCount = 0;

            for (const [productKey, yandexUrl] of Object.entries(mapping)) {
                const product = products.find(p => 
                    p.article === productKey || 
                    p.name === productKey ||
                    (p.article && p.article.toLowerCase() === productKey.toLowerCase()) ||
                    (p.name && p.name.toLowerCase() === productKey.toLowerCase())
                );

                if (!product) {
                    notFoundCount++;
                    continue;
                }

                const fullUrl = buildFullUrl(yandexUrl);
                if (!fullUrl) continue;

                try {
                    const fullProductResponse = await axios.post(`${API_BASE_URL}getOneProduct`, { id: product._id });
                    const fullProductData = fullProductResponse.data;

                    const formData = new FormData();
                    formData.append('data', JSON.stringify({
                        ...fullProductData,
                        yandexMarketUrl: fullUrl
                    }));

                    if (fullProductData.cover) {
                        formData.append('coverNames', fullProductData.cover);
                    }
                    if (Array.isArray(fullProductData.images)) {
                        fullProductData.images.forEach((img, index) => {
                            if (typeof img === 'string') {
                                formData.append(`imageNames[${index}]`, img);
                            }
                        });
                    }

                    await axios.post(`${API_BASE_URL}editProduct`, formData, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    updatedCount++;
                    await new Promise(resolve => setTimeout(resolve, 300));
                } catch (error) {
                    errorCount++;
                }
            }

            toast({
                position: 'bottom-right',
                render: () => (
                    <div className="toast">
                        Обновлено: {updatedCount}, Ошибок: {errorCount}, Не найдено: {notFoundCount}
                    </div>
                ),
                duration: 5000
            });

            if (onSuccess) onSuccess();
            onClose();
            setMappingText('');

        } catch (error) {
            toast({
                position: 'bottom-right',
                render: () => (<div className="toast">Ошибка: {error.message}</div>),
                duration: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Массовое обновление ссылок Яндекс Маркет</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                        Вставьте JSON с маппингом товаров и ссылок. Формат: {"{"}"артикул или название": "ссылка"{"}"}
                    </p>
                    <textarea
                        value={mappingText}
                        onChange={(e) => setMappingText(e.target.value)}
                        placeholder='{"ART-001": "https://market.yandex.ru/product/123456", "Кольцо": "123456"}'
                        style={{
                            width: '100%',
                            minHeight: '300px',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                            fontSize: '12px'
                        }}
                    />
                    <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <Button onClick={onClose} variant="secondary">Отменить</Button>
                        <Button onClick={handleUpdate} disabled={isLoading} variant="success">
                            {isLoading ? 'Обновление...' : 'Обновить'}
                        </Button>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

