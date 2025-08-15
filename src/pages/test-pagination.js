import { Footer } from "@/components";
import Header from "@/components/Header/Header";
import Head from "next/head";
import Link from "next/link";

export default function TestPagination() {
    return (
        <>
            <Head>
                <title>Тест пагинации - Mi Alegria</title>
                <meta name="description" content="Тестовая страница для проверки работы пагинации" />
            </Head>
            <center>
                <main>
                    <Header />
                    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                        <h1>Тест пагинации каталога</h1>
                        
                        <h2>Проверка URL структуры:</h2>
                        <ul>
                            <li><Link href="/catalog">Первая страница каталога</Link></li>
                            <li><Link href="/catalog?PAGEN_1=2">Вторая страница каталога</Link></li>
                            <li><Link href="/catalog?PAGEN_1=3">Третья страница каталога</Link></li>
                            <li><Link href="/catalog?PAGEN_1=4">Четвертая страница каталога</Link></li>
                        </ul>
                        
                        <h2>Что проверить:</h2>
                        <ol>
                            <li>Откройте каждую ссылку выше</li>
                            <li>Проверьте, что URL корректно отображается в браузере</li>
                            <li>Убедитесь, что страница не сбрасывается на первую</li>
                            <li>Проверьте, что пагинация работает корректно</li>
                            <li>При клике на номера страниц URL должен обновляться</li>
                        </ol>
                        
                        <h2>Ожидаемый результат:</h2>
                        <ul>
                            <li>URL должны быть в формате ?PAGEN_1=N</li>
                            <li>Страница не должна сбрасываться на первую</li>
                            <li>Пагинация должна переключать страницы</li>
                            <li>При изменении фильтров страница должна сбрасываться на первую</li>
                        </ul>
                        
                        <h2>Известные проблемы (исправлены):</h2>
                        <ul>
                            <li>✅ Страница не сбрасывается при переключении пагинации</li>
                            <li>✅ URL корректно обновляется</li>
                            <li>✅ Пагинация работает стабильно</li>
                        </ul>
                    </div>
                    <Footer />
                </main>
            </center>
        </>
    );
}
