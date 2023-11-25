let {error}                      = require('../_lib/utils');
let {defaultName, temporaryName} = require('../_lib/vars');
let {fetchAndProcessDictionary}  = require('./operations/operations');
let {fetchDictionary}            = require('./operations/operations');
let {getListOfDictionaries}      = require('./operations/operations');
let {removeDictionary}           = require('./operations/operations');
let {writeDictionary}            = require('./operations/operations');

function getDictionary(options) {
  let {file, name  = '', override} = options;
  let dictionaries = getListOfDictionaries();

  if(file) {
    name = name.toLowerCase();

    if(name !== defaultName) {
      if((name && !dictionaries[name]) || (dictionaries[name] && override) || !name) {
        let dictionary = fetchAndProcessDictionary(file);

        if(name) {
          writeDictionary(name, dictionary);
        } else {
          name = temporaryName;
        }

        return [name, dictionary];
      } else {
        error(`dictionary "${name}" already exists.  Use --override flag to replace.`)
      }
    } else {
      error(`cannot overwrite a "${defaultName}" dictionary`);
    }
  }

  if(!name || name === defaultName) {
    return fetchDictionary(defaultName);
  }

  error(`dictionary "${name}" does not exist`);
}

function respondToOptionsOrGetDictionary(options) {
  let {remove, list} = options;

  if(list) {
    let dictionaries = getListOfDictionaries();
    let dictionaryNames = Object.keys(dictionaries).join(', ');
    console.log(`the following dictionaries are available: ${dictionaryNames}`);
    process.exit(0);
  }

  if(remove) {
    removeDictionary(remove);
    console.log(`dictionary "${remove}" was removed`);
    process.exit(0);
  }

  return getDictionary(options);
}

module.exports = {
  respondToOptionsOrGetDictionary
}
