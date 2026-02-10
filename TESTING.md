# Guide de Test - Akuunda QR Orchestrator

Ce guide explique comment tester l'application après l'intégration de l'authentification Keycloak et des APIs dynamiques.

## Prérequis

- Node.js 18+ installé
- Accès aux credentials Keycloak
- Accès au serveur `walletdev.akuunda-pay.io`

## 1. Installation et Configuration

### 1.1 Installer les dépendances

```bash
npm install
```

### 1.2 Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
# Keycloak Authentication - REQUIS
KEYCLOAK_TOKEN_URL=https://auth.akuunda-pay.io/realms/akuunda/protocol/openid-connect/token
KEYCLOAK_USERNAME=votre_username
KEYCLOAK_PASSWORD=votre_password
KEYCLOAK_CLIENT_ID=votre_client_id
KEYCLOAK_CLIENT_SECRET=votre_client_secret

# Akuunda Internal API Base URL
AKUUNDA_API_BASE_URL=https://walletdev.akuunda-pay.io

# YellowCard Channel ID (optionnel, sera récupéré dynamiquement)
YELLOWCARD_CHANNEL_ID=

# Frontend
NEXT_PUBLIC_API_BASE=/api
```

**⚠️ Important**: Remplacez les valeurs par vos credentials Keycloak réels. Sans ces credentials, l'application ne pourra pas s'authentifier.

### 1.3 Vérifier la configuration

```bash
# Vérifier que les variables sont bien définies
cat .env.local | grep KEYCLOAK
```

## 2. Tests de Build et Compilation

### 2.1 Vérifier que le code compile sans erreurs

```bash
npm run build
```

✅ **Résultat attendu**: Le build doit se terminer sans erreurs TypeScript.

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (13/13)
```

### 2.2 Lancer le serveur de développement

```bash
npm run dev
```

✅ **Résultat attendu**: Le serveur démarre sur `http://localhost:3000`

```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## 3. Tests Fonctionnels de l'Authentification

### 3.1 Tester l'authentification Keycloak (Backend)

Créez un fichier de test `test-auth.js` :

```javascript
// test-auth.js
async function testKeycloakAuth() {
  const { getKeycloakToken } = require('./lib/keycloak');
  
  try {
    console.log('🔐 Test d\'authentification Keycloak...');
    const token = await getKeycloakToken();
    console.log('✅ Token obtenu avec succès');
    console.log('Token (premiers 50 caractères):', token.substring(0, 50) + '...');
    return true;
  } catch (error) {
    console.error('❌ Erreur d\'authentification:', error.message);
    return false;
  }
}

testKeycloakAuth();
```

Exécutez le test :

```bash
node test-auth.js
```

✅ **Résultat attendu**: 
```
🔐 Test d'authentification Keycloak...
✅ Token obtenu avec succès
Token (premiers 50 caractères): eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA...
```

❌ **Si échec**: Vérifiez vos credentials dans `.env.local`

### 3.2 Tester le profil marchand (Endpoint #1)

Créez `test-merchant.js` :

```javascript
// test-merchant.js
async function testMerchantProfile() {
  const { fetchMerchantProfile } = require('./lib/akuunda-api');
  
  try {
    console.log('👤 Test récupération profil marchand...');
    const merchantId = 'votre_merchant_id'; // Remplacez par un ID valide
    const profile = await fetchMerchantProfile(merchantId);
    console.log('✅ Profil récupéré avec succès');
    console.log('Marchand:', profile.recipient.name);
    console.log('Email:', profile.recipient.email);
    console.log('Téléphone:', profile.userName);
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return false;
  }
}

