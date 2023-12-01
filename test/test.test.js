let {expect}                                   = require('chai');
let fs                                         = require('fs');
let path                                       = require('path');
let {defaultName, softwareName, temporaryName} = require('../src/_lib/vars');
let {getListOfDictionaries}                    = require('../src/dictionary/operations/operations');
let {cli, ENTER}                               = require('./_lib/cli');
let {removeEscapeChars}                        = require('./_lib/utils');

describe('anagrammer', () => {
  let alias = 'extra';
  let scriptPath = path.resolve(__dirname, '../src/index.js');
  let dictionaryPath = path.resolve(process.cwd(), './test/sample-dictionary.txt');
  let words = '  post\t\tspot\nopts\t den end    place';
  let wordsProcessed = words.trim().split(/\s+/);
  let anagramsCount = 5;

  async function execute(configs = {}, clean = false) {
    let output = await cli({scriptPath, ...configs});
    return clean ? removeEscapeChars(output) : output;
  }

  before(() => fs.writeFileSync(dictionaryPath, words));
  after(() => fs.unlinkSync(dictionaryPath));

  describe('dictionaries', () => {
    it('starts with internal dictionary as default', async () => {
      let output = await execute({}, true);
      let expectedPrompt = `${softwareName} (${defaultName})`;
      expect(output).to.include(expectedPrompt);
    });

    it('loads dictionary temporarily (into memory)', async () => {
      let output = await execute({args: ['-f', dictionaryPath]}, true);
      let expectedPrompt = `${softwareName} (${temporaryName})`;
      let dictionaries = getListOfDictionaries();
      expect(output).to.include(expectedPrompt);
      expect(Object.keys(dictionaries)).to.eql(['default']);
    });

    it('alerts whenever an incorrect dictionary path is provided', async () => {
      let incorrectPath = path.resolve(process.cwd(), 'some-incorrect-path-to-dictionary.txt');
      let output = await execute({args: ['-f', incorrectPath]}, true);
      expect(output).to.include(`dictionary file path "${incorrectPath}" is invalid`);
    });

    it('outputs to the console how many words were processed', async () => {
      let output = await execute({args: ['-f', dictionaryPath]}, true);
      let expectedProcessedCount = `processed ${wordsProcessed.length} words`;
      expect(output).to.include(expectedProcessedCount);
    });

    it('indicates how many anagrammable words were imported', async () => {
      let output = await execute({args: ['-f', dictionaryPath]}, true);
      let expectedImportedCount = `imported ${anagramsCount} anagrammable words`;
      expect(output).to.include(expectedImportedCount);
    });

    it('provides how long it took to process a dictionary file', async () => {
      let output = await execute({args: ['-f', dictionaryPath]}, true);
      let timeRx = /in \d+\.\d+ms/;
      expect(timeRx.test(output)).to.be.true;
    });

    it('imports a dictionary file and saves it under an alias', async () => {
      let output = await execute({args: ['-f', dictionaryPath, '-n', alias]});
      let expectedPrompt = `${softwareName} (${alias})`;
      let dictionaries = getListOfDictionaries();
      expect(Object.keys(dictionaries).includes(alias)).to.be.true;
      expect(output).to.include(expectedPrompt);
      await execute({args: ['-r', alias]});
    });

    it('activates a previously imported dictionary', async () => {
      await execute({args: ['-f', dictionaryPath, '-n', alias]});
      let expectedPrompt = `${softwareName} (${alias})`;
      let output = await execute({args: ['-n', alias]});
      expect(output).to.include(expectedPrompt);
      await execute({args: ['-r', alias]});
    });

    it('informs whenever provided dictionary name does not exist', async () => {
      let nonExistentDictionary = 'not-existent';
      let output = await execute({args: ['-n', nonExistentDictionary]}, true);
      expect(output).to.include(`dictionary "${nonExistentDictionary}" does not exist`);
    });

    it('removes an imported dictionary', async () => {
      await execute({args: ['-f', dictionaryPath, '-n', alias]});
      let dictionaries = getListOfDictionaries();
      expect(dictionaries[alias]).to.equal(`${alias}.json`);
      await execute({args: ['--remove', alias]});
      dictionaries = getListOfDictionaries();
      expect(dictionaries[alias]).to.be.undefined;
    });

    it('errors whenever "default" dictionary is attempted to be removed', async () => {
      let output = await execute({args: ['-r', 'default']}, true);
      expect(output).to.include('cannot remove "default" dictionary');
    });

    it('notifies whenever a non-existing dictionary is attempted to be removed', async () => {
      let incorrectDictionaryName = 'non-existent';
      let output = await execute({args: ['-r', incorrectDictionaryName]}, true);
      expect(output).to.include(`dictionary "${incorrectDictionaryName}" does not exist`);
    });

    it('terminates whenever an existing dictionary attempted to be overwritten', async () => {
      await execute({args: ['-f', dictionaryPath, '-n', alias]});
      let output = await execute({args: ['-f', dictionaryPath, '-n', alias]});
      expect(output).to.include(`dictionary "${alias}" already exists`);
      await execute({args: ['--remove', alias]});
    });

    it('overwrites an existing dictionary when --override flag is provided', async () => {
      await execute({args: ['-f', dictionaryPath, '-n', alias]});
      await execute({args: ['-f', dictionaryPath, '-n', alias, '-o']});
      await execute({args: ['-r', alias]});
    });

    it('prevents "default" dictionary to be overwritten', async () => {
      let output = await execute({args: ['-f', dictionaryPath, '-n', 'default', '-o']}, true);
      expect(output).to.include('cannot overwrite "default" dictionary');
    });

    it('lists available dictionaries', async () => {
      await execute({args: ['-f', dictionaryPath, '-n', alias]});
      let output = await execute({args: ['--list']}, true);
      expect(output).to.include(`dictionaries are available: default, ${alias}`);
      await execute({args: ['-r', alias]});
    });
  });

  describe('anagram querying', () => {
    let inputPromptRxStr = 'anagrammer\\s+\\(default\\)\\s+.\\s+';

    it('returns anagrams for a word', async () => {
      let output = await execute({inputs: [['stop', ENTER]], inputPromptRxStr}, true);
      expect(output).to.include(`'stop' has the following anagrams: post, spot, tops`);
    });

    it('feedbacks whenever there are no anagrams', async () => {
      let output = await execute({inputs: [['blatant', ENTER]], inputPromptRxStr}, true);
      expect(output).to.include(`'blatant' has no anagrams`);
    });

    it('quits whenever ".exit" word is received', async () => {
      let output = await execute({inputs: [['.exit', ENTER]], inputPromptRxStr}, true);
      expect(output).to.include('Bye!');
    });

    it('performs multiple word lookups', async() => {
      let output = await execute({inputs: [['slay', ENTER], ['stay', ENTER], ['.exit', ENTER]]}, true);
      expect(output).to.include("'slay' has the following anagram: lyas");
      expect(output).to.include("'stay' has no anagrams");
      expect(output).to.include('Bye!');
    });
  });
});
