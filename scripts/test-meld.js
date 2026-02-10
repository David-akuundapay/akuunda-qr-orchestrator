#!/usr/bin/env node
/**
 * Script de test pour les endpoints MELD
 * 
 * Usage: node scripts/test-meld.js FR
 */

require('dotenv').config({ path: '.env.local' });

const countryCode = process.argv[2] || 'FR';

async function testMeld() {
  console.log(`\n💰 Test des APIs MELD pour ${countryCode}\n`);
  console.log('═══════════════════════════════════════\n');

  try {
    const { 
      getMeldPaymentMethods, 
      getMeldDefaults,
      getMeldFiatCurrencies,
      getMeldCryptoCurrencies 
    } = require('../lib/meld-api');

    const currency = countryCode === 'FR' ? 'EUR' : 'USD';

    // Test 1: Payment Methods
    console.log('1️⃣ Test récupération des méthodes de paiement...');
    const startTime1 = Date.now();
    const methods = await getMeldPaymentMethods(currency);
    const duration1 = Date.now() - startTime1;
    
    console.log(`✅ ${methods.length} méthodes récupérées en ${duration1}ms`);
    methods.forEach((method, i) => {
      console.log(`   ${i + 1}. ${method.label} (${method.id})`);
    });
    console.log();

    // Test 2: Defaults
    console.log('2️⃣ Test récupération des defaults...');
    const startTime2 = Date.now();
    const defaults = await getMeldDefaults(countryCode);
    const duration2 = Date.now() - startTime2;
    
    console.log(`✅ Defaults récupérés en ${duration2}ms`);
    console.log('   Service Provider:', defaults.serviceProvider || 'N/A');
    console.log('   Destination Currency:', defaults.destinationCurrencyCode || 'N/A');
    console.log();

    // Test 3: Fiat Currencies
    console.log('3️⃣ Test récupération des devises fiat...');
    try {
      const fiats = await getMeldFiatCurrencies(countryCode);
      console.log(`✅ ${fiats.length} devises fiat récupérées`);
    } catch (error) {
      console.log(`⚠️  Impossible de récupérer les devises fiat: ${error.message}`);
    }
    console.log();

    // Test 4: Crypto Currencies
    console.log('4️⃣ Test récupération des crypto-monnaies...');
    try {
      const cryptos = await getMeldCryptoCurrencies(countryCode);
      console.log(`✅ ${cryptos.length} crypto-monnaies récupérées`);
    } catch (error) {
      console.log(`⚠️  Impossible de récupérer les cryptos: ${error.message}`);
    }

    console.log('\n═══════════════════════════════════════');
    console.log('✅ Tests MELD terminés!\n');

  } catch (error) {
    console.error('\n❌ Erreur lors des tests MELD:');
    console.error('Message:', error.message);
    console.error('\n💡 Vérifiez que le serveur dev tourne ou que les credentials sont corrects\n');
    process.exit(1);
  }
}

testMeld();
