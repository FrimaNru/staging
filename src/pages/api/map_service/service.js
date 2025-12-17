export default async function handler(req, res) {
    const upstreamBase = "https://api.mi-alegria.shop/map_service/service.php";

    try {
        const url = new URL(upstreamBase);

        // Пробрасываем query string как есть
        if (req.query && typeof req.query === "object") {
            Object.entries(req.query).forEach(([k, v]) => {
                if (v == null) return;
                // Next может отдавать массив для повторяющихся параметров
                if (Array.isArray(v)) v.forEach((vv) => url.searchParams.append(k, String(vv)));
                else url.searchParams.set(k, String(v));
            });
        }

        const method = (req.method || "GET").toUpperCase();

        const headers = {
            // важно: json, т.к. сервис php умеет json_decode тела
            "Content-Type": "application/json",
            "Accept": "application/json",
        };

        const hasBody = method !== "GET" && method !== "HEAD";
        const body = hasBody ? JSON.stringify(req.body ?? {}) : undefined;

        const upstream = await fetch(url.toString(), {
            method,
            headers,
            body,
        });

        // Пробрасываем статус и ключевые заголовки
        res.status(upstream.status);
        const contentType = upstream.headers.get("content-type");
        if (contentType) res.setHeader("content-type", contentType);
        const xServiceVersion = upstream.headers.get("x-service-version");
        if (xServiceVersion) res.setHeader("x-service-version", xServiceVersion);

        const text = await upstream.text();
        res.send(text);
    } catch (e) {
        console.error("CDEK proxy error:", e);
        res.status(502).json({ message: "CDEK proxy error" });
    }
}


