import { useState } from 'react';
import { API_BASE_URL } from '../apiConfig';

export default function TestVKAuth() {
    const [logs, setLogs] = useState([]);

    const addLog = (message) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const testVKAuth = () => {
        addLog('Starting VK auth test...');
        addLog(`API_BASE_URL: ${API_BASE_URL}`);
        addLog(`VK auth URL: ${API_BASE_URL}auth/vk`);
        
        // Открываем VK авторизацию в новом окне для тестирования
        const vkWindow = window.open(`${API_BASE_URL}auth/vk`, 'vk-auth', 'width=600,height=600');
        
        // Слушаем сообщения от дочернего окна
        const messageHandler = (event) => {
            if (event.origin !== window.location.origin) return;
            
            if (event.data.type === 'VK_AUTH_SUCCESS') {
                addLog('VK auth successful!');
                addLog(`Token: ${event.data.token}`);
                addLog(`User: ${JSON.stringify(event.data.user)}`);
                vkWindow.close();
            } else if (event.data.type === 'VK_AUTH_ERROR') {
                addLog(`VK auth error: ${event.data.error}`);
                vkWindow.close();
            }
        };

        window.addEventListener('message', messageHandler);
        
        // Очистка через 5 минут
        setTimeout(() => {
            window.removeEventListener('message', messageHandler);
            if (vkWindow && !vkWindow.closed) {
                vkWindow.close();
            }
        }, 300000);
    };

    const clearLogs = () => {
        setLogs([]);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>VK Auth Test</h1>
            
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={testVKAuth}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#0077ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Test VK Auth
                </button>
                
                <button 
                    onClick={clearLogs}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#666',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Clear Logs
                </button>
            </div>

            <div style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '5px',
                maxHeight: '400px',
                overflowY: 'auto'
            }}>
                <h3>Logs:</h3>
                {logs.length === 0 ? (
                    <p>No logs yet. Click "Test VK Auth" to start.</p>
                ) : (
                    logs.map((log, index) => (
                        <div key={index} style={{ marginBottom: '5px', fontSize: '12px' }}>
                            {log}
                        </div>
                    ))
                )}
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>Instructions:</h3>
                <ol>
                    <li>Click "Test VK Auth" to open VK authorization in a new window</li>
                    <li>Complete the VK authorization process</li>
                    <li>Check the logs below to see what happens</li>
                    <li>Check the browser console for additional debug information</li>
                </ol>
            </div>
        </div>
    );
}
