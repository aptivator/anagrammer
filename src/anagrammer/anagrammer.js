let {Input}         = require('enquirer');
let {toAnagramForm} = require('../_lib/utils');

module.exports = {
  startAnagrammer([dictionaryName, dictionary]) {
    console.log('provide a word to find its anagrams');
    console.log('to quit type .exit or press Ctrl + C');
    console.log();

    (function run() {
      const prompt = new Input({
        message: `anagrammer (${dictionaryName})`,
        symbols: {prefix: ''}
      });
    
      prompt.run().then((word) => {
        if(word !== '.exit') {
          let [anagramForm, wordAdj] = toAnagramForm(word);
          let anagrams = dictionary[anagramForm];

          if(anagrams) {
            anagrams = anagrams.filter((word) => word !== wordAdj).join(', ');
            console.log(`'${word}' has the following anagrams: ${anagrams}`);
          } else {
            console.log(`'${word}' has no anagrams`.red);
          }

          return run();
        }
    
        console.log('Bye!');
        process.exit(0);
      }).catch(console.log);
    })();
  }
};
