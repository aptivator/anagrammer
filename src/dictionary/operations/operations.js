let fs                     = require('fs');
let path                   = require('path');
let {performance}          = require('perf_hooks');
let {error, toAnagramForm} = require('../../_lib/utils');
let {defaultName}          = require('../../_lib/vars');
let {getDictionariesPath}  = require('./_lib/utils');

function fetchAndProcessDictionary(dictionaryPath) {
  let start = performance.now();
  let dictionary = {};
  let dictionaryPathFull = path.resolve(process.cwd(), dictionaryPath);
  let dictionaryContents = fs.readFileSync(dictionaryPathFull, 'utf-8');
  let words = dictionaryContents.split(/\s/);
  let {length: wordCount} = words;

  for(let word of words) {
    let [anagrammed, wordAdj] = toAnagramForm(word);
    let entries = dictionary[anagrammed];

    if(!entries) {
      entries = dictionary[anagrammed] = [];
    }

    if(!entries.includes(wordAdj)) {
      entries.push(wordAdj);
    }
  }

  for(let [key, entries] of Object.entries(dictionary)) {
    if(entries.length === 1) {
      delete dictionary[key];
    }
  }

  console.log(`imported ${wordCount} words in ${(performance.now() - start).toFixed(2)}ms`.green);
  return dictionary;
}

function fetchDictionary(dictionaryName) {
  let dictionaryFile = dictionaryName + '.json';
  let dictionaryPath = getDictionariesPath(dictionaryFile);
  let dictionary = require(dictionaryPath);

  return [dictionaryName, dictionary];
}

function getListOfDictionaries() {
  let dictionaryFiles = fs.readdirSync(getDictionariesPath());

  return dictionaryFiles.reduce((dictionaries, dictionaryFile) => {
    let dictionaryFileParts = dictionaryFile.split('.');
    let dictionaryName = dictionaryFileParts.slice(0, -1).join('.');
    return Object.assign(dictionaries, {[dictionaryName]: dictionaryFile});
  }, {});
}

function removeDictionary(dictionaryName) {
  if(dictionaryName !== defaultName) {
    let dictionaries = getListOfDictionaries();
    let dictionaryFile = dictionaries[dictionaryName];
  
    if(dictionaryFile) {
      let dictionaryPath = getDictionariesPath(dictionaryFile);
      return fs.unlinkSync(dictionaryPath);
    }
  
    error(`dictionary "${dictionaryName}" does not exist`);
  }

  error(`cannot remove "${defaultName}" dictionary`);
}

function writeDictionary(dictionaryName, dictionary) {
  let dictionaryFile = dictionaryName + '.json';
  let dictionaryStr = JSON.stringify(dictionary);
  let dictionaryPath = getDictionariesPath(dictionaryFile);

  fs.writeFileSync(dictionaryPath, dictionaryStr);
}

module.exports = {
  fetchAndProcessDictionary,
  fetchDictionary,
  getListOfDictionaries,
  removeDictionary,
  writeDictionary
};
