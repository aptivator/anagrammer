let colors = require('colors');
let figlet = require('figlet');

colors.enable();

module.exports = {
  defaultName: 'default',
  dictionariesDir: 'dictionaries',
  softwareName: 'anagrammer',
  softwareNamePretty: figlet.textSync('Anagrammer').green,
  temporaryName: 'temporary'
};
