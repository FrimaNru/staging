export default async function handler(req, res) {
    try {
        const method = (req.method || "GET").toUpperCase();

        // Виджет @cdek-it/widget ожидает "legacy service.php" интерфейс:
        // - GET ?action=offices&page&size... -> массив deliverypoints (CDEK-like shape)
        // - POST {action:"calculate", ...} -> {tariff_codes: [...]}
        //
        // Внешний api.mi-alegria.shop/map_service/service.php сейчас падает (Server not authorized),
        // поэтому используем публичный endpoint СДЭК pvzlist (без oauth) хотя бы для офисов.

        const action =
            method === "GET"
                ? String(req.query?.action || "")
                : String((req.body && req.body.action) || "");

        if (action === "calculate") {
            // Для UI виджета достаточно вернуть пустой список тарифов — выбор ПВЗ работает,
            // а стоимость/сроки мы всё равно считаем своим API calculateDelivery.
            res.status(200).json({ tariff_codes: [] });
            return;
        }

        if (action !== "offices") {
            res.status(400).json({ message: "Unknown action" });
            return;
        }

        const page = Math.max(0, Number(req.query?.page || 0) || 0);
        const size = Math.max(1, Math.min(500, Number(req.query?.size || 50) || 50));

        // В pvzlist нужен cityid. Виджет обычно передает city_code/region_code, но не всегда.
        // Если не нашли — дефолтим на Москву (44).
        const cityIdRaw =
            req.query?.cityid ||
            req.query?.city_id ||
            req.query?.cityCode ||
            req.query?.city_code ||
            req.query?.city_code_id ||
            44;
        const cityid = String(Array.isArray(cityIdRaw) ? cityIdRaw[0] : cityIdRaw).replace(/[^\d]/g, "") || "44";

        const pvzUrl = `https://integration.cdek.ru/pvzlist/v1/json?cityid=${encodeURIComponent(cityid)}`;
        const pvzResp = await fetch(pvzUrl, {
            headers: {
                Accept: "application/json",
                "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
            },
        });
        const pvzJson = await pvzResp.json();
        const pvz = Array.isArray(pvzJson?.pvz) ? pvzJson.pvz : [];

        const mapped = pvz.map((p) => ({
            // Поля, которые использует formatOffices() в виджете
            type: p.type,
            have_cashless: Boolean(p.haveCashless),
            have_cash: Boolean(p.haveCash),
            allowed_cod: Boolean(p.allowedCod),
            is_dressing_room: Boolean(p.isDressingRoom),
            code: p.code,
            name: p.name,
            address: p.address,
            work_time: p.workTime,
            // В исходном API виджета location — это объект
            location: {
                city_code: Number(p.cityCode),
                city: p.city,
                postal_code: p.postalCode,
                country_code: Number(p.countryCode),
                region: p.regionName,
                address: p.address,
                latitude: Number(p.coordY),
                longitude: Number(p.coordX),
            },
        }));

        const start = page * size;
        const slice = mapped.slice(start, start + size);

        res.status(200).json(slice);
    } catch (e) {
        console.error("CDEK proxy error:", e);
        res.status(502).json({ message: "CDEK proxy error" });
    }
}


