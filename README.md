# Semnan Smart Governance V4

نسخه V4 همان کدهای V3 را نگه می‌دارد، اما Portal و Command Center را در یک Next.js واحد ادغام می‌کند.

## ساختار

```text
semnan-smart-governance-v4/
├── frontend/          # Landing + Management Dashboard, one Next.js app
│   ├── app/
│   │   ├── page.tsx            # Landing: /
│   │   └── command/page.tsx    # Dashboard: /command
│   └── dashboard/     # Existing command-center components/features
├── backend/           # Existing Django + GraphQL + PostGIS API
├── docs/
└── docker-compose.yml
```

## آدرس‌ها

- Landing: http://localhost:3000/
- Management Dashboard: http://localhost:3000/command
- GraphQL API: http://localhost:9000/graphql/

## اجرای ساده با Docker

```bash
docker compose up --build -d
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py seed_demo
```

بعد فقط مرورگر را روی `http://localhost:3000` باز کنید. داشبورد مدیریتی نیز روی همان پورت در `/command` است.

## اجرای Development بدون Docker برای Frontend

Backend:

```bash
docker compose up -d db redis backend
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py seed_demo
```

Frontend (فقط یک ترمینال):

```bash
cd frontend
npm install
npm run dev
```

- Landing: `http://localhost:3000/`
- Dashboard: `http://localhost:3000/command`

در صورت اجرای Backend روی آدرس دیگری، فایل `.env.local` در `frontend` بسازید و `SEMNAN_API_URL` را تنظیم کنید.
