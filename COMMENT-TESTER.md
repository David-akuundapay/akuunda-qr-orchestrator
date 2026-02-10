# Comment Tester l'Intégration Keycloak 🧪

## Résumé Rapide

J'ai créé une documentation complète et des scripts de test pour vous permettre de tester facilement l'intégration Keycloak et les APIs dynamiques.

## 📂 Fichiers de Test Créés

### Documentation
- **`TESTING.md`** (10 KB) - Guide de test complet en français avec :
  - Instructions de configuration étape par étape
  - Tests d'authentification Keycloak
  - Tests des 12 endpoints API
  - Tests de l'interface utilisateur
  - Résolution des problèmes courants

- **`QUICKSTART.md`** - Guide de démarrage rapide (3 étapes)

- **`.env.local.example`** - Template de configuration avec commentaires détaillés

### Scripts de Test
- **`scripts/test-auth.js`** - Test d'authentification Keycloak
- **`scripts/test-yellowcard.js`** - Test des APIs YellowCard
- **`scripts/test-meld.js`** - Test des APIs MELD
- **`scripts/quick-start.sh`** - Script de setup automatique

### Commandes NPM
J'ai ajouté ces commandes dans `package.json` :
```json
"test:auth": "node scripts/test-auth.js",
"test:yellowcard": "node scripts/test-yellowcard.js",
"test:meld": "node scripts/test-meld.js"
```

## 🚀 Comment Commencer

### Option 1 : Démarrage Rapide (3 commandes)

```bash
# 1. Configurer les credentials
cp .env.local.example .env.local
# Éditez .env.local avec vos credentials Keycloak

# 2. Installer et tester l'authentification
npm install
npm run test:auth

# 3. Démarrer le serveur
npm run dev
```

### Option 2 : Tests Complets

```bash
# Test 1: Authentification Keycloak
npm run test:auth

# Test 2: YellowCard APIs (Côte d'Ivoire)
npm run test:yellowcard CI

# Test 3: MELD APIs (France)
npm run test:meld FR

# Test 4: Build du projet
npm run build

# Test 5: Démarrer le serveur
npm run dev
```

## 🧪 Tests Disponibles

### 1. Test d'Authentification (test:auth)

```bash
npm run test:auth
```

**Ce qui est testé :**
- ✅ Présence des variables d'environnement Keycloak
- ✅ Obtention d'un token via OAuth2
- ✅ Cache du token (performances)
- ✅ Format du token (JWT)

**Résultat attendu :**
```
🔐 Test d'authentification Keycloak
═══════════════════════════════════════

1️⃣ Vérification des variables d'environnement...
✅ Toutes les variables sont définies

2️⃣ Obtention du token Keycloak...
✅ Token obtenu en 234ms
📝 Token (premiers 50 chars): eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA...
📏 Longueur totale: 1842 caractères

3️⃣ Test du cache de token...
✅ Token récupéré du cache en 2ms (117x plus rapide)

✅ Tous les tests d'authentification réussis!
```

### 2. Test YellowCard (test:yellowcard)

```bash
npm run test:yellowcard CI
```

