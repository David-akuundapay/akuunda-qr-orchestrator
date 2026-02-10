# Akuunda QR Orchestrator

Backend orchestrator for the Akuunda Pay QR-code on-ramp flow.

## Overview

This Next.js application provides a web interface for processing cryptocurrency on-ramp payments through:
- **YellowCard**: Mobile money payments for African countries
- **MELD**: Card and bank transfer payments for international markets

All internal API calls are authenticated via Keycloak OAuth2 password grant flow.

## Features

- ✅ Keycloak OAuth2 authentication with automatic token caching and refresh
- ✅ Dynamic payment options fetched from real APIs (no hardcoded data)
- ✅ Support for multiple payment providers (YellowCard and MELD)
- ✅ Real-time exchange rates and network information
- ✅ Multi-step payment flow with validation
- ✅ TypeScript strict mode for type safety

## Architecture

### Authentication Flow

1. All internal API calls require a Bearer token from Keycloak
2. Token is obtained via OAuth2 password grant flow
3. Token is cached and automatically refreshed 30 seconds before expiration
4. See `lib/keycloak.ts` for implementation

### API Client

The `lib/internal-api.ts` module provides authenticated HTTP methods:
- `internalGet<T>(path, params?)` - Authenticated GET requests
- `internalPost<T>(path, body)` - Authenticated POST requests

All calls automatically include the Keycloak Bearer token.

### Integration Endpoints

#### Keycloak Authentication (Endpoint #0)
- **URL**: `KEYCLOAK_TOKEN_URL`
- **Method**: POST
- **Grant Type**: password
- **Content-Type**: application/x-www-form-urlencoded

#### Merchant Profile (Endpoint #1)
- **Endpoint**: `GET /api/internal/v1/users/akuunda/getUser`
- **Query Param**: `username` (merchantId)
- **Implementation**: `lib/akuunda-api.ts`

#### YellowCard APIs (Endpoints #2-6)
- **Rates**: `GET /api/internal/v1/yellow-card/rates?currencyCode=`
- **Rates by Channel**: `GET /api/internal/v1/yellow-card/rates/{channelId}?currencyCode=`
- **Networks**: `GET /api/internal/v1/yellow-card/networks?countryCode=`
- **Channels**: `GET /api/internal/v1/yellow-card/channels?countryCode=`
- **Create Collection**: `POST /api/internal/v1/yellow-card/on-ramp/create-collection`
- **Implementation**: `lib/yellowcard-api.ts`

#### MELD APIs (Endpoints #7-11)
- **Payment Methods**: `GET /api/internal/v1/meld/payment-methods?fiatCurrency=`
- **Fiat Currencies**: `GET /api/internal/v1/meld/countries/{cc}/fiat-currencies`
- **Defaults**: `GET /api/internal/v1/meld/countries/{cc}/defaults`
- **Crypto Currencies**: `GET /api/internal/v1/meld/countries/{cc}/crypto-currencies`
- **Create Session**: `POST /api/internal/v1/meld/session`
- **Implementation**: `lib/meld-api.ts`

### Frontend API Routes

The Next.js API routes act as proxies to internal APIs:

- `/api/payment-options` - Aggregates networks/channels/payment methods by country
- `/api/on-ramp/create` - Creates payment (YellowCard or MELD)
- `/api/yellowcard/rates` - YellowCard exchange rates
- `/api/yellowcard/networks` - Mobile money networks
- `/api/yellowcard/channels` - Payment channels
- `/api/meld/payment-methods` - MELD payment methods
- `/api/meld/defaults` - MELD country defaults
- `/api/meld/crypto-currencies` - Available cryptocurrencies

## Environment Variables

### Required Variables

```bash
# Keycloak Authentication
KEYCLOAK_TOKEN_URL=https://auth.akuunda-pay.io/realms/akuunda/protocol/openid-connect/token
KEYCLOAK_USERNAME=your_username
KEYCLOAK_PASSWORD=your_password
KEYCLOAK_CLIENT_ID=your_client_id
KEYCLOAK_CLIENT_SECRET=your_client_secret

# Akuunda Internal API Base URL
AKUUNDA_API_BASE_URL=https://walletdev.akuunda-pay.io
```

### Optional Variables

```bash
# YellowCard Channel ID (optional fallback, fetched dynamically)
YELLOWCARD_CHANNEL_ID=

# Frontend API Base
NEXT_PUBLIC_API_BASE=/api
```