testMerchantProfile();
```

```bash
node test-merchant.js
```

## 4. Tests des APIs YellowCard

### 4.1 Tester les réseaux disponibles (Endpoint #4)

```bash
curl -X GET "http://localhost:3000/api/yellowcard/networks?countryCode=CI"
```

✅ **Résultat attendu**: Liste des réseaux mobile money pour la Côte d'Ivoire

```json
[
  {
    "networkId": "401a79b8-50bd-41fc-9102-b5d4650a02aa",
    "label": "MTN Mobile Money"
  },
  {
    "networkId": "...",
    "label": "Orange Money"
  }
]
```

### 4.2 Tester les channels (Endpoint #5)

```bash
curl -X GET "http://localhost:3000/api/yellowcard/channels?countryCode=CI"
```

### 4.3 Tester les taux de change (Endpoint #2)

```bash
curl -X GET "http://localhost:3000/api/yellowcard/rates?currencyCode=XOF"
```

## 5. Tests des APIs MELD

### 5.1 Tester les méthodes de paiement (Endpoint #7)

```bash
curl -X GET "http://localhost:3000/api/meld/payment-methods?fiatCurrency=EUR"
```

✅ **Résultat attendu**: Liste des méthodes de paiement pour EUR

```json
[
  {
    "id": "card",
    "label": "Carte bancaire",
    "type": "card"
  },
  {
    "id": "sepa",
    "label": "Virement SEPA",
    "type": "bank_transfer"
  }
]
```

### 5.2 Tester les defaults (Endpoint #9)

```bash
curl -X GET "http://localhost:3000/api/meld/defaults?countryCode=FR"
```

### 5.3 Tester les crypto-monnaies (Endpoint #10)

```bash
curl -X GET "http://localhost:3000/api/meld/crypto-currencies?countryCode=FR"
```

## 6. Test du Flow Complet (UI)

### 6.1 Accéder à la page de paiement

Ouvrez votre navigateur et accédez à :

```
http://localhost:3000/pay?merchantId=MERCHANT_ID&wallet=WALLET_ADDRESS
```

Remplacez :
- `MERCHANT_ID` par un ID marchand valide
- `WALLET_ADDRESS` par une adresse de wallet valide

### 6.2 Scénario de test YellowCard (Côte d'Ivoire)

1. **Step 1 - Sélection du pays**
   - Cliquez sur "Côte d'Ivoire 🇨🇮"
   - ✅ Le bouton "Continuer" devient actif

2. **Step 2 - Sélection du réseau**
   - ✅ Vérifiez que les réseaux se chargent dynamiquement (spinner visible pendant le chargement)
   - ✅ Vous devriez voir : MTN Mobile Money, Orange Money, Wave, Moov Money
   - Sélectionnez un réseau (ex: MTN Mobile Money)
   - ✅ Le networkId doit être un UUID valide (pas un faux UUID hardcodé)

3. **Step 3 - Informations de paiement**
   - Entrez un montant (ex: 10000)
   - Entrez le nom du compte
   - Entrez le numéro de téléphone
   - Cliquez sur "Continuer"

4. **Step 4 - Révision**
   - Vérifiez que toutes les informations sont correctes
   - Cliquez sur "Confirmer le paiement"

5. **Step 5 - Confirmation**
   - ✅ Vous devriez voir une confirmation ou être redirigé

### 6.3 Scénario de test MELD (France)

1. **Step 1 - Sélection du pays**
   - Cliquez sur "France 🇫🇷"

2. **Step 2 - Méthode de paiement**
   - ✅ Le fournisseur de service devrait être auto-sélectionné (ex: Transak)
   - ✅ Les méthodes de paiement se chargent dynamiquement
   - Sélectionnez une méthode (ex: Carte bancaire)

3. **Step 3-4-5** - Suivez le même flow que YellowCard

## 7. Tests des Logs

### 7.1 Vérifier les logs de l'application

Dans le terminal où tourne `npm run dev`, vous devriez voir :

```
[Token] Fetching new Keycloak token...
[Token] Token cached until: 2026-02-10T23:45:00.000Z
[API] GET /api/internal/v1/yellow-card/networks?countryCode=CI
[API] Response status: 200
```

### 7.2 Vérifier les logs du navigateur

Ouvrez la console du navigateur (F12) et vérifiez :

```javascript
// Lors du chargement des options de paiement
Fetching payment options for country: CI
Payment options loaded: { engine: "YELLOWCARD", paymentMethods: [...] }
```

## 8. Tests d'Erreur

### 8.1 Tester avec des credentials invalides

1. Modifiez `.env.local` avec un mauvais mot de passe
2. Redémarrez le serveur
3. Essayez d'accéder à `/api/payment-options?countryCode=CI`

✅ **Résultat attendu**: Erreur 500 avec message "Keycloak authentication failed"

### 8.2 Tester sans merchantId

Accédez à :
```
http://localhost:3000/pay
```

✅ **Résultat attendu**: L'application devrait gérer l'absence de merchantId

### 8.3 Tester avec un pays invalide

```bash
curl -X GET "http://localhost:3000/api/yellowcard/networks?countryCode=XX"
```

✅ **Résultat attendu**: Erreur 400 ou 500 avec message approprié

## 9. Tests de Performance

### 9.1 Vérifier le cache de token

1. Faites plusieurs appels API consécutifs
2. ✅ Le token ne devrait être rafraîchi qu'une seule fois (vérifier les logs)

```bash
# Faire 5 appels rapidement
for i in {1..5}; do
  curl -s "http://localhost:3000/api/yellowcard/networks?countryCode=CI" > /dev/null
  echo "Call $i done"
