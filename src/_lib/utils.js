let {softwareName} = require('./vars');

module.exports = {
  error(errorMessage) {
    console.error(`${softwareName}: ${errorMessage}`.red);
    process.exit(1);
  },

  toAnagramForm(word) {
    let wordAdj = word.trim().toLowerCase();
    let anagramForm = wordAdj.split('').sort().join('');
    return [anagramForm, wordAdj];
  }
};
