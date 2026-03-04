# Futuros BCV

Microservicio que devuelve la tasa oficial del Banco Central de Venezuela (BCV) en formato JSON.

## Endpoint

```
GET /api/rates
```

### Respuesta exitosa

```json
{
  "success": true,
  "data": {
    "eur_bs": 491.49,
    "usd_bs": 425.67,
    "date": "2026-03-04",
    "effective_date": "Miércoles, 04 Marzo 2026",
    "source": "BCV oficial",
    "fetched_at": "2026-03-04T10:30:00Z"
  }
}
```

### Respuesta fallida

```json
{
  "success": false,
  "error": "No se pudo obtener la tasa del BCV",
  "fetched_at": "2026-03-04T10:30:00Z"
}
```

## Desarrollo local

```bash
npm install
npm run dev
# GET http://localhost:3000/api/rates
```

## Stack

- Next.js 14 (App Router)
- Cheerio (scraping)
- Axios (HTTP)
- Vercel (deploy)
