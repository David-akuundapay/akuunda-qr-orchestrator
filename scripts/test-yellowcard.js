#!/usr/bin/env node
/**
 * Script de test pour les endpoints YellowCard
 * 
 * Usage: node scripts/test-yellowcard.js CI
 */

require('dotenv').config({ path: '.env.local' });

const countryCode = process.argv[2] || 'CI';

async function testYellowCard() {
  console.log(`\n💳 Test des APIs YellowCard pour ${countryCode}\n`);
  console.log('═══════════════════════════════════════\n');

  try {
    const { getYellowCardNetworks, getYellowCardChannels } = require('../lib/yellowcard-api');

    // Test 1: Networks
    console.log('1️⃣ Test récupération des réseaux...');
    const startTime1 = Date.now();
    const networks = await getYellowCardNetworks(countryCode);
    const duration1 = Date.now() - startTime1;
    
    console.log(`✅ ${networks.length} réseaux récupérés en ${duration1}ms`);
    networks.forEach((network, i) => {
      console.log(`   ${i + 1}. ${network.label} (${network.networkId})`);
    });
    console.log();

    // Test 2: Channels
    console.log('2️⃣ Test récupération des channels...');
    const startTime2 = Date.now();
    const channels = await getYellowCardChannels(countryCode);
    const duration2 = Date.now() - startTime2;
    
    console.log(`✅ ${channels.length} channels récupérés en ${duration2}ms`);
    channels.forEach((channel, i) => {
      console.log(`   ${i + 1}. ${channel.name || 'Channel'} (${channel.channelId})`);
    });
    console.log();

    // Test 3: Rates (si disponible)
    console.log('3️⃣ Test récupération des taux...');
    try {
      const { getYellowCardRates } = require('../lib/yellowcard-api');
      const currencyCode = countryCode === 'CI' ? 'XOF' : countryCode === 'CD' ? 'CDF' : 'XAF';
      const rates = await getYellowCardRates(currencyCode);
      console.log(`✅ Taux récupérés pour ${currencyCode}`);
      if (Array.isArray(rates)) {
        console.log(`   ${rates.length} taux disponibles`);
      }
    } catch (error) {
      console.log(`⚠️  Impossible de récupérer les taux: ${error.message}`);
    }

    console.log('\n═══════════════════════════════════════');
    console.log('✅ Tests YellowCard terminés!\n');

  } catch (error) {
    console.error('\n❌ Erreur lors des tests YellowCard:');
    console.error('Message:', error.message);
    console.error('\n💡 Vérifiez que le serveur dev tourne ou que les credentials sont corrects\n');
    process.exit(1);
  }
}

testYellowCard();