**Ce qui est testé :**
- ✅ Récupération des réseaux mobile money (endpoint #4)
- ✅ Récupération des channels (endpoint #5)
- ✅ Récupération des taux de change (endpoint #2)

**Résultat attendu :**
```
💳 Test des APIs YellowCard pour CI
═══════════════════════════════════════

1️⃣ Test récupération des réseaux...
✅ 4 réseaux récupérés en 156ms
   1. MTN Mobile Money (401a79b8-50bd-41fc-9102-b5d4650a02aa)
   2. Orange Money (uuid-real)
   3. Wave (uuid-real)
   4. Moov Money (uuid-real)

2️⃣ Test récupération des channels...
✅ 1 channels récupérés en 89ms
   1. Channel (7c7e79fe-a82a-42ab-b35c-248aba8c49b3)

✅ Tests YellowCard terminés!
```

### 3. Test MELD (test:meld)

```bash
npm run test:meld FR
```

**Ce qui est testé :**
- ✅ Récupération des méthodes de paiement (endpoint #7)
- ✅ Récupération des defaults (endpoint #9)
- ✅ Récupération des devises fiat (endpoint #8)
- ✅ Récupération des crypto-monnaies (endpoint #10)

**Résultat attendu :**
```
💰 Test des APIs MELD pour FR
═══════════════════════════════════════

1️⃣ Test récupération des méthodes de paiement...
✅ 4 méthodes récupérées en 142ms
   1. Carte bancaire (card)
   2. Virement SEPA (sepa)
   3. Apple Pay (apple_pay)
   4. Google Pay (google_pay)

2️⃣ Test récupération des defaults...
✅ Defaults récupérés en 78ms
   Service Provider: TRANSAK
   Destination Currency: USDC_POLYGON

✅ Tests MELD terminés!
```

## 🌐 Test de l'Interface Utilisateur

### Démarrer le serveur

```bash
npm run dev
```

### Tester le Flow YellowCard

1. Ouvrez : `http://localhost:3000/pay?merchantId=YOUR_ID&wallet=YOUR_WALLET`

2. **Step 1** - Sélectionnez "Côte d'Ivoire 🇨🇮"

3. **Step 2** - Vérifiez que :
   - Les réseaux se chargent dynamiquement (spinner visible)
   - Vous voyez : MTN, Orange, Wave, Moov
   - Les networkId sont de vrais UUID (pas des faux hardcodés)

4. **Step 3** - Entrez les informations de paiement

5. **Step 4** - Vérifiez et confirmez

### Tester le Flow MELD

1. Ouvrez : `http://localhost:3000/pay?merchantId=YOUR_ID&wallet=YOUR_WALLET`

2. **Step 1** - Sélectionnez "France 🇫🇷"

3. **Step 2** - Vérifiez que :
   - Le service provider est auto-sélectionné
   - Les méthodes de paiement se chargent dynamiquement
   - Vous voyez : Carte bancaire, SEPA, Apple Pay, Google Pay

4. **Step 3-4** - Complétez le paiement

## 🔍 Tests Manuels avec cURL

### YellowCard

```bash
# Réseaux
curl "http://localhost:3000/api/yellowcard/networks?countryCode=CI"

# Channels
curl "http://localhost:3000/api/yellowcard/channels?countryCode=CI"

# Taux
curl "http://localhost:3000/api/yellowcard/rates?currencyCode=XOF"
```

### MELD

```bash
# Méthodes de paiement
curl "http://localhost:3000/api/meld/payment-methods?fiatCurrency=EUR"

# Defaults
curl "http://localhost:3000/api/meld/defaults?countryCode=FR"

# Crypto-monnaies
curl "http://localhost:3000/api/meld/crypto-currencies?countryCode=FR"
```

## ⚠️ Résolution de Problèmes

### ❌ "Missing Keycloak configuration"

**Problème** : Variables d'environnement manquantes

**Solution** :
```bash
# Vérifier que .env.local existe
ls -la .env.local

# S'il n'existe pas, le créer
cp .env.local.example .env.local

# Éditer et ajouter vos credentials
nano .env.local
```

### ❌ "Failed to obtain Keycloak token"

**Problème** : Credentials invalides

**Solution** :
1. Vérifiez chaque variable dans `.env.local`
2. Testez l'URL Keycloak dans un navigateur
3. Contactez l'admin pour vérifier les credentials

### ❌ Tests échouent avec des erreurs réseau

**Problème** : API non accessible

**Solution** :
```bash
# Vérifier la connectivité
ping walletdev.akuunda-pay.io

# Vérifier le firewall/VPN
curl https://walletdev.akuunda-pay.io

# Vérifier les logs du serveur
npm run dev
# Regarder les logs dans le terminal
```

## 📊 Checklist Complète

- [ ] `.env.local` créé avec credentials Keycloak
- [ ] `npm install` exécuté avec succès
- [ ] `npm run build` réussi sans erreurs
- [ ] `npm run test:auth` ✅ Token obtenu
- [ ] `npm run test:yellowcard CI` ✅ Réseaux récupérés
- [ ] `npm run test:meld FR` ✅ Méthodes récupérées
- [ ] `npm run dev` ✅ Serveur démarre
- [ ] UI accessible sur http://localhost:3000/pay
- [ ] Flow YellowCard testé (CI)
- [ ] Flow MELD testé (FR)
- [ ] Aucune console error dans le navigateur
- [ ] Aucune erreur dans les logs serveur

## 📚 Documentation Complète

Pour plus de détails, consultez :
- **`TESTING.md`** - Guide complet (tous les scénarios de test)
- **`QUICKSTART.md`** - Guide rapide (3 étapes)
- **`README.md`** - Documentation générale

## 🎯 Prochaines Étapes

Une fois les tests réussis :

1. **Déploiement** - Configurer les mêmes variables sur le serveur de production
2. **Monitoring** - Surveiller les logs d'authentification
3. **Performance** - Vérifier les temps de réponse des APIs
4. **Erreurs** - Tester les cas d'erreur (credentials invalides, API down, etc.)

---

**Besoin d'aide ?** Consultez la section "Troubleshooting" dans `TESTING.md` ou contactez l'équipe de développement.

**Version**: 1.0.0  
**Date**: 2026-02-10