### Removed Variables

The following variables are **no longer needed** as all API calls now go through the internal authenticated endpoints:

- ❌ `YELLOWCARD_API_URL` - Now uses internal endpoint
- ❌ `YELLOWCARD_API_KEY` - Now uses Keycloak token
- ❌ `MELD_API_URL` - Now uses internal endpoint
- ❌ `MELD_API_KEY` - Now uses Keycloak token

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Keycloak credentials
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Start production server**:
   ```bash
   npm start
   ```

## Payment Flow

1. **Country Selection**: User selects their country
2. **Provider Selection**: System fetches available payment methods dynamically
   - For YellowCard: Shows mobile money networks
   - For MELD: Shows card/bank payment options
3. **Payment Details**: User enters amount and account information
4. **Review**: User confirms payment details
5. **Processing**: System creates payment via authenticated API
   - YellowCard: Returns payment confirmation
   - MELD: Redirects to payment provider

## Security

- ✅ All API calls use Keycloak OAuth2 authentication
- ✅ No hardcoded API keys or secrets in code
- ✅ Environment variables for sensitive data
- ✅ TypeScript strict mode for type safety
- ✅ Input validation on all forms
- ✅ Error handling and logging

## Key Changes from Previous Version

### 1. Authentication
- **Before**: Direct API calls without authentication
- **After**: All calls authenticated via Keycloak Bearer token

### 2. Merchant Profile API
- **Before**: POST request with body `{ username: merchantId }`
- **After**: GET request with query param `?username=merchantId`

### 3. Payment Data
- **Before**: Hardcoded UUIDs and payment methods
- **After**: Dynamically fetched from real APIs

### 4. API Structure
- **Before**: Direct external API calls with separate keys
- **After**: All calls through internal API with Keycloak auth

## Testing

Pour tester l'application, consultez le guide détaillé : **[TESTING.md](./TESTING.md)**

### Tests rapides

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les credentials Keycloak dans .env.local
cp .env.example .env.local
# Éditer .env.local avec vos credentials

# 3. Build
npm run build

# 4. Démarrer le serveur
npm run dev

# 5. Tester l'UI
# Ouvrir http://localhost:3000/pay?merchantId=YOUR_ID&wallet=YOUR_WALLET
```

## Development

### Project Structure

```
├── app/
│   ├── api/                    # Next.js API routes
│   │   ├── payment-options/    # Payment discovery endpoint
│   │   ├── on-ramp/create/     # Payment creation endpoint
│   │   ├── yellowcard/         # YellowCard proxy routes
│   │   └── meld/               # MELD proxy routes
│   ├── pay/                    # Payment flow UI
│   └── layout.tsx
├── components/                  # React components
│   ├── CountrySelector.tsx
│   ├── ProviderSelector.tsx    # Dynamic payment method selector
│   ├── PaymentForm.tsx
│   ├── ReviewStep.tsx
│   └── ProgressStepper.tsx
├── lib/                        # Core logic modules
│   ├── keycloak.ts            # OAuth2 authentication
│   ├── internal-api.ts        # Authenticated HTTP client
│   ├── akuunda-api.ts         # Merchant profile API
│   ├── yellowcard-api.ts      # YellowCard integration
│   ├── meld-api.ts            # MELD integration
│   ├── yellowcard.ts          # YellowCard types & builders
│   ├── meld.ts                # MELD types & builders
│   └── countries.ts           # Country configuration
└── .env.example               # Environment template
```

### TypeScript

The project uses TypeScript with strict mode disabled (`"strict": false` in tsconfig.json). However, the code follows best practices:
- Explicit type annotations
- No use of `any` type
- Proper error handling
- Interface definitions for all data structures

## Troubleshooting

### Authentication Issues

If you see authentication errors:
1. Verify Keycloak credentials in `.env`
2. Check that `KEYCLOAK_TOKEN_URL` is correct
3. Ensure the Keycloak user has proper permissions
4. Check logs for detailed error messages

### Build Errors

If the build fails:
1. Run `npm install` to ensure dependencies are up to date
2. Delete `.next` folder and rebuild
3. Check TypeScript errors with `npx tsc --noEmit`

### API Errors

If API calls fail:
1. Verify `AKUUNDA_API_BASE_URL` is correct
2. Check that the internal API is accessible
3. Review browser console and server logs for details
4. Ensure Keycloak token is valid and not expired

## License

Proprietary - Akuunda Pay
