# Akuunda QR Orchestrator

Backend orchestrator for the Akuunda Pay QR-code on-ramp flow.
It proxies and secures calls to internal MELD and YellowCard APIs via a Keycloak service-account token (password grant).

## Architecture

```
Mobile App / QR Web ──► QR Orchestrator ──► walletdev internal API
                              │                     │
                              └── Keycloak token ────┘
```

## Endpoints

| Method | Path                    | Description                                   |
|--------|-------------------------|-----------------------------------------------|
| GET    | `/api/health`           | Liveness probe                                |
| GET    | `/api/payment-options`  | Dynamic discovery (`?countryCode=CD`)         |
| POST   | `/api/on-ramp/create`   | Create MELD session or YellowCard collection  |

## Quick Start

```bash
cp .env.example .env   # fill in secrets
npm install
npm run build
npm start
```

## Docker (Coolify)

```bash
docker build -t qr-orchestrator .
docker run -p 3000:3000 --env-file .env qr-orchestrator
```

## Environment Variables

See `.env.example` for the full list. Never commit real secrets.

## Front-End Integration

The QR Web front-end must call this orchestrator instead of `walletdev` directly:

```
NEXT_PUBLIC_API_BASE=https://qr-orchestrator.akuunda-pay.io/api
```

## License

Private – Akuunda Pay