#!/usr/bin/env node
/**
 * Script de test pour l'authentification Keycloak
 * 
 * Usage: node scripts/test-auth.js
 */

require('dotenv').config({ path: '.env.local' });

async function testKeycloakAuth() {
  console.log('\n🔐 Test d\'authentification Keycloak\n');
  console.log('═══════════════════════════════════════\n');

  // Vérifier les variables d'environnement
  console.log('1️⃣ Vérification des variables d\'environnement...');
  const requiredVars = [
    'KEYCLOAK_TOKEN_URL',
    'KEYCLOAK_USERNAME',
    'KEYCLOAK_PASSWORD',
    'KEYCLOAK_CLIENT_ID',
    'KEYCLOAK_CLIENT_SECRET'
  ];

  const missingVars = requiredVars.filter(v => !process.env[v]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variables manquantes:', missingVars.join(', '));
    console.error('\n💡 Créez un fichier .env.local avec ces variables.\n');
    process.exit(1);
  }

  console.log('✅ Toutes les variables sont définies\n');

  // Tester l'obtention du token
  console.log('2️⃣ Obtention du token Keycloak...');
  
  try {
    const { getKeycloakToken } = require('../lib/keycloak');
    const startTime = Date.now();
    const token = await getKeycloakToken();
    const duration = Date.now() - startTime;
    
    console.log(`✅ Token obtenu en ${duration}ms`);
    console.log(`📝 Token (premiers 50 chars): ${token.substring(0, 50)}...`);
    console.log(`📏 Longueur totale: ${token.length} caractères\n`);

    // Tester le cache
    console.log('3️⃣ Test du cache de token...');
    const startTime2 = Date.now();
    const token2 = await getKeycloakToken();
    const duration2 = Date.now() - startTime2;
    
    if (token === token2) {
      console.log(`✅ Token récupéré du cache en ${duration2}ms (${Math.round(duration/duration2)}x plus rapide)`);
    } else {
      console.log('⚠️  Token différent (cache non utilisé?)');
    }

    console.log('\n═══════════════════════════════════════');
    console.log('✅ Tous les tests d\'authentification réussis!\n');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'authentification:');
    console.error('Message:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    console.error('\n💡 Vérifiez vos credentials dans .env.local\n');
    process.exit(1);
  }
}

// Exécuter le test
testKeycloakAuth();
