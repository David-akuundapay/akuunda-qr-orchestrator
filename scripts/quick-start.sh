#!/bin/bash
# Script de démarrage rapide pour tester l'application
# Usage: ./scripts/quick-start.sh

set -e

echo "🚀 Démarrage rapide - Akuunda QR Orchestrator"
echo "=============================================="
echo ""

# Vérifier si .env.local existe
if [ ! -f .env.local ]; then
    echo "❌ Fichier .env.local non trouvé!"
    echo ""
    echo "Créez le fichier .env.local avec vos credentials Keycloak:"
    echo ""
    echo "  cp .env.local.example .env.local"
    echo "  # Puis éditez .env.local avec vos vraies valeurs"
    echo ""
    exit 1
fi

echo "✅ Fichier .env.local trouvé"
echo ""

# Vérifier si node_modules existe
if [ ! -d node_modules ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo ""
fi

# Build du projet
echo "🔨 Build du projet..."
npm run build
echo ""

# Lancer les tests d'authentification
echo "🧪 Test d'authentification Keycloak..."
npm run test:auth
echo ""

# Proposer de démarrer le serveur
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Configuration validée!"
echo ""
echo "Pour démarrer le serveur:"
echo "  npm run dev"
echo ""
echo "Pour tester les APIs:"
echo "  npm run test:yellowcard CI"
echo "  npm run test:meld FR"
echo ""
echo "Pour tester l'UI, ouvrez:"
echo "  http://localhost:3000/pay?merchantId=YOUR_ID&wallet=YOUR_WALLET"
echo ""