done
```

✅ **Résultat attendu**: Vous devriez voir un seul "Fetching new Keycloak token" dans les logs

## 10. Checklist de Validation Finale

Avant de considérer que tout fonctionne :

- [ ] ✅ Build réussi sans erreurs TypeScript
- [ ] ✅ Authentification Keycloak fonctionne
- [ ] ✅ Profil marchand récupéré (GET, pas POST)
- [ ] ✅ YellowCard networks retournent des UUIDs réels
- [ ] ✅ YellowCard channels sont récupérés dynamiquement
- [ ] ✅ MELD payment methods sont dynamiques
- [ ] ✅ Flow complet YellowCard testé en UI
- [ ] ✅ Flow complet MELD testé en UI
- [ ] ✅ Gestion d'erreurs fonctionne
- [ ] ✅ Cache de token fonctionne (pas de ré-authentification à chaque appel)
- [ ] ✅ Aucun API key hardcodé dans le code
- [ ] ✅ Variables d'environnement correctement configurées

## 11. Résolution de Problèmes Courants

### Erreur: "Missing Keycloak configuration"

**Cause**: Variables d'environnement non définies  
**Solution**: Vérifiez que `.env.local` existe et contient toutes les variables KEYCLOAK_*

### Erreur: "Failed to obtain Keycloak token"

**Cause**: Credentials invalides ou serveur Keycloak inaccessible  
**Solution**: 
1. Vérifiez les credentials
2. Testez l'URL Keycloak dans un navigateur
3. Vérifiez les logs détaillés du serveur

### Erreur: "Failed to fetch payment options"

**Cause**: L'API interne ne répond pas  
**Solution**:
1. Vérifiez que `AKUUNDA_API_BASE_URL` est correct
2. Testez l'API directement avec curl
3. Vérifiez les logs côté serveur

### Les réseaux YellowCard ne se chargent pas

**Cause**: Problème d'authentification ou endpoint incorrect  
**Solution**:
1. Vérifiez les logs du serveur
2. Testez l'endpoint directement: `curl http://localhost:3000/api/yellowcard/networks?countryCode=CI`
3. Vérifiez que le token Keycloak est valide

## 12. Tests Automatisés (Optionnel)

Si vous souhaitez créer des tests automatisés :

```javascript
// tests/integration/auth.test.js
const { getKeycloakToken } = require('../../lib/keycloak');

describe('Keycloak Authentication', () => {
  it('should obtain a valid token', async () => {
    const token = await getKeycloakToken();
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(100);
  });

  it('should cache the token', async () => {
    const token1 = await getKeycloakToken();
    const token2 = await getKeycloakToken();
    expect(token1).toBe(token2);
  });
});
```

## Contact

Pour toute question sur les tests, consultez le README.md ou contactez l'équipe de développement.

---

**Dernière mise à jour**: 2026-02-10  
**Version**: 1.0.0 (Intégration Keycloak)
