const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const caData = new Map();
let isDataReady = false;

// Função que lê o arquivo CSV e o carrega para a memória
function loadData() {
  console.log('[DADOS] Iniciando carregamento do arquivo caepi.csv...');
  const csvFilePath = path.resolve(__dirname, 'caepi.csv');
  const parser = parse({
    delimiter: ';', // O separador do arquivo do governo geralmente é ';'
    columns: true,  // Usa a primeira linha como cabeçalho
    trim: true
  });

  const fileStream = fs.createReadStream(csvFilePath);

  fileStream.pipe(parser);

  parser.on('readable', function(){
    let record;
    while ((record = parser.read()) !== null) {
      // Usamos o número do CA como chave do nosso "mapa" de dados
      caData.set(record['Nº CA'], record);
    }
  });

  parser.on('end', function(){
    isDataReady = true;
    console.log(`[DADOS] Base de dados carregada com sucesso. Total de ${caData.size} registros.`);
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
    return {
      'Nº do CA': caInfo['Nº CA'],
      'Data de Validade': caInfo['Data de Validade'],
      'Situação': caInfo.Situação,
      'Equipamento': caInfo['Descrição do Equipamento'],
      'Fabricante': caInfo['Nome do Fabricante / Importador']
    };
  } else {
    return { error: `O CA "${caNumber}" não foi encontrado na base de dados.` };
  }
}

module.exports = { getCAInfo, loadData };