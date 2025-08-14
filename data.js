// data.js - VERSÃO DE DIAGNÓSTICO DO ARQUIVO CSV
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const caData = new Map();
let isDataReady = false;

function loadData() {
  console.log('[DADOS] Iniciando carregamento e diagnóstico do arquivo caepi.csv...');
  const csvFilePath = path.resolve(__dirname, 'caepi.csv');
  
  // Usamos 'latin1' que é uma codificação comum para arquivos do governo brasileiro
  const fileContent = fs.readFileSync(csvFilePath, 'latin1'); 

  const parser = parse(fileContent, {
    delimiter: ';',
    columns: true,
    trim: true,
    skip_empty_lines: true
  });

  parser.on('readable', function(){
    let record;
    let firstRowProcessed = false;
    while ((record = parser.read()) !== null) {
      // --- INÍCIO DO DIAGNÓSTICO ---
      // Na primeira linha de dados, imprime os nomes das colunas que ele encontrou
      if (!firstRowProcessed) {
        console.log('--- DIAGNÓSTICO DE COLUNAS ---');
        console.log('Nomes das colunas encontrados no arquivo CSV:');
        console.log(Object.keys(record));
        console.log('Exemplo da primeira linha de dados:');
        console.log(record);
        console.log('--- FIM DO DIAGNÓSTICO ---');
        firstRowProcessed = true;
      }
      // --- FIM DO DIAGNÓSTICO ---
      
      // Tentamos adivinhar qual é a coluna do CA
      const caKey = record['Nº CA'] || record['NR_CA'];
      if (caKey) {
        caData.set(String(caKey).trim(), record);
      }
    }
  });

  parser.on('end', function(){
    isDataReady = true;
    console.log(`[DADOS] Base de dados carregada. Total de ${caData.size} registros.`);
  });

  parser.on('error', function(err){
    console.error('[DADOS] ERRO AO LER O ARQUIVO CSV:', err.message);
  });
}

function getCAInfo(caNumber) {
  if (!isDataReady) {
    return { error: 'A base de dados ainda está a ser carregada. Por favor, tente novamente em um minuto.' };
  }
  
  const caInfo = caData.get(String(caNumber).trim());
  if (caInfo) {
    // Usamos os nomes de coluna mais prováveis, com alternativas
    return {
      'Nº do CA': caInfo['Nº CA'] || caInfo['NR_CA'],
      'Data de Validade': caInfo['Data de Validade'],
      'Situação': caInfo.Situação,
      'Equipamento': caInfo['Descrição do Equipamento'] || caInfo.DS_EQUIPAMENTO,
      'Fabricante': caInfo['Nome do Fabricante / Importador'] || caInfo.NO_FABRICANTE
    };
  } else {
    return { error: `O CA "${caNumber}" não foi encontrado na base de dados.` };
  }
}

module.exports = { getCAInfo, loadData };