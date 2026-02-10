# Guide de Test Rapide 🚀

## Démarrage en 3 étapes

### 1. Configuration des credentials

```bash
# Copier le fichier d'exemple
cp .env.local.example .env.local

# Éditer avec vos credentials Keycloak
nano .env.local  # ou vim, code, etc.
```

### 2. Installation et build

```bash
npm install
npm run build
```

### 3. Tests

```bash
# Test d'authentification Keycloak
npm run test:auth

# Test des APIs YellowCard
npm run test:yellowcard CI

# Test des APIs MELD
npm run test:meld FR
```

## Démarrer le serveur

```bash
npm run dev
```

Puis ouvrez http://localhost:3000/pay?merchantId=YOUR_ID&wallet=YOUR_WALLET

## Tests manuels

### Test YellowCard (Côte d'Ivoire)

```bash
# Obtenir les réseaux
curl "http://localhost:3000/api/yellowcard/networks?countryCode=CI"

# Obtenir les channels
curl "http://localhost:3000/api/yellowcard/channels?countryCode=CI"

# Obtenir les taux
curl "http://localhost:3000/api/yellowcard/rates?currencyCode=XOF"
```

### Test MELD (France)

```bash
# Obtenir les méthodes de paiement
curl "http://localhost:3000/api/meld/payment-methods?fiatCurrency=EUR"

# Obtenir les defaults
curl "http://localhost:3000/api/meld/defaults?countryCode=FR"

# Obtenir les crypto-monnaies
curl "http://localhost:3000/api/meld/crypto-currencies?countryCode=FR"
```

## Résolution de problèmes

### ❌ "Missing Keycloak configuration"

➡️ Vérifiez que `.env.local` existe et contient toutes les variables KEYCLOAK_*

### ❌ "Failed to obtain Keycloak token"

➡️ Vérifiez vos credentials dans `.env.local`

### ❌ Build échoue

➡️ Supprimez `.next` et relancez :
```bash
rm -rf .next
npm run build
```

## Documentation complète

Pour plus de détails, consultez [TESTING.md](./TESTING.md)
