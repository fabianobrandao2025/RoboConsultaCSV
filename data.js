// data.js - VERSÃO DE DIAGNÓSTICO FINAL DO ARQUIVO CSV
const fs = require('fs');
const path = require('path');

// As outras bibliotecas não são necessárias para este teste
let isDataReady = false;

function loadData() {
  console.log('[DADOS] Iniciando diagnóstico do arquivo caepi.csv...');
  try {
    const csvFilePath = path.resolve(__dirname, 'caepi.csv');
    
    // Lê apenas os primeiros 1000 caracteres do arquivo
    const fileSample = fs.readFileSync(csvFilePath, { encoding: 'latin1' }).substring(0, 1000);

    console.log('--- DIAGNÓSTICO DO ARQUIVO CSV ---');
    console.log('Amostra das primeiras linhas do arquivo (como o robô está a ler):');
    console.log('====================================');
    console.log(fileSample);
    console.log('====================================');
    console.log('Por favor, copie e cole o texto acima (entre as linhas ===) para análise.');
    console.log('--- FIM DO DIAGNÓSTICO ---');

  } catch (err) {
    console.error('[DADOS] ERRO AO LER O ARQUIVO CSV:', err.message);
  }
}

function getCAInfo(caNumber) {
  // Resposta padrão durante o diagnóstico
  return { error: 'Robô em modo de diagnóstico. Verifique os logs do Render.' };
}

module.exports = { getCAInfo, loadData };